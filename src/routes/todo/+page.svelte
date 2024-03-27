<script lang="ts">
	import { enhance } from '$app/forms';
	import TodoList from '$lib/components/TodoList.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const clearMessage = () => {
		setTimeout(() => {
			deleted = '';
			toggled = '';
		}, 2000);
	};
	let toggled = '';
	const toggleCompleted = async (id: string) => {
		const response = await fetch(`/todo?id=${id}`, {
			method: 'PATCH',
			body: id
		});

		const data = await response.json();

		toggled = data.toggled ? 'toggled successfully' : 'toggle failed';

		if (data.toggled) {
			todos = todos.map((todo) => {
				if (todo.id === id) {
					todo.completed = !todo.completed;
				}
				return todo;
			});
			clearMessage();
		}
	};
	let deleted = '';
	const deleteTodo = async (id: string) => {
		const response = await fetch(`/todo?id=${id}`, {
			method: 'DELETE',
			body: id
		});
		const data = await response.json();
		deleted = data.deleted ? 'deleted successfully' : 'delete failed';
		clearMessage();
	};
	$: result = deleted || toggled;
	$: ({ todos, user } = data);
	let selectedAuthorId = '';
	const authorId = data?.user?.id;
	// ('authorId', data.user.id);
</script>

<h1>
	Todo Page
	{#if data.user.role === 'ADMIN'}
		<select class="select-author" bind:value={selectedAuthorId}>
			<option value="" selected>Select Todo Author</option>
			{#each data.users as user}
				<option value={user.id}>
					{user.firstName}
					{user.lastName}
				</option>
			{/each}
		</select>
	{:else}
		<p>{user.firstName} {user.lastName}</p>
	{/if}
	{#if result}
		<span class="message">{result}</span>
	{/if}
	<span class="message">{user.firstName} {user.lastName}</span>
</h1>
<div class="board">
	<form method="POST" action="?/create" use:enhance>
		<div class="two-inputs">
			<input type="hidden" name="userId" value={authorId} />
			<input type="text" placeholder="enter todo title?" name="title" />
			<input type="number" name="priority" placeholder="Priority" />
		</div>
		<div class="two-inputs">
			<input type="text" placeholder="enter todo content" name="content" />
			<button type="submit">save</button>
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
{#if form?.error}
	<p>{form.error}</p>
{/if}
{#if form?.success}
	<p>{form?.success}</p>
{/if}

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
					width: 5.1rem;
					// color: red;
					padding-left: 2px;
				}
				font-size: 1.1em;
				grid-column: 1/3;
				width: calc(100% - 5rem);
				padding-left: 1rem;
				input {
					display: inline-block;
				}
				button {
					display: inline-block;
					width: 5.6rem;
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
	h1 {
		display: flex;
		align-items: baseline;
		margin-left: 1rem;
		.message {
			display: inline-block;
			font-size: 14px;
			font-weight: 100;
			// color: yellow;
			margin-left: 1rem;
		}
		select {
			margin-left: 1rem;
		}
	}
</style>
