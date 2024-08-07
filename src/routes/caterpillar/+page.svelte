<script lang="ts">
	import { onMount } from 'svelte'
	import { tick } from 'svelte'
	import { Flip } from 'gsap/dist/Flip'
	import { setCaterpillarColors } from '$utils'

	import { gsap } from 'gsap'
	gsap.registerPlugin(Flip)

	/* You must build the app first pnpm run build in order to really
    be able to import Flip as it points to gsap/dist/Flip.
    On the GSAP site they say
    	import { Flip } from 'gsap/Flip';
    	gsap.registerPlugin(Flip);

    but that did not work.
    NOTE: all the code should be run inside onMount as the page is
    render twice ssr and csr and ssr is halting the code
  */

	type Layout = 'stack' | 'grid'

	let layout: Layout = 'stack'
	async function flip() {
		// get initial state
		const divEl = document?.querySelector('.transform') as HTMLDivElement
		divEl.style.transitionDelay = divEl.classList.contains('transform-active') ? '0.5s' : '-0.1s'
		divEl.style.transitionDuration = divEl.classList.contains('transform-active') ? '1s' : '1s'
		divEl?.classList.toggle('transform-active')
		await tick()
		const state = Flip.getState('.circle', { props: 'borderRadius' })
		// change layout
		layout === 'grid' ? (layout = 'stack') : (layout = 'grid')
		// wait for changes to be applied to DOM
		await tick()

		// flip
		Flip.from(state, {
			// delay: 2,
			duration: 0.6,
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'expoScale(0.5,7,none)'
		})
	}

	// instantiate iterator by assignment
	const n6 = 6
	const n5 = 5
	// // @ts-expect-error
	// const arr6 = [...n6]
	// // @ts-expect-error
	// const arr5 = [...n5]

	let slider1: HTMLDivElement
	let slider2: HTMLDivElement
	let slider: HTMLDivElement

	const toggleBorder = (el: HTMLDivElement) => {
		el.classList.toggle('border')
	}
	const moveCard = (id: string) => {
		slider = id === '1' ? (slider1 as HTMLDivElement) : (slider2 as HTMLDivElement)
		let max = id === '1' ? n5 : (n6 as number)

		;(slider as HTMLDivElement).insertBefore(
			slider.children[max - 1] as HTMLDivElement,
			slider.children[0] as HTMLDivElement
		)
	}
	// put border on leading caterpillar squares
	let head1: HTMLDivElement | null = null
	let head2: HTMLDivElement | null = null

	const toggleCaterpillarHeads = (h1: HTMLDivElement, h2: HTMLDivElement) => {
		h1.style.border = `8px solid gray` //${h1.style.color}`;
		h2.style.border = `8px solid gray` //${h2.style.color}`;
	}

	// const isChildOfParent = (parent: HTMLDivElement, child: HTMLDivElement) => {
	// 	for (let i = 0; i < parent.children.length; i++) {
	// 		if (parent.children[i] === child) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// };

	let child: HTMLDivElement
	const sliderOnClick = (event: MouseEvent) => {
		event.stopPropagation() // unnecessary
		const elem = event.currentTarget as HTMLDivElement
		elem.style.border = 'none'

		child = event.currentTarget as HTMLDivElement
		const el = child.parentElement as HTMLDivElement
		child = el.children[el.children.length - 2] as HTMLDivElement

		// NOTE: toggle('border') does not work on this page as we use .style.backgroundColor
		// and .style.color in setCaterpillarColors?
		// child.classList.toggle('border');

		child.style.border = `8px solid gray` //${child.style.color}`;
		const match = el.outerHTML.match(/class=.(\w+\d) /)
		const id = match ? match[1].slice(-1) : ''
		let state = Flip.getState(id === '1' ? '.item' : '.itm') as Flip.FlipState
		let target = id === '1' ? '.item' : '.itm'

		moveCard(id)

		Flip.from(state, {
			targets: target,
			ease: 'sine.inOut',
			absolute: true,
			onEnter: (elements) => {
				toggleBorder(slider.firstChild as HTMLDivElement)
				return gsap.from(elements, {
					yPercent: 20,
					opacity: 0,
					ease: 'sine.out'
				})
			},
			onLeave: (element) => {
				toggleBorder(slider.lastChild as HTMLDivElement)
				return gsap.to(element, {
					yPercent: 20,
					xPercent: -20,
					transformOrigin: 'bottom left',
					duration: 3000,
					opacity: 0,
					ease: 'sine.out'
				})
			}
		})
	}

	onMount(() => {
		slider1 = document.querySelector('.slider1') as HTMLDivElement
		slider2 = document.querySelector('.slider2') as HTMLDivElement
		setCaterpillarColors(slider1)
		setCaterpillarColors(slider2)
		head1 = slider1.children[slider1.children.length - 1] as HTMLDivElement
		head2 = slider2.children[slider2.children.length - 1] as HTMLDivElement
		toggleCaterpillarHeads(head1, head2)
	})
</script>

