<script lang="ts">
	type Person = {
		name: string
		age: number
	}
	type PROPS = {
		person: Person
	}
	let { person = $bindable() }: PROPS = $props()
</script>

<input type="text" placeholder="put the name here" bind:value={person.name} />
<br />
<label for="age">Person age</label>
<input type="number" bind:value={person.age} min="1" max="105" id="age" style="width:4rem" />
<button onclick={() => (person.age += 1)}>increment age</button>
<button onclick={() => (person.age -= 1)}>decrement age</button>
