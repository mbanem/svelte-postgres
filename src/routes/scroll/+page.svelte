<script lang="ts">
	import { tick } from 'svelte'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { capitalize } from '$utils/helpers.svelte'
	import { flip } from 'svelte/animate'
	import { fade } from 'svelte/transition'

	let max_range = 5
	let startInt = $state(0)
	let delta = $state(3)
	let digits = $derived(
		Array(5)
			.fill(null)
			.map((_, i) => i + startInt)
	)
	let delay_fade = $derived(delta === max_range ? 0 : 1000)
	let dd_animate = $derived(delta === max_range ? 0 : 500)
	const scrollToTheRight = () => {
		startInt = startInt + delta
	}
	const scrollToTheLeft = () => {
		startInt = startInt - delta
	}

	import gsap from 'gsap'
	gsap.registerPlugin(ScrollTrigger)

	// -------------------------------------------------------------------
	let divEl: HTMLDivElement
	let messages = $state([
		'Filip Isakovic',
		'Matia Isakovic',
		'Marko Milutinovic',
		'Mia Milutinovic',
		'Ljubomir Isakovic',
		'Tanja Milutinovic',
		'Ljuban Milutinovic'
	])
	let names = [
		'Snezana Milutinovic',
		'Bojana Kotur',
		'Nikola Kotur',
		'Dragana Kotur',
		'Zeljko Kotur'
	]
	let ix = 0
	let input_message: HTMLInputElement

	const scroll = () => {
		if (divEl.offsetHeight + divEl.scrollTop > divEl.getBoundingClientRect().height - 20) {
			tick().then(() => {
				divEl.scrollTo(0, divEl.scrollHeight)
			})
		}
	}
	const addAnotherName = (event: MouseEvent | KeyboardEvent) => {
		if (event instanceof KeyboardEvent) {
			if (event.key !== 'Enter') return
			messages.push(input_message.value)
			scroll()
			input_message.value = ''
		}
	}
	const addListedName = () => {
		if (ix < names.length) {
			messages.push(names[ix++] as string)
			scroll()
		}
	}
	let info: HTMLDivElement
	const run = () => {
		info.innerHTML += `<p>when running in component, $effect.tracking is  ${$effect.tracking()}</p>`
	}
	$effect(() => {
		info.innerHTML += `<p>when running in effect, $effect.tracking is  ${$effect.tracking()}</p>`
	})

	// events are now properties of elements
	let count = $state(0)

	const onclick = () => {
		count++
	}
	// ----------------------------------------------------------------

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
	// inside animateOut. As it is in <button onclick scope it can
	// accept the reverse() call

	// toggle hidden is crucial for allowing the reverse button to function
	// timeline.reverse() also calls animateOut but clicking on button title
	// timeline is left stuck, probably getting incorrect event, so we use x
	// to call ourselves timeline-reverse() every second time no mater if
	// button or button title is clicked
	let x = false
	let timeoutId: ReturnType<typeof setTimeout>
	const animateOut = () => {
		timeoutId = setTimeout(() => {
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
	// buttons and tooltip text when hover over them
	type ButtonCaption = 'a' | 'b' | 'c' | 'd'
	let ttEl = $state<HTMLDivElement>()
	const where = 'Will animate in<br/>'
	const when_visible = '<br/>when it gets visible'
	const tooltips: Record<ButtonCaption, String> = {
		a: `${where}this page`,
		b: `${where}the page below`,
		c: `${where}the second page below`,
		d: `${where}the third page below`
	}
	const setTooltipText = (el: HTMLButtonElement | HTMLInputElement) => {
		if (!ttEl) return
		const tooltipEl = el.innerText as ButtonCaption
		if (el.dataset.tooltip) {
			ttEl.innerHTML = el.dataset.tooltip
		} else {
			ttEl.innerHTML = '' + tooltips[tooltipEl] + when_visible
		}
	}
	const positionTooltip = (el: HTMLButtonElement | HTMLInputElement) => {
		if (!ttEl) return
		const rect = el.getBoundingClientRect()
		const x = window.scrollX
		const y = window.scrollY
		console.log('x', x, 'y', y, 'top', rect.top, 'height', 1.6 * rect.height)
		ttEl.style.left = `${x + rect.left - rect.width / 2}px`
		ttEl.style.top = `${y + Math.floor(rect.top) - 2 * Math.floor(rect.height)}px`
	}
	const tooltipToggle = async (event: MouseEvent) => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		if (!ttEl) return
		const el = event.target as HTMLButtonElement | HTMLInputElement
		setTooltipText(el)
		positionTooltip(el)
		await tick()
		ttEl.classList.toggle('hidden')

		setTimeout(() => {
			if (ttEl) {
				ttEl.classList.toggle('hidden')
			}
		}, 4000)
	}
</script>

<!-- === BEGIN squares in separate pages ====
    so we have to scroll and bring them
    into view in order to trigger the animation
-->
<!-- <div class="tooltip-mouse-wheel hidden">focus & use mouse wheel</div> -->
<div bind:this={ttEl} class="tooltip hidden"></div>
<div class="container">
	<div class="buttons">
		<!-- scroll array elements left and right -->
		<p class="tt-wrapper">
			<input
				bind:value={delta}
				type="number"
				min="1"
				max={max_range}
				onmouseenter={tooltipToggle}
				data-tooltip="Scroll array elements by mousewheel"
			/>
			&nbsp; element{delta === 1 ? '' : 's'}
		</p>
		<div id="wrapper">
			{#each digits as digit (digit)}
				<div
					class="display-element"
					animate:flip={{ delay: dd_animate, duration: 1000 }}
					in:fade={{ delay: delay_fade, duration: 1000 }}
					out:fade={{ duration: 0 }}
				>
					{digit}
				</div>
			{/each}
		</div>
		<button class="scroll-button" onclick={scrollToTheLeft}>scroll to the left</button>
		<button class="scroll-button" onclick={scrollToTheRight}>scroll to the right</button>
		<p>Animation starts when square come in the view -- when it becomes visible:</p>
		<button onclick={animateAll}>animate all</button>
		<p>Animate square and scroll to make it visible to trigger the animation</p>
		<br />

		{#each Object.keys(params) as cn}
			<p class="tooltip-wrapper">
				<button onclick={() => animation(`.${cn}`)} onmouseenter={tooltipToggle}>
					{cn}
				</button>
			</p>
		{/each}

		{#each Object.keys(params) as cn}
			<div class={`box ${cn}`} onclick={animate} aria-hidden={true}>{cn.toUpperCase()}</div>
		{/each}
	</div>

	<div class="main">
		<pre style="margin-left:- class='scroll-button' rem;">
				$effect.pre does not work on adding messages to the div element
				so we can use scrollTo inside the addListedName method instead
			</pre>
		<p>Enter a name to the input below and press Enter to add it t the list</p>
		<input
			type="text"
			bind:this={input_message}
			onkeypress={addAnotherName}
			placeholder="Enter a name and press Enter"
		/>
		<button onclick={addListedName}>add name</button>

		<div bind:this={divEl} class="message-container">
			{#key messages}
				{#each messages as message}
					<p>{message}</p>
				{/each}
			{/key}
		</div>

		<!-- tracking where script is running -->
		<hr />
		<pre>NOTE: $effect.tracking will be renamed into $effect,trucking</pre>
		<p>when script is running in template, $effect.tracking is {$effect.tracking()}</p>
		<button onclick={run}>run the script</button>
		<div bind:this={info} class="info">Tracking where script is running</div>

		<hr />

		<!--  events are now properties of elements -->
		<pre>Events are now properties of elements</pre>
		<div {onclick} aria-hidden={true} class="div-button">
			clicks: {count}
		</div>
	</div>

	<!-- NOTE. We put onclick hendler on boxes as on the wrapper it cannot ingnore
		clicks probably the animation handler does not break when it starts so when we
		return false when clicked on the wrapper the handler continus and make
		just a jerk instead of a full animation.$derived.
		And this does not work seo we left handler on wrapper
		-->
	<div class="wrapper" onclick={animateOut} aria-hidden={true}>
		<p class="caption">Click a box to transition out</p>
		<div class="button-wrapper">
			<button onclick={() => timeline.reverse()} class="button hidden">reverse</button>
		</div>
		{#each ['green', 'purple', 'orange', 'tomato', 'rebeccapurple'] as colorName}
			<div class="boxS {colorName}"><br /><br />{capitalize(colorName)}</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use 'sass:list';
	.main {
		margin: 0.1rem 1rem;
		border: 1px solid gray;
		border-radius: 1rem;
		padding: 2rem 1rem;
	}
	.div-button {
		width: 6rem;
		padding: 6px 1rem;
		border: 1px solid gray;
		border-radius: 5px;
		color: white;
		background-color: navy;
		user-select: none;
		text-align: center;
		cursor: pointer;
		&:hover {
			border-color: yellow;
			color: yellow;
		}
	}
	.button-wrapper {
		display: inline-block;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 5px;
		z-index: 2;
		&:hover {
			color: yellow;
			border: 1px solid yellow;
		}
	}
	.message-container {
		width: 16rem;
		height: 4rem;
		border: 1px solid gray;
		border-radius: 4px;
		overflow-y: auto;
		padding: 0.5rem;
	}
	p {
		margin: 0;
		padding: 0;
	}
	.caption {
		font-size: 16px;
		margin: 2rem 0;
		color: lightgreen;
		text-align: center;
	}
	.info {
		width: 23rem;
		height: 6rem;
		border: 1px solid gray;
		border-radius: 5px;
		margin-top: 1rem;
		padding: 5px;
		overflow-y: auto;
	}
	.hidden {
		display: none;
	}
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
			@extend .boxS;
			background-color: list.nth($cls, $j);
			word-break: break-word;
			line-height: 14px;
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
	/* grid last column must be fixed e.g. 12rem otherwise
		it slightly change the width on content animation
	*/
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 0.3fr;
		margin: 1rem 0 0 2rem;
		width: 80vw;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		margin-left: 2rem;
		border: 1px solid gray;
		border-radius: 1rem;
		width: 100%;
		height: 92vh;
	}

	.buttons {
		display: block;
		border: 1px solid gray;
		border-radius: 1rem;
		padding: 2rem 0 1rem 1rem;
		// width: 90%;
		height: 85vh;
		button:nth-child(1) {
			display: block;
			margin: 8px 0;
		}
		p {
			margin: 1rem 0 0.5rem 0;
		}
	}
	/* scroll array elements left and right */
	/* NOTE this is class for id='wrapper' while there are class='wrapper's as well*/
	#wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 2rem;
		color: yellow;
		width: 20.1rem;
		margin-bottom: 1rem;
	}
	.display-element {
		display: inline-block;
		// margin: 0 0 1rem 1.4rem;
	}
	.scroll-button {
		width: 10rem;
	}
	/* to position tooltip label it must have absolute position
		so the wrapper class must have position relative
	*/
</style>
