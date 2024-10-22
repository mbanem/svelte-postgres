<script lang="ts">
	type Person = {
		name: string
		age: number
	}

	import Box from '$lib/components/Box.svelte'

	let person = $state<Person>({ name: 'Mr. Filip Isakovic', age: 18 })

	let nameUpper = $derived(person.name.toUpperCase())
</script>

<svelte:head>
	<title>Box</title>
</svelte:head>
<div class="wrapper">
	<h2>Child actions on bind:person parent's prop</h2>

	<Box bind:person />

	<p>Reactive child value in the parent: {nameUpper}</p>
	<p style="color:yellow">{person.name} is of age {person.age}</p>

	<pre>
  All actions on a parent's person object exposed via bind:parent as
  prop to child component are carried out inside the child component
  but displayed only in the parent
	</pre>
</div>

<style lang="scss">
	.wrapper {
		margin: 5rem 0 0 20vw;
	}
</style>
