<script lang="ts">
	// if you need to turn something into a store
	// so that you can use it in multiple places.

	// With runes, reactivity extends beyond the boundaries of your .svelte files.
	// To encapsulate e.g. counter logic in a way that could be reused between components,
	// today, you would use a custom store in a .ts file.
	// We've found that the store API can get rather unwieldy when you start doing more complex things.
	// let count = $state(0);

	// const increment = () => {
	// 	count += 1;
	// };
	// const decrement = () => {
	// 	if (count === 0) return;
	// 	count -= 1;
	// };

	import { Todos, getGlobalTodos } from '$lib/utils/todos.svelte'
	// Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
	import { createCounter, getGlobalCounter } from '$lib/utils/counter.svelte'
	let { data } = $props()
	const counter = createCounter()

	const gCounter = getGlobalCounter()

	// local todos destroyed on page unmount
	// const todos = new Todos();
	const todos = getGlobalTodos()
	if (todos.length == 0) {
		const family = [
			'Filip Isakovic',
			'Matia Isakovic',
			'Ljubomir Isakovic',
			'Snezana Isakovic',
			'Marko Milutinovic',
			'Mia Milutinovic',
			'Tanja Milutinovic',
			'Ljuban Milutinovic'
		]
		family.forEach((member, index) => {
			todos.set(index, member, Math.random() < 0.5)
		})
	}
	// const arr = todos.asArray();
	// arr.forEach((member) => console.log(member));
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<div class="wrapper">
	<pre>
    Counter component is defined in $lib-utils.counter.svelte.ts
    and can be used across the app, here in /+page.svelte
  </pre>
	<button onclick={counter.increment}>
		clicks: {counter.count}
	</button>
	<button onclick={counter.decrement}> decrement </button>

	<p>Global counter {gCounter.count} is equal across the pages</p>
	<button onclick={() => (gCounter.count += 1)}>+</button>
	<button onclick={() => (gCounter.count -= 1)}>-</button>
	{#each todos.asArray() as todo}
		<p>{todo.text} {todo.done}</p>
	{/each}
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
</style>
