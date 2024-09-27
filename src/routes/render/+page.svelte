<script>
	import Comp1 from './Comp1.svelte'
	import Comp2 from './Comp2.svelte'
	const caption1 = 'Component One'
	const caption2 = 'Component Two'
</script>

<div class="parent">
	<Comp1 cls="childClass" {caption1}>Matia Isakovic</Comp1>
</div>
<div class="child">
	<Comp2 cls="child2Class" {caption2}>Filip Isakovic</Comp2>
</div>

<!-- sending a CSS class to child component -->
<style>
	.parent,
	.child {
		margin: 3rem 0 0 4rem;
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
</style>
