<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let firstName = '';
</script>

{#if firstName}
	<h1>Welcome {firstName} to SvelteKit</h1>
{:else}
	<h1>Welcome to SvelteKit</h1>
{/if}

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
