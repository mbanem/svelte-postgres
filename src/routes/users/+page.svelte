<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, getContext } from 'svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ users } = data);
	const postDelete = async (id: string) => {
		// we immediately get a promise
		const response = await fetch(`/api/delete/[user]x[${id}]`, {
			method: 'POST',
			body: id
		});

		// and with the promise we have to wait for the result
		const data = await response.json();
		// console.log(JSON.stringify(data, null, 2));
	};

	let mrPath = getContext('mrPath') as SvelteStore<string>;

	onMount(() => {
		return () => {
			mrPath.set($page.url.pathname);
		};
	});
</script>

<h1>User List</h1>
<!-- <pre>{JSON.stringify(data,null,2)}</pre> -->
<ul>
	{#if users}
		{#each users as { id, firstName, lastName, email }}
			<li class="post-list">
				<button on:click={() => postDelete(id)} type="button">❌</button>
				<a href="/user?id={id}">{firstName} {lastName}</a>
			</li>
		{/each}
	{/if}
</ul>

<style lang="scss">
	.post-list {
		display: flex;
		gap: 8px;
	}
</style>
