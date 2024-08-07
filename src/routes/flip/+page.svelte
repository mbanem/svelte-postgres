<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	// import { onMount, getContext } from 'svelte';
	import { tick } from 'svelte'
	import { gsap } from 'gsap'
	import Flip from 'gsap/dist/Flip'
	import { crossfade } from 'svelte/transition'
	import { error } from '@sveltejs/kit'
	import * as utils from '$utils'
	import { capitalize, setMrPath } from '$utils'

	const colors = ['red', 'orange', 'green', 'purple']
	gsap.registerPlugin(Flip)

	let start = $state<boolean>(true)
	let [send, receive] = crossfade({
		duration: 2000
	})
	const handleEndA = () => {
		console.log('handleEnd A')
	}
	const handleEndB = () => {
		console.log('handleEnd B')
	}
	type Layout = 'stack' | 'grid'
	// NOTE: in route 'flip' layout is not defined by rune $state and works OK
	// but here layout = $state<Layout> is necessary for flip to work
	let layout = $state<Layout>('stack')

	const flip = async () => {
		const state = Flip.getState('.circle', { props: 'borderRadius' })
		layout = layout === 'grid' ? 'stack' : 'grid'
		await tick()

		Flip.from(state, {
			duration: 0.8,
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'ease-out',
			delay: 0.5
		})
	}

	const makeError = () => {
		throw error(420, 'Enhance your calm')
	}

	// let mrPath = getContext('mrPath') as SvelteStore<string>;

	let boxTimeline = gsap.core.Timeline
	const boxPlay = (node: string) => {
		let boxTimeline = gsap.timeline()
		const duration = 1

		boxTimeline
			.from(node, {
				duration,
				opacity: 0
			})
			.from(
				node,
				{
					duration,
					xPercent: 100,
					rotation: -90,
					yPercent: 100,
					ease: 'bounce.out'
				},
				`-=${duration * 0.75}`
			)
	}
	onMount(() => {
		boxPlay('.box1')
		return () => {
			setMrPath($page.url.pathname)
		}
	})

	let visible = $state<boolean>(true)
	// let cb_state = $derived(visible ? 'Hide the box' : 'Turn the box visible')

	const tweenMe = (node: HTMLElement) => {
		let tl = gsap.timeline()
		const duration = 1

		tl.from(node, {
			duration,
			opacity: 0
		}).from(
			node,
			{
				duration,
				xPercent: 100,
				rotation: -90,
				yPercent: 100,
				ease: 'bounce.out'
			},
			`-=${duration * 0.75}`
		)

		return {
			/* GSAP's duration is in seconds. Svelte's is in milliseconds */
			duration: tl.totalDuration() * 1000,
			tick: (t: number) => {
				tl.progress(t)
			}
		}
	}

	// ------------- squares 1-5 to animateOut and restore back ---------------
	let timeline: gsap.core.Timeline

	// stagger block
	// NOTE: creating timeline i  onMount after timeline.reverse()
	// leave timeline unresponsive, so we create it over and over
	// inside animateOut. As it is in <button onclick scope it can
	// accept the reverse() call

	// toggle hidden is crucial for allowing the reverse button to function
	// timeline.reverse() also calls animateOut but clicking on button title
	// timeline is left stuck, probably getting incorrect event, so we use x
	// to call ourselves timeline-reverse() every second time no mater if
	// button or button title is clicked
	let x = false
	const animateOut = () => {
		setTimeout(() => {
			document.querySelector('.button')?.classList.toggle('hidden')
		}, 2500)

		if (x) {
			x = !x
			return timeline.reverse()
		}
		x = !x

		timeline = gsap.timeline({
			defaults: { duration: 1 }
		})
		timeline
			.to('.boxS', {
				opacity: 0,
				y: -300,
				stagger: 0.3,
				ease: 'back.in'
			})
			.fromTo(
				'.button',
				{
					opacity: 0,
					rotation: 360,
					ease: 'back.in'
				},
				{
					opacity: 1
				}
			)
	}
	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Flip</title>
</svelte:head>

