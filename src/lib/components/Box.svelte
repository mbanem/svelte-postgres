<script lang="ts">
	export let person: Person;
</script>

<input type="text" placeholder="put the name here" bind:value={person.name} />
<br />
<label for="age">Person age</label>
<input type="number" bind:value={person.age} min="1" max="105" id="age" style="width:2rem" />
<button style="color:black;" on:click={() => (person.age += 1)}>increment age</button>
