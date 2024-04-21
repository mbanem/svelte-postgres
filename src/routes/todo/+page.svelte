<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores'; // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { setColor, setButtonVisible } from '$lib/utils';

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';
	import TodoList from '$lib/components/TodoList.svelte';

	export let data: PageData; // from +page.server.ts load function
	export let form: ActionData; // form?.messages from action methods in +page.server.ts

	let loading: boolean;
	let message = '';
	// form?.message cannot be cleared by code but could be ignored when necessary
	let ignoreFormMessage = false;

	$: setColor(form?.message ? (form.message.includes('successfully') ? 'green' : 'red') : 'green');

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			ignoreFormMessage = false;
			result = '';
		}, 2000);
		setButtonVisible([btnCreate, btnUpdate]);
	};

	// if form is filled with  data for update, but user chose other action, we
	// clear the form input elements
	const clearForm = () => {
		setButtonVisible([btnCreate, btnUpdate]);
		(document.querySelector("input[name='title']") as HTMLInputElement).value = '';
		(document.querySelector("input[name='content']") as HTMLInputElement).value = '';
	};
	let titleIsRequired = '';
	let contentIsRequired = '';
	// get params action for URL amf formData to check on required fields
	const enhanceTodo: SubmitFunction = ({ action, formData }) => {
		titleIsRequired = '';
		contentIsRequired = '';
		ignoreFormMessage = false;
		if (formData.get('title') === '') {
			titleIsRequired = 'Title is required field';
		}
		if (formData.get('content') === '') {
			contentIsRequired = 'Content is required field';
		}

		if (titleIsRequired || contentIsRequired) return;

		// turn on spinner before form submit
		loading = true;
		// show the intent of the action that follows
		message = action.search === '?/addTodo' ? 'created todo...' : 'updating todo...';

		return async ({ update }) => {
			await update();
			if (action.search === '?/addTodo') {
				message = $page.status === 200 ? 'todo created' : 'create failed';
			} else if (action.search === '?/updateTodo') {
				message = $page.status === 200 ? 'todo updated' : 'update failed';
			}
			invalidateAll();
			ignoreFormMessage = true;
			loading = false; // turn the spinner off
			setButtonVisible([btnCreate, btnUpdate]);
		};
	};

	const toggleCompleted = async (id: string) => {
		loading = true;
		// if form fields are prepared for update but user
		// select different action we clear the form fields
		clearForm();
		// instead of easier action in +page.server.ts we demonstrate
		// here endpoint HTML remote communication via fetch
		const response = await fetch(`/todo?id=${id}`, {
			method: 'PATCH',
			body: id
		});
		const data = await response.json();
		loading = false;
		// setting message will dynamically set result, which in turn will show message
		// for several seconds and then clear it out
		message = data.toggled ? 'toggled successfully' : data.message ?? 'toggle failed';

		if (data.toggled) {
			todos = todos.map((todo) => {
				if (todo.id === id) {
					todo.completed = !todo.completed;
				}
				return todo;
			});
		}
	};

	const deleteTodo = async (id: string) => {
		loading = true;
		clearForm();
		const response = await fetch(`/todo?id=${id}`, {
			method: 'DELETE',
			body: id
		});
		const result = await response.json();
		loading = false;
		// setting message will dynamically set result, which in turn will show message
		// for several seconds and then clear it out
		message = result.deleted ? 'deleted successfully' : 'delete failed';
		if (result.deleted) {
			todos = todos.filter((todo: Todo) => todo.id !== id);
		}
	};

	let todoIdEl: HTMLInputElement;
	const prepareDataForEdit = (todoId: string) => {
		const todo = data.todos.filter((todo) => todo.id === todoId)[0] as Partial<Todo>;
		// prevent ADMIN to update others todos
		selectedUserId = todo.userId as string;
		todoIdEl.value = todo.id as string;
		(document.querySelector("input[name='userId']") as HTMLInputElement).value =
			todo.userId as string;
		(document.querySelector("input[name='title']") as HTMLInputElement).value =
			todo.title as string;
		(document.querySelector("input[name='content']") as HTMLInputElement).value =
			todo.content as string;
		(document.querySelector("input[name='priority']") as HTMLInputElement).value = String(
			todo.priority
		);
		setButtonVisible([btnCreate, btnUpdate]);
	};

	// updatePrepared say data is copied into the form elements
	// and should be cleared if action other than click on the
	// update button is taken
	let updatePrepared = false;
	let btnCreate: HTMLButtonElement;
	let btnUpdate: HTMLButtonElement;
	let theForm: HTMLFormElement;
	const prepareUpdate = async (todoId: string) => {
		prepareDataForEdit(todoId);
		updatePrepared = true;
	};

	$: formMessage = ignoreFormMessage ? '' : form?.message ?? '';
	// setting result will call showMessage and this one will setTimeout
	// to clear the message after several seconds
	$: result = message || formMessage;
	$: ({ todos, user } = data);

	let selectedUserId = '';
	const authorId = data?.user?.id;
