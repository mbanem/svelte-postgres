<script lang="ts">
	import type { Snapshot } from '../$types'; // .sveltekit/$types
	import { onMount, getContext } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores'; // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { setColor, setButtonVisible, csvToNumArr } from '$lib/utils';

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';
	// categories
	import MultiSelectBox from '$lib/components/MultiSelectBox.svelte';
	import PostList from '$lib/components/PostList.svelte';

	export let data: PageData;
	export let form: ActionData;

	let message = '';
	let loading = false;
	let ignoreFormMessage = false;
	let selectedUserId = '';
	let titleIsRequired = '';
	let contentIsRequired = '';
	const requiredCategory = 'Please select corresponding categories';
	let categoryIsRequired = requiredCategory;

	let btnCreate: HTMLButtonElement;
	let btnDelete: HTMLButtonElement;
	let btnUpdate: HTMLButtonElement;
	const authorId = data?.user?.id;

	let categoryIds: number[] = [];

	$: setColor(form?.message ? (form.message.includes('successfully') ? 'green' : 'red') : 'green');

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			ignoreFormMessage = false;
			result = '';
			categoryIsRequired = requiredCategory;
		}, 2000);
	};

	const clearForm = () => {
		const els = ['id', 'title', 'content', 'categoryIds'];
		els.forEach((k) => {
			(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = '';
		});
		(document.querySelector(`input[name='published']`) as HTMLInputElement).checked = false;
		setSelectedOptions([], categoryIsRequired);
		setColor('green');
	};

	const required = {
		title: '',
		content: '',
		categoryIds: ''
	};

	const categoryList = (arr: number[]) => {
		// @ts-expect-error
		return arr.map((n) => data.categories[n - 1].name).join(', ');
	};

	let selectedCategoryIds: () => string;

	/*
		After processing the request (for example, logging the user in by setting a cookie),
		the action can respond with data that will be available through the form property on
		the corresponding page and through $page.form app-wide until the next update.
	*/
	const enhancePost: SubmitFunction = ({ action, formData }) => {
		message = '';
		titleIsRequired = '';
		ignoreFormMessage = false;
		contentIsRequired = '';

		for (const key of Object.keys(required)) {
			if (formData.get(key) == '') {
				switch (key) {
					case 'title':
						titleIsRequired = 'Title is required';
						break;
					case 'content':
						contentIsRequired = 'Content is required';
						break;
					case 'categoryIds':
						categoryIsRequired = 'Category is required';
						break;
					default:
						break;
				}
			}
		}
		loading = true; // start spinner animation
		if (action.search === '?/createPost') {
			setButtonVisible([btnCreate, btnUpdate, btnDelete]);
			message = 'saving post...';
		} else if (action.search === '?/deletePost') {
			message = 'deleting post...';
		} else if (action.search === '?/updatePost') {
			message = 'updating post...';
		}

		return async ({ update }) => {
			await update();
			ignoreFormMessage = true;

			if (action.search === '?/createPost') {
				message = $page.status === 200 ? 'Post created' : 'create failed';
			} else if (action.search === '?/deletePost') {
				message = $page.status === 200 ? 'Post deleted' : 'delete failed';
			} else if (action.search === '?/updatePost') {
				message = $page.status === 200 ? 'Post updated' : 'update failed';
			}
			clearMessage();
			invalidateAll();
			setButtonVisible([btnCreate, btnUpdate, btnDelete]);
			clearForm();
			loading = false; // stop spinner animation
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

	onMount(() => {
		boardBlock.classList.toggle('hidden');
		selectedUserId = data.user.id as string;
		adminSelected = data.locals.user.role === 'ADMIN';
	});

	const postsAuthors = () => {
		const arr: {
			id: string;
			title: string;
			content: string;
			published: boolean;
			createdAt: Date;
			updatedAt: Date;
			firstName: string;
			lastName: string;
		}[] = [];

		data.postAuthors.forEach((post) => {
			if (selectedUserId === post.authorId) {
				const { id, title, content, published, createdAt, updatedAt, firstName, lastName, role } =
					post;
				arr.push({
					id,
					title,
					content,
					published,
					createdAt,
					updatedAt,
					firstName: `${firstName}${role === 'ADMIN' ? 'T' : ''}`,
					lastName
				});
			}
		});

		return arr;
	};

	let setSelectedOptions: (arr: number[] | [], nameList: string) => void;

	const toUpdatePost = (postId: string) => {
		const authorPost = data.postAuthors.filter((pa) => pa.id === postId);
		const { id, authorId, published, categoryIds, title, content } = authorPost[0];
		// selectOptions(categoryIds);
		const els = [
			{ id: id },
			{ authorId: authorId },
			{ title: title },
			{ content: content },
			{ categoryIds: categoryIds }
		];

		setButtonVisible([btnUpdate, btnCreate, btnDelete]);
		// NOTE: in TypeScript Playground instead of using nested loops as we use below,
		// the spread operators works, but here does not
		// for (const [k,v] of Object.entries([...els])) { code here }
		els.forEach((el) => {
			for (const [k, v] of Object.entries(el)) {
				(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = `${v}`;
			}
		});
		(document.querySelector(`input[name='published']`) as HTMLInputElement).checked = published;
		const numArr = csvToNumArr(categoryIds);
		setSelectedOptions(numArr, categoryList(numArr));
	};

	const deletePost = (id: string) => {
		// if (browser) {
		(document.querySelector("input[name='id']") as HTMLInputElement).value = id;
		btnDelete.click();
		// }
	};

	$: ({ postAuthors } = data);
	$: formMessage = ignoreFormMessage ? '' : form?.message || '';
	$: result = message || formMessage;

	let snap = {
		id: '',
		authorId: '',
		categoryIds: '',
		title: '',
		content: '',
		published: false
	};
	export const snapshot: Snapshot = {
		capture: () => {
			// console.log('snap.capture');
			return snap;
		},
		restore: (value) => {
			// console.log('snap.restore');
			snap = value;
		}
	};
	let mrPath = getContext('mrPath') as SvelteStore<string>;

	onMount(() => {
		return () => {
			mrPath.set($page.url.pathname);
		};
	});
</script>

<svelte:head>
	<title>Post</title>
</svelte:head>

<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId
	amendTrueFalseUserId={true}
	PageName="Post"
	user={data.locals.user}
	users={data.users}
/>

<div bind:this={boardBlock} class="board hidden">
	<div>
		<form method="POST" action="?/createPost" use:enhance={enhancePost}>
			<input type="hidden" name="id" bind:value={snap.id} />
			<input type="hidden" name="authorId" bind:value={snap.authorId} />
			<input type="hidden" name="categoryIds" bind:value={snap.categoryIds} />
			<input
				type="text"
				name="title"
				bind:value={snap.title}
				placeholder={titleIsRequired || 'enter post title'}
			/>
			<input
				type="text"
				name="content"
				bind:value={snap.content}
				placeholder={contentIsRequired || 'enter post content'}
			/>
			<label for="published" class="label-save">
				<input type="checkbox" name="published" id="published" bind:value={snap.published} />
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
				<button bind:this={btnUpdate} type="submit" formaction="?/updatePost" class="button hidden">
					{#if loading}
						<CircleSpinner color="skyblue" />
					{/if}
					update
				</button>
				<button
					on:click|preventDefault={() => {
						clearForm();
						return false;
					}}>clear</button
				>
			</label>
		</form>
		<div class="multi-select-container">
			<MultiSelectBox
				categories={data.categories}
				bind:categoryIsRequired
				bind:setSelectedOptions
				bind:getSelectedCategoryIDs={selectedCategoryIds}
			/>
		</div>
	</div>
</div>
<di>
	{#key postAuthors}
		{#key selectedUserId}
			<PostList postAuthors={postsAuthors()} {toUpdatePost} {deletePost} />
		{/key}
	{/key}
</di>

<style lang="scss">
	.board {
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
	}

	.button {
		position: relative;
	}
	.hidden {
		display: none;
	}
</style>
