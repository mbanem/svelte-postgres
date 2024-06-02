<script>
	export let data
	$: ({ users } = data)
	$: attendees = 'attendee' + users.length === 1 ? 's' : ''
	$: even = Math.random() > 0.5
	let ordinal = 1
</script>

<div class="body">
	<h1>Seminar Attendees</h1>
	{#if users.length === 1}
		<p>In total {users.length} attendee</p>
	{:else}
		<p>In total {users.length} attendees</p>
	{/if}
	<ul>
		{#each users as user, ix}
			{#if (even && ix % 2 === 0) || (!even && ix % 2 === 1)}
				<li>
					{user.firstName}
					{user.lastName} as {user.role == 'USER' ? 'Visitor' : 'Administrator'}
				</li>
			{/if}
		{/each}
	</ul>
	<a class="a-button" href="/news">back</a>
</div>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->

<style lang="scss">
	.body {
		width: 100vw;
		height: 100vh;
		background-color: #3e3e3e;
		margin: 1rem 0 0 3rem;
	}
	h1,
	h2 {
		color: skyblue;
	}
	.a-button {
		display: inline-block;
		width: 4rem;
		padding: 3px 1rem;
		color: white;
		background-color: navy;
		text-align: center;
		border: 1px solid transparent;
		border-radius: 4px;
		&:hover {
			border-color: yellow;
		}
	}
</style>
