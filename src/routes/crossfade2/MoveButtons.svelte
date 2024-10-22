<script lang="ts">
	// does not work correctly when attempting to cross family borders
	type PROPS = {
		actionUp: (_: Object, _: number) => void
		actionDown: (_: Object, _: number) => void
		first: boolean
		last: boolean
	}
	let { actionUp, actionDown, first, last } = $props()
	console.log(first, last)
</script>

<div class="up-down">
	<button onclick={() => actionUp} disabled={first}> ↑ </button>
	<button onclick={() => actionDown} disabled={last}> ↓ </button>
</div>

<style>
	.up-down {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid;
		padding: 0.5rem 0.5rem;
		margin: -1rem 0 -1rem -1rem;
		gap: 0.5rem;
	}
	button:disabled {
		background-color: darkgray !important;
		cursor: not-allowed;
	}
</style>
