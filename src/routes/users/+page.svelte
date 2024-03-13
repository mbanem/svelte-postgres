<script lang="ts">
	import { P } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ users } = data);
</script>

<h1>User List</h1>
<!-- <pre>{JSON.stringify(data,null,2)}</pre> -->
<ul>
	{#if users}
		{#each users as { id, firstName, lastName, email }}
			<li class="post-list">
				<a type="button" href="/api/delete/[user]x[{id}]">❌</a>
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
