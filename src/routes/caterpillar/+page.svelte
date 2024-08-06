<script lang="ts">
	import { onMount } from 'svelte'
	import { tick } from 'svelte'
	import { Flip } from 'gsap/dist/Flip'
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'

	import { gsap } from 'gsap'
	gsap.registerPlugin(Flip)

	/* You must build the app first pnpm run build in order to really
    be able to import Flip as it points to gsap/dist/Flip
    On the GSAP site they say
    import { Flip } from 'gsap/Flip';
    gsap.registerPlugin(Flip);

    but that did not work.
    NOTE: all the code should be run inside onMount as the page is
    render twice ssr and csr and ssr is halting the code
  */
	type Layout = 'stack' | 'grid'

	// NOTE: in caterpillar the layout must be defined as
	// $state<Layout>('stack') is ==n order to work,
	// but here it works as a plain variable
	let layout: Layout = 'stack'

	async function flip() {
		// get initial state
		const state = Flip.getState('.circle', { props: 'borderRadius' })
		// change the layout
		layout === 'grid' ? (layout = 'stack') : (layout = 'grid')
		// wait for changes to sink to DOM
		await tick()

		// flip
		Flip.from(state, {
			duration: 0.6,
			absolute: true,
			scale: true,
			stagger: -0.1,
			spin: true,
			ease: 'power1.easeOut'
		})
	}

	// instantiate iterator by assignment
	const n6 = 6
	const n5 = 5
	// @ts-expect-error
	const arr6 = [...n6]
	// @ts-expect-error
	const arr5 = [...n5]

	let slider1: HTMLDivElement
	let slider2: HTMLDivElement
	let slider: HTMLDivElement

	const toggleBorder = (el: HTMLDivElement) => {
		console.log('toggleBorder')
		el.classList.toggle('border')
	}
	const moveCard = (id: string) => {
		slider = id === '1' ? (slider1 as HTMLDivElement) : (slider2 as HTMLDivElement)
		let max = id === '1' ? n5 : (n6 as number)

		// ;(slider.children[0] as HTMLDivElement).classList.add('border')
		;(slider as HTMLDivElement).insertBefore(
			slider.children[max - 1] as HTMLDivElement,
			slider.children[0] as HTMLDivElement
		)
		// ;(slider.children[max - 1] as HTMLDivElement).classList.remove('border')
	}
	const sliderOnClick = (event: MouseEvent) => {
		event.stopPropagation() // unnecessary
		const match = (event.currentTarget as HTMLDivElement).outerHTML.match(/class=.(\w+\d) /)
		// @ts-expect-error
		const id = match[1].slice(-1)
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
		slider1.addEventListener('click', sliderOnClick)
		slider2.addEventListener('click', sliderOnClick)
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<div class="in-grid">
	<div class="label-abs">
		<div>click on square box to make it the last one in caterpillar</div>
		<div data-top={layout}>click on an image to rearrange them</div>
	</div>
	<div class="slider1">
		{#each arr5 as n}
			<div class="item item-{n5 - n}">{n5 - n}</div>
		{/each}
	</div>

	<div class="slider2">
		{#each arr6 as n}
			<div class="itm itm-{n6 - n}">{n6 - n}</div>
		{/each}
	</div>
	<div class="container" on:click={flip} aria-hidden={true}>
		<div data-layout={layout}>
			{#each { length: 10 } as _, id}
				<img class="circle" src="https://picsum.photos/100/100?random={id}" alt="Placeholder" />
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@use 'sass:math';
	@use 'sass:list';

	// 145 colors by name
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
		border: 6px solid gray;
	}
	.in-grid {
		display: grid;
		position: relative;
		align-items: center;
		width: 85vw;
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
		top: 6px;
		left: 2rem;
		margin-bottom: 5px;
		color: lightgreen;
		transition-delay: 3s;
	}
	[data-top='stack'] {
		margin-left: 25vw;
		margin-top: 3.5rem;
		transform: translate(0, 1.5rem);
		transition-delay: 1s;
		transition: transform 3s;
	}
	[data-top='grid'] {
		margin-left: 25vw;
		// margin-top: 1rem;
		transform: translate(0, 10px);
		transition: transform 1s;
	}
	.slider1,
	.slider2 {
		position: relative;
		width: 250px;
		height: 250px;
		// margin: 4rem 0 0 5rem;
		perspective: 200px;
		border: 1px solid gray;
		border-radius: 8px;
		background-color: rgb(60, 58, 58);
		cursor: pointer;
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

	@for $i from 1 through 5 {
		.item-#{$i} {
			// background-color: rgba(255 * math.random(), 255 * math.random(), 255 * math.random(), 1);
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
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	[data-layout='grid'] .circle {
		border-radius: 20%;
	}
</style>
