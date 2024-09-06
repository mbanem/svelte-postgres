<script lang="ts">
	import { onMount } from 'svelte'
	import { Tooltip } from 'flowbite-svelte'
	import { createCounter, getGlobalCounter } from '$lib/utils/counter.svelte'
	import Area from '$components/Area.svelte'
	const counter = createCounter()

	// Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
	const gCounter = getGlobalCounter()

	// Area props
	let width = $state(12)
	let height = $state(13)
	let pHeight = $state(10)

	let raw = $state.raw([])
	let appended = $state<number[]>([])

	const appendToFrozen = () => {
		const num = Math.round(Math.random() * 100)
		appended.push(num)
		setTimeout(() => {
			// @ts-expect-error
			raw = [...raw, num]
		}, 0)
	}
	const removeFromToFrozen = () => {
		setTimeout(() => {
			raw = raw.filter((_:number, ix:number) => ix < raw.length - 1)
		})
		appended.pop()
	}
	onMount(() => {
		// @ts-expect-error
		;[...5].forEach((n) => appendToFrozen())
	})
</script>

<div class="wrapper">
	<pre>
    Counter component is defined in $lib-utils.counter.svelte.ts
    and can be used across the app, here in /counter/+page.svelte
  </pre>

	<button onclick={counter.increment}>
		clicks: {counter.count}
	</button>
	<button onclick={counter.decrement}> decrement </button>

	<p>Global counter {gCounter.count} is equal across the pages</p>
	<button onclick={() => (gCounter.count += 1)}>+</button>
	<button onclick={() => (gCounter.count -= 1)}>-</button>

	<Area {width} {height} {pHeight} />

	<div class="dimensions">
		<label for="w"> rectangle width </label>
		<input id="w" type="number" bind:value={width} />
		<label for="h"> rectangle height </label>
		<input id="h" type="number" bind:value={height} />
		<label for="z"> parallelepiped height </label>
		<input id="z" type="number" bind:value={pHeight} />
	</div>

	<pre>
	We define raw = $state.raw([100, 101, 102]) that could only be reassigned/replaced
	completely, say this way: raw = [...raw, new+item]
	We can use reduce on raw like
		&lcub;raw.reduce((a, b) =&gt; a + b, 0)&rcub; should give 303=100+101+103

	For instance &lcub;(raw = [300, 400, 500]).reduce((a, b) =&gt; a + b, 0)&rcub;
	gives total 	<span class="highlighted-number">{raw.reduce((a, b) => a + b, 0)}</span>
	appended 	<span class="highlighted-array">{appended.join(', ')}</span>
	</pre>
	<button data-append onclick={appendToFrozen}>append to raw</button>
	<button data-prepend onclick={removeFromToFrozen}>remove last from raw</button>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss'">
	.wrapper {
		margin: 2rem 0 0 3rem;
		background-color: #4e4e5e;
		color: white;
		padding: 1rem 0 1rem 3rem;
		border-radius: 1rem;
		/* width: 90vw;
		height: 80vh;
		margin: 0;
		border: none; */
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
	}
	.dimensions {
		display: grid;
		width: 13.5rem;
		grid-template-columns: 10rem 3rem;
	}
	.highlighted-number {
		font-size: 28px;
		color: yellow;
	}
	.highlighted-array {
		font-size: 20px;
		color: pink;
	}
	[data-append],
	[data-prepend] {
		width: 12rem;
	}
</style>
