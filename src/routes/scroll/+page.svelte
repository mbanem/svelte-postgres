<script lang="ts">
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
</script>

<div class="buttons">
	<p>Animation starts when square come in the view -- when it becomes visible:</p>
	<button on:click={animateAll}>animate all</button>
	<p>Animate square and scroll to make it visible to trigger the animation</p>
	<br />
	{#each Object.keys(params) as cn}
		<button on:click={() => animation(`.${cn}`)}>{cn}</button>
		<!-- <button on:click={() => animation('.b')}>b</button>
	<button on:click={() => animation('.c')}>c</button>
	<button on:click={() => animation('.d')}>d</button> -->
	{/each}
</div>

<div class="container">
	{#each Object.keys(params) as cn}
		<div class={`box ${cn}`} on:click={animate} aria-hidden={true}>{cn.toUpperCase()}</div>
	{/each}
	<!-- <div class="box b" on:click={animate} aria-hidden={true}>b</div>
	<div class="box c" on:click={animate} aria-hidden={true}>c</div>
	<div class="box d" on:click={animate} aria-hidden={true}>d</div> -->
</div>

<style lang="scss">
	@use 'sass:list';
	.e {
		width: 6rem;
		height: 6rem;
		font-size: 30px;
		text-align: center;
		line-height: 6rem;
		border: 4px solid gray;
		border-radius: 1rem;
	}
	$colors: navy, brown, darkgreen, tomato;
	$class: '.a', '.b', '.c', '.d';
	@for $i from 1 through 4 {
		#{list.nth($class,$i)} {
			@extend .e;
			background-color: list.nth($colors, $i);
			color: white;
		}
	}
	p {
		color: lightgreen;
	}
	// .b {
	// 	background-color: navy;
	// 	color: white
	// }
	// .c {
	// 	background-color: darkgreen;
	// 	color: white;
	// }
	// .d {
	// 	background-color: tomato;
	// 	color: black;
	// 	margin-bottom: 3rem;
	// }
	.container {
		display: flex;
		flex-direction: column;
		gap: 90vh;
		margin-left: 8rem;
	}
	.buttons {
		display: block;
		margin: 1rem 0 1rem 4rem;
		button:nth-child(1) {
			display: block;
			margin: 8px 0;
		}
	}
</style>
