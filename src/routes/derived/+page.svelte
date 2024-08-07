<script lang="ts">
	import { onMount } from 'svelte'
	import RandomCanvas from '$lib/components/RandomCanvas.svelte'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'

	let numbers = $state([1, 2, 3])
	let total = $derived.by(() => {
		return numbers.reduce((a, c) => a + c, 0)
	})
	// -------------------------------------------------
	let size = $state(100)
	let color = $state('#ff3e00')
	let backColor = $state('#a08090')
	let lblColor: HTMLInputElement
	let canvas: HTMLCanvasElement
	let canvas2: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D
	let ctx2: CanvasRenderingContext2D

	/*
		The function passed to $effect will run when the component mounts,
		and will re-run after any changes to the values it reads that were declared
		with $state or $derived (including those passed in with $props).
		Re-runs are batched (i.e. changing color and size in the same moment won't
		cause two separate runs), and happen after any DOM updates have been applied.
	*/

	// $effect(...) runs onMount so the bind to canvas is already established
	$effect(() => {
		if (!ctx) return
		// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.textAlign = 'center'
		// render background first, otherwise it goes over the text
		ctx.fillStyle = backColor
		ctx.fillRect(0, 0, size, size)
		lblColor.style.backgroundColor = backColor

		// render text after filling background to get on top
		ctx.fillStyle = color
		ctx.font = '48px serif'
		const x = canvas.width / 2
		ctx.fillText(size.toString(), x, 12 + canvas.height / 2)

		// this will re-run whenever `color` or `size` change
	})

	// creates two opposite colors for text and background to make text more visible
	const hexColors = () => {
		let c = '#'
		let bc = '#'
		;[0, 1, 2].forEach((n) => {
			const v = Math.floor((Math.random() * 1000) % 255)
			c = c + ('0' + v.toString(16)).slice(-2)
			bc = bc + ('0' + (255 - v).toString(16)).slice(-2)
		})
		return [c, bc]
	}

	// random generate colors set to variables to use in $effect
	// for styling the canvas above
	const setColor = () => {
		// const ctx = canvas.getContext('2d');
		const cbc = hexColors()
		color = cbc[0] as string
		backColor = cbc[1] as string
		ctx?.fillText('COLOR', canvas.width / 2, canvas.height / 2)
		ctx2.font = getFontSize(ctx2Text, canvas2.width, ctx2, true) as string
	}

	/* ------------------ $effect with async -----------------

		Values that are read asynchronously — after an await or inside a setTimeout,
		for example — will not be tracked. Here, the canvas will be repainted when
		color changes, but not when size changes.
	*/
	// adjust font canvas size so 'Hello' could fit in canvas of given width
	const getFontSize = (
		txt: string,
		maxWidth: number,
		ctx: CanvasRenderingContext2D,
		px: boolean = false
	) => {
		let work = true
		let fontSize = 48 //= '48px serif';
		while (work) {
			ctx.font = `${fontSize}px serif`
			if (ctx.measureText(txt).width > maxWidth) {
				fontSize -= 1
			} else {
				work = false
			}
		}
		return px ? (`${fontSize}px serif` as string) : (fontSize as number)
	}

	let size2 = $state<number>(150)
	let ctx1Text = 'Canvas Text Number One'
	let ctx2Text = 'Canvas Text Number Two'

	$effect(() => {
		if (!ctx2) return
		// const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
		ctx2.roundRect(10, 20, 150, 100, [40])
		ctx2?.clearRect(0, 0, canvas2.width, canvas2.height)
		// this will re-run whenever `color` changes...
		ctx2.fillStyle = backColor
		const fontSize = getFontSize(ctx2Text, canvas2.width, ctx2)
		ctx2.font = `${fontSize}px serif`
		ctx2.fillText('Hello', 10, 50)
		// ctx2.fillText('Color', 10, 10);

		// setTimeout(() => {
		// 	ctx2?.clearRect(0, 0, canvas2.width, canvas2.height);
		// 	// ...but not when `size` changes
		// 	ctx2.fillRect(0, 0, 50 + Math.random() * size2, 50 + Math.random() * size2);
		// 	ctx2.font = `${fontSize}px serif`;
		// 	ctx2.fillStyle = 'White';
		// 	ctx2.fillText('Hello', 10, 50);
		// }, 500);
	})

	// ------------- slow to fast counter -------------
	let count = $state(0)
	let milliseconds = $state(1000)
	let maxCount = $state(20)
	let interval: NodeJS.Timeout
	const toggleCounter = (event: MouseEvent) => {
		const btn = event.target as HTMLButtonElement
		if (btn.innerText.startsWith('stop')) {
			clearInterval(interval)
			btn.innerText = 'restart counter'
		} else {
			btn.innerText = 'stop counter'
			count += 1
		}
	}
	$effect(() => {
		// This will be recreated whenever `interval` changes
		if (count < maxCount) {
			interval = setInterval(() => {
				count += 1
			}, milliseconds)
		}
		return () => {
			// if a callback is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval)
		}
	})

	// -------------- avoid $effect -------------
	let value = $state<String>('Filip Isakovic')
	let facade = {
		get value() {
			return value.toUpperCase()
		},
		set value(val) {
			value = val.toLowerCase()
		}
	}
	let h4Color = $state<string>('royalblue')
	const colors = ['red', 'orange', 'green', 'purple', 'default']

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<br />
<a href="/">Home</a>
<a href="/chip">Chip</a>

