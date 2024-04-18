<script lang="ts">
	import { isNameChanged } from '$lib/utils/index';
	type PostList = {
		id: string;
		title: string;
		content: string;
		firstName: string;
		lastName: string;
	};
	export let postAuthors: PostList[];
	export let deletePost: (id: string) => void;
	export let toUpdatePost: (id: string) => void;
</script>

<div class="post-container">
	<ul>
		{#if postAuthors[0]}
			<p class="name">{postAuthors[0].firstName.slice(0, -1)} {postAuthors[0].lastName}</p>
			{#each postAuthors as { id, title, content, firstName, lastName }}
				<li class="post-block">
					<div class="title">
						<p>{title}</p>
						<p on:click={() => deletePost(id)} class="highlight" aria-hidden={true}>❌</p>
						<p on:click={() => toUpdatePost(id)} class="highlight" aria-hidden={true}>📝</p>
					</div>
					<p class="content">{content}</p>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.post-container {
		overflow-y: auto;
		width: 70vw;
		min-width: 36em;
		height: 15rem;
		border: 1px solid gray;
		border-radius: 8px;
		margin-left: 2rem;
	}
	.name {
		position: sticky;
		top: -5px;
		font-style: italic;
		color: yellow;
		font-size: 16px;
		margin-bottom: 8px;
		padding: 5px 1rem 5px 1rem;
		background-color: #3e3e3e; /*  $BACK-COLOR; */
	}
	.post-block {
		list-style: none;
		margin: 1rem 0 0 0;
		padding: 0 5px 0 0;
	}
	.title {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		font-size: 12px;
		/* display: flex; */
		/* flex-direction: column; */
		padding: 0;
		margin: 0;
	}
	.highlight:hover {
		background-color: pink;
		cursor: pointer;
	}
	.content {
		font-size: 16px;
		font-family: Verdana, sans-serif;
		padding: 0;
		margin: 0;
	}
</style>
