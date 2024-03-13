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

<pre>{JSON.stringify(data, null, 2)}</pre>
<h1>Profile Page</h1>
<p>Selected AuthorId {JSON.stringify(selectedAuthorId, null, 2)}</p>
<div class="container">
	<div class="left-column">
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
				<select class="select-author" bind:value={selectedAuthorId} on:change={authorSelected}>
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
	<div class="right-column">
		<ul>
			{#if data.users}
				{#each data.users as user}
					<li>
						<p>{user.firstName} {user.lastName}</p>
						<p>{user.profile?.bio ?? ''}</p>
					</li>
				{/each}
			{/if}
		</ul>
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		gap: 1rem;
		width: 80vw;
		grid-template-columns: 1fr 3fr;
		text-align: center;
		// border: 1px solid gray;
		// width: 20em;
		.left-column {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			border: 1px solid gray;
			align-items: center;
			border-radius: 6px;
			padding-top: 1rem;
			// width: 30vw;
			p {
				text-align: left;
			}
			textarea {
				text-align: left;
				color: black;
				margin-top: 1rem;
			}
			button {
				display: block;
				color: black;
				font-size: 16px;
				margin: 1rem 0 0 3.5em;
				&:disabled {
					background-color: gray;
				}
			}
			.select-author {
				padding-left: 2rem;
				width: 15rem;
				font-size: 16px;
				font-weight: 300;
				margin-right: 2.5rem;
				:focus {
					outline: 2px dashed red;
				}
			}
		}
		.right-column {
			border: 1px solid gray;
			border-radius: 6px;
			ul {
				list-style: none;
				li {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					margin: 0;
					padding: 0;
					p:nth-child(1) {
						color: yellow;
						font-style: italic;
						margin: 1rem 0 0 0;
					}
					p:nth-child(2) {
						margin-top: 8px;
						font-size: 14px;
					}
				}
			}
		}
	}

	ul {
		display: flex;
		flex-direction: column;
		text-align: center;
		margin: 2px auto;
	}
</style>
