<script lang="ts">
	export let paths: string[];
	export let prevPath: string;
	import { goto } from '$app/navigation';
	import * as utils from '$lib/utils';

	const followPath = (path: string) => {
		if (path === prevPath.slice(1)) {
			// 'history to', prevPath);
			history.back();
		} else {
			// 'followPath to', path);
			path === 'home' ? goto('/') : goto(`/${path}`);
		}
	};
</script>

{#each paths as path}
	{#if path === prevPath}
		{history.back()}
	{:else}
		<button on:click={() => followPath(path)}>{utils.capitalize(path)}</button>
	{/if}
{/each}
