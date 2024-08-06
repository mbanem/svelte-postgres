<script lang="ts">
	// child component to update local childCount when called from parent
	let childCount = $state<number>(0);
	export const counter = (delta: number) => (childCount += delta);
</script>

<div class="wrapper">
	<p>child local counter <span class="count">{childCount}</span></p>
</div>

<style lang="scss">
	.count {
		font-size: 24px;
		color: yellow;
	}
</style>
