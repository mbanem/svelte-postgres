<script lang="ts">
	import '$styles/global.scss'
	import '$styles/app.scss'
	import { writable } from 'svelte/store'
	import { getContext, setContext, type Snippet } from 'svelte'
	import { getNavBars, setNavBars, setNavButtons, getNavButtons } from '$utils/store'

	import NavBar from '$components/NavBar.svelte'
	import type { LayoutData } from './$types'
	let { data, children }: { data: LayoutData; children: Snippet } = $props()

	// array of individual button props
	const navButtonObjects: TNavButtonObject[] = [
		{ position: '0', title: 'home', condition: 'VISITOR' },
		{ position: '5', title: 'profile', href: '/profile', condition: 'USER' },
		{ position: '10', title: 'post', condition: 'USER' },
		{ position: '15', title: 'todo', condition: 'USER' },
		{ position: '20', title: 'news', condition: 'USER' },
		{ position: '21', title: 'derived', condition: 'USER' },
		{ position: '25', title: 'multiselect', href: '/multiselect', condition: 'USER' },
		{ position: '30', title: 'users', href: '/users', condition: 'ADMIN' },
		{ position: '36', title: 'admin', href: '/admin', condition: 'ADMIN' },
		{ position: '40', title: 'flip', condition: 'VISITOR' },
		{ position: '45', title: 'crossfade', condition: 'VISITOR' },
		{ position: '50', title: 'communicate', condition: 'VISITOR' },
		{ position: '55', title: 'Parent Child', href: '/parent_child', condition: 'VISITOR' },
		{ position: '60', title: 'bars', condition: 'VISITOR' },
		{ position: '65', title: 'caterpillar', condition: 'VISITOR' },
		{ position: '70', title: 'scroll', condition: 'VISITOR' }
	]

	// establish presence of context for this page
	setNavBars('not set', 0, 0)
	const navBars = getNavBars()

	let navPath = writable<string>('/')
	setContext('mrPath', navPath)
	// let mrPath = getContext('mrPath') as SvelteStore<string>

	/*
	to iterate over ButtonProps as it is an array of PartialRecord<TButtonParam, string>
	we need outer loop over the array and inner loop over the Record props
		navButtonProps.forEach(button=> {
        for (const key in button){
            console.log(key, button[key as TButtonParam])
        }
    })
*/

	// import { getContext, setContext } from 'svelte';
	// import { writable } from 'svelte/store';

	setNavButtons(0, 'className', 0, '/to-nowhere', 'title', 'condition')
	const navButtons = getNavButtons()
	navButtons.set([])

	let locals = $derived(data?.locals ?? {}) // data.data.data.locals.user.role
</script>

<div class="wrapper">
	<NavBar {navButtonObjects} role={locals?.user?.role ?? 'VISITOR'} />
	{@render children()}
	<div class="footer">
		<p>ComRUNNER Software Inc 2024 All rights reserved</p>
	</div>
</div>

<style lang="scss">
	.wrapper {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		// cannot help scrolling when selecting button Two or Three
		overflow-anchor: none;
	}

	.footer {
		position: absolute;
		text-align: left;
		margin-left: 1rem;
		left: 0;
		top: calc(100vh + 3rem);
		z-index: 1;
	}
	div {
		font-size: 16px;
		&:target {
			background-color: blue;
		}
	}
</style>