<div class="in-grid">
	<div class="caterpillar">click on square box to make it the last one in caterpillar</div>
	<div class="label-abs">
		<div data-top={layout} class="transform">click on an image to rearrange them</div>
	</div>
	<div class="slider1">
		{#each [...n5] as n}
			<!-- could use [...5] as well -->
			<div class="item" onclick={sliderOnClick} aria-hidden={true}>{n5 - n}</div>
		{/each}
	</div>

	<div class="slider2">
		{#each [...n6] as n}
			<div class="itm" onclick={sliderOnClick} aria-hidden={true}>{n6 - n}</div>
		{/each}
	</div>
	<div class="container" onclick={flip} aria-hidden={true}>
		<div data-layout={layout}>
			{#each { length: 8 } as _, id}
				<img class="circle" src="/assets/P{id}-100x100.jpg" alt="Placeholder" />
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@use 'sass:math';
	@use 'sass:list';

	.caterpillar {
		position: absolute;
		top: 1rem;
		left: 2.5rem;
		color: lightgreen;
	}
	/* 145 colors by name*/
	$colors: AliceBlue, Aqua, Aquamarine, Azure, Beige, Bisque, Black, BlanchedAlmond, Blue,
		BlueViolet, Brown, BurlyWood, CadetBlue, Chartreuse, Chocolate, Coral, CornflowerBlue, Cornsilk,
		Crimson, Cyan, DarkBlue, DarkCyan, DarkGoldenRod, DarkGray, DarkGrey, DarkGreen, DarkKhaki,
		DarkMagenta, DarkOliveGreen, DarkOrange, DarkOrchid, #ad1414, DarkSalmon, DarkSeaGreen,
		DarkSlateBlue, DarkSlateGray, DarkSlateGrey, DarkTurquoise, DarkViolet, DeepPink, DeepSkyBlue,
		DimGray, DimGrey, DodgerBlue, FireBrick, ForestGreen, Fuchsia, Gainsboro, GhostWhite, Gold,
		GoldenRod, Gray, Grey, Green, GreenYellow, HoneyDew, HotPink, IndianRed, Indigo, Ivory, Khaki,
		Lavender, LavenderBlush, LawnGreen, LemonChiffon, LightBlue, LightCoral, LightCyan,
		LightGoldenRodYellow, LightGray, LightGrey, LightGreen, LightPink, LightSalmon, LightSeaGreen,
		LightSkyBlue, LightSlateGray, LightSlateGrey, LightSteelBlue, LightYellow, Lime, LimeGreen,
		Linen, Magenta, Maroon, MediumAquaMarine, MediumBlue, MediumOrchid, MediumPurple, MediumSeaGreen,
		MediumSlateBlue, MediumSpringGreen, MediumTurquoise, MediumVioletRed, MidnightBlue, MintCream,
		MistyRose, Moccasin, NavajoWhite, Navy, OldLace, Olive, OliveDrab, Orange, OrangeRed, Orchid,
		PaleGoldenRod, PaleGreen, PaleTurquoise, PaleVioletRed, PapayaWhip, PeachPuff, Peru, Pink, Plum,
		PowderBlue, Purple, RebeccaPurple, Red, RosyBrown, RoyalBlue, SaddleBrown, Salmon, SandyBrown,
		SeaGreen, SeaShell, Sienna, Silver, SkyBlue, SlateBlue, SlateGray, SlateGrey, Snow, SpringGreen,
		SteelBlue, Tan, Teal, Thistle, Tomato, Turquoise, Violet, Wheat, Yellow, YellowGreen;
	.border {
		border: 6px solid yellow;
		background-color: pink;
	}
	.in-grid {
		display: grid;
		position: relative;
		align-items: center;
		width: 70vw;
		margin: 0 auto;
		margin-top: 3rem;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 1rem;
		grid-template-columns: 260px 260px 1fr;
	}
	.label-abs {
		position: absolute;
		display: flex;
		top: 5px;
		left: 15%;
		margin-bottom: 5px;
		color: lightgreen;
		transition-delay: 3s;
		:nth-child(2) {
			margin-left: 12rem;
		}
	}
	[data-top='stack'] {
		margin-left: 30vw;
		margin-top: 3.5rem;
		transform: translate(0, 1.5rem);
		// transition-delay: 2s;
		transition: transform 3s;
	}
	[data-top='grid'] {
		margin-left: 30vw;
		// transition-delay: 2s;
		/* margin-top: 1rem; */
		transform: translate(0, 10px);
		transition: transform 1s;
	}
	.transform {
		transition: all 2s ease;
		transition-delay: 1s;
		transition-timing-function: ease-in-out;
	}

	.transform-active {
		top: 3rem;
	}
	.slider1,
	.slider2 {
		position: relative;
		width: 250px;
		height: 250px;
		/* margin: 4rem 0 0 5rem; */
		perspective: 200px;
		border: 1px solid gray;
		border-radius: 8px;
		background-color: rgb(60, 58, 58);
		cursor: pointer;
	}
	.border {
		border: 6px solid yellow;
	}
	.item,
	.itm {
		position: absolute;
		width: 100px;
		height: 100px;
		margin-top: 8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 3rem;
		border-radius: 6px;
		user-select: none;
	}

	/* NOTE: not used but left as interesting part */
	@for $i from 1 through 5 {
		.item-#{$i} {
			/* background-color: rgba(255 * math.random(), 255 * math.random(), 255 * math.random(), 1); */
			background-color: list.nth($colors, math.ceil(144 * math.random()));
		}
	}

	@for $i from 1 through 6 {
		.itm-#{$i} {
			background-color: list.nth($colors, math.ceil(144 * math.random()));
		}
	}

	button {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 50%;
		border: 0;
		font-size: 24px;
	}
	$e: 1;
	$f: 5;
	@for $k from $e through $f {
		.item:nth-child(#{$k}) {
			left: (120 - 20 * $k) * 1px;
			top: (-120 + 20 * $k) * 1px;
		}
	}

	$m: 1;
	$n: 6;
	@for $t from $m through $n {
		.itm:nth-child(#{$t}) {
			left: (140 - 20 * $t) * 1px;
			top: (-140 + 20 * $t) * 1px;
		}
	}

	.container {
		height: 300px;
		display: grid;
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
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}

	[data-layout='grid'] .circle {
		border-radius: 20%;
	}
</style>
