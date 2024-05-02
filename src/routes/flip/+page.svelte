<script lang="ts">
	import { tick } from 'svelte';
	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
	import { error } from '@sveltejs/kit';

	gsap.registerPlugin(Flip);

	type Layout = 'stack' | 'grid';
	let layout: Layout = 'stack';

	const flip = async () => {
		const state = Flip.getState('.circle');
		layout = layout === 'grid' ? 'stack' : 'grid';
		await tick();

		Flip.from(state, {
			duration: 0.8, // sec
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'ease-out'
		});
	};
	const makeError = () => {
		throw error(420, 'Enhance your calm');
	};
</script>

<svelte:head>
	<title>Flip</title>
</svelte:head>

<!-- <svelte:window on:click={flip} /> -->
<h3>Click on a circle to FLIP</h3>

<div class="container">
	<div
		data-layout={layout}
		on:click={flip}
		on:keydown={flip}
		role="button"
		tabindex="0"
		aria-label="press a key to flip"
	>
		{#each { length: 10 } as circle, id}
			<img class="circle" src="/assets/P{id}-100x100.jpg" alt="" />
		{/each}
	</div>
</div>

<pre>We cause error on purpose in order to show Custom Error Page
by submitting form with POST method to fake URL
</pre>
<form method="POST" action="?/nowhere">
	<input type="hidden" value="make an error" />
	<button type="submit">make error</button>
</form>

<style lang="scss">
	h3 {
		position: absolute;
		top: 20%;
		left: 50%;
		translate: -50%;
		font-weight: 200;
		cursor: pointer;
	}
	.container {
		display: grid;
		height: 50vh;
		place-content: center;
		cursor: pointer;
	}
	.circle {
		width: 100px;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 4px solid hsl(220 10% 10%);
	}
	[data-layout='stack'] {
		display: flex;
	}
	[data-layout='stack'] .circle:not(:first-child) {
		margin-left: -40px;
	}
	[data-layout='grid'] {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}
</style>
