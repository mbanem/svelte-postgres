<script lang="ts">
	type ARGS = {
		color: string
		duration?: string
		size?: string
	}
	let { color = `black`, duration = `1.5s`, size = `1em` }: ARGS = $props()
</script>

<!-- border-color for every side top right bottom left -->
<div
	style:border-color="{color} transparent {color}
	{color}"
	style="--duration: {duration}"
	style:width={size}
	style:height={size}
></div>

<style>
	div {
		display: inline-block;
		vertical-align: middle;
		margin: 0 3pt;
		border-width: calc(1em / 5);
		border-style: solid;
		border-radius: 50%;
		animation: var(--duration) infinite rotate;
		position: absolute;
		top: 20%;
		left: 0;
		color: black;
	}
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
