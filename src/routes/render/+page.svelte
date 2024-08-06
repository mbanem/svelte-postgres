<script>
	import Comp1 from './Comp1.svelte';
	import Comp2 from './Comp2.svelte';
	const caption = 'Component One';
</script>

<div class="parent">
	<Comp1 cls="childClass" {caption}>Matia Isakovic</Comp1>
</div>
<Comp2
	cls="childClass"
	caption="Component Two"
	style="color:skyblue;border:1px solid skyblue;width:9rem !important; padding:4px 1rem;border-radius:6px;"
>
	<p style="margin:0;text-align:center;">Filip Isakovic</p>
</Comp2>

<!-- sending a CSS class to child component -->
<style>
	.parent :global(.childClass) {
		color: lightgreen;
		border: 1px solid lightgreen;
		width: 11rem;
		padding: 3px 1rem;
		border-radius: 6px;
		text-align: center;
		margin: 0;
		padding: 0;
		&:hover {
			color: yellow;
			border-color: yellow;
			cursor: pointer;
		}
	}
	:global(.x) {
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
	}
</style>