</script>

<!-- <pre style="font-size:11px;">authorId {authorId}</pre> -->
<!-- <pre style="font-size:11px;">form.message {JSON.stringify(form?.message, null, 2)}</pre> -->

<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId
	PageName="Todo"
	user={data.user}
	users={data.users}
/>
<div class="board">
	<form bind:this={theForm} method="POST" action="?/addTodo" use:enhance={enhanceTodo}>
		<div class="two-inputs">
			<input bind:this={todoIdEl} type="hidden" name="id" value="mili" />
			<input type="hidden" name="userId" value={authorId} />
			<input type="text" name="title" placeholder={titleIsRequired || 'enter todo title'} />
			<input type="number" name="priority" placeholder="Priority" />
		</div>
		<div class="two-inputs">
			<input type="text" name="content" placeholder={contentIsRequired || 'enter todo content'} />
			<!-- position:relative here is essential for CircleSpinner
					to stay inside the buttons
			-->
			<div style="position:relative;">
				<button bind:this={btnCreate} type="submit">
					{#if loading}
						<CircleSpinner color="skyblue" />
					{/if}
					save
				</button>
				<button
					bind:this={btnUpdate}
					disabled={selectedUserId !== authorId}
					style:cursor={selectedUserId === authorId ? 'pointer' : 'not-allowed'}
					formaction="?/updateTodo"
					type="submit"
					class="hidden"
				>
					{#if loading}
						<CircleSpinner color="skyblue" />
					{/if}
					update
				</button>
			</div>
		</div>
	</form>
	<div class="left-column">
		<h3>todo</h3>
		<TodoList
			{todos}
			completed={false}
			id={user.id}
			{toggleCompleted}
			{prepareUpdate}
			{deleteTodo}
		/>
	</div>
	<div class="right-column">
		<h3>done</h3>
		<TodoList {todos} completed={true} {toggleCompleted} {prepareUpdate} {deleteTodo} />
	</div>
</div>

<style lang="scss">
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
		input {
			display: inline-block;
			font-size: 18px;
			padding-left: 0.5rem;
		}
		.left-column,
		.right-column {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
		}

		:nth-child(1) {
			grid-column: span 2;
			display: flex;
			flex-direction: column;
			margin: 0;
			.two-inputs {
				display: flex;
				display: inline-block;
				[type='number'] {
					width: 7.35rem;
					padding-left: 2px;
				}
				font-size: 1.1em;
				grid-column: 1/3;
				width: calc(100% - 5rem);
				padding-left: 1rem;
				input {
					display: inline-block;
					&::placeholder {
						color: var(--PLACEHOLDER_COLOR);
						font-weight: normal;
					}
				}
				.hidden {
					display: none;
				}
			}
		}
	}
	button {
		// display: inline-block;
		margin-top: 1rem !important;
	}
	h3 {
		display: block;
		font-weight: 200;
		margin-left: 1rem;
		border-bottom: 1px solid gray;
	}
</style>
