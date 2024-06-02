<script lang="ts">
	import '$styles/global.scss'
	import '$styles/app.scss'
	import { writable } from 'svelte/store'
	import { getContext, setContext } from 'svelte'
	import { getNavBars, setNavBars, setNavButtons, getNavButtons } from '$utils/store'

	import NavBar from '$components/NavBar.svelte'
	import type { LayoutData } from './$types'
	export let data: LayoutData

	// array of individual button props
	const navButtonObjects: TNavButtonObject[] = [
		{ position: '0', title: 'home', condition: 'UNKNOWN' },
		{ position: '1', title: 'profile', href: '/profile', condition: 'USER' },
		{ position: '2', title: 'post', condition: 'USER' },
		{ position: '3', title: 'todo', condition: 'USER' },
		{ position: '4', title: 'news', condition: 'USER' },
		{ position: '5', title: 'multiselect', href: '/multiselect', condition: 'USER' },
		{ position: '6', title: 'users', href: '/users', condition: 'ADMIN' },
		{ position: '7', title: 'admin', href: '/admin', condition: 'ADMIN' },
		{ position: '8', title: 'flip', condition: 'UNKNOWN' },
		{ position: '9', title: 'crossfade', condition: 'UNKNOWN' },
		{ position: '10', title: 'communicate', condition: 'UNKNOWN' },
		{ position: '11', title: 'parent_child', condition: 'UNKNOWN' },
		{ position: '1t', title: 'bars', condition: 'UNKNOWN' }
	]

	// establish presence of context for this page
	setNavBars('not set', 0, 0)
	const navBars = getNavBars()

	let navPath = writable<string>('/')
	setContext('mrPath', navPath)
	let mrPath = getContext('mrPath') as SvelteStore<string>

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

	$: ({ locals } = data ?? {}) // data.data.data.locals.user.role
</script>

<div class="wrapper">
	<NavBar {navButtonObjects} role={locals?.user?.role ?? 'UNKNOWN'} />
	<slot />
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
		top: calc(100vh - 3rem);
		z-index: 1;
	}
	div {
		font-size: 16px;
		&:target {
			background-color: blue;
		}
	}
</style>
