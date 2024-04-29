<script type="ts">
	import Box from '$lib/components/Box.svelte';
	let city = 'San Diego';
	let age = 18;
	let person = { name: 'Mr. Filip Isakovic', age: 18, city: 'San Diego' };
	$: nameUpper = person.name.toUpperCase();
</script>

<h2>Parent Page</h2>
<h4 style="font-weight:400;margin:0;width:60rem;">
	On a bound value both parent and (&lt;Box) child have access. See the child blue and parent yellow
	text about parent's bound prop person &lt;Box bind:person... sent to child defined as export let
	person:Person
</h4>
<Box bind:person userAge={age} {city} />

<div class="container">
	<p>Reactive child controlled value displayed in the parent: {nameUpper}</p>
	<p style="color:yellow">Person {person.name} is of age {person.age} from {person.city}</p>
</div>
<pre>
  All actions on a parent person object exposed via bind:parent as
  prop to child component as carried out inside the child component
  but displayed only in the parent
</pre>

<label for="city" style=" color:skyblue;">
	Parent binds this input value to person.city so blue line could change
</label>
<input id="city" bind:value={person.city} placeholder="please enter city" style="margin-top:6px;" />
