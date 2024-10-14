<script lang="ts">
	// in order to use child function we have to import the child
	import Child from './Child.svelte';

	// for parent to call child function it has to have reference
	// to the child component binding this way <Child bind:this={childComponent}...
	// and child component must export the function like
	//   export const counter = (delta: number) => (childCount += delta);
	// then calling child function 'counter' like this: childComponent.counter(value)
	// Even if child variable is defined as 'export let childVar = 0' it cannot
	// be updated from parent via childComponent.childVar += 1
	// so only exported functions can be used from parent

	const getRandomInt = () => {
		return Math.round(Math.random() * 10000);
	};
	const callChildCounter = () => {
		childComponent?.counter(getRandomInt());
	};
	let childComponent = $state<Child>();
</script>

<div class="wrapper">
	<!-- bind:childFunction = { local function of the same type } -->
	<Child bind:this={childComponent}></Child>

	<button onclick={callChildCounter}> call child counter to increment its count </button>
</div>

<style lang="scss">
	.wrapper {
		margin-top: 3rem;
		margin-left: 40vw;
		button {
			width: 12rem;
			padding: 8px 1rem;
			// cursor: pointer;
		}
	}
</style>
