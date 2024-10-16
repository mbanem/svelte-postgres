<script lang="ts">
	import FilterableList from './FilterableList.svelte'
	import { colors, type Color } from './colors'

	// let row = colors[0];
</script>

<FilterableList data={colors} field="name">
	{#snippet header()}
		<header class="row">
			<span class="color"></span>
			<span class="name">name</span>
			<span class="hex">hex</span>
			<span class="rgb">rgb</span>
			<span class="hsl">hsl</span>
		</header>
	{/snippet}

	{#snippet item_row(c: Color)}
		<div class="row">
			<span class="color" style="background-color: {c.hex}"></span>
			<span class="name">{c.name}</span>
			<span class="hex">{c.hex}</span>
			<span class="rgb">{c.rgb}</span>
			<span class="hsl">{c.hsl}</span>
		</div>
	{/snippet}
</FilterableList>

<style>
	.row {
		display: grid;
		width: 51rem;
		align-items: center;
		grid-template-columns: 4em 16rem 8rem 20rem 20rem;
		/* gap: 1em; */
		/* padding: 0.1em; */
		background: var(--bg-1);
		border-radius: 0.2em;
		color: lightgreen;
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-size: 18px;
		border-top: 1px solid gray;
		border-bottom: 1px solid gray;
		height: 1.6rem;
	}
	.row:not(header) {
		color: lightgreen;
		border: none;
	}
	header {
		font-weight: normal;
		text-transform: capitalize;
	}

	.row:not(header):hover {
		color: yellow;
		cursor: pointer;
		border-bottom: 1px solid yellow;
	}

	.color {
		aspect-ratio: 1;
		height: 30px;
		border-radius: 0.1em;
	}

	.rgb,
	.hsl {
		display: none;
	}

	@media (min-width: 40rem) {
		.row {
			grid-template-columns: 2em 4fr 3fr 3fr;
		}

		.rgb {
			display: block;
		}
	}

	@media (min-width: 60rem) {
		.row {
			grid-template-columns: 2em 4fr 3fr 3fr 3fr;
		}

		.hsl {
			display: block;
		}
	}
</style>
