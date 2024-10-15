<script lang="ts">
	// in order to use child function we have to import the child
	import Child, { counter } from './Child.svelte'

	const getRandomInt = () => {
		return Math.round(Math.random() * 10000)
	}
	const callChildCounter = () => {
		counter(getRandomInt())
	}
</script>

<div class="wrapper">
	<!-- bind:childFunction = { local function of the same type } -->
	<Child></Child>

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
