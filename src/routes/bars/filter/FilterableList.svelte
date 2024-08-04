<script lang="ts">
	type ARGS = {
		data: { hex: string; name: string }
		field: string
	}
	let { data, field }: ARGS = $props()

	let search = $state('')

	let regex = $derived(search ? new RegExp(search, 'i') : null)
	//	item
	const matches = (item) => (regex ? regex.test(item[field]) : true)
</script>

<div class="list">
	<label class="title">
		Color names containing this substring: <input bind:value={search} />
	</label>

	<div class="header">
		<slot name="header" />
	</div>

	<div class="content">
		{#each data.filter(matches) as item}
			<slot {item} />
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
