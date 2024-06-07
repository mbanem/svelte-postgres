<script lang="ts">
	import { page } from '$app/stores'
	import { onMount, getContext } from 'svelte'
	import { tick } from 'svelte'
	import { gsap } from 'gsap'
	import Flip from 'gsap/dist/Flip'
	import { error } from '@sveltejs/kit'

	gsap.registerPlugin(Flip)

	type Layout = 'stack' | 'grid'
	let layout: Layout = 'stack'

	const flip = async () => {
		const state = Flip.getState('.circle')
		layout = layout === 'grid' ? 'stack' : 'grid'
		await tick()

		Flip.from(state, {
			duration: 0.8, // sec
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'ease-out'
		})
	}
	const makeError = () => {
		throw error(420, 'Enhance your calm')
	}

	let mrPath = getContext('mrPath') as SvelteStore<string>

	onMount(() => {
		return () => {
			// @ts-expect-error
			mrPath.set($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Flip</title>
</svelte:head>

<!-- <svelte:window on:click={flip} /> -->
<main>
	<h3 class="click-info">Click on a circle to FLIP</h3>
	<div class="container">
		<div
			data-layout={layout}
			on:click={flip}
			on:keydown={flip}
			role="button"
			tabindex="0"
			aria-label="press a key to flip"
		>
			{#each { length: 9 } as circle, id}
				<img class="circle" src="/assets/P{id}-100x100.jpg" alt="" />
			{/each}
		</div>
	</div>
	<div class="slider">
		<div class="item item-5">5</div>
		<div class="item item-4">4</div>
		<div class="item item-3">3</div>
		<div class="item item-2">2</div>
		<div class="item item-1">1</div>
	</div>
</main>
<section>
	<pre>We cause error on purpose in order to show Custom Error Page
	by submitting form with POST method to fake URL
</pre>
	<form method="POST" action="?/nowhere">
		<input type="hidden" value="make an error" />
		<button type="submit">make error</button>
	</form>
</section>

<style lang="scss">
	@use 'sass:list';
	$colors: 'green', 'orange', 'purple', 'navy', 'tomato';
	.item-base {
		width: 4rem;
		height: 4rem;
		color: white;
		font-size: 25px;
		text-align: center;
		line-height: 4rem;
		border: 4px solid gray;
		border-radius: 8px;
	}
	@for $i from 1 through 5 {
		.item-#{$i} {
			@extend .item-base;
			background-color: list.nth($colors, $i);
		}
	}
	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-content: center;
		position: relative;
		width: 100vw;
		height: 70vh;
	}
	.click-info {
		position: absolute;
		top: -4rem;
		left: 42vw;
		font-weight: 300;
		color: lightgreen;
	}
	section {
		margin-left: 4rem;
	}

	.container {
		// position: relative;
		display: grid;
		height: 45vh;
		width: 45vw;
		margin: 6rem auto;
		place-content: center;
		cursor: pointer;
		border: 1px solid gray;
		border-radius: 1rem;
	}
	.circle {
		width: 100px;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 4px solid hsl(220 10% 10%);
	}
	[data-layout='stack'] {
		display: flex;
		gap: -0.5rem;
	}
	[data-layout='stack'] .circle:not(:first-child) {
		margin-left: -40px;
	}
	[data-layout='grid'] {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		// row-gap: -1rem;
	}
</style>
