<script lang="ts">
	export let person: Person;
	export let city = '';
	export let userAge: number;
	const decrement = () => {
		if (person.age > 1) {
			person.age -= 1;
		}
	};
</script>

<div class="container">
	<p>This is child block</p>
	<input type="text" placeholder="put the name here" bind:value={person.name} />
	<br />
	<label for="age">Person age</label>
	<input type="number" bind:value={person.age} min="1" max="105" id="age" style="width:2rem" />
	<p>Leaving in {city} of age {userAge}</p>
	<button on:click={() => (person.age += 1)}>increment age</button>
	<button on:click={decrement}>decrement age</button>
</div>
``

<style lang="scss">
	.container {
		padding: 1rem;
		border: 1px solid gray;
		border-radius: 6px;
	}
</style>
