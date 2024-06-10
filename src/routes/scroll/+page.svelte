<script lang="ts">
	// import { onMount } from 'svelte'
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { capitalize, setButtonVisible } from '$utils/helpers'
	gsap.registerPlugin(ScrollTrigger)

	let position = 0
	// keep a sing for rotational direction1:clockwise, -1:counterclockwise
	// and for translation direction 1:300 -1:0
	const params = { a: 1, b: 1, c: 1, d: 1 }

	type P = keyof typeof params

	const animate = (es: MouseEvent | String) => {
		let className = 'a'
		if (es instanceof MouseEvent) {
			className = (es.currentTarget as HTMLDivElement)?.className.slice(4, 5) as P
		}
		animation(`.${className}`)
	}
	const animation = (className: string) => {
		const cn = className.slice(1, 2) as P
		let param = params[cn]
		const position = param === 1 ? 300 : 0
		const rot = param === 1 ? 360 : -0
		gsap.to(className, {
			scrollTrigger: className,
			x: position,
			rotate: rot,
			duration: 3
		})
		params[cn] = -1 * params[cn]
	}
	const animateAll = () => {
		Object.keys(params).forEach((cn) => {
			animation(`.${cn}`)
		})
	}

	/*
		To “tween” simply means to move between two values over a stretch of time,
		applying some effect to start and end-points. Like all things in programming
		you provide meaning to the value by using it for something.
		All tweening does is to move between A and B using a special formula.
	*/
	let timeline: gsap.core.Timeline

	// stagger block
	// NOTE: creating timeline i  onMount after timeline.reverse()
	// leave timeline unresponsive, so we create it over and over
	// inside animateOut. As it is in <button on:click scope it can
	// accept the reverse() call

	// toggle hidden is crucial for allowing the reverse button to function
	const animateOut = () => {
		setTimeout(() => {
			document.querySelector('.button')?.classList.toggle('hidden')
		}, 2500)
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
</script>

<!-- === BEGIN squares in separate pages ====
    so we have to scroll and bring them
    into view in order to trigger the animation
-->
<div class="container">
	<div class="buttons">
		<p>Animation starts when square come in the view -- when it becomes visible:</p>
		<button on:click={animateAll}>animate all</button>
		<p>Animate square and scroll to make it visible to trigger the animation</p>
		<br />
		<!-- individual buttons on the left in grid to animate a,b,c or d -->
		{#each Object.keys(params) as cn}
			<button on:click={() => animation(`.${cn}`)}>{cn}</button>
		{/each}
		<!-- A.Back.C and D squares that do animations -->
		{#each Object.keys(params) as cn}
			<div class={`box ${cn}`} on:click={animate} aria-hidden={true}>{cn.toUpperCase()}</div>
		{/each}
	</div>
	<div class="wrapper" on:click={animateOut} aria-hidden={true}>
		<h3>Click a box to transition out</h3>
		<button on:click={() => timeline.reverse()} class="button hidden">animate</button>
		{#each ['green', 'purple', 'orange', 'tomato', 'rebeccapurple'] as colorName}
			<div class="boxS {colorName}">{capitalize(colorName)}</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use 'sass:list';

	.hidden {
		display: none;
	}
	// as is ti used for class names we keep colors as strings
	$cls: green, purple, orange, tomato, rebeccapurple;
	.boxS {
		color: white;
		width: 5rem;
		height: 5rem;
		border: 3px solid gray;
		border-radius: 6px;
		margin-left: 1rem;
		text-align: center;
		line-height: 5rem;
		cursor: pointer;
	}
	@for $j from 1 through 5 {
		.#{'' + list.nth($cls,$j)} {
			// @extend .boxS;
			background-color: list.nth($cls, $j);
		}
	}
	.button {
		opacity: 0;
	}

	// basic class for A,B,C and D squares for the left side of grid for animations
	.e {
		width: 6rem;
		height: 6rem;
		font-size: 30px;
		text-align: center;
		line-height: 6rem;
		border: 4px solid gray;
		border-radius: 1rem;
		margin: 1rem 0 70vh 2rem;
	}
	$colors: navy, brown, darkgreen, tomato;
	$class-name: '.a', '.b', '.c', '.d';
	@for $i from 1 through 4 {
		#{list.nth($class-name,$i)} {
			@extend .e;
			background-color: list.nth($colors, $i);
			color: white;
			@if $class-name != 'a' {
				grid-column: span 2;
			}
		}
	}
	p {
		color: lightgreen;
	}
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin-top: 1rem;
		width: 80vw;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-left: 8rem;
		border: 1px solid gray;
		border-radius: 1rem;
		width: 100%;
		height: 85vh;
		padding-left: 4rem;
	}
	// .stagger-block {
	// 	border: 1px solid gray;
	// 	border-radius: 1rem;
	// 	width: 40vw;
	// }
	.buttons {
		display: block;
		border: 1px solid gray;
		border-radius: 1rem;
		width: 100%;
		height: 85vh;
		// margin: 1rem 0 1rem 4rem;
		button:nth-child(1) {
			display: block;
			margin: 8px 0;
		}
	}
</style>
