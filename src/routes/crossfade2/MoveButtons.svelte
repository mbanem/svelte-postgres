<script lang="ts">
	// does not work correctly when attempting to cross family borders
	let { actionUp, actionDown } = $props()
</script>

<div class="up-down">
	<button onclick={() => actionUp}> ↑ </button>
	<button onclick={() => actionDown}> ↓ </button>
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
</style>
