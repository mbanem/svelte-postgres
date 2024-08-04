<script lang="ts">
	import { base } from '$app/paths'
	import { browser } from '$app/environment'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { getNavBars, getNavButtons } from '$utils/store'
	import Error from '$routes/+error.svelte'
	import { selectRecordItems } from '$lib/utils'

	type ARGS = {
		navButtonObjects: TXNavButtonObject[]
		role: string
	}
	let { navButtonObjects = [], role = 'VISITOR' }: ARGS = $props()
	// nav bars are named by route.id + -Objects and are used
	// to hold indices for buttons inside a nav bar so we have
	// function for indices oix  where indices are bound for label
	// to receive click events and to a hidden checkbox that has
	// impact via css :checked property on button style even if hidden
	const navBars = getNavBars() // returns store context
	const navButtonsStore = getNavButtons()

	// variables for defining css class categories and class ids
	// part of class name to be created based on the page route id
	// that starts with a dot as it is the leading class-name part
	// followed by an index starting with zero
	let navCategory: string
	let classCategory: string // navCategory with a leading dot for class name

	// nav bar contains one or more buttons and we give them succeeding indices
	// bound as id to hidden check boxes crucial for css toggling button styles
	let navBarsItem: TNavBar // current navBar for ButtonObject or ButtonProps

	// class index to make it unique for a button belonging to a route based nav bar
	const oix = () => {
		return navBarsItem.Ix++ // start from 0, navBarsItem.oIx += 1 starts from 1
	}

	// nav bar contains several buttons and we give button indices to bind as id
	// to hidden checkboxes crucial for css toggling button styles
	// and nav bars are named by route.id and type -Objects
	const getNavBarItemOfName = () => {
		navCategory = `${$page.route.id}-Object`
			.replace(/\W/g, '-')
			.replace(/--/g, '-')
			.replace(/^-/, '') as string
		classCategory = `.${navCategory}`
		let i = -1
		// when user revisits the page we need old nav bar buttons settings,
		// which we can display/hide based on currently logged in user
		// as id is bound to label and hidden checkbox we need unique id
		// for every button so every new navBar should continue with last
		// id incremented by 1, so we need max id of navBars
		let maxId = 0
		if ($navBars && $navBars.length > 0) {
			for (i = 0; i < $navBars.length; i++) {
				if (maxId < $navBars[i].Ix) {
					maxId = $navBars[i].Ix + 1
				}
				if ($navBars[i].navId === navCategory) {
					navBarsItem = $navBars[i] as TNavBar
					if (navButtonObjects[0]?.position === 0) {
						navBarsItem.Ix = navBarsItem.startIx
					}
					return $navBars[i] as TNavBar
				}
			}
		}
		// this is the first time calling for this route.id so create one
		$navBars.push({ navId: navCategory, startIx: maxId, Ix: maxId, activeEl: undefined })
		navBarsItem = $navBars[i === -1 ? 0 : i] as TNavBar
	}
	// ----------------------------------------------------------------

	// --------- flag and style the active button
	const clearActiveEl = () => {
		$navBars.forEach((nb: TNavBar) => {
			if (nb && nb.activeEl) {
				nb.activeEl.checked = false
				nb.activeEl = undefined // TODO: why undefined?
			}
		})
	}

	// keep previously flagged active button to clear when a new become active
	let activeEl: HTMLInputElement
	// as we cannot use preventDefault fired on a DIV we wait for
	// event bubbling to fire on a checkbox -- an HTMLInputElement
	const toggleActive = (event: MouseEvent) => {
		const TN = (event.target as HTMLElement).tagName.toUpperCase()
		if (!'|INPUT|A|'.includes(TN)) return

		clearActiveEl()
		let checkbox: HTMLInputElement
		if (TN === 'A') {
			checkbox = (event.target as HTMLAnchorElement).previousElementSibling as HTMLInputElement
		} else {
			checkbox = event.target as HTMLInputElement
		}
		if (navBarsItem.activeEl === undefined) {
			navBarsItem.activeEl = checkbox
		} else {
			navBarsItem.activeEl.checked = false
			navBarsItem.activeEl = checkbox
		}
	}
	// --------- end flag active button
	// user supplied css rules are of lower specificity
	// so we flag all of them as !important

	const fromButtonObjects = () => {
		getNavBarItemOfName()
		// nav bar contains objects defined via list of TNavButtonObjects
		navButtonObjects.forEach((button) => {
			if (button.ix === undefined) {
				button.ix = oix()
			}
			if (button.title.toLowerCase() == 'home' && button.href === undefined) {
				button.href = '/'
			}
			const className = `${classCategory}${button.ix}`
			button.className = className.slice(1)
			let def: string = ''
			if (button.cssRules || button.onHover) {
				makeCSSClass(
					className,
					`${className} {
						${button.cssRules ? button.cssRules.replace(/;/g, ' !important;') : ''}
						&:hover{
						${button.onHover ? button.onHover.replace(/;/g, ' !important;') : ''}}
					}`
				) as string
			}
		})
		return navButtonObjects
	}
	// TODO here we test only via className, but many classes do not have
	// user added adjustments in cssRules and onHover so we should test on
	// css class content instead?
	const classExists = (className: string) => {
		if (!browser) return
		const max = document.head.children.length
		const items = document.head.children as HTMLCollection
		for (let i = 0; i < max; i++) {
			if ((items[i] as HTMLElement).outerText.startsWith(className)) {
				return true
			}
		}
		return false
	}

	const makeCSSClass = (className: string, cssClassDef: string) => {
		if (!browser) return
		if (classExists(className)) return
		let s = document.createElement('style')
		s.innerHTML = cssClassDef
		document.head.appendChild(s)
		return cssClassDef
	}

	let navButtons: TNavButtons = []
	// if a button item with a given name exists we replace it as its content
	// or condition could change e.g. by login or logout
	export const getNavButtonItemIndex = (className: string): number => {
		for (let i = 0; i < $navButtonsStore.length; i++) {
			if ($navButtonsStore[i].className === className) {
				return i
			}
		}
		return -1
	}

	// /+layout.svelte should define navigation buttons but it does not receive
	// user role on login or logout so navigation is defined here instead
	const addLogButton = (role: string) => {
		if ($page.route.id?.startsWith('/bars')) return
		// clear previous login or logout button
		navButtonObjects = navButtonObjects.filter((btn) => {
			return !'|login|logout|'.includes(`|${btn.title.toLowerCase()}|`)
		})
		// set login,register or logout buttons
		if (role === 'VISITOR') {
			navButtonObjects.push({
				position: '100',
				title: 'login',
				href: '/login',
				condition: 'VISITOR'
			})
			navButtonObjects.push({
				position: '101',
				title: 'register',
				href: '/register',
				condition: 'VISITOR'
			})
		} else {
			// USER includes ADMIN
			navButtonObjects.push({
				position: '100',
				title: 'logout',
				href: '/logout',
				condition: 'USER'
			})
		}
	}
	// return an array that contains objects
	const getButtonObjects = (role: string): TXNavButtonObject[] => {
		addLogButton(role)
		fromButtonObjects() // create button objects
		navButtonObjects.sort((a, b) => Number(a.position) - Number(b.position))
		return navButtonObjects
	}
