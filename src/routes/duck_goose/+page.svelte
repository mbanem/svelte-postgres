<script lang="ts">
	import '$styles/app.scss';

	const duck = new URL('./duck.jpeg', import.meta.url).href;
	const goose = new URL('./goose.jpeg', import.meta.url).href;

	// import duck from './duck.jpeg';
	// import goose from './goose.jpeg';
	// import { read } from '$app/server';

	let bird = duck;
	export function GET() {
		bird = bird === duck ? goose : duck;
		// return read(bird);
	}
</script>

<input type="text" class="text-box" placeholder="Enter First Name" />
<div class="wrapper">
	<img src={bird} alt="Either a duck, a duck or a goose" />

	<button on:click={GET}>get duck or goose</button>
</div>

<style lang="scss">
	.text-box {
		// @include input-text(12rem);
		width: 12rem;
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
