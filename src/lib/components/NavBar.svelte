<script lang="ts">
	// export const ssr = false;
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getNavBars } from '$utils/store';
	import { Button } from 'flowbite-svelte';

	export let ButtonObjects: TButtonObject[] = [];
	export let ButtonProps: TButtonProps = [];
	export let role: Role; // 'ADMIN', 'USER', UNKNOWN

	const navBars = getNavBars(); // returns store context

	// store for defining css class categories and class ids
	// part of class name to be created based on page route id
	// starts with dot as it is leading class name part
	let navCategory: string;
	let classCategory: string; // navCategory with a leading dot for class name
	let navBarsItem: TNavBar; // current navBar for ButtonObject or ButtonProps

	// class index to make it unique for a button
	const oix = () => {
		return navBarsItem.oIx++; // start from 0, navBarsItem.oIx += 1 starts from 1
	};
	const pix = () => {
		return navBarsItem.pIx++;
	};

	// const initializeNavBars = () => {
	// 	navBars.set([{ navId: 'HomePage', pIx: 24, oIx: 1718, activeEl: undefined }])
	// 	$navBars.push({ navId: 'HomePage', pIx: 24, oIx: 1718, activeEl: undefined })
	// 	// clearing navBar leave operable $navBars so we can work on it
	// 	navBars.set([])
	// }

	const getNavBarItemOfName = (type: string) => {
		navCategory = `${$page.route.id}${type}`
			.replace(/\W/g, '-')
			.replace(/--/g, '-')
			.replace(/^-/, '') as string;
		classCategory = `.${navCategory}`;
		// if (navBars && $navBars === undefined) {
		// 	initializeNavBars()
		// }
		let i = -1;
		if ($navBars && $navBars.length > 0) {
			for (i = 0; i < $navBars.length; i++) {
				if ($navBars[i].navId === navCategory) {
					navBarsItem = $navBars[i] as TNavBar;
					return $navBars[i] as TNavBar;
				}
			}
		}
		// this is the first time calling for this type so create one
		$navBars.push({ navId: navCategory, pIx: 0, oIx: 0, activeEl: undefined });
		navBarsItem = $navBars[i === -1 ? 0 : i] as TNavBar;
	};
	// ----------------------------------------------------------------

	// --------- flag active button
	const clearActiveEl = () => {
		$navBars.forEach((nb: TNavBar) => {
			if (nb && nb.activeEl) {
				nb.activeEl.checked = false;
				nb.activeEl = undefined;
			}
		});
	};

	let activeEl: HTMLInputElement;
	const toggleActive = (event: MouseEvent) => {
		if ((event.target as HTMLElement).tagName === 'DIV') return;
		clearActiveEl();
		const el = event.target as HTMLInputElement;
		if (navBarsItem.activeEl === undefined) {
			navBarsItem.activeEl = el;
		} else {
			navBarsItem.activeEl.checked = false;
			navBarsItem.activeEl = el;
		}
	};
	// --------- end flag active button
	// user supplied css rules are of lover specificity
	// so we turn all of them into !important

	type TNavButton = {
		className: string; // hidden or className as .navCategoryIx
		ix: string; // for label to point to checkbox
		href: string; // for goto statement
		title: string; // button title
		condition: string; // admin-only-, logged-in-only-
	};
	type TNavButtons = TNavButton[];
	let navButtons: TNavButtons = [];

	// TODO: adapt this function to remove new conditions if any
	const extractTitle = (button: TNavButton) => {
		if (button.title) {
			return button.title.replace(/^logged-in-only-/, '').replace(/^admin-only-/, '');
		}
		return '';
	};

	// TODO: adapt this function to leave only new conditions if any
	const extractCondition = (title: string, button: TNavButton) => {
		if (button.title) {
			return button.title.replace(new RegExp(`${title}$`), '');
		}
		return '';
	};

	const setNavButtons = (buttons: TButtonObjects) => {
		buttons.forEach((button) => {
			let title = button.title,
				condition = '';
			if (button.title.includes('-only-')) {
				title = extractTitle(button as unknown as TNavButton);
				condition = extractCondition(title, button as unknown as TNavButton);
			}
			navButtons.push({
				className: button.className as string,
				ix: String(button.ix),
				href: button.href as string,
				title,
				condition
			});
		});
	};

	// type TNavButtons = {
	// 	className: string; // hidden or className as .navCategoryIx
	// 	ix: string; // for label to point to checkbox
	// 	href: string; // for goto statement
	// 	title: string; // button title
	// 	condition: string; // admin-only-, logged-in-only-
	// }[];
	// let navButtons: TNavButtons;

	// const setNavButtons = (buttons: TButtonObject[]) => {
	// 	buttons.forEach((button) => {
	// 		navButtons.push({
	// 			className: button.className as string,
	// 			ix: String(button.ix),
	// 			href: button.href as string,
	// 			title: button.title,
	// 			condition: button.className as string
	// 		});
	// 	});
	// };
	// to separate classes from ButtonObjects and ButtonProps
	// we set start ix to 0 for ButtonObjects and 100 for ButtonProps
	// dipper level navBars could specify button.ix to avoid active
	// buttons collision, so if button.ix is present we keep it
	const fromButtonObjects = () => {
		getNavBarItemOfName('-Objects');
		ButtonObjects.forEach((button) => {
			if (button.ix === undefined) {
				button.ix = oix();
			}
			const className = `${classCategory}${button.ix}`;
			button.className = className.slice(1);

			makeCSSClass(
				className,
				`${className} {
  ${button.cssRules ? button.cssRules.replace(/;/g, ' !important;') : ''}&:hover{
	${button.onHover ? button.onHover.replace(/;/g, ' !important;') : ''}}
}`
			);
		});
		return ButtonObjects;
	};
	// user supplied css rules are of lover specificity
	// so we change all of them to !important
	// and we turn array of array props into an array of objects
	// so the same rendering code is in use

	const fromButtonProps = () => {
		getNavBarItemOfName('-Props');
		ButtonProps.forEach((prop) => {
			const ix = 100 + pix();
			const className = `${classCategory}${ix}`;
			if (prop instanceof Array) {
				ButtonObjects.push({
					title: prop[0] as string,
					href: prop[1]
						? prop[1]
						: prop[0]?.toLowerCase() === 'home'
							? '/'
							: (`/${prop[0]}` as string),
					className: prop[0] as string,
					ix,
					cssRules: prop[2] ? prop[2].replace(/;/g, ' !important;') : '',
					onHover: prop[3] ? prop[3].replace(/;/g, ' !important;') : ''
				});
				makeCSSClass(
					className,
					`${className}{
  ${prop[2] ? prop[2].replace(/;/g, ' !important;') : ''}
&:hover{
	${prop[3] ? prop[3].replace(/;/g, ' !important;') : ''}}
}`
				);
			} else {
				ButtonObjects.push({
					title: prop,
					href: prop.toLowerCase() === 'home' ? '/' : `/${prop}`,
					ix,
					className: prop
				});
				makeCSSClass(
					className,
					`${className}{
					}`
				);
			}
		});
		return ButtonObjects;
	};

	const classExists = (className: string) => {
		if (!browser) return;
		const max = document.head.children.length;
		const items = document.head.children as HTMLCollection;
		for (let i = 0; i < max; i++) {
			if ((items[i] as HTMLElement).outerText.startsWith(className)) {
				return true;
			}
		}
		return false;
	};

	const makeCSSClass = (className: string, cssClassDef: string) => {
		if (!browser) return;
		if (classExists(className)) return;
		let s = document.createElement('style');
		s.innerHTML = cssClassDef;
		document.head.appendChild(s);
	};

	// return an array that contains objects
	const getButtonObjects = (): TButtonObject[] => {
		const buttons = (
			ButtonObjects.length ? fromButtonObjects() : fromButtonProps()
		) as TButtonObject[];
		setNavButtons(buttons);
		return buttons;
	};

	onMount(() => {
		// on unmounting page
		return () => {
			console.log($navBars);
			$navBars.forEach((nb: TNavBar) => {
				nb.oIx = 0;
				nb.pIx = 0;
			});
		};
	});
	// end of rendering navigation bar
</script>

<nav class="nav" on:click={toggleActive} aria-hidden={true}>
	{#each getButtonObjects() as button}
		<label for={`cb${button.ix}`}>
			<input type="checkbox" id={`cb${button.ix}`} />
			<div
				class={button.className}
				on:click={() => goto(button.href ?? `/${button.title}`)}
				aria-hidden={true}
			>
				{button.title}
			</div>
		</label>
	{/each}
</nav>

<style lang="scss">
	.hidden {
		display: none !important;
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
		padding: 2px 0.5rem;
		border: 2px solid transparent;
		text-align: center;
		min-width: 6rem;
		height: 1.5rem;
		font-size: 20px;
		cursor: pointer;
		user-select: none;
		outline: none;
		margin: 0 4px;
		text-transform: capitalize;
		&:hover {
			color: yellow;
			border-color: lightgreen;
		}
	}
	.nav input {
		display: none;
	}
	/* input:checked ~ div *,  */
	input:checked ~ div,
	input:checked ~ div * {
		border-color: rgb(91, 178, 91);
		background-color: navy;
		color: yellow;
	}
</style>
