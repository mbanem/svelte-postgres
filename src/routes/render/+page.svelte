<script>
	import Comp1 from './Comp1.svelte'
	import Comp2 from './Comp2.svelte'
	const caption1 = 'Component One'
	const caption2 = 'Component Two'
	import ContactCard from './ContactCard.svelte'
</script>

<div class="parent">
	<Comp1 cls="childClass" {caption1}>Matia Isakovic</Comp1>
</div>
<div class="child">
	<Comp2 cls="child2Class" {caption2}>Filip Isakovic</Comp2>
</div>

<div class="wrapper">
	<pre>
ContactCard component should get name and Address props as snippets
from parent and should render them @render name(), @render address()
caling snippets as functions as they are such.
The parent send snippets as component content, i.e. specifying them
between the component tags
&lt;ContactCard&gt;
	&lcub;#snippet name()&rcub;
		P. Sherman
	&lcub;/snippet&rcub;

	&lcub;#snippet address()&rcub;
		42 Wallaby Way
		Sydney
	&lcub;/snippet&rcub;
&lt;/ContactCard&gt;
</pre>

	<ContactCard>
		{#snippet name()}
			P. Sherman
		{/snippet}

		{#snippet address()}
			42 Wallaby Way <br />
			Sydney
		{/snippet}
	</ContactCard>
</div>

<!-- sending a CSS class to child component -->
<style>
	.parent,
	.child {
		margin: 1rem 0 0 4rem;
	}
	.parent :global(.childClass),
	.child :global(.child2Class) {
		color: lightgreen;
		border: 1px solid lightgreen;
		width: 11rem;
		padding: 1rem;
		border-radius: 6px;
		text-align: center;
		&:hover {
			color: yellow;
			border-color: yellow;
			cursor: pointer;
		}
	}
	.child :global(.child2Class) {
		color: skyblue;
		border: 1px solid skyblue;
		&:hover {
			color: pink;
			border-color: pink;
		}
	}
	/*	:global(.x) {
		:hover {
			color: yellow;
			border-color: yellow;
		}
	}
	:global(.comp) {
		color: lightgreen;
		border: 1px solid lightgreen;
		:hover {
			color: yellow;
			border: 1px solid yellow;
		}
	}*/
	.wrapper {
		width: max-content;
		padding: 6px 1rem;
		margin: 5px 0 0 4rem;
		border: 1px solid gray;
		border-radius: 8px;
	}
</style>
