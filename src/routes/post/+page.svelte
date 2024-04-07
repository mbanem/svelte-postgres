<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';

	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	$: ({ PostAuthor, user } = data);

	let selectedAuthorId = '';
	let message = '';
	let ignoreFormMessage = false;
	let btnDelete: HTMLButtonElement;
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

	let boardBlock: HTMLDivElement;
	let adminSelected: boolean;
	let selectedUserName: string = '';
	const userSelected = () => {
		selectedAuthorId = String(selBox.value).slice(2);
		adminSelected = String(selBox.value).slice(0, 1) === 'T';
		// @ts-expect-error
		selectedUserName = selBox.options[selBox.selectedIndex].text;
		// if no admin is selected hide boardBlock if not hidden already
		if (boardBlock.classList.contains('hidden')) {
			if (adminSelected) {
				boardBlock.classList.toggle('hidden');
			}
		} else {
			if (!adminSelected) {
				boardBlock.classList.toggle('hidden');
			}
		}
	};

	// let selBox: HTMLSelectElement;
	onMount(() => {
		boardBlock.classList.toggle('hidden');
		selectedAuthorId = data.user.id;
		adminSelected = data.locals.user.role === 'ADMIN';
		// if (adminSelected) {
		// 	if (data.users.length == 1) {
		// 		selBox.selectedIndex = 1;
		// 	} else {
		// 		for (let i = 0; i < selBox.options.length; i++) {
		// 			if (selBox.options[i]?.value.slice(2) === selectedAuthorId) {
		// 				// @ts-expect-error
		// 				selBox.options[i].selected = true;
		// 			}
		// 		}
		// 	}
		// }
		// selectedUserName = `${data.user.firstName} ${data.user.lastName}`;
	});
	let fn: string = '';
	let ln: string = '';
	const isNameChanged = (firstName: string, lastName: string) => {
		const result = fn === firstName && ln === lastName ? false : true;
		if (result) {
			fn = firstName;
			ln = lastName;
		}
		return result;
	};
	const postsAuthors = () => {
		console.log('postsAuthors');
		const arr: {
			id: string;
			title: string;
			content: string;
			firstName: string;
			lastName: string;
		}[] = [];

		if (selectedAuthorId === user.id) {
			data.PostAuthor.forEach((post) => {
				const {
					id,
					title,
					content,
					author: { firstName, lastName, role }
				} = post;
				arr.push({
					id,
					title,
					content,
					firstName: `${firstName}${role === 'ADMIN' ? 'T' : ''}`,
					lastName
				});
			});
		} else {
			data.PostAuthor.forEach((post) => {
				const {
					id,
					title,
					content,
					author: { firstName, lastName }
				} = post;
				arr.push({
					id,
					title,
					content,
					firstName,
					lastName
				});
			});
		}
		console.log(arr);
		return arr;
	};

	$: result = '';
	$: msg = form?.success
		? 'Saved - ' + form.success
		: form?.error
			? 'Error: ' + form?.error.message
			: '';
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<!-- <pre style="font-size:11px;"> {JSON.stringify(data.PostAuthor, null, 2)}</pre> -->
<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedAuthorId
	bind:btnDelete
	amendTFUserId={true}
	PageName="Post"
	user={data.user}
	users={data.users}
/>

<!-- <pre style="font-size:11px;"> {selectedAuthorId}</pre> -->
<!-- <pre style="font-size:11px;">data.postAuthor {JSON.stringify(data.PostAuthor, null, 2)}</pre> -->
<!-- <p>selected {data.locals.user.role}</p>
{#if data.user.role === 'ADMIN'}
	{#if data.users}
		<select on:click={userSelected} class="select-author">
			<option value="">Select Post Author</option>
			{#each data.users as user}
				<option value="{user.role === 'ADMIN' ? 'T-' : 'F-'}{user.id}">
					{user.firstName}
					{user.lastName}
				</option>
			{/each}
		</select>
	{/if}
{/if} -->

<!-- <span class="login-user">{selectedUserName} -- role {adminSelected ? 'ADMIN' : 'USER'}</span> -->
<div bind:this={boardBlock} class="board hidden">
	<div>
		<form method="POST" action="?/create" use:enhance>
			<input type="hidden" name="authorId" value={authorId} />
			<input type="hidden" name="categoryIDs" value={categoryIDs} />
			<input type="text" placeholder="enter post title?" name="title" />
			<input type="text" placeholder="enter post content?" name="content" />
			<label for="published">
				<input type="checkbox" name="published" id="published" />
				<span style="user-select:none">published</span>
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
	</div>
</div>
<div class="post-container">
	{#if data.PostAuthor}
		<!-- <pre style="font-size:11px;"> {JSON.stringify(data.PostAuthor, null, 2)}</pre> -->
		<ul>
			{#each postsAuthors() as { id, title, content, firstName, lastName }}
				<li class="post-block">
					{#if isNameChanged(firstName, lastName)}
						<p class="name">{firstName} {lastName}</p>
					{/if}
					<p class="title">{title}</p>
					<p>{content}</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	// .board {
	// 	// display: grid;
	// 	// grid-template-columns: 1fr 1fr;
	// 	// grid-column-gap: 1em;
	// 	min-width: 36em;
	// 	width: 62vw;
	// 	gap: 2px;
	// 	padding: 1rem;
	// 	margin-left: 1rem;
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
		width: 100%;
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
	p {
		margin: 0;
		padding: 0;
	}
	.name {
		color: yellow;
		font-size: 16px;
		margin-bottom: 4px;
	}
	.title {
		font-size: 12px;
		display: flex;
		flex-direction: column;
		margin: 0;
	}
	.post-container {
		// grid-column: span 2;
		width: 100%;
		height: 16.5rem;
		border: 1px solid gray;
		border-radius: 8px;
		overflow: auto;
	}
	.multi-select-container {
		// grid-column: span 2;
		padding: 0;
		margin: 0;
		width: 100%;
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
	// }
	.hidden {
		display: none;
		// visibility: hidden;
		// height: 0;
	}
	.post-block,
	.post-block {
		list-style: none;
		margin: 1rem 0 0 0;
		padding: 0;

		// p:nth-child(1) {
		// 	font-size: 12px;
		// 	font-style: italic;
		// }
	}
</style>
