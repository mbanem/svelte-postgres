<script lang="ts">
	// export const ssr = false;
	export let data: App.Locals;
	import { page } from '$app/stores';
	import '$styles/app.scss';
	import { onMount } from 'svelte';
	// import Nav from '$components/Nav.svelte';
	// import type { LayoutData } from './$types';
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { setNavBars, getNavBars } from '$utils/store';
	import NavBar from '$components/NavBar.svelte';
	// import { applyAction } from '$app/forms';
	// establish presence of context for this page
	setNavBars('not set', 0, 0);
	const navBars = getNavBars();
	navBars.set([]);

	/*not used yet
	let ButtonObjects1: TButtonObjects = [
		{ title: 'home', href: '/' },
		{ title: 'logged-in-only-post', href: '/post', cssRules: '', onHover: '' },
		{ title: 'logged-in-only-profile', href: '/profile', cssRules: '', onHover: '' },
		{ title: 'logged-in-only-todo', href: '/todo', cssRules: '', onHover: '' }
	]
	let ButtonObjects2: TButtonObjects = [
		{ title: 'news', href: '/news' },
		{ title: 'admin-only-admin', href: '/admin' },
		{ title: 'pavlovci', href: '/about/pavlovci' },
		{ title: 'notifications', href: '/about/notifications' }
		{title: 'login'}, href: '/login'},
		{title: 'register'}, href: '/register'},
		{title: 'flip'}, href: '/flip'},
		{title: 'multiselect'}, href: '/multiselect'},
		{title: 'box'}, href: '/box'},
		{title: 'communicate'}, href: '/communicate'}
	]
	*/

	let ButtonProps: TButtonProps = [
		'home',
		'post',
		'profile',
		'todo',
		'admin',
		'users',
		'login',
		'logout',
		'register',
		'flip',
		'multiselect',
		'box',
		'communicate'
	];

	let navPath = writable<string>('/');
	setContext('mrPath', navPath);
	let mrPath = getContext('mrPath') as SvelteStore<string>;

	$: role = (data as App.Locals)?.user?.role ?? 'UNDEFINED';
	onMount(() => {
		console.log('role', role);
	});
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<main>
	<!-- <Nav {locals} /> -->
	<NavBar {ButtonProps} {role} />
	<slot />
</main>

<style lang="scss">
	// @import 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css';

	:global(body) {
		padding: 2rem;
	}
	:global(input, button) {
		border-radius: 6px;
	}

	main {
		width: 98vw;
		height: 85vh;
		background-color: #3e3e3e;
	}
</style>
