<script>
	let { members } = $props()
</script>

<div class="container">
	{#each members as member}
		<div class="wrapper">
			<p class="title">{member.title}</p>
			<p class="name">{member.name}</p>
			{#each member.address.split(';') as txt}
				<p>{txt}</p>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 2rem 10vw;
	}
	.wrapper {
		width: 12rem;
		margin: 4px 0 0 0;
		border: 1px solid gray;
		border-radius: 8px;
		padding: 6px 0 6px 1rem;
		margin: 0;
		color: lightgray;
	}
	p {
		margin: 0;
		padding: 0;
	}
	.name {
		color: yellow;
		margin: 5px 0 1rem 0;
	}
	.title {
		color: lightgreen;
		font-style: italic;
		margin: 8px 0;
	}
</style>
