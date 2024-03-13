<script lang="ts">
	import { enhance } from '$app/forms';
	import TodoList from '$lib/components/TodoList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ todos } = data);

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
</script>

<h1>
	Todo Page
	{#if result}
		<span class="message">{result}</span>
	{/if}
</h1>
<div class="board">
	<form method="POST" action="?/todo" use:enhance>
		<input type="text" placeholder="what to do?" name="todo" />
		<button type="submit">save</button>
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
		width: 60vw;
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

		:nth-child(1) {
			grid-column: span 2;
			display: flex;
			margin: 0;
			input {
				font-size: 1.1em;
				grid-column: 1/3;
				width: calc(100% - 5rem);
				padding-left: 1rem;
			}
			button {
				color: black;
				display: inline-block;
				height: 2.4rem;
				width: 4rem;
				margin-left: 1rem;
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
	}
</style>
