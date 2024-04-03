<script lang="ts">
	import { enhance } from '$app/forms';
	import TodoList from '$lib/components/TodoList.svelte';
	import type { PageData, ActionData } from './$types';
	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	// https://flowbite-svelte.com/docs/components/spinner
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;
	export let form: ActionData;

	let success: string;
	let loading: boolean;
	let saving: string;

	const setColor = (color: string) => {
		if (browser) {
			document.documentElement.style.setProperty('--PLACEHOLDER_COLOR', color);
		}
	};
	$: setColor(form?.message ? 'red' : 'green');

	let ignoreMessage = false;
	const clearMessage = () => {
		setTimeout(() => {
			deleted = '';
			toggled = '';
			ignoreMessage = false;
			saving = '';
			result = '';
		}, 2000);
	};

	const toggleComplete = () => {
		// loading = !loading;
	};
	let phTitle = '';
	let phContent = '';
	const enhanceAddTodo: SubmitFunction = ({ action, formData }) => {
		success = '';
		phTitle = '';
		ignoreMessage = false;
		if (formData.get('title') === '') {
			phTitle = 'Title is required field';
		}
		phContent = '';
		if (formData.get('content') === '') {
			phContent = 'Content is required field';
		}

		if (phTitle || phContent) return;

		// processing before form submit
		loading = true;
		saving = 'saving todo...';

		return async ({ update }) => {
			await update();
			loading = false;
			success = action.search === '?/addTodo' ? 'New todo added' : 'What to put here?';
			ignoreMessage = true;
		};
	};

	let toggled = '';
	const toggleCompleted = async (id: string) => {
		loading = true;
		const response = await fetch(`/todo?id=${id}`, {
			method: 'PATCH',
			body: id
		});

		const data = await response.json();
		loading = false;
		// setting toggled will dynamically set result, which in turn will show message
		// for several seconds and then clear it out
		toggled = data.toggled ? 'toggled successfully' : 'toggle failed';

		if (data.toggled) {
			todos = todos.map((todo) => {
				if (todo.id === id) {
					todo.completed = !todo.completed;
				}
				return todo;
			});
		}
	};

	let deleted = '';
	const deleteTodo = async (id: string) => {
		loading = true;
		const response = await fetch(`/todo?id=${id}`, {
			method: 'DELETE',
			body: id
		});
		const data = await response.json();
		loading = false;
		// setting deleted will dynamically set result, which in turn will show message
		// for several seconds and then clear it out
		deleted = data.deleted ? 'deleted successfully' : 'delete failed';
		if (deleted) {
			todos = todos.filter((todo) => todo.id !== id);
		}
	};
	$: message = ignoreMessage ? '' : form?.message ?? '';
	$: result = toggled || deleted || saving || message;
	// $: message = form?.message ?? '';
	// setting result will call showMessage and this onw will setTimeout
	// to clear the message after several seconds
	const showResult = () => {
		clearMessage();
		return result;
	};

	$: ({ todos, user } = data);

	let selectedUserId = '';
	const authorId = data?.user?.id;
</script>

<!-- <pre style="font-size:11px;"> {JSON.stringify(ignoreMessage, null, 2)}</pre> -->
<!-- <pre style="font-size:11px;"> {JSON.stringify(toggled, null, 2)}</pre> -->
<PageTitleCombo
	bind:result
	bind:saving
	bind:deleted
	bind:toggled
	bind:ignoreMessage
	bind:selectedUserId
	PageName="Todo"
	user={data.user}
	users={data.users}
/>

<div class="board">
	<form method="POST" action="?/addTodo" use:enhance={enhanceAddTodo}>
		<div class="two-inputs">
			<input type="hidden" name="userId" value={authorId} />
			<input type="text" name="title" placeholder={phTitle ?? 'enter todo title'} />
			<input type="number" name="priority" placeholder="Priority" />
		</div>
		<div class="two-inputs">
			<input type="text" name="content" placeholder={phContent ?? 'enter todo content'} />
			<button type="submit" style="text-align:center;position:relative;">
				{#if loading}
					<CircleSpinner color="blue" />
				{/if}
				save
			</button>
		</div>
	</form>
	<div class="left-column">
		<h3>todo</h3>
		<TodoList {todos} completed={false} {toggleCompleted} {deleteTodo} />
	</div>
	<div class="right-column">
		<h3>done</h3>
		<TodoList {todos} completed={true} {toggleCompleted} {deleteTodo} />
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
		input,
		button {
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
				button {
					display: inline-block;
					width: 8rem;
					padding: 6px 0;
					color: black;
				}
			}
		}
	}
	h3 {
		display: block;
		font-weight: 200;
		margin-left: 1rem;
		border-bottom: 1px solid gray;
	}
	// h1 {
	// 	display: flex;
	// 	align-items: baseline;
	// 	margin-left: 1rem;
	// 	.message,
	// 	.user-name {
	// 		display: inline-block;
	// 		font-size: 14px;
	// 		font-weight: 100;
	// 		color: yellow;
	// 		margin-left: 1rem;
	// 	}
	// 	.user-name {
	// 		color: white;
	// 	}
	// 	select {
	// 		margin-left: 1rem;
	// 	}
	// }
</style>
