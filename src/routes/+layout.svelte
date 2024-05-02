<script lang="ts">
	import { page } from '$app/stores';
	import '$styles/app.scss';
	import Nav from '$components/Nav.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
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
