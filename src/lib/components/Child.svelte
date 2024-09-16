<script lang="ts">
	type ARGS = {
		array: number[]
	}
	let { array = $bindable([]) }: ARGS = $props()
</script>

<div class="wrapper expression-highlighted">
	{#each array as n}
		<p>{n}</p>
	{/each}
</div>
Child area
<button onclick={() => array.push(array.length)}>add next</button>
<button onclick={() => array.pop()}>remove the last</button>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss'">
	.wrapper {
		display: flex;
		gap: 4px;
	}
	p {
		display: inline-block;
	}
</style>
