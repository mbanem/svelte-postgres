<script lang="ts">
	import type { Snapshot } from './$types'
	import type { PageData, ActionData } from './$types'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores' // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { Tooltip } from 'flowbite-svelte'
	import { setColor, setButtonVisible } from '$lib/utils'

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte'
	import TodoLists from './TodoLists.svelte'
	import { onMount, tick } from 'svelte'
	import * as utils from '$lib/utils'

	type SelectedUser = {
		id: string
		firstName: string
		lastName: string
		role: string
	}
	type ARGS = {
		data: PageData
		form: ActionData
	}
	let { data, form }: ARGS = $props()
	let { users } = data

	// NOTE: When the page updates uTodos = $state<UTodos>() is not refreshed but data.uTodos are refreshed.
	// In order to have uTodos refreshed we need two steps: let uTodos = $state<UTodos>() like a definition
	// and $effect that get uTodos from refreshed data prop
	let uTodos = $state<UTodos>()
	$effect(() => {
		uTodos = data.uTodos
	})
	let selectedUserId = $state<string>(data.locals.user.id)
	let loading = $state<boolean>(false)
	// form?.message cannot be cleared by code but could be ignored when necessary
	let ignoreFormMessage = false
	let titleIsRequired = ''
	let contentIsRequired = ''
	let updatePrepared = false
	let btnCreate: HTMLButtonElement
	let btnUpdate: HTMLButtonElement
	let btnDelete: HTMLButtonElement
	let theForm: HTMLFormElement

	$effect(() => {
		setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
	})

	let snap = $state<TodoFormData>({
		id: '',
		authorId: '',
		title: '',
		content: '',
		priority: 0
	})

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			ignoreFormMessage = false
			result = ''
		}, 2000)
		setButtonVisible([btnCreate, btnUpdate])
	}

	// if form is filled with  data for update, but user chose other action, we
	// clear the form input elements
	const clearForm = async () => {
		setButtonVisible([btnCreate, btnUpdate])
		;(document.querySelector("input[name='title']") as HTMLInputElement).value = ''
		;(document.querySelector("input[name='content']") as HTMLInputElement).value = ''
		;(document.querySelector("input[type='number']") as HTMLInputElement).value = '0'
		titleIsRequired = contentIsRequired = ''
		setColor('lightgreen')

		await tick()
		setColor('lightgreen')
	}

	// on update todo we do not load todos again but we have to change
	// uTodos list with the updated todo
	const updateTodos = (formData: FormData) => {
		if (uTodos) {
			uTodos = uTodos.map((t) => {
				if (t.todoId === formData.get('id')) {
					t.title = formData.get('title') as string
					t.content = formData.get('content') as string
					t.priority = Number(formData.get('priority'))
				}
				return t
			}) as UTodos
		}
	}

	// get params action for URL and formData to check on required fields
	const enhanceTodo: SubmitFunction = async ({ action, formData }) => {
		console.log('action.search')
		titleIsRequired = ''
		contentIsRequired = ''
		ignoreFormMessage = false

		if (action.search !== '?/deleteTodo') {
			if (formData.get('title') === '') {
				titleIsRequired = 'Title is required field'
			}
			if (formData.get('content') === '') {
				contentIsRequired = 'Content is required field'
			}

			if (titleIsRequired || contentIsRequired) return
		}

		// turn on spinner before form submit
		loading = true
		// show the intent of the action that follows
		result =
			action.search === '?/addTodo'
				? 'creating todo...'
				: action.search === '?/updateTodo'
					? 'updating todo...'
					: 'deleting todo...'

		return async ({ update }) => {
			await update()
			if (action.search === '?/addTodo') {
				result = $page.status === 200 ? 'todo created' : 'create failed'
			} else if (action.search === '?/updateTodo') {
				result = $page.status === 200 ? 'todo updated' : 'update failed'
				// updateTodos(formData)
			} else if (action.search === '?/deleteTodo') {
				result = $page.status === 200 ? 'todo deleted' : 'delete failed'
				// updateTodos(formData)
			}
			await invalidateAll()
			loading = false // turn the spinner off
			ignoreFormMessage = true
			setButtonVisible([btnCreate, btnUpdate])
			clearMessage()
		}
	}

	const toggleCompleted = async (id: string) => {
		loading = true
		const completed = (uTodos?.filter((uTodo) => uTodo.todoId === id)[0] as UTodo).completed
		const currentState = completed ? 'completed' : 'active'
		const newState = completed ? 'active' : 'completed'
		result = `toggling ${currentState} into ${newState}...`
		// if form fields are prepared for update but user
		// select different action we clear the form fields
		clearForm()
		// instead of easier action in +page.server.ts we demonstrate
		// here endpoint HTML remote communication via fetch
		const response = await fetch(`/todo?id=${id}`, {
			method: 'PATCH',
			body: id
		})
		const data = await response.json()
		await utils.sleep(2000)
		loading = false
		result = `toggled into ${newState}`
		// setting message will dynamically set result, which in turn will show message
		// for several seconds and then clear it out

		if (data.toggled) {
			uTodos = (uTodos as UTodos).map((todo) => {
				if (todo.todoId === id) {
					todo.completed = !todo.completed
				}
				invalidateAll()
				setTimeout(() => {
					result = ''
				}, 2000)
				return todo
			})
		}
	}

	const deleteTodo = async (id: string) => {
		console.log('deleteTodo', id)
		// snap.id = id
		todoIdEl.value = id
		btnDelete.click()
		// loading = true
		// result = 'deleting todo...'
		// clearForm()
		// const response = await fetch(`/todo?id=${id}`, {
		// 	method: 'DELETE',
		// 	body: id
		// })
		// result = await response.json()
		// loading = false
		// // setting result will dynamically set result, which in turn will show result
		// // for several seconds and then clear it out
		// result = form?.success ? 'deleted successfully' : 'delete failed'
		// if (form?.success) {
		// 	uTodos = uTodos.filter((uTodo: UTodo) => uTodo.todoId !== id)
		// }
	}

	let todoIdEl: HTMLInputElement
	const prepareDataForEdit = (todoId: string) => {
		const uTodo = data.uTodos.filter((uTodo) => uTodo.todoId === todoId)[0] as UTodo
		// prevent ADMIN to update others todos
		selectedUserId = uTodo.id as string
		snap.id = uTodo.todoId
		snap.authorId = uTodo.id
		snap.title = uTodo.title
		snap.content = uTodo.content
		snap.priority = Number(uTodo.priority)
		// todoIdEl.value = uTodo.todoId as string;
		// (document.querySelector("input[name='userId']") as HTMLInputElement).value = uTodo.id as string;
		// (document.querySelector("input[name='title']") as HTMLInputElement).value =
		// 	uTodo.title as string;
		// (document.querySelector("input[name='content']") as HTMLInputElement).value =
		// 	uTodo.content as string;
		// (document.querySelector("input[name='priority']") as HTMLInputElement).value = String(
		// 	uTodo.priority
		// );
		setButtonVisible([btnUpdate, btnCreate])
	}

	// updatePrepared say data is copied into the form elements
	// and should be cleared if action other than click on the
	// update button is taken

	const prepareUpdate = async (todoId: string) => {
		console.log('prepareUpdate', todoId)
		prepareDataForEdit(todoId)
		updatePrepared = true
		// hide create button and show the update one
		setButtonVisible([btnUpdate, btnCreate])
	}

	let formMessage = ignoreFormMessage ? '' : form?.message || ''
	let result = $state<string>(formMessage)
	// setting result will call showMessage and this one will setTimeout
	// to clear the message after several seconds
	// let result = $derived(message || formMessage)

	let authorId = $state<string>(data.locals.user.id)

	export const snapshot: Snapshot<TodoFormData> = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			snap = value
		}
	}

	const tooltipMouseWheel = () => {
		console.log('tooltipMouseWheel')
		document.querySelector('.tooltip-mouse-wheel')?.classList.toggle('hidden')
		setTimeout(() => {
			document.querySelector('.tooltip-mouse-wheel')?.classList.toggle('hidden')
		}, 1500)
	}
	// const todoUserToSnap = (tUser: UTodo, snap: TodoFormData) => {
	// 	snap.id = tUser.todoId;
	// 	snap.authorId = tUser.id;
	// 	snap.title = tUser.title;
	// 	snap.content = tUser.content;
	// 	snap.priority = Number(tUser.priority);
	// };
	onMount(() => {
		if (selectedUserId !== data.locals.user.id) {
			console.log('ids do not match')
			return
		}
		const tUser = utils.selectRecordItems<UTodo>('id', selectedUserId, data.uTodos)
		snap.authorId = selectedUserId
		authorId = selectedUserId
		setButtonVisible([btnCreate, btnUpdate])
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<!-- scroll to  onmouseenter={tooltipMouseWheel} where tooltip is activated-->
<div class="tooltip-mouse-wheel hidden">focus & use mouse wheel</div>
<svelte:head>
	<title>Todo</title>
</svelte:head>
<PageTitleCombo
	PageName="Todo"
	bind:result
	bind:ignoreFormMessage
	bind:selectedUserId
	amendTrueFalseUserId={false}
	user={data.locals.user}
	users={data.users}
/>

<div class="board">
	<form bind:this={theForm} method="POST" action="?/addTodo" use:enhance={enhanceTodo}>
		<div class="two-inputs">
			<input bind:this={todoIdEl} type="hidden" name="id" bind:value={snap.id} />
			<input type="hidden" name="userId" bind:value={snap.authorId} />
			<input
				type="text"
				name="title"
				placeholder={titleIsRequired || 'enter todo title'}
				bind:value={snap.title}
			/>

			<input
				onmouseenter={tooltipMouseWheel}
				type="number"
				name="priority"
				placeholder="Priority"
				bind:value={snap.priority}
			/>
		</div>
		<div class="two-inputs">
			<input
				type="text"
				name="content"
				placeholder={contentIsRequired || 'enter todo content'}
				bind:value={snap.content}
			/>
			<!-- position:relative here is essential for CircleSpinner
					to stay inside the buttons
			-->
			<div class="buttons-relative">
				<button bind:this={btnCreate} type="submit">
					{#if loading}
						<CircleSpinner color="skyblue" top="50%" />
					{/if}
					create
				</button>
				<button
					bind:this={btnUpdate}
					disabled={selectedUserId !== authorId}
					style:cursor={selectedUserId === authorId ? 'pointer' : 'not-allowed'}
					formaction="?/updateTodo"
					type="submit"
					class="hidden"
				>
					update
				</button>
				{#if selectedUserId !== authorId}
					<Tooltip
						placement="top"
						defaultClass="tooltip-update-false"
						class="master-todo"
						arrow={false}
					>
						<p>owner only permission</p>
					</Tooltip>
				{/if}
				{#if loading}
					<CircleSpinner color="skyblue" top="50%" />
				{/if}
				<button bind:this={btnDelete} type="submit" formaction="?/deleteTodo" class="button hidden"
				></button>
				{#if selectedUserId !== authorId}
					<Tooltip
						placement="top"
						defaultClass="tooltip-update-button"
						class="master-todo"
						arrow={false}
					>
						<p>owner only permission</p>
					</Tooltip>
				{/if}
				<button onclick={clearForm}>clear form</button>
			</div>
		</div>
	</form>
	<div class="two-columns">
		<TodoLists
			id={data.locals.user.id}
			role={data.locals.user.role}
			uTodosProp={data.uTodos}
			bind:selectedUserId
			{toggleCompleted}
			{prepareUpdate}
			{deleteTodo}
		></TodoLists>
	</div>
</div>

<style lang="scss">
	:global(.tooltip-update-button),
	:global(.tooltip-update-false) {
		position: absolute;
		left: 8rem !important;
		top: 1.1rem !important;
		width: 11rem !important;
		color: yellow !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border: 1px solid gray;
		border-radius: 6px;
	}
	:global(.tooltip-update-false) {
		color: pink !important;
		border-color: pink;
	}
	.tooltip-mouse-wheel {
		position: fixed;
		width: 12rem;
		text-align: center;
		color: lightgreen;
		background-color: #3e3e3e;
		border: 1px solid lightgreen;
		border-radius: 5px;
		top: 4.3rem;
		left: 35rem;
		cursor: progress;
	}
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 1em;
		min-width: 36em;
		width: 62vw;
		padding: 1rem;
		border: 1px solid gray;
		border-radius: 8px;
		margin-left: 1rem;

		.left-column,
		.right-column {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
		}
		.two-columns {
			grid-column: span 2;
		}

		:nth-child(1) {
			grid-column: span 2;
			display: flex;
			flex-direction: column;
			margin: 0;
			.two-inputs {
				display: flex;
				display: inline-block;
				font-size: 1.1em;
				grid-column: 1/3;
				width: calc(100% - 5rem);
				padding-left: 1rem;
			}
		}
	}
	button {
		margin-top: 1rem !important;
	}
	.buttons-relative {
		position: relative;
		display: flex;
		gap: 1rem;
	}
	h3 {
		display: block;
		font-weight: 200;
		margin-left: 1rem;
		border-bottom: 1px solid gray;
	}
	.hidden {
		display: none;
	}
</style>
