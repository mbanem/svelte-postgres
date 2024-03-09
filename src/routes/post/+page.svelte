<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let success = '';
	let loading = false;
	let selectedAuthorId = '';
	const createPost: SubmitFunction = ({ action }) => {
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
	$: ({ users, posts } = data);
</script>

<h1>Posts Page</h1>
<p>Selected AuthorId {JSON.stringify(selectedAuthorId, null, 2)}</p>
<div class="container">
	<div>
		<form action="?/create" method="post" use:enhance={createPost}>
			<label for="title">
				Title
				<input type="text" name="title" value={form?.post?.title ?? ''} />
			</label>
			<label for="title">
				Content
				<input type="text" name="content" value={form?.post?.content ?? ''} />
			</label>
			<input type="hidden" name="authorId" value={selectedAuthorId ?? ''} />
			<button type="submit" disabled={selectedAuthorId === ''}>Create Post</button>
		</form>
		<div class="user-list">
			<ul>
				Select Post Author
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
	<div>
		<p>Posts</p>
		{#if posts}
			<ul>
				{#each posts as post}
					<li>
						<p class="post">
							<span class="hidden-id">{post.authorId}</span>
							{post.title} -- {post.author.firstName}
							{post.author.lastName}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 60rem;
		justify-content: space-around;
		align-items: flex-start;
		margin: 1rem auto;
	}
	select {
		appearance: none; /* remove default appearance set by the browser */
		outline: none; /* remove the outline shown on focus */
		cursor: pointer; /* change the mouse cursor icon */

		color: navy !important; /* text color */
		background-color: white;
		border: 2px solid blue;

		border-radius: 5px; /* round the border corners */
		padding: 5px 10px;
		width: 200px;
		height: 40px;
		box-shadow: 5px 8px 5px rgba(0, 0, 0, 0.8);

		font-family: serif;
		font-size: 16px;
		font-weight: bold;
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
		text-align: left;
	}
	.post {
		display: flex;
		padding: 0;
		margin: 0;
		height: 1.5rem;
	}
	.hidden-id {
		display: inline-block;
		width: 0;
		visibility: hidden;
	}
</style>
