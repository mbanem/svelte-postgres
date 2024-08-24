<script lang="ts">
	import '$styles/app.scss'
	const duck = new URL('./duck.jpeg', import.meta.url).href
	const goose = new URL('./goose.jpeg', import.meta.url).href

	// import duck from './duck.jpeg';
	// import goose from './goose.jpeg';
	// import { read } from '$app/server';

	let bird = duck
	let btn: HTMLButtonElement
	const get = () => {
		bird = bird === duck ? goose : duck
		btn.innerText = bird === duck ? 'show goose' : 'show duck'
	}
</script>

<div class="wrapper">
	<input type="text" class="text-box" placeholder="Enter First Name" />
	{#if bird}
		<img src={bird} alt="" />
	{/if}
	<button bind:this={btn} onclick={get}>show goose</button>
</div>
<!-- even onMount click on a button to get bird does not work
	looks like this is the only solution, though there is a flick
-->
<svelte:window on:load={() => get()} />

<style lang="scss">
	.text-box {
		@include input-text(16rem);
		// width: 12rem;
	}
	.wrapper {
		// position: relative;
		margin: 6rem 0 0 33vw;
		img {
			// position: fixed;
			width: 20rem;
			height: 20rem;
			// left: 45vw;
			// top: 8rem;
			background: #222;
		}
		button {
			display: block;
			margin: 1rem 0 0 3rem;
			width: 14rem;
		}
	}
</style>
