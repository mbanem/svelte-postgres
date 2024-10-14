<script lang="ts">
	import { send, receive } from '$utils/transitions'
	import { flip } from 'svelte/animate'
	import { Tooltip } from 'flowbite-svelte'
	import TodoList from '$components/TodoList.svelte'

	type SelectedUser = {
		id: string
		firstName: string
		lastName: string
		role: string
	}
	type ARGS = {
		id: string
		selectedUserId: string
		role: string
		uTodosProp: UTodos
		toggleCompleted: (id: string) => void
		deleteTodo: (id: string) => void
		prepareUpdate: (todoId: string) => void
	}
	let {
		id,
		selectedUserId = $bindable(),
		role,
		uTodosProp,
		toggleCompleted,
		deleteTodo,
		prepareUpdate
	}: ARGS = $props()

	let uTodos: UTodos = $state<UTodos>(uTodosProp)
	$effect(() => {
		uTodos = uTodosProp
	})
	const permission = 'owner only permission'

	const move = (item: string, from: string[], to: string[]) => {
		to.push(item)
		return [from.filter((i) => i !== item), to]
	}

	const moveLeft = (item: string) => {
		// @ts-expect-error
		;[right, left] = move(item, right, left)
	}

	const moveRight = (item: string) => {
		// @ts-expect-error
		;[left, right] = move(item, left, right)
		console
	}
</script>

<TodoList {id} {uTodos} bind:selectedUserId {toggleCompleted} {prepareUpdate} {deleteTodo}
></TodoList>

<!-- <pre style="font-size:11px;">TodoLists.svelte uTodos {JSON.stringify(uTodos, null, 2)}</pre> -->

<style lang="scss">
	// :global(.tooltip-todo) {
	// 	position: absolute;
	// 	left: 7rem !important;
	// 	top: -2rem !important;
	// 	display: grid;
	// 	grid-template-columns: 6rem 30rem;
	// 	justify-content: flex-start;
	// 	width: 40rem !important;
	// 	color: skyblue !important;
	// 	font-size: 14px;
	// 	font-weight: 400;
	// 	padding: 3px 1rem;
	// 	text-align: center;
	// 	background-color: $BACK-COLOR;
	// 	border: 1px solid gray;
	// 	border-radius: 6px;
	// 	p:nth-child(even) {
	// 		color: yellow;
	// 	}
	// }
	// :global(.tooltip-todo-update) {
	// 	position: absolute;
	// 	left: -2rem !important;
	// 	top: -2rem !important;
	// 	width: 9rem !important;
	// 	color: yellow !important;
	// 	border: 1px solid gray;
	// 	border-radius: 6px;
	// 	padding: 4px;
	// 	text-align: center !important;
	// }
	// :global(.master-todo) {
	// 	// top: -0.5rem !important;
	// 	font-size: 14px;
	// 	font-weight: 400;
	// }
	.blue {
		color: skyblue;
	}
	.todos {
		margin-left: 1rem;
		padding: 0;
	}
	label {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		width: 100%;
		height: 100%;
		input {
			width: 1rem;
			height: 1rem;
			padding: 0;
			margin: 0;
		}
	}

	span {
		flex: 1;
		padding-top: 2px;
		justify-content: center;
	}

	button {
		width: 2rem;
		background-color: transparent;
		border: 2px solid transparent;
		&:hover {
			border: 2px solid yellow;
			cursor: pointer;
		}
	}
	.ok-hover {
		&:hover {
			cursor: pointer;
		}
	}
	.no-hover {
		&:hover {
			border-color: gray;
			cursor: not-allowed;
		}
	}
	li {
		color: white;
		list-style: none;
		opacity: 0.4;
		&.uncompleted {
			color: yellow;
			opacity: 1;
		}
	}
</style>
