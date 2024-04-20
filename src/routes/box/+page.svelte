<script type="ts">
	import Box from '$lib/components/Box.svelte';
	let city = 'San Diego';
	let age = 18;
	let person = { name: 'Mr. Filip Isakovic', age: 18 };
	$: nameUpper = person.name.toUpperCase();
</script>

<h2>Child actions on bind:person parent prop</h2>
<Box bind:person userAge={age} {city} />

<p>Reactive child controlled value displayed in the parent: {nameUpper}</p>
<p style="color:yellow">{person.name} is of age {person.age}</p>

<pre>
  All actions on a parent person object exposed via bind:parent as
  prop to child component as carried out inside the child component
  but displayed only in the parent
</pre>
