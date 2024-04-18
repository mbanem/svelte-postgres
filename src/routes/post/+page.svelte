<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores'; // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { setColor, setButtonVisible } from '$lib/utils';
	import { onMount } from 'svelte';

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';
	// categories
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import PostList from '$lib/components/PostList.svelte';

	export let data: PageData;
	export let form: ActionData;

	let message = '';
	let loading = false;
	let ignoreFormMessage = false;
	let selectedUserId = '';
	let titleIsRequired = '';
	let contentIsRequired = '';
	let categoryIsRequired = '';

	let btnCreate: HTMLButtonElement;
	let btnDelete: HTMLButtonElement;
	let btnUpdate: HTMLButtonElement;
	const authorId = data?.user?.id;

	let selected: string[] = [];
	let categoryIDs: number[] = [];

	$: setColor(form?.message ? 'red' : 'green'); // toggle color for a message

	const resetForm = () => {
		(document.querySelector("input[name='bio']") as HTMLTextAreaElement).value = '';
		(document.querySelector("input[name='authorId']") as HTMLInputElement).value = '';
		(document.querySelector("input[name='bioId']") as HTMLInputElement).value = '';
	};

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			ignoreFormMessage = false;
			result = '';
		}, 2000);
	};

	const required = {
		title: '',
		content: '',
		categoryIDs: ''
	};
	let selectedCategoryIds: () => string;
	const enhancePostActions: SubmitFunction = ({ action, formData }) => {
		loading = true; // start spinner animation
		message = '';
		titleIsRequired = '';
		contentIsRequired = '';
		categoryIsRequired = '';

		for (const key of Object.keys(required)) {
			if (formData.get(key) == '') {
				switch (key) {
					case 'title':
						titleIsRequired = 'Title is required';
						break;
					case 'content':
						contentIsRequired = 'Content is required';
						break;
					case 'categoryIDs':
						categoryIsRequired = 'Category is required';
						break;
					default:
						break;
				}
			}
		}
		ignoreFormMessage = false;
		if (action.search === '?/createPost') {
			setButtonVisible([btnCreate, btnUpdate, btnDelete]);
			message = 'saving post...';
		} else if (action.search === '?/deletePost') {
			message = 'deleting post...';
		} else if (action.search === '?/updatePost') {
			(document.querySelector("input[name='categoryIDs']") as HTMLInputElement).value =
				selectedCategoryIds();
			console.log(JSON.stringify(selectedCategoryIds(), null, 2));
			message = 'updating post...';
		}

		return async ({ update }) => {
			await update();
			ignoreFormMessage = true;

			if (action.search === '?/createPost') {
				$page.status === 200 ? 'Post created' : 'create failed';
			} else if (action.search === '?/deletePost') {
				$page.status === 200 ? 'Post deleted' : 'delete failed';
			} else if (action.search === '?/updatePost') {
				$page.status === 200 ? 'Post updated' : 'update failed';
			}
			clearMessage();
			invalidateAll();
			setButtonVisible([btnCreate, btnUpdate, btnDelete]);
			clearForm();
			// resetButtons([btnCreate, btnDelete, btnUpdate]);
			loading = false; // stop spinner animation
			// if (action.search === '?/update') {
			// 	selectedUserWithBio.bio = bio as string;
			// }
		};
	};

	let boardBlock: HTMLDivElement;
	let adminSelected: boolean;
	const userSelected = () => {
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
		selectedUserId = data.user.id;
		adminSelected = data.locals.user.role === 'ADMIN';
	});

	const postsAuthors = () => {
		const arr: {
			id: string;
			title: string;
			content: string;
			firstName: string;
			lastName: string;
		}[] = [];

		data.PostAuthor.forEach((post) => {
			if (selectedUserId === post.authorId) {
				const { id, title, content, firstName, lastName, role } = post;
				arr.push({
					id,
					title,
					content,
					firstName: `${firstName}${role === 'ADMIN' ? 'T' : ''}`,
					lastName
				});
			}
		});

		return arr;
	};

	const clearForm = () => {
		const els = ['id', 'authorId', 'title', 'content', 'published', 'categoryIDs'];
		els.forEach((k) => {
			(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = '';
		});
	};
	let selectOptions: (arr: number[]) => void;
	const toUpdatePost = (postId: string) => {
		// todo
		const authorPost = data.PostAuthor.filter((pa) => pa.id === postId);
		const { id, authorId, published, categoryIds, title, content } = authorPost[0];
		//todo
		// selectOptions(categoryIDs);
		const els = [
			{ id: id },
			{ authorId: authorId },
			{ title: title },
			{ content: content },
			{ published: published }
			// { categoryIDs: categoryIDs }
		];
		selectOptions((categoryIds.split(',') as string[]).map((el) => Number(el)));
		setButtonVisible([btnUpdate, btnCreate, btnDelete]);

		// NOTE: in TypeScript Playground instead of using nested loops as we use below,
		// the spread operators works, but here does not
		// for (const [k,v] of Object.entries([...els])) { code here }
		els.forEach((el) => {
			for (const [k, v] of Object.entries(el)) {
				(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = `${v}`;
			}
		});
	};

	const deletePost = (id: string) => {
		if (browser) {
			(document.querySelector("input[name='id']") as HTMLInputElement).value = id;
			btnDelete.click();
		}
	};

	$: ({ PostAuthor } = data);
	$: formMessage = ignoreFormMessage ? '' : form?.message || '';
	$: result = message || formMessage;
	$: msg = form?.success
		? 'Saved - ' + form.success
		: form?.message
			? 'Error: ' + form.message
			: '';
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId
	amendTFUserId={true}
	PageName="Post"
	user={data.user}
	users={data.users}
/>

<!-- <pre style="font-size:11px;"> {selectedUserId}</pre> -->
<!-- <pre style="font-size:1/1px;">data.postAuthor {JSON.stringify(data, null, 2)}</pre> -->

<div bind:this={boardBlock} class="board hidden">
	<div>
		<form method="POST" action="?/createPost" use:enhance={enhancePostActions}>
			<input type="hidden" name="id" />
			<input type="hidden" name="authorId" value={authorId} />
			<input type="hidden" name="categoryIDs" value={categoryIDs} />
			<input type="text" name="title" placeholder={titleIsRequired || 'enter post title'} />
			<input type="text" name="content" placeholder={contentIsRequired || 'enter post content'} />
			<label for="published" class="label-save">
				<input type="checkbox" name="published" id="published" />
				<span style="user-select:none">published</span>
				<button bind:this={btnCreate} type="submit" class="button">
					{#if loading}
						<CircleSpinner color="skyblue" />
					{/if}
					create
				</button>
				<button bind:this={btnDelete} type="submit" formaction="?/deletePost" class="button hidden"
					>delete</button
				>
				<button bind:this={btnUpdate} type="submit" formaction="?/updatePost" class="button hidden"
					>update</button
				>
			</label>
		</form>
		<div class="multi-select-container">
			<MultiSelect
				bind:categoryIsRequired
				data={data.categories}
				bind:setSelectedIds={selectOptions}
				bind:getSelectedCategoryIDs={selectedCategoryIds}
				select_box="select_box"
				selected_categories="selected_categories"
			/>
		</div>
	</div>
</div>
<div class="post-container">
	{#key PostAuthor}
		<!-- <pre style="font-size:11px;"> {JSON.stringify(data.PostAuthor, null, 2)}</pre> -->
		{#key selectedUserId}
			<PostList postAuthors={postsAuthors()} {toUpdatePost} {deletePost} />
		{/key}
	{/key}
</div>

<style lang="scss">
	.board {
		// display: grid;
		// grid-template-columns: 1fr 1fr;
		// grid-column-gap: 1em;
		min-width: 36em;
		width: 70vw;
		gap: 2px;
		padding: 0 1rem 1rem 1rem;
		margin-left: 1rem;
		form {
			width: calc(100% - 1rem);
		}
	}
	.label-save {
		display: flex;
		align-items: baseline;
	}
	button {
		display: inline-block;
		position: relative;
		height: 1.9rem;
		width: 6rem;
		font-size: 16px;
		background-color: $BACK-COLOR;
	}

	input {
		display: inline-block;
		width: 5rem;
		width: 100%;
		padding-left: 0.5rem;
		line-height: 0.8rem;
		color: $BACK-COLOR;
		height: 1.3rem;
		&::placeholder {
			color: var(--PLACEHOLDER_COLOR);
			font-weight: normal;
		}
	}
	label input {
		display: inline-block;
		width: 1rem;
		height: 1rem;
	}
	label {
		display: flex;
		gap: 1.5rem;
		// margin: 0;
	}

	.multi-select-container {
		// grid-column: span 2;
		padding: 0;
		margin: 0;
		width: 100%;
		border: 1px solid gray;
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
	}
</style>
