<script lang="ts">
	import Box from '$lib/components/Box.svelte'
	let name = 'Mr. Filip Isakovic'
	let age = 18
	let person = { name, age }
	$: nameUpper = person.name.toUpperCase()
</script>

<h2>Child actions on bind:person parent's prop</h2>
<Box bind:person />

<p>Reactive child value in the parent: {nameUpper}</p>
<p style="color:yellow">{person.name} is of age {person.age}</p>

<pre>
  All actions on a parent's person object exposed via bind:parent as
  prop to child componentare carried out inside the child component
  but displayed only in the parent
</pre>
