<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import MultiSelect from '$lib/components/MultiSelect.svelte';

	export let data: PageData;
	export let form: ActionData;

	const clearMessage = () => {
		setTimeout(() => {
			deleted = '';
		}, 2000);
	};

	let deleted = '';
	const deletePost = async (id: string) => {
		const response = await fetch(`/post?id=${id}`, {
			method: 'DELETE',
			body: id
		});
		const data = await response.json();
		deleted = data.deleted ? 'deleted successfully' : 'delete failed';
		clearMessage();
	};
	$: result = deleted;
	$: ({ queryPosts, user } = data);
	let selectedAuthorId = '';
	const authorId = data?.user?.id;
	// console.log('authorId', data.user.id);

	// let selectedCategories:string
	let selected: string[] = [];
	let categoryIDs: number[] = [];

	const setCategoryIDs = (event: CustomEvent<{ ids: number[]; names: string[] }>) => {
		categoryIDs = event.detail.ids;
		selected = event.detail.names;
		// ('categoryIDs', JSON.stringify(event.detail, null, 2));
	};

	$: msg = form?.success
		? 'Saved - ' + form.success
		: form?.error
			? 'Error: ' + form?.error.message
			: '';
</script>

<!-- <pre style="font-size:11px;"> {JSON.stringify(msg ?? '', null, 2)}</pre> -->
<h1>
	Post Page{#if msg}<p class="message">{msg}</p>{/if}
</h1>
<!-- <p>categoryIDs {JSON.stringify(categoryIDs, null, 2)}</p>
<p>selected {JSON.stringify(selected, null, 2)}</p> -->
{#if data.user.role === 'ADMIN'}
	{#if data.users}
		<select class="select-author" bind:value={selectedAuthorId}>
			<option value="" selected>Select Post Author</option>
			{#each data.users as user}
				<option value={user.id}>
					{user.firstName}
					{user.lastName}
				</option>
			{/each}
		</select>
	{/if}
{:else}
	<p>{user.firstName} {user.lastName}</p>
{/if}
{#if result}
	<span class="message">{result}</span>
{/if}
<span class="message">{user.firstName} {user.lastName}</span>
<div class="board">
	<form method="POST" action="?/create" use:enhance>
		<input type="hidden" name="authorId" value={authorId} />
		<input type="hidden" name="categoryIDs" value={categoryIDs} />
		<input type="text" placeholder="enter post title?" name="title" />
		<input type="text" placeholder="enter post content?" name="content" />
		<label for="published">
			<input type="checkbox" name="published" id="published" />
			<span>published</span>
		</label>
		<button type="submit">save</button>
	</form>
	<div class="multi-select-container">
		<MultiSelect
			on:categoryids={setCategoryIDs}
			data={data.categories}
			select_box="select_box"
			selected_categories="selected_categories"
		/>
	</div>
	<div class="post-container">
		{#if data.queryPosts}
			<!-- <pre style="font-size:11px;"> {JSON.stringify(data.queryPosts, null, 2)}</pre> -->
			<ul>
				{#each data.queryPosts as { title, content, author: { firstName, lastName } }}
					<li class="post-block">
						<p>{firstName} {lastName}</p>
						<p>{title}</p>
						<p>{content}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1em;
		min-width: 36em;
		width: 62vw;
		gap: 2px;
		padding: 1rem;
		margin-left: 1rem;
		form {
			width: calc(100% - 1rem);
		}
		input,
		button {
			width: 8rem;
			display: inline-block;
			font-size: 18px;
			padding-left: 0.5rem;
			color: black;
		}
		input {
			display: inline-block;
			width: calc(100% - 1rem);
			height: 1.5rem;
		}
		label input {
			display: inline-block;
			width: 1rem;
			height: 1rem;
		}
		label {
			display: flex;
			gap: 1rem;
			margin-bottom: 6px;
		}

		:nth-child(1) {
			grid-column: span 2;
			display: flex;
			flex-direction: column;
			margin: 0;
		}
		.post-container {
			grid-column: span 2;
			width: 100%;
			height: 16.5rem;
			border: 1px solid gray;
			border-radius: 8px;
			overflow: auto;
		}
	}
	h1 {
		display: flex;
		align-items: baseline;
		margin-left: 2rem;
		height: 1.5rem;
		.message {
			display: inline-block;
			font-size: 12px;
			font-weight: 100;
			color: yellow;
			margin-left: 1rem;
		}
		// select {
		// 	margin-left: 1rem;
		// }
	}

	// for a child <MultiSelect component
	.multi-select-container {
		padding: 0;
		margin: 0;
		width: 50rem;
		margin: 1rem 0;
		border: 1px solid yellow;
	}
	.multi-select-container :global(.select_box) {
		width: 40%;
		height: 4rem;
		font-weight: 500;
	}
	.multi-select-container :global(.selected_categories) {
		border: 1px solid gray;
		// width: 100;
		height: 1.5rem;
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 0 0 0 5px;
		margin: 0 0 2px 0;
		color: skyblue;
		font-family: 'Arial Narrow Bold', sans-serif;
		font-size: 0.8em;
	}
	.select-author {
		margin: 0 1rem 0 2rem;
	}
	.post-block,
	.post-block {
		list-style: none;
		margin: 1rem 0 0 0;
		padding: 0;
		p {
			margin: 0;
			padding: 0;
		}
		p:nth-child(1) {
			font-size: 12px;
			font-style: italic;
		}
	}
</style>
