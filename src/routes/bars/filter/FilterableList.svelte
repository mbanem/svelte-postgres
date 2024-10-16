<script lang="ts">
	import type { Snippet } from 'svelte'
	import { type Color } from './colors'

	type ARGS = {
		data: Color[]
		field: string
		header: Snippet
		item_row: Snippet<[Color]>
	}
	let { data, field, header, item_row }: ARGS = $props()

	let search = $state('')

	let regex = $derived(search ? new RegExp(search, 'i') : null)
	// @ts-expect-error
	const matches = (item: Data) => (regex ? regex.test((item as Data)[field]) : true)
</script>

<div class="list">
	<label class="title">
		Color names containing this substring: <input bind:value={search} />
	</label>

	<div class="header">
		{@render header()}
	</div>

	<div class="content">
		{#each data.filter(matches) as item}
			{@render item_row(item)}
		{/each}
	</div>
</div>

<style>
	input {
		padding: 2px 6px;
		height: 1.5rem;
		font-size: 18px;
		margin-top: 0.5rem;
	}
	.list {
		display: flex;
		flex-direction: column;
		width: 51rem;
		height: 84.5vh;
		border: 1px solid gray;
		border-radius: 10px;
		margin: 1rem auto;
		overflow-y: auto;
		font-size: 18px;
	}

	/* .header {
		padding: 0.2em 0;
		background-color: aliceblue;
		color: black;
		height: 1.5rem;
	} */

	.content {
		flex: 1;
		overflow: auto;
		padding-top: 0.5em;
	}
	.title {
		color: skyblue;
		margin: 1rem 0 0 3rem;
	}
</style>
