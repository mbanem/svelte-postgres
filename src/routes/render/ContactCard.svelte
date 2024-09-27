<script lang="ts">
	import type { Snippet } from 'svelte'
	let { name, address }: { name: Snippet; address: Snippet } = $props()
</script>

<div class="wrapper">
	<div class="name">{@render name()}</div>
	<div class="address">{@render address()}</div>
</div>

<style>
	.wrapper {
		width: max-content;
		border: 1px solid gray;
		border-radius: 8px;
		padding: 1rem 2rem;
		margin-left: 2rem;
	}
	.name {
		font-size: 20px;
		font-weight: 400;
		color: lightblue;
	}
	.address {
		color: lightgreen;
		margin-top: 6px;
	}
</style>
