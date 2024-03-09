<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let success = '';
	let loading = false;
	let selectedAuthorId = '';
	const createProfile: SubmitFunction = ({ action }) => {
		// action is URL e.g. http://localhost:5173/dodos?/addTodo
		// action.search e.g. ?/addTodo	so action.search.slice(2) is addTodo route folder name
		success = '';
		// processing before form submit8
		// if (!form?.missing) {
		loading = true;
		// }
		// processing after the form submit
		return async ({ update }) => {
			await update();
			loading = false;
			success = action.search.slice(2) === 'addTodo' ? 'New todo added' : 'All todos cleared';
			setTimeout(() => {
				success = '';
			}, 3000);
		};
	};
	const authorSelected = () => {
		console.log('selectedAuthorId', selectedAuthorId);
	};
	$: ({ users } = data);
</script>

<h1>Posts Page</h1>
<p>Selected AuthorId {JSON.stringify(selectedAuthorId, null, 2)}</p>
<div class="container">
	<div>
		Author Bio
		<form action="?/create" method="post" use:enhance={createProfile}>
			<textarea
				class="text-area"
				placeholder="Place bio here"
				rows={5}
				cols={35}
				name="bio"
				value={form?.bio ?? ''}
			/>
			<input type="hidden" name="authorId" value={selectedAuthorId ?? ''} />
			<button type="submit" disabled={selectedAuthorId === ''}>Create Profile</button>
		</form>
	</div>
	<div class="user-list">
		<ul>
			<p>Select Profile Author</p>
			<select bind:value={selectedAuthorId} on:change={authorSelected}>
				<option value="" selected>Select the Author</option>
				{#if users}
					{#each users as user}
						<option value={user.id}>
							{user.firstName}
							{user.lastName}
						</option>
					{/each}
				{/if}
			</select>
		</ul>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		text-align: center;
		border: 1px solid gray;
		width: 20em;
	}
	textarea {
		color: black;
		// &::placeholder {
		// font-size:16px;
	}

	select {
		appearance: none; /* remove default appearance set by the browser */
		outline: none; /* remove the outline shown on focus */
		cursor: pointer; /* change the mouse cursor icon */

		color: black !important; /* text color */
		background-color: white;
		border: 1px solid gray;

		border-radius: 5px; /* round the border corners */
		padding: 5px 10px;
		width: 15rem;
		height: 30px;
		box-shadow: 5px 8px 5px rgba(0, 0, 0, 0.8);

		font-family: serif;
		font-size: 16px;
		font-weight: 300;
		text-align: center;
		:focus {
			outline: 2px dashed red;
		}
	}
	p {
		color: yellow;
	}
	button {
		color: black;
		font-size: 16px;
		&:disabled {
			background-color: gray;
		}
	}
	ul {
		display: flex;
		flex-direction: column;
		text-align: center;
		margin: 2px auto;
	}
</style>
