<script lang="ts">
	const item = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE']
	const colors = [
		'AliceBlue',
		'AntiqueWhite',
		'Aqua',
		'Aquamarine',
		'lightgreen',
		'Teal',
		'Thistle',
		'Violet',
		'SkyBlue'
	]
</script>

<svelte:head>
	<title>Flex & Greed</title>
</svelte:head>
<br />
<br />
<div class="grid-wrapper">
	{#each [...9] as _, ix}
		<div class={`container container${ix + 1}`}>
			<div class="item">{item[ix]}</div>
			<div class="item item1">1</div>
			<div class="item item2">2</div>
		</div>
	{/each}
</div>
<div class="grid-wrapper2">
	{#each [...9] as _, ix}
		<div style={`background-color:${colors[ix]}`}>
			<div class="item x">{item[ix]}</div>
			<div class="x"><i class="fa-regular fa-lightbulb"></i></div>
			<div class="x">2</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.item.x {
		background-color: navy;
	}
	.x {
		font-size: 24px;
		font-weight: 800;
		color: black;
	}
	.grid-wrapper,
	.grid-wrapper2 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: flex-start;
		grid-row: auto;
		border: 1px solid gray;
		border-radius: 1rem;
		width: 80vw;
		margin: 0 auto;
	}
	.grid-wrapper {
		grid-template-rows: auto 17rem auto;
	}
	.grid-wrapper2 {
		border: 1px solid yellow;
	}
	.container1,
	.container2,
	.container3,
	.container4,
	.container5,
	.container6,
	.container7,
	.container8,
	.container9 {
		display: flex;
		gap: 8px;
		border: 1px solid gray;
		border-radius: 1rem;
	}

	.container1 {
		flex-direction: column;
		align-items: flex-start;
		background-color: cornsilk;
		.item:first-child {
			align-self: flex-end;
		}
		.item1 {
			align-self: flex-end;
		}
		.item2 {
			align-self: center;
		}
	}
	.container2 {
		grid-row: 2/3;
		grid-column: 1/2;
		flex-direction: column;
		// justify-content: center;
		// align-items: center;
		place-items: center;
		background-color: SeaGreen;
	}
	.container3 {
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
	}
	.container4 {
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
		background-color: red;
		.item2 {
			flex-grow: 1;
		}
	}
	.container5 {
		grid-row: 1/2;
		grid-column: 2/3;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: burlywood;
	}
	.container6 {
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
	}
	.container7 {
		flex-direction: row;
		justify-content: space-around;
		align-items: baseline;
		.item1 {
			flex-grow: 1;
			font-size: 4rem;
		}
	}
	.container8 {
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
		.item2 {
			font-size: 4rem;
		}
	}
	.container9 {
		flex-direction: row;
		justify-content: space-evenly;
		align-items: flex-start;
	}
	.item {
		@include rectangle(60px, 60px);
	}
</style>
