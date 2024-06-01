<script lang="ts">
	import { page } from '$app/stores'
	import { onMount, getContext } from 'svelte'

	let mrPath = getContext('mrPath') as SvelteStore<string>

	onMount(() => {
		return () => {
			// @ts-expect-error
			mrPath.set($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1>Welcome to SvelteKit</h1>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
