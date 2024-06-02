<script lang="ts">
	export let data
	let setUsers = new Set<string>()
	const usersArr = data.users.map((user) => `${user.firstName} ${user.lastName} -- ${user.role}`)
	const rnd = (max: number) => {
		return Math.floor(Math.random() * 1000) % max
	}
	const max = usersArr.length
	let users = new Set<string>()
	for (let i = 0; i < rnd(3 * max); i++) {
		users.add(usersArr[rnd(max)] as string)
	}
</script>

<div class="body">
	<h1>Seminar Attendees</h1>
	{#if users.size === 1}
		<p>In total a single attendee</p>
	{:else}
		<p>In total {users.size} attendees</p>
	{/if}
	<ul>
		{#each users as user, ix}
			<li>
				<span>{user}</span>
			</li>
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
			border-color: lightgreen;
		}
	}
	ul li span {
		color: lightgreen;
	}
	p {
		color: yellow;
	}
</style>
