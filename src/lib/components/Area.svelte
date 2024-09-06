<script lang="ts">
	import { globalVolume } from '$lib/utils/counter.svelte'
	// Svelte 5 introduces the $derived and $effect runes, which instead determine the dependencies
	// of their expressions when they are evaluated, not like $: when they are compiled:
	type WH_PH = { width: number; height: number; pHeight: number }
	let { width, height, pHeight }: WH_PH = $props() // instead of `export let`

	const area = $derived(width * height)
	// const volume:number = $derived(area * pHeight);
	// let volume = $state(0);
	$effect(() => {
		globalVolume.volume = area * pHeight
	})
	let numbers = $state([1, 2, 3])
</script>

<div class="page">
	Area Component
	<div class="wrapper">
		<pre>
		Rectangle with dimensions <span class="expression">{width}x{height}</span> has area of <span
				class="expression">{area}</span
			>
		globalVolume.volume for parallelepiped
		with dimensions <span class="expression">{width}x{height}x{pHeight} </span> is <span
				class="expression">{globalVolume.volume}</span
			>

	numbers is a $state rune of Array&lt;number> [1,2,3...]
	where buttons add or remove the next number
	with last line rendering the total
		<button onclick={() => numbers.push(numbers.length + 1)}> add </button> <button
				onclick={() => numbers.pop()}> remove </button>  {numbers.join(' + ') ||
				0} = {numbers.reduce((a, b) => a + b, 0)}
		</pre>
	</div>
	<hr />
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
	.page {
		background-color: #3e3e3e;
		color: white;
	}
	.wrapper {
		width: 30rem;
		padding: 1rem;
		margin: 1rem 0 0 2rem;
	}
	.expression {
		font-size: 18px;
		font-weight: 700;
		color: yellow;
	}
	// button {
	// 	display: inline-block;
	// }
</style>
