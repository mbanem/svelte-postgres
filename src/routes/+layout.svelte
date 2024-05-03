<script lang="ts">
	export let data: LayoutData;
	import { page } from '$app/stores';
	import '$styles/app.scss';
	import Nav from '$components/Nav.svelte';
	import type { LayoutData } from './$types';
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let navPath = writable<string>('/');
	setContext('mrPath', navPath);
	let mrPath = getContext('mrPath') as SvelteStore<string>;

	$: ({ locals } = data);
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<main>
	<Nav {locals} />
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
