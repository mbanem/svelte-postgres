<script lang="ts">
	import { tick } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	// type Post = {
	// 	id: string;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// 	title: string;
	// 	content: string | null;
	// 	published: boolean;
	// 	authorId: string;
	// };

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

			// wait for form:ActionData to become available
			await tick();
			// @ts-expect-error
			const post = JSON.parse(form?.post);
			// console.log(post.id);
			showFullPost(post.id);
			setTimeout(() => {
				success = '';
			}, 3000);
		};
	};
	let selectedAuthorName = '';
	const authorSelected = () => {
		selectedAuthorName = '';
		selectedAuthorName = findUser(selectedAuthorId).firstName + "'s";
	};
	let thePost: Post;
	let author: User;
	const findUser = (id: string) => {
		return users?.filter((user) => String(user.id) === id)[0] as unknown as User;
	};
	const showFullPost = (event: MouseEvent | string) => {
		// as attribute uis named data-id so we read pEl.dataset.id
		// i.e. what follows data- is the name of dataset attribute
		let id: string;
		if (event instanceof MouseEvent) {
			const pEl = event.currentTarget as HTMLParagraphElement;
			id = pEl.dataset.id as string;
			if (!id) {
				return;
			}
		} else {
			id = event;
		}
		thePost = posts?.filter((post) => post.id === id)[0] as unknown as Post;
		author = findUser(String(thePost.authorId));
		// console.log('the post.id', JSON.stringify(thePost, null, 2));
	};
	$: ({ users, posts } = data);
</script>

<!-- {#if form}
	<pre>{JSON.stringify(form, null, 2)}</pre>
{/if} -->
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
			{#if selectedAuthorName}
				<a
					class="disconnect-posts"
					type="button"
					href="/api/disconnect/[user]x[{selectedAuthorId}]x[post]"
					>disconnect {selectedAuthorName ?? ''} posts
				</a>
				<a
					class="disconnect-posts"
					type="button"
					href="/api/disconnect/[user]x[{selectedAuthorId}]x[profile]"
					>disconnect {selectedAuthorName ?? ''} profile
				</a>
			{/if}
		</div>
	</div>
	<div>
		<p>Posts</p>
		{#if posts}
			<ul>
				{#each posts as post}
					<li class="post-list">
						<a type="button" href="/api/delete/[post]x[{post.id}]">❌</a>
						<p class="post" on:click={showFullPost} aria-hidden="true" data-id={post.id}>
							{post.title} -- {post.author.firstName}
							{post.author.lastName}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	<div class="two-columns">
		{#if thePost}
			<p class="title">{thePost?.title}</p>
			<p class="content">{thePost.content}</p>
			<p>Created at {thePost.createdAt.toLocaleDateString()}</p>
			{#if thePost.updatedAt}
				<p>Created at {thePost.updatedAt.toLocaleDateString()}</p>
			{/if}
			<p>{thePost.published ? '' : 'not '}published</p>
			<p>{thePost.authorId}</p>
			{#if author}
				<p>{author.firstName} {author.lastName}</p>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr 2fr;
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
		// border: 2px solid blue;

		border-radius: 5px; /* round the border corners */
		padding: 5px 10px;
		width: 200px;
		height: 40px;
		box-shadow: 5px 8px 5px rgba(0, 0, 0, 0.8);

		font-family: serif;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
	p {
		color: aliceblue;
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
		color: yellow;
		cursor: pointer;
	}
	.two-columns {
		grid-column: span 2;
		border: 1px solid lightgray;
		border-radius: 8px;
		padding: 10px 1rem;
		width: 80%;
		p {
			margin: 2px 0 2px 2rem;
		}
	}
	.title {
		color: rgb(233, 233, 156);
	}
	.content {
		color: rgb(246, 246, 103);
		font-size: 18px;
		font-weight: 200;
		padding: 8px 0;
	}
	.post-list {
		display: flex;
		gap: 8px;
	}
	.user-list {
		display: flex;
		flex-direction: column;
		// justify-content: flex-start;
		align-items: flex-start;
		// border: 0;
		padding: 0;
		gap: 1rem;
		ul {
			list-style-type: none;
			// border: 1px solid gray;
			// margin: 0;
			// padding: 0;
		}
	}
	.disconnect-posts {
		border: 2px solid gray;
		border-radius: 4px;
		width: 16rem;
		padding: 4px 0;
		margin: 0 0 1rem 1rem;
	}
</style>
