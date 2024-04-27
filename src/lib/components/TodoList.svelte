<script lang="ts">
	import { send, receive } from '$utils/transitions';
	import { Tooltip } from 'flowbite-svelte';

	export let id: string = '';
	export let selectedUserId: string;
	export let uTodos: UTodos;
	export let completed = false;
	export let toggleCompleted: (id: string) => void;
	export let deleteTodo: (id: string) => void;
	export let prepareUpdate: (todoId: string) => void;

	const permission = 'owner only permission';
	const handleStart = () => {
		// console.log('Transition started!');
	};

	const handleEnd = () => {
		// console.log('Transition ended!');
	};
</script>

<ul class="todos">
	{#each uTodos.filter((uTodo) => uTodo.completed === completed) as uTodo (uTodo.todoId)}
		{@const tuSu = uTodo.id === selectedUserId}
		<li
			class:uncompleted={!completed}
			in:send={{ key: uTodo.todoId }}
			out:receive={{ key: uTodo.todoId }}
			on:introstart={handleEnd}
			on:outroend={handleStart}
		>
			<label>
				<input
					type="checkbox"
					class={tuSu ? 'ok-hover' : 'no-hover'}
					checked={uTodo.completed}
					on:click|preventDefault={() => {
						tuSu && toggleCompleted(uTodo.todoId);
					}}
				/>
				<div class="tooltip-wrapper">
					<span class:blue={uTodo.id === id}>{uTodo.title}</span>
					<Tooltip placement="top" defaultClass="tooltip-todo" class="master-todo" arrow={false}>
						<p>priority</p>
						<p>{uTodo.priority}</p>
						<p>created on</p>
						<p class="prop-value">{uTodo.createdAt.toLocaleDateString()}</p>
						<p>updated on</p>
						<p class="prop-value">{uTodo.updatedAt?.toLocaleDateString()}</p>
						<p>content:</p>
						<p class="prop-value">{uTodo.content}</p>
						<p>owner:</p>
						<p class="prop-value">{uTodo.firstName} {uTodo.lastName}</p>
					</Tooltip>
				</div>
				<div class="tooltip-wrapper">
					<button
						class={tuSu ? 'ok-hover' : 'no-hover'}
						on:click={() => {
							tuSu && deleteTodo(uTodo.todoId);
						}}
						aria-label="Delete Todo"
					>
						{#if tuSu}
							❌
						{:else}
							🍀
						{/if}
					</button>
					{#if !tuSu}
						<Tooltip
							placement="top"
							defaultClass="tooltip-todo-update"
							class="master-todo"
							arrow={false}
						>
							<p>{permission}</p>
						</Tooltip>
					{/if}
				</div>
				<div class="tooltip-wrapper">
					<button
						class={tuSu ? 'ok-hover' : 'no-hover'}
						on:click={() => {
							tuSu && prepareUpdate(uTodo.todoId);
						}}
						aria-label="Update Todo"
					>
						📝</button
					>
					{#if !tuSu}
						<Tooltip
							placement="top"
							defaultClass="tooltip-todo-update"
							class="master-todo"
							arrow={false}
						>
							<p>{permission}</p>
						</Tooltip>
					{/if}
				</div>
			</label>
		</li>
	{/each}
</ul>

<style lang="scss">
	.not-allowed {
		cursor: not-allowed;
	}
	.tu-su {
		// user when todo.userId !== selectedUserId
		color: gray;
		fill: gray;
		&:hover {
			cursor: not-allowed;
			border-color: gray;
		}
	}
	.tooltip-wrapper {
		position: relative;
	}

	:global(.tooltip-todo) {
		position: absolute;
		left: 7rem !important;
		top: -2rem !important;
		display: grid;
		grid-template-columns: 6rem 30rem;
		justify-content: flex-start;
		width: 40rem !important;
		color: skyblue !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		background-color: $BACK-COLOR;
		border: 1px solid gray;
		border-radius: 6px;
		p:nth-child(even) {
			color: yellow;
		}
	}
	:global(.tooltip-todo-update) {
		position: absolute;
		left: -2rem !important;
		top: -2rem !important;
		width: 11rem !important;
		color: pink !important;
		border: 1px solid pink;
		border-radius: 6px;
	}
	:global(.master-todo) {
		// top: -0.5rem !important;
		font-size: 14px;
		font-weight: 400;
		p {
			display: flex;
			justify-content: space-between;
			align-content: flex-start;
			gap: 0.5rem;
			padding: 0 0 0 5px;
			margin: 0;
			.prop-value {
				color: yellow;
			}
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
