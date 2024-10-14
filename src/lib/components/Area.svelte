<<<<<<< HEAD
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

<pre>
	Area Component
Rectangle with dimensions <span class="expression-highlighted">{width}x{height}</span
	> has area of <span class="expression-highlighted">{area}</span>
globalVolume.volume for parallelepiped
with dimensions <span class="expression-highlighted">{width}x{height}x{pHeight} </span> is <span
		class="expression-highlighted">{globalVolume.volume}</span
	>

numbers is a $state rune of Array&lt;number> [1,2,3...]
where buttons add or remove the next number
with last line rendering the total
<button onclick={() => numbers.push(numbers.length + 1)}> add </button> <button
		onclick={() => numbers.pop()}> remove </button>  {numbers.join(' + ') || 0} = {numbers.reduce(
		(a, b) => a + b,
		0
	)}
		</pre>

<style lang="scss">
	pre {
		margin: 0;
		padding: 8px 1rem;
	}
</style>
=======
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

<pre>
	Area Component
Rectangle with dimensions <span class="expression-highlighted">{width}x{height}</span
	> has area of <span class="expression-highlighted">{area}</span>
globalVolume.volume for parallelepiped
with dimensions <span class="expression-highlighted">{width}x{height}x{pHeight} </span> is <span
		class="expression-highlighted">{globalVolume.volume}</span
	>

numbers is a $state rune of Array&lt;number> [1,2,3...]
where buttons add or remove the next number
with last line rendering the total
<button onclick={() => numbers.push(numbers.length + 1)}> add </button> <button
		onclick={() => numbers.pop()}> remove </button>  {numbers.join(' + ') || 0} = {numbers.reduce(
		(a, b) => a + b,
		0
	)}
		</pre>

<style lang="scss">
	// pre {
	// 	margin: 0;
	// 	padding: 8px 1rem;
	// }
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
