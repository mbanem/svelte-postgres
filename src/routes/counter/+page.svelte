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
			raw = raw.filter((_: number, ix: number) => ix < raw.length - 1)
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
		<button onclick={counter.increment}>clicks: {counter.count}</button> <button
			onclick={counter.decrement}> decrement </button>
	Global counter {gCounter.count} is equal across the pages
		<button onclick={() => (gCounter.count += 1)}>+</button> <button
			onclick={() => (gCounter.count -= 1)}>-</button
		>
	</pre>

	<Area {width} {height} {pHeight} />

	<div class="dimensions">
		<label for="w"> rectangle width </label>
		<input id="w" class="number" type="number" bind:value={width} />
		<label for="h"> rectangle height </label>
		<input id="h" class="number" type="number" bind:value={height} />
		<label for="z"> parallelepiped height </label>
		<input id="z" class="number" type="number" bind:value={pHeight} />
	</div>

	<pre>
	We define <span style="color:yellow;">raw</span
		> = $state.raw([100, 101, 102]) that could only be reassigned/replaced
	completely, say this way: raw = [...raw, new+item]
	We can use reduce on raw like
		&lcub;raw.reduce((a, b) =&gt; a + b, 0)&rcub; which should give 303=100+101+103

	For instance &lcub;(raw = [300, 400, 500]).reduce((a, b) =&gt; a + b, 0)&rcub;
	raw [<span class="highlighted-array">{appended.join(', ')}</span>]
	gives total 	<span class="expression-highlighted">{raw.reduce((a, b) => a + b, 0)}</span>
	<button data-append onclick={appendToFrozen}>append to raw</button> <button
			data-prepend
			onclick={removeFromToFrozen}>remove last from raw</button
		>
</pre>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss'">
	.wrapper {
		margin: 8px 1rem;
		background-color: #4e4e5e;
		color: white;
		padding-left: 2rem;
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
	button {
		display: inline-block;
	}
	.dimensions {
		display: grid;
		width: 13.5rem;
		grid-template-columns: 10rem 3rem;
	}
	.highlighted-array {
		font-size: 20px;
		color: pink;
	}
	[data-append],
	[data-prepend] {
		width: 12rem;
	}
	/* .number, */
	/* input[type='number'] {
		width: 3.5rem;
		height: 1.2rem;
		font-size: 16px;
		padding: 4px 0 4px 8px;
		font-weight: 400;
		border-radius: 4px;
		color: lightgreen;
		background-color: #3e3e3e;
		&:focus {
			color: yellow;
			background-color: #3e3e3e;
		}
	} */
</style>
