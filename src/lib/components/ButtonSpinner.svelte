<!--
@component
-->

<script lang='ts'>
	type ARGS = {
		color?: string
		duration?: string
		size?: string
		top?: string
		bindTo?: any
		formaction?: string
		spinOn: boolean
		caption: string
	}
	let {
		color = `skyblue`,
		duration = `1.5s`,
		size = `1em`,
		top = `0`,
		bindTo=$bindable(),
		formaction,
		spinOn,
		caption
	}: ARGS = $props()
</script>

{#snippet spinner(color: string)}
	<div
		class="comrunner-div"
		style:border-color='{color} transparent {color}
		{color}'
		style='--duration: {duration}'
		style:width={size}
		style:height={size}
		style:top={top}
	></div>
{/snippet}

<p style='position:relative;margin:0;padding:0;'>
	<button bind:this={bindTo as HTMLButtonElement} type='submit' class='hidden' {formaction}>
		{#if spinOn}
			<!-- NOTE: must have ancestor with position relative to get proper position -->
			{@render spinner(color)}
		{/if}
		{caption}
	</button>
</p>
<style>
	.comrunner-div {
		display: inline-block;
		vertical-align: middle;
		margin: 0 4pt;
		height:1rem;
		border-width: calc(1em / 5);
		border-style: solid;
		border-radius: 50%;
		animation: var(--duration) infinite rotate;
		position: absolute;
		left: 0;
		top: 8px !important;
		color: black;
	}
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
	.hidden{
		display:none;
	}
</style>