<script lang="ts">
	// import { flip } from 'svelte/animate';
	import { send, receive } from '$utils/transitions';

	export let todos: Todo[] = [];
	export let completed = false;
	export let toggleCompleted: (id: string) => void;
	export let deleteTodo: (id: string) => void;

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
				<span>{todo.content}</span>
				<button on:click={() => deleteTodo(todo.id)} aria-label="Delete Todo">❌</button>
			</label>
		</li>
	{/each}
</ul>

<style lang="scss">
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
