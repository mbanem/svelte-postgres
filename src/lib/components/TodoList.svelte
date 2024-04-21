<script lang="ts">
	import { send, receive } from '$utils/transitions';
	import { Tooltip } from 'flowbite-svelte';

	export let id: string = '';
	export let todos: Todo[] = [];
	export let completed = false;
	export let toggleCompleted: (id: string) => void;
	export let deleteTodo: (id: string) => void;
	export let prepareUpdate: (id: string) => void;

	const handleStart = () => {
		console.log('Transition started!');
	};

	const handleEnd = () => {
		console.log('Transition ended!');
	};
</script>

<ul class="todos">
	{#each todos.filter((todo) => todo.completed === completed) as todo (todo.id)}
		<li
			class:uncompleted={!completed}
			in:send={{ key: todo.id }}
			out:receive={{ key: todo.id }}
			on:introstart={handleEnd}
			on:outroend={handleStart}
		>
			<label>
				<input
					type="checkbox"
					checked={todo.completed}
					on:click|preventDefault={() => toggleCompleted(todo.id)}
				/>
				<div class="tooltip-wrapper">
					<span class:blue={todo.userId === id}>{todo.title}</span>
					<Tooltip placement="top" defaultClass="tooltip-todo" class="master-todo" arrow={false}>
						<p>created on {todo.createdAt.toLocaleDateString()}</p>
						<p>updated on {todo.updatedAt?.toLocaleDateString()}</p>
					</Tooltip>
				</div>
				<button on:click={() => deleteTodo(todo.id)} aria-label="Delete Todo">❌</button>
				<button on:click={() => prepareUpdate(todo.id)} aria-label="Update Todo"> 📝</button>
			</label>
		</li>
	{/each}
</ul>

<style lang="scss">
	.tooltip-wrapper {
		position: relative;
	}

	:global(.tooltip-todo) {
		position: absolute;
		left: 7rem !important;
		top: -2rem !important;
		display: inline-block;
		width: 11rem !important;
		color: yellow !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		background-color: $BACK-COLOR;
	}
	:global(.master-todo) {
		// top: -0.5rem !important;
		color: yellow !important;
		font-size: 14px;
		font-weight: 400;
		p {
			padding: 0;
			margin: 0;
		}
	}
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
