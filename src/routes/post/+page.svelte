<<<<<<< HEAD
<script lang="ts">
	// @ts-check
	import type { Snapshot } from '../$types' // .sveltekit/$types
	import type { PageData, ActionData } from './$types'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores' // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { onMount } from 'svelte'
	import * as utils from '$utils'

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte'
	// categories
	import MultiSelectBox from '$lib/components/MultiSelectBox.svelte'
	import PostList from '$lib/components/PostList.svelte'

	type ARGS = {
		data: PageData
		form: ActionData
	}
	let { data, form }: ARGS = $props()

	let { postAuthors } = data
	let message = ''
	let loading = $state<boolean>(false)
	let ignoreFormMessage = $state<boolean>(false)
	const requiredCategory = 'Please select corresponding categories'
	let selectedUserId = $state<string>('')
	let titleIsRequired = ''
	let contentIsRequired = ''
	let categoryIsRequired = requiredCategory

	let btnCreate: HTMLButtonElement
	let btnDelete: HTMLButtonElement
	let btnUpdate: HTMLButtonElement
	const authorId = data?.user?.id

	let categoryIds: number[] = []
	let multiSelectComponent: MultiSelectBox
	$effect(() => {
		utils.setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
	})

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = ''
			ignoreFormMessage = false
			result = ''
			categoryIsRequired = requiredCategory
		}, 2000)
	}

	const clearForm = (event?: MouseEvent) => {
		event?.preventDefault()
		utils.shallowCopy(initialSnap, snap)
		snap.authorId = data.locals.user.id
		// const els = ['id', 'title', 'content', 'categoryIds'];
		// els.forEach((k) => {
		// 	(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = '';
		// });
		// (document.querySelector(`input[name='published']`) as HTMLInputElement).checked = false;
		multiSelectComponent.setSelectedOptions([], requiredCategory)
		utils.setColor('lightgreen')
	}

	const required = {
		title: '',
		content: '',
		categoryIds: ''
	}

	const categoryList = (arr: number[]) => {
		// @ts-expect-error
		return arr.map((n) => data.categories[n - 1].name).join(', ')
	}

	let selectedCategoryIds: () => string

	/*
		After processing the request (for example, logging the user in by setting a cookie),
		the action can respond with data that will be available through the form property on
		the corresponding page and through $page.form app-wide until the next update.
	*/
	const enhancePost: SubmitFunction = ({ action, formData, cancel }) => {
		console.log('enhancePost', action.search, formData.get('id'))
		if (action.search === '?/clearForm') {
			return cancel()
		}
		if (action.search !== '?/deletePost' && !snap.categoryIds) {
			categoryIsRequired = requiredCategory
			message = 'Please select corresponding categories'
			utils.setColor('pink')
			return
		}
		result = ''
		titleIsRequired = ''
		ignoreFormMessage = false
		contentIsRequired = ''
		console.log('enhancePost1', action.search)
		for (const key of Object.keys(required)) {
			if (formData.get(key) == '') {
				switch (key) {
					case 'title':
						titleIsRequired = 'Title is required'
						break
					case 'content':
						contentIsRequired = 'Content is required'
						break
					case 'categoryIds':
						categoryIsRequired = 'Category is required'
						break
					default:
						break
				}
			}
		}
		loading = true // start spinner animation
		if (action.search === '?/createPost') {
			utils.setButtonVisible([btnCreate, btnUpdate, btnDelete])
			result = 'creating post...'
		} else if (action.search === '?/deletePost') {
			result = 'deleting post...'
		} else if (action.search === '?/updatePost') {
			result = 'updating post...'
		}
		console.log('enhancePost2 result', result)
		return async ({ update }) => {
			await update()
			ignoreFormMessage = true
			console.log('enhancePost after action', action.search, $page.status)
			if (action.search === '?/createPost') {
				result = $page.status === 200 ? 'post created' : 'create failed'
			} else if (action.search === '?/deletePost') {
				result = $page.status === 200 ? 'post deleted' : 'delete failed'
			} else if (action.search === '?/updatePost') {
				result = $page.status === 200 ? 'post updated' : 'update failed'
			}
			utils.setButtonVisible([btnCreate, btnUpdate, btnDelete])
			invalidateAll()
			clearForm()
			loading = false // stop spinner animation
			utils.setColor('lightgreen')
			clearMessage()
		}
	}

	let boardBlock: HTMLDivElement
	let adminSelected: boolean
	const userSelected = () => {
		// if no admin is selected hide boardBlock if not hidden already
		if (boardBlock.classList.contains('hidden')) {
			if (adminSelected) {
				boardBlock.classList.toggle('hidden')
			}
		} else {
			if (!adminSelected) {
				boardBlock.classList.toggle('hidden')
			}
		}
	}

	onMount(() => {
		// if (data.postAuthors[0]) {
		// 	utils.shallowCopy(data.postAuthors[0], snap);
		// }
		snap.authorId = authorId as string
		boardBlock.classList.toggle('hidden')
		selectedUserId = data.user.id as string
		adminSelected = data.locals.user.role === 'ADMIN'
	})

	const postsAuthors = () => {
		const arr: PAuthor[] = []

		data.postAuthors.forEach((post) => {
			if (selectedUserId === post.authorId) {
				const {
					id,
					title,
					content,
					published,
					createdAt,
					updatedAt,
					firstName,
					lastName,
					role,
					author
				} = post
				arr.push({
					id,
					title,
					content,
					published,
					createdAt,
					updatedAt,
					firstName: `${firstName}${role === 'ADMIN' ? 'T' : ''}`,
					lastName,
					author
				})
			}
		})
		return arr
	}

	let setSelectedOptions: (arr: number[] | [], nameList: string) => void

	const toUpdatePost = (postId: string) => {
		const authorPost = data.postAuthors.filter((pa) => pa.id === postId)[0] as PostAuthor
		utils.shallowCopy(authorPost, snap)
		const { title, content, published, categoryIds } = authorPost //as PostAuthor
		// selectOptions(categoryIds);
		const els = [
			// { published: published },
			{ title },
			{ content },
			{ categoryIds }
		]

		utils.setButtonVisible([btnUpdate, btnCreate, btnDelete])
		// NOTE: in TypeScript Playground instead of using nested loops as we use below,
		// the spread operators works, but here does not
		// for (const [k,v] of Object.entries([...els])) { code here }
		els.forEach((el) => {
			for (const [k, v] of Object.entries(el)) {
				;(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = `${v}`
			}
		})
		;(document.querySelector(`input[name='published']`) as HTMLInputElement).checked = published
		const numArr = utils.csvToNumArr(categoryIds)
		multiSelectComponent.setSelectedOptions(numArr, categoryList(numArr))
	}

	const deletePost = (id: string) => {
		// if (browser) {
		;(document.querySelector("input[name='id']") as HTMLInputElement).value = id
		btnDelete.click()
		// }
	}

	// let formMessage = ignoreFormMessage ? '' : form?.message || ''
	let result = $state<string>(message || (form?.message as string))
	let wrongUser = $derived(selectedUserId !== data.locals.user.id)

	type TSnap = {
		id: string
		authorId: string
		categoryIds: string
		title: string
		content: string
		published: boolean
	}
	const initialSnap: TSnap = {
		id: '',
		authorId: '',
		categoryIds: '',
		title: '',
		content: '',
		published: false
	}
	// NOTE: without $state for snap, whose properties are bound to form input elements
	// we could not get data to create post action in +page.server.ts
	let snap = $state<TSnap>({
		id: '',
		authorId: '',
		categoryIds: '',
		title: '',
		content: '',
		published: false
	})
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			snap = value
		}
	}

	onMount(() => {
		utils.shallowCopy(initialSnap, snap)
		snap.authorId = data.locals.user.id
		multiSelectComponent.setSelectedOptions([], categoryIsRequired)
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Post</title>
</svelte:head>
<!-- <pre style="font-size:13px;">categoryIds {JSON.stringify(snap, null, 2)}</pre> -->
<!-- amendTrueFalseUserId = {true} forced selectBox value userId to be prefixed with T=ADMIN, F=USER -->
<PageTitleCombo
	PageName="Post"
	bind:result
	bind:ignoreFormMessage
	bind:selectedUserId
	amendTrueFalseUserId={true}
	user={data.locals.user}
	users={data.users}
/>

<div bind:this={boardBlock} class="board hidden">
	<div style="position:relative;">
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
				<input type="checkbox" name="published" id="published" bind:checked={snap.published} />
				<span style="user-select:none">published</span>
				{#if !wrongUser}
					<button bind:this={btnCreate} type="submit" class="button">
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						create
					</button>
					<button
						bind:this={btnDelete}
						type="submit"
						formaction="?/deletePost"
						class="button hidden">delete</button
					>
					<button
						bind:this={btnUpdate}
						type="submit"
						formaction="?/updatePost"
						class="button hidden"
					>
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						update
					</button>
				{/if}
				<button
					formaction="?/clearForm"
					onclick={() => {
						clearForm()
						return false
					}}
				>
					clear
				</button>
			</label>
		</form>
		<div class="multi-select-container">
			<MultiSelectBox
				categories={data.categories}
				bind:categoryIsRequired
				bind:this={multiSelectComponent}
				bind:selectedCategoryIds={snap.categoryIds}
			/>
		</div>
	</div>

	<div>
		{#key postAuthors}
			{#key selectedUserId}
				<PostList postAuthors={postsAuthors()} {toUpdatePost} {deletePost} />
			{/key}
		{/key}
	</div>
</div>

<style lang="scss">
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-width: 60rem;
		width: 80vw;
		gap: 2px;
		padding: 0 1rem 1rem 1rem;
		margin-left: 1rem;
		form {
			width: calc(40vw - 1rem);
		}
	}
	.label-save {
		display: flex;
		align-items: baseline;
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
	/* move the clear button out of the form to avoid submit action but
		set it adjacent to create/update button using the absolute position
	*/
</style>
=======
<script lang="ts">
	// @ts-check
	import type { Snapshot } from '../$types' // .sveltekit/$types
	import type { PageData, ActionData } from './$types'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores' // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { onMount } from 'svelte'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$utils'

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte'
	// categories
	import MultiSelectBox from '$lib/components/MultiSelectBox.svelte'
	import PostList from '$lib/components/PostList.svelte'

	type ARGS = {
		data: PageData
		form: ActionData
	}
	let { data, form }: ARGS = $props()

	let { postAuthors } = data
	let message = ''
	let loading = $state<boolean>(false)
	let ignoreFormMessage = $state<boolean>(false)
	const requiredCategory = 'Please select corresponding categories'
	let selectedUserId = $state<string>('')
	let titleIsRequired = ''
	let contentIsRequired = ''
	let categoryIsRequired = requiredCategory

	let btnCreate: HTMLButtonElement
	let btnDelete: HTMLButtonElement
	let btnUpdate: HTMLButtonElement
	const authorId = data?.user?.id

	let categoryIds: number[] = []
	let multiSelectComponent: MultiSelectBox
	$effect(() => {
		utils.setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
	})

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = ''
			ignoreFormMessage = false
			result = ''
			categoryIsRequired = requiredCategory
		}, 2000)
	}

	const clearForm = (event?: MouseEvent) => {
		event?.preventDefault()
		utils.shallowCopy(initialSnap, snap)
		snap.authorId = data.locals.user.id
		// const els = ['id', 'title', 'content', 'categoryIds'];
		// els.forEach((k) => {
		// 	(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = '';
		// });
		// (document.querySelector(`input[name='published']`) as HTMLInputElement).checked = false;
		multiSelectComponent.setSelectedOptions([], requiredCategory)
		utils.setColor('lightgreen')
	}

	const required = {
		title: '',
		content: '',
		categoryIds: ''
	}

	const categoryList = (arr: number[]) => {
		// @ts-expect-error
		return arr.map((n) => data.categories[n - 1].name).join(', ')
	}
	let selectedCategoryIds: () => string

	/*
		After processing the request (for example, logging the user in by setting a cookie),
		the action can respond with data that will be available through the form property on
		the corresponding page and through $page.form app-wide until the next update.
	*/
	const enhancePost: SubmitFunction = ({ action, formData, cancel }) => {
		console.log('enhancePost', action.search, formData.get('id'))
		if (action.search === '?/clearForm') {
			return cancel()
		}
		if (action.search !== '?/deletePost' && !snap.categoryIds) {
			categoryIsRequired = requiredCategory
			message = 'Please select corresponding categories'
			utils.setColor('pink')
			return
		}
		result = ''
		titleIsRequired = ''
		ignoreFormMessage = false
		contentIsRequired = ''
		// console.log('enhancePost1', action.search)
		for (const key of Object.keys(required)) {
			if (formData.get(key) == '') {
				switch (key) {
					case 'title':
						titleIsRequired = 'Title is required'
						break
					case 'content':
						contentIsRequired = 'Content is required'
						break
					case 'categoryIds':
						categoryIsRequired = 'Category is required'
						break
					default:
						break
				}
			}
		}
		loading = true // start spinner animation
		if (action.search === '?/createPost') {
			utils.setButtonVisible([btnCreate, btnUpdate, btnDelete])
			result = 'creating post...'
		} else if (action.search === '?/deletePost') {
			result = 'deleting post...'
		} else if (action.search === '?/updatePost') {
			result = 'updating post...'
		}
		// console.log('enhancePost2 result', result)
		return async ({ update }) => {
			await update()
			ignoreFormMessage = true
			console.log('enhancePost after action', action.search, $page.status)
			if (action.search === '?/createPost') {
				result = $page.status === 200 ? 'post created' : 'create failed'
			} else if (action.search === '?/deletePost') {
				result = $page.status === 200 ? 'post deleted' : 'delete failed'
			} else if (action.search === '?/updatePost') {
				result = $page.status === 200 ? 'post updated' : 'update failed'
			}
			utils.setButtonVisible([btnCreate, btnUpdate, btnDelete])
			invalidateAll()
			clearForm()
			loading = false // stop spinner animation
			utils.setColor('lightgreen')
			clearMessage()
		}
	}

	let boardBlock: HTMLDivElement
	let adminSelected: boolean
	const userSelected = () => {
		// if no admin is selected hide boardBlock if not hidden already
		if (boardBlock.classList.contains('hidden')) {
			if (adminSelected) {
				boardBlock.classList.toggle('hidden')
			}
		} else {
			if (!adminSelected) {
				boardBlock.classList.toggle('hidden')
			}
		}
	}

	const postsAuthors = () => {
		const arr: PAuthor[] = []

		data.postAuthors.forEach((post) => {
			if (selectedUserId === post.authorId) {
				const {
					id,
					title,
					content,
					published,
					createdAt,
					updatedAt,
					firstName,
					lastName,
					role,
					author,
					authorId,
					categoryNames
				} = post
				arr.push({
					id,
					title,
					content,
					published,
					createdAt,
					updatedAt,
					firstName: `${firstName}${role === 'ADMIN' ? 'T' : ''}`,
					lastName,
					author,
					authorId,
					categoryNames
				})
			}
		})
		return arr
	}

	let setSelectedOptions: (arr: number[] | [], nameList: string) => void

	const toUpdatePost = (event: MouseEvent | KeyboardEvent, postId: string) => {
		event.preventDefault()
		const authorPost = data.postAuthors.filter((pa) => pa.id === postId)[0] as PostAuthor
		utils.shallowCopy(authorPost, snap)
		const { title, content, published, categoryIds } = authorPost //as PostAuthor
		// selectOptions(categoryIds);
		const els = [
			// { published: published },
			{ title },
			{ content },
			{ categoryIds }
		]

		utils.setButtonVisible([btnUpdate, btnCreate, btnDelete])
		// NOTE: in TypeScript Playground instead of using nested loops as we use below,
		// the spread operators works, but here does not
		// for (const [k,v] of Object.entries([...els])) { code here }
		els.forEach((el) => {
			for (const [k, v] of Object.entries(el)) {
				;(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = `${v}`
			}
		})
		;(document.querySelector(`input[name='published']`) as HTMLInputElement).checked = published
		const numArr = utils.csvToNumArr(categoryIds)
		multiSelectComponent.setSelectedOptions(numArr, categoryList(numArr))
	}

	const deletePost = (event: MouseEvent | KeyboardEvent, id: string) => {
		event.preventDefault()
		// if (browser) {
		;(document.querySelector("input[name='id']") as HTMLInputElement).value = id
		btnDelete.click()
		// }
	}

	// let formMessage = ignoreFormMessage ? '' : form?.message || ''
	let result = $state<string>(message || (form?.message as string))
	let wrongUser = $derived(selectedUserId !== data.locals.user.id)

	type TSnap = {
		id: string
		authorId: string
		categoryIds: string
		title: string
		content: string
		published: boolean
	}
	const initialSnap: TSnap = {
		id: '',
		authorId: '',
		categoryIds: '',
		title: '',
		content: '',
		published: false
	}
	// NOTE: without $state for snap, whose properties are bound to form input elements
	// we could not get data to create post action in +page.server.ts
	let snap = $state<TSnap>({
		id: '',
		authorId: '',
		categoryIds: '',
		title: '',
		content: '',
		published: false
	})
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			snap = value
		}
	}

	onMount(() => {
		// if (data.postAuthors[0]) {
		// 	utils.shallowCopy(data.postAuthors[0], snap);
		// }
		snap.authorId = authorId as string
		boardBlock.classList.toggle('hidden')
		selectedUserId = data.user.id as string
		adminSelected = data.locals.user.role === 'ADMIN'
		utils.shallowCopy(initialSnap, snap)
		snap.authorId = data.locals.user.id
		multiSelectComponent.setSelectedOptions([], categoryIsRequired)
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Post</title>
</svelte:head>

<!-- <pre style="font-size:13px;">data {JSON.stringify(data, null, 2)}</pre> -->
<!-- amendTrueFalseUserId = {true} forced selectBox value userId to be prefixed with T=ADMIN, F=USER -->
<PageTitleCombo
	PageName="Post"
	bind:result
	bind:ignoreFormMessage
	bind:selectedUserId
	amendTrueFalseUserId={true}
	user={data.locals.user}
	users={data.users}
/>
{#snippet tooltip(title: string)}
	<!-- NOTE the way to toggle string content based on a predicate -->
	<Tooltip placement="top" defaultClass={`tooltip_default-update`} arrow={false}>
		{title}
	</Tooltip>
{/snippet}

{#snippet toggle_published(title: string)}
	<div class="tooltip-wrapper">
		<button class="ok-hover">
			<input type="checkbox" name="published" id="published" bind:checked={snap.published} />
			{@render tooltip(title)}
		</button>
	</div>
{/snippet}
<div bind:this={boardBlock} class="board hidden">
	<div style="position:relative;">
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
			<div class="multi-select-container">
				<MultiSelectBox
					categories={data.categories}
					bind:categoryIsRequired
					bind:this={multiSelectComponent}
					bind:selectedCategoryIds={snap.categoryIds}
				/>
			</div>
			<label for="published" class="label-save">
				{@render toggle_published('Toggle the Published Flag')}
				<span style="user-select:none">published</span>
				{#if !wrongUser}
					<button bind:this={btnCreate} type="submit">
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						create
					</button>
					<button bind:this={btnDelete} type="submit" formaction="?/deletePost" class="hidden"
						>delete</button
					>
					<button
						bind:this={btnUpdate}
						type="submit"
						formaction="?/updatePost"
						class="button hidden"
					>
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						update
					</button>
				{/if}
				<button
					formaction="?/clearForm"
					onclick={() => {
						clearForm()
						return false
					}}
				>
					clear
				</button>
			</label>
		</form>
	</div>

	<div>
		{#key postAuthors}
			{#key selectedUserId}
				<PostList postAuthors={postsAuthors()} {toUpdatePost} {deletePost} {selectedUserId} />
			{/key}
		{/key}
	</div>
</div>

<style lang="scss">
	.tooltip-wrapper {
		position: relative;
		p {
			display: flex;
			justify-content: space-between;
			align-content: flex-start;
			gap: 0.5rem;
			padding: 0 0 0 5px;
			margin: 0;
		}
		&:hover {
			cursor: pointer;
		}
	}
	:global(.tooltip_default) {
		position: absolute;
		left: 12rem !important;
		top: -4rem !important;
		display: grid;
		grid-template-columns: 6rem max-content;
		justify-content: flex-start;
		width: 15rem !important;
		color: skyblue !important;
		font-size: 14px;
		line-height: 14px;
		font-weight: 400;
		padding: 3px 1rem !important;
		text-align: center;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border: 1px solid gray;
		border-radius: 8px;
		z-index: 6;
		p:nth-child(even) {
			color: yellow;
		}
	}
	:global(.tooltip_default-update) {
		position: absolute;
		// top: -2rem !important;
		left: -2rem !important;
		width: max-content !important;
		color: lightblue !important;
		border: 1px solid lightblue;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border-radius: 6px;
		padding: 3px 1rem;
		text-align: center;
		z-index: 6;
		p {
			padding: 0 1rem !important;
		}
	}
	.ok-hover {
		border: none; //1px solid transparent;
		outline: none;
		padding: 0;
		font-size: 14px;
		color: lightblue;
	}
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-width: 60rem;
		width: 80vw;
		gap: 2px;
		padding: 0 1rem 1rem 1rem;
		margin-left: 1rem;
		form {
			width: calc(40vw - 1rem);
		}
	}
	.label-save {
		display: flex;
		align-items: baseline;
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
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