<!-- <svelte:window onclick={flip} /> -->
<!-- three column grid -->
<main>
	<h3 class="click-info">Click on a circle to FLIP</h3>
	<div class="label-abs">
		<div data-label={layout}>click on an image to rearrange them</div>
	</div>
	<div class="container">
		<div
			data-layout={layout}
			onclick={flip}
			onkeydown={flip}
			role="button"
			tabindex="0"
			aria-label="press a key to flip"
		>
			{#each { length: 9 } as circle, id}
				<img class="circle" src="/assets/P{id}-100x100.jpg" alt="" />
			{/each}
		</div>
	</div>
	<div class="slider" onclick={animateOut} aria-hidden={true}>
		<h3 class="transition-info">Click a box to transition out</h3>
		<div class="button-wrapper">
			<button onclick={() => timeline.reverse()} class="button hidden">reverse</button>
		</div>
		{#each ['green', 'purple', 'orange', 'tomato', 'rebeccapurple'] as colorName}
			<div class="boxS {colorName}">{capitalize(colorName)}</div>
		{/each}
	</div>

	<div class="tween-block">
		<div>
			<div class="box1" onclick={() => boxPlay('.box1')} aria-hidden={true}>Click to play</div>
		</div>
		<div>
			{#if visible}
				<div
					class="box2"
					transition:tweenMe
					onclick={() => {
						visible = !visible
						start = !start
					}}
					aria-hidden={true}
				>
					Hiding box
				</div>
			{/if}
		</div>
		<div style="position:relative">
			<div class="main" onclick={() => (start = !start)} aria-hidden={true}>
				{#if start}
					<label
						class="crossfade-a"
						for="cBox"
						in:send={{ key: 'x' }}
						out:receive={{ key: 'x' }}
						aria-hidden={true}
					>
					</label>
				{:else}
					<label
						class="crossfade-b"
						style:width="10.1rem"
						for="cBox"
						in:send={{ key: 'x' }}
						out:receive={{ key: 'x' }}
					>
						Turn the box visible
					</label>
				{/if}
			</div>
			<!-- clicks toggle checkbox's bind-variable true/false
				which in turn activates transition in the previous block above
			-->
			<input id="cBox" type="checkbox" bind:checked={visible} class="hidden" />
		</div>
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

	.crossfade-a,
	.crossfade-b {
		border: 1px solid gray;
		border-radius: 5px;
		padding: 3px 1rem;
		margin-top: 1rem;
		width: 30rem;
		user-select: none;
		cursor: pointer;
		&:hover {
			border-color: yellow;
		}
		label {
			border: none;
			margin: 0;
			padding: 0;
			color: yellow;
		}
	}
	.crossfade-a {
		position: absolute;
		top: 15rem;
		left: 15rem;
		opacity: 0;
	}
	.crossfade-b {
		position: absolute;
		top: -5rem;
		left: -6rem;
		border: 1px solid yellow !important;
		border: 4px solid yellow;
	}
	.hidden {
		display: none;
	}

	label[for='cBox'] {
		display: inline-block;
		width: 9rem;
		height: 1.5rem;
		color: white;
		background-color: navy;
		border: 1px solid transparent;
		border-radius: 4px;
		text-align: center;
		line-height: 1.5rem;
		&:hover {
			color: yellow;
			border-color: yellow;
		}
	}

	.tween-block {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: center;
		margin-top: 4rem 0 0 0;
		padding: 1rem;
		border: 1px solid gray;
		border-radius: 8px;
	}
	.slider {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 100%;
		height: 85vh;
		.button {
			color: lightgreen;
			border-color: lightgreen;
			border-radius: 5px;
			&:hover {
				color: inherit;
				border-color: inherit;
				border-radius: inherit;
				cursor: pointer;
			}
		}
	}
	.button-wrapper {
		display: inline-block;
		background: transparent;
		border-radius: 5px;
		z-index: 2;
		&:hover {
			color: yellow;
			border: 1px solid yellow;
		}
	}
	.box1,
	.box2 {
		width: 110px;
		height: 110px;
		background-color: purple;
		border: 3px solid gray;
		text-align: center;
		line-height: 110px;
		border-radius: 6px;
		margin: 1rem 0 0 4rem;
		user-select: none;
		cursor: pointer;
	}

	$cls: green, purple, orange, tomato, rebeccapurple;
	.boxS {
		color: white;
		width: 8rem;
		height: 5rem;
		border: 3px solid gray;
		border-radius: 6px;
		margin-left: 1rem;
		text-align: center;
		line-height: 5rem;
		user-select: none;
		cursor: pointer;
	}
	@for $j from 1 through 5 {
		.#{'' + list.nth($cls,$j)} {
			@extend .boxS;
			background-color: list.nth($cls, $j);
		}
	}
	main {
		display: grid;
		grid-template-columns: 1fr 15rem 1fr;
		justify-content: center;
		position: relative;
		width: 100vw;
		height: 70vh;
	}
	.transition-info {
		font-weight: 300;
		color: lightgreen;
		text-align: center;
		user-select: none;
	}
	.click-info {
		position: absolute;
		top: -4rem;
		left: 42vw;
		font-weight: 300;
		user-select: none;
		color: lightgreen;
	}
	section {
		margin-left: 4rem;
	}

	.container {
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
		user-select: none;
	}
	[data-layout='stack'] .circle:not(:first-child) {
		margin-left: -40px;
		user-select: none;
	}
	[data-layout='grid'] {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		user-select: none;
	}
	.label-abs {
		position: absolute;
		display: flex;
		top: 10rem;
		left: 17.2rem;
		margin-bottom: 5px;
		color: lightgreen;
		transition-delay: 6s;
	}
	[data-label='stack'] {
		transform: translate(0, 3rem);
		transition-delay: 6s;
		transition: transform 3s;
		user-select: none;
	}
	[data-label='grid'] {
		// position: absolute;
		// top: 5rem;
		// width: 15rem;
		transform: translate(0, -3.8rem);
		transition-delay: 2s;
		transition: transform 3s;
		user-select: none;
	}
</style>
