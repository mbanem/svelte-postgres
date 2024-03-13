<script lang="ts">
	import { tick } from 'svelte';
	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
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
</script>

<svelte:window on:click={flip} />
<h3>Click anywhere to FLIP</h3>

<div class="container">
	<div data-layout={layout}>
		{#each { length: 10 } as circle, id}
			<img class="circle" src="https://picsum.photos/100/100?random={id}" alt="placeholder" />
		{/each}
	</div>
</div>

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
		height: 100vh;
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
