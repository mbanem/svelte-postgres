<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { gsap } from 'gsap'

	/* You must build the app first pnpm run build in order to really
    be able to import Flip as it points to gsap/dist/Flip
    On the GSAP site they say
    import { Flip } from "gsap/Flip";
    gsap.registerPlugin(Flip);

    but that did not work.
    NOTE: all the code should be run inside onMount as the page is
    render twice ssr and csr and ssr is halting the code
  */

	import { Flip } from 'gsap/dist/Flip'
	gsap.registerPlugin(Flip)

	// define iterable number using object prototype and generator
	// function* to assign it to the Number iterator
	// @ts-expect-error
	Number.prototype[Symbol.iterator] = function* () {
		// @ts-expect-error
		for (let i = 0; i < this; i++) {
			yield i
		}
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
	const moveCard = (id: string) => {
		let slider = id === '1' ? (slider1 as HTMLDivElement) : (slider2 as HTMLDivElement)
		let max = id === '1' ? n5 : n6

		;(slider as HTMLDivElement).insertBefore(
			slider.children[max - 1] as HTMLDivElement,
			slider.children[0] as HTMLDivElement
		)
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
				return gsap.from(elements, {
					yPercent: 20,
					opacity: 0,
					ease: 'sine.out'
				})
			},
			onLeave: (element) => {
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
	})
</script>

<div class="in-flex">
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
</div>

<style lang="scss">
	@use 'sass:math';
	.in-flex {
		display: flex;
	}
	.slider1,
	.slider2 {
		position: relative;
		width: 250px;
		height: 250px;
		margin: 4rem 0 0 5rem;
		perspective: 200px;
		border: 1px solid gray;
		border-radius: 8px;
		background-color: lightgreen;
		cursor: pointer;
	}
	.slider2 {
		margin: 4rem 0 0 15rem;
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
	$a: 1;
	$b: 5;
	@for $i from $a through $b {
		.item-#{$i} {
			background-color: rgba(250 * math.random(), 160 * math.random(), 160 * math.random(), 1);
		}
	}

	$c: 1;
	$d: 6;
	@for $i from $c through $d {
		.itm-#{$i} {
			background-color: rgba(250 * math.random(), 160 * math.random(), 160 * math.random(), 1);
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
	// .item:nth-child(5) {
	// 	left: 0;
	// 	top: 0;
	// }
	// .item:nth-child(4) {
	// 	left: 20px;
	// 	top: -20px;
	// }
	// .item:nth-child(3) {
	// 	left: 40px;
	// 	top: -40px;
	// }
	// .item:nth-child(2) {
	// 	left: 60px;
	// 	top: -60px;
	// }
	// .item:nth-child(1) {
	// 	left: 80px;
	// 	top: -80px;
	// }
</style>