<div class="absolute">
	<div class="row">
		<canvas bind:this={canvas2} width={size2} height={size2}></canvas>

		<p class="style-directive-title">Click color button to change Color Directive</p>
		<h4 style:background-color={h4Color}>Color Style Directives</h4>
		{#each colors as item (item)}
			<button
				style:background-color={item}
				onclick={() => (h4Color = `${item === 'default' ? 'royalblue' : item}`)}
			>
				{item}
			</button>
		{/each}
	</div>
</div>
<div class="main">
	<input bind:value />
	<pre>value {facade.value}</pre>

	<pre>
  Sometimes we need to create complex derivations that don't fit inside a short expression.
  In such cases, we can use $derived.by which accepts a function as its argument.
</pre>

	<pre>sum {numbers.join('+')} is {total}</pre>
	<button onclick={() => numbers.push(numbers.length + 1)}> expand </button>
	<button
		onclick={() => {
			numbers.pop()
		}}>reduce</button
	>

	<hr />
	<canvas bind:this={canvas} width={size} height={size}></canvas>

	<RandomCanvas />
	<!-- <div class="controls">
		<label>
			<input type="range" min="50" max="300" bind:value={size} /> size
		</label>

		<label>
			<input bind:this={lblColor} type="color" bind:value={color} /> color
		</label>
		<button class="generate-color" onclick={setColor}>random color</button>
		<p>color {color}</p>
		<p>back color {backColor}</p>
	</div> -->

	<h1 style="color:skyblue;">{count}</h1>
	<p>clicking faster increases speed on every click</p>
	<button onclick={() => (milliseconds *= 2)}>slower</button>
	<button onclick={() => (milliseconds /= 2)}>faster</button>
	<button onclick={() => (count = 0)}>clear counter</button>
	<button onclick={toggleCounter}>stop counter</button>
	<label for="cnt">
		Count up to
		<input type="number" bind:value={maxCount} />
	</label>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss'">
	.absolute {
		position: absolute;
		top: 6rem;
		right: 8rem;
	}
	.row {
		position: relative;
		display: inline-block;
		margin: 0 0 0 2rem;
		padding: 0;
		height: 2rem;
		canvas {
			display: inline-block;
		}
		h4,
		button {
			border-radius: 6px;
			background-color: royalblue;
			text-align: center;
			width: 6rem;
			height: 1.8rem;
			margin-left: 6px;
			user-select: none;
		}
		h4 {
			width: 14rem;
			height: 1.8rem;
			line-height: 1.8rem;
			font-weight: 400;
			display: inline-block;
		}
	}
	.main {
		margin: 1rem 0 0 2rem;
	}
	.controls {
		width: 40rem;
		border: 1px solid yellow;
		padding: 1em 0 1em 1rem;
		margin: 1em 0;
		display: flex;
		gap: 1em;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	.generate-color {
		border: 2px solid gray;
		border-radius: 5px;
		color: white;
		background-color: navy;
		margin: 0;
		padding: 1px 6px;
		cursor: pointer;
		&:hover {
			color: yellow;
			border-color: yellow;
		}
	}
	a {
		text-decoration: none;
		margin: 1rem 0 0 1rem;
		padding: 5px 1rem;
		border: 1px solid transparent;
		border-radius: 5px;
		color: white;
		background-color: #6e6e8e;
		&:hover {
			color: yellow;
			border-color: yellow;
		}
	}
</style>