</script>

<nav class="nav" onclick={toggleActive} aria-hidden={true}>
	{#each getButtonObjects(role) as button}
		{#if button.condition === 'VISITOR' || button.condition === role || role === 'ADMIN'}
			<label for={`cb${button.ix}`}>
				<input type="checkbox" id={`cb${button.ix}`} class="hidden" />
				<div
					class={button.className}
					onclick={() => goto(button.href ?? `/${button.title}`)}
					aria-hidden={true}
				>
					{button.title}
					<!-- {role.slice(0, 2)} -->
					<!--{button.condition.slice(0, 2)}-->
				</div>
			</label>
			<!-- {:else}
			<p>{button.title}-{button?.condition}</p> -->
		{/if}
	{/each}
</nav>

<style lang="scss">
	.hidden {
		display: none;
	}
	.nav {
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
		gap: 6px;
	}
	.nav div {
		// @extend .navbar-button;
		display: inline-block;
		background-color: rgb(5, 5, 153);
		color: lightgreen;
		border-radius: 5px;
		padding: 1px 0.5rem;
		border: 1px solid transparent;
		text-align: center;
		min-width: 3rem;
		height: 1.5rem;
		font-size: 20px;
		cursor: pointer;
		user-select: none;
		outline: none;
		margin: 0 4px;
		text-transform: capitalize;
		&:target,
		&:active {
			background-color: blue;
			border-color: lightgreen;
		}
		a &:hover {
			color: yellow;
			border-color: lightgreen;
		}
	}
	.nav input {
		display: none;
	}
	input:checked ~ div,
	input:checked ~ div * {
		border-color: rgb(91, 178, 91);
		background-color: navy;
		color: yellow;
	}
	div:has(input:checked),
	label:has(input:checked) {
		border-color: rgb(91, 178, 91);
		background-color: navy;
		color: yellow;
	}
</style>
