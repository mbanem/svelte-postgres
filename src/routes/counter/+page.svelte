<script lang="ts">
	import { createCounter, getGlobalCounter } from '$lib/utils/counter.svelte';
	import Area from '$components/Area.svelte';
	const counter = createCounter();

	// Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
	const gCounter = getGlobalCounter();

	// Area props
	let width = $state(12);
	let height = $state(13);
	let pHeight = $state(10);

	let frozen = $state.frozen([100, 101, 102]);
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
	let numbers = $state.frozen([100, 101, 102]) could only be reassigned/replaced
	so wwe use numbers = [...numbers, new+item]
	{frozen.reduce((a, b) => a + b, 0)}
	</pre>
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
</style>
