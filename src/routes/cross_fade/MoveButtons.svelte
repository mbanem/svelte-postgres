<script>
	let { actionUp, actionDown } = $props()
</script>

<div>
	<button onclick={() => actionUp}> ↑ </button>
	<button onclick={() => actionDown}> ↓ </button>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid;
		padding: 0.5rem 0.5rem;
		margin: -1rem 0 -1rem -1rem;
		gap: 0.5rem;
	}
</style>
