<<<<<<< HEAD
<script lang="ts">
	import { send, receive } from '$utils/transitions'
	import { flip } from 'svelte/animate'
	import { Tooltip } from 'flowbite-svelte'

	type TSnippet = {
		id: string
		selectedUserId: string
		toggleCompleted: (id: string) => void
		prepareUpdate: (id: string) => void
		deleteTodo: (id: string) => void
	}

	type ARGS = {
		id: string
		selectedUserId: string
		uTodos: UTodos
		toggleCompleted: (id: string) => void
		deleteTodo: (id: string) => void
		prepareUpdate: (todoId: string) => void
	}
	let {
		id,
		selectedUserId = $bindable(),
		uTodos,
		toggleCompleted,
		deleteTodo,
		prepareUpdate
	}: ARGS = $props()

	const permission = 'owner only permission'
	const getSelectedRole = () => {
		return (uTodos.filter((t) => t.id === selectedUserId)[0] as UTodo).role
	}
	const listTodos = () => {
		return uTodos.filter((t) => {
			return getSelectedRole() === 'ADMIN' ? true : t.id === selectedUserId ? true : false
		})
	}
	// for Flip we need two areas, usually le3ft and right, for flipping between
	// so we make left and right from uTodos based on completed left=false, right=true
	// let left = $state<UTodos>([])
	// let right = $state<UTodos>([])
	// $effect(() => {
	// 	left = uTodos.filter((t) => t.completed === false) as UTodos
	// 	right = uTodos.filter((t) => t.completed === true) as UTodos
	// })

	const move = (item: UTodo, from: UTodo[], to: UTodo[]) => {
		to.push(item)
		return [from.filter((i) => i !== item), to]
	}

	const moveLeft = (item: UTodo) => {
		// @ts-expect-error
		;[right, left] = move(item, right, left)
	}

	const moveRight = (item: UTodo) => {
		// @ts-expect-error
		;[left, right] = move(item, left, right)
	}

	const td = {
		id,
		selectedUserId,
		toggleCompleted,
		prepareUpdate,
		deleteTodo
	}
</script>

<!-- Looks like you cannot change some markup conditionally -->
{#snippet tooltip(tf: boolean, title: string)}
	{#if !tf}
		<Tooltip placement="top" defaultClass="tooltip-todo-false" class="master-todo" arrow={false}>
			<p>owner only permission</p>
		</Tooltip>
	{:else}
		<Tooltip placement="top" defaultClass="tooltip-todo-delete" class="master-todo" arrow={false}>
			<p>{title}</p>
		</Tooltip>
	{/if}
{/snippet}

{#snippet todos(td: TSnippet, todos: UTodos, completed: boolean)}
	<div>
		{#if completed}
			<p class="caption">Completed</p>
		{:else}
			<p class="caption">Not Completed</p>
		{/if}
		{#each todos as todo (todo)}
			<!-- tuSu -- todo of selected user -->
			{@const tuSu = todo.id === selectedUserId}
			<li
				class:uncompleted={!todo.completed}
				animate:flip={{ delay: 500, duration: 1000 }}
				in:send={{ key: todo.todoId }}
				out:receive={{ key: todo.todoId }}
			>
				<label>
					<input
						in:receive={{ key: todo.todoId }}
						out:send={{ key: todo.todoId }}
						type="checkbox"
						class={tuSu ? 'ok-hover' : 'no-hover'}
						checked={todo.completed}
						disabled={!tuSu}
						onclick={() => {
							tuSu && td.toggleCompleted(todo.todoId)
							completed ? moveLeft(todo) : moveRight(todo)
						}}
					/>
					<div class="tooltip-wrapper">
						<p class={`${todo.id === id ? 'blue' : 'gray'} ${tuSu ? 'ok-hover' : 'no-hover'}`}>
							{todo.title}
						</p>
						{todo.content}
						<Tooltip placement="top" defaultClass="tooltip-todo" class="master-todo" arrow={false}>
							<p>priority</p>
							<p>{todo.priority}</p>
							<p>created on</p>
							<p class="prop-value">{todo.createdAt.toLocaleString()}</p>
							<p>updated on</p>
							<p class="prop-value">{todo.updatedAt?.toLocaleString()}</p>
							<p>owner: {tuSu}</p>
							<!-- NOTE: Tooltip accepts style setting but not class -->
							<p style={`margin-bottom:8px; color:${tuSu ? 'skyblue' : 'pink'}`}>
								{todo.firstName}
								{todo.lastName}
							</p>
						</Tooltip>
					</div>
					<div class="tooltip-wrapper">
						<button
							class={tuSu ? 'ok-hover' : 'no-hover'}
							onclick={() => {
								tuSu && td.deleteTodo(todo.todoId)
							}}
							aria-label="Delete Todo"
						>
							{#if tuSu}
								❌
							{:else}
								🍀
							{/if}
						</button>
						{@render tooltip(tuSu, 'Delete ToDo')}
					</div>
					<div class="tooltip-wrapper">
						<button
							class={tuSu ? 'ok-hover' : 'no-hover'}
							onclick={() => {
								tuSu && td.prepareUpdate(todo.todoId)
							}}
							aria-label="Update Todo"
						>
							📝</button
						>
						{@render tooltip(tuSu, 'Prepare for update')}
					</div>
				</label>
			</li>
		{/each}
	</div>
{/snippet}

<div class="container">
	{@render todos(td, listTodos().filter((t) => t.completed === false) as UTodos, false)}
	{@render todos(td, listTodos().filter((t) => t.completed === true) as UTodos, true)}
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.tooltip-wrapper {
		position: relative;
		p {
			display: flex;
			justify-content: space-between;
			align-content: flex-start;
			gap: 0.5rem;
			padding: 0 0 0 5px;
			margin: 0;
			.prop-value {
				margin-bottom: 8px;
				color: yellow;
			}
		}
		.tooltip-todo {
			position: absolute;
			left: 25rem !important;
			top: -5rem !important;
			background-color: black !important;
			opacity: 1 !important;
		}
		&:hover {
			cursor: pointer;
		}
	}
	.caption {
		border-bottom: 1px solid gray;
		width: 90%;
	}
	.list-item {
		padding: 2px 6px;
		border: 1px solid transparent;
		&:hover {
			border-color: yellow;
			border-radius: 6px;
		}
	}
	:global(.tooltip-todo) {
		position: absolute;
		left: 12rem !important;
		top: -5rem !important;
		display: grid;
		grid-template-columns: 6rem 30rem;
		justify-content: flex-start;
		width: 18rem !important;
		color: skyblue !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border: var(--TOOLTIP-BORDER);
		border-radius: 6px;
		p:nth-child(even) {
			color: yellow;
		}
	}
	:global(.tooltip-todo-update),
	:global(.tooltip-todo-delete),
	:global(.tooltip-todo-false) {
		position: absolute;
		left: -2rem !important;
		top: -2rem !important;
		width: 6rem !important;
		color: yellow !important;
		border: 1px solid yellow;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border-radius: 6px;
		padding: 4px 1rem;
		text-align: center;
	}
	:global(.tooltip-todo-update) {
		width: 9rem !important;
	}
	:global(.tooltip-todo-false) {
		color: pink !important;
		border-color: pink;
	}
	:global(.master-todo) {
		position: absolute;
		top: -4rem !important;
		left: 8rem;
		font-size: 14px;
		font-weight: 400;
	}
	.blue {
		color: skyblue;
		margin-bottom: 6px !important;
	}
	.gray {
		color: lightgray;
		margin-bottom: 6px !important;
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
	.prop-red {
		margin-bottom: 8px;
		color: red;
	}
</style>
=======
<script lang="ts">
	import { send, receive } from '$utils/transitions'
	import { flip } from 'svelte/animate'
	import { Tooltip } from 'flowbite-svelte'

	type TSnippet = {
		id: string
		selectedUserId: string
		toggleCompleted: (id: string) => void
		prepareUpdate: (id: string) => void
		deleteTodo: (id: string) => void
	}

	type ARGS = {
		id: string
		selectedUserId: string
		uTodos: UTodos
		toggleCompleted: (id: string) => void
		deleteTodo: (id: string) => void
		prepareUpdate: (todoId: string) => void
	}
	let {
		id,
		selectedUserId = $bindable(),
		uTodos,
		toggleCompleted,
		deleteTodo,
		prepareUpdate
	}: ARGS = $props()

	const permission = 'owner only permission'
	const getSelectedRole = () => {
		return (uTodos.filter((t) => t.id === selectedUserId)[0] as UTodo).role
	}
	const listTodos = () => {
		return uTodos.filter((t) => {
			return getSelectedRole() === 'ADMIN' ? true : t.id === selectedUserId ? true : false
		})
	}
	// for Flip we need two areas, usually left and right, for flipping
	// between so we make left and right from uTodos based on 'completed'
	// property left=false, right=true

	let left: UTodos = uTodos.filter((t) => t.completed === false) as UTodos
	let right: UTodos = uTodos.filter((t) => t.completed === true) as UTodos
	const move = (item: UTodo, from: UTodo[], to: UTodo[]): UTodos[] => {
		to.push(item)
		// The 'to' got new item so we take out that item from 'from'.
		// As moveLeft and moveRight establish new state for both left
		// and righrt, we return array [from, to] with new state
		return [from.filter((itm) => itm !== item), to] as UTodos[]
	}

	const moveLeft = (item: UTodo) => {
		// @ts-expect-error
		;[right, left] = move(item, right, left)
	}

	const moveRight = (item: UTodo) => {
		// @ts-expect-error
		;[left, right] = move(item, left, right)
	}

	const td = {
		id,
		selectedUserId,
		toggleCompleted,
		prepareUpdate,
		deleteTodo
	}
</script>

<!-- <pre style="font-size:11px;">selectedUserId {JSON.stringify(selectedUserId, null, 2)}</pre> -->
<!-- Looks like you cannot change some markup conditionally -->
{#snippet tooltip(allowed: boolean, title: string)}
	<!-- NOTE the way to toggle string content based on a predicate -->
	<Tooltip
		placement="top"
		defaultClass={`tooltip_default-${allowed ? 'delete' : 'false'}`}
		arrow={false}
	>
		<p>{allowed ? title : 'owner only permission'}</p>
	</Tooltip>
{/snippet}

<!-- this snippet handle flipping todo batween active and completed -->
{#snippet tooltip_toggle_completed(allowed: boolean, td: TSnippet, todo: UTodo, completed: boolean)}
	<div class="tooltip-wrapper">
		<!-- <button style="padding:2px;"> -->
		<input
			in:receive={{ key: todo.todoId }}
			out:send={{ key: todo.todoId }}
			type="checkbox"
			class={allowed ? 'ok-hover' : 'no-hover'}
			checked={todo.completed}
			disabled={!allowed}
			onclick={() => {
				allowed && td.toggleCompleted(todo.todoId)
				completed ? moveLeft(todo) : moveRight(todo)
			}}
		/>
		<!-- </button -->

		{@render tooltip(allowed, completed ? 'Return to Not Completed' : 'Flag as Completed')}
	</div>
{/snippet}

{#snippet title_with_content(allowed: boolean, todo: UTodo)}
	<section>
		<p class={`${todo.id === id ? 'blue' : 'gray'} ${allowed ? 'ok-hover' : 'no-hover'}`}>
			{todo.title}
		</p>
		<p>{todo.content}</p>
	</section>
{/snippet}

{#snippet info_panel(allowed: boolean, todo: UTodo)}
	<div class="tooltip-wrapper">
		<!-- NOTE: Tooltip is active only over an element immediately preceding it, 
		 so in order to react over both title and context we made them belong to a 
		 single HTML with @render title_with_content(allowed, todo) to create a single
		 element and as it is immediately preceding Tooltip both title and content
		 are triggering tooltip
		-->
		{@render title_with_content(allowed, todo)}

		<Tooltip placement="top" defaultClass="tooltip_default" arrow={false}>
			<p>priority</p>
			<p class="prop-value">{todo.priority}</p>
			<p>created on</p>
			<p class="prop-value">{todo.createdAt.toLocaleString()}</p>
			<p>updated on</p>
			<p class="prop-value">{todo.updatedAt?.toLocaleString()}</p>
			<p>owner: {allowed}</p>
			<!-- NOTE: Tooltip accepts style setting but not class -->
			<p style={`margin-bottom:8px; color:${allowed ? 'skyblue' : 'pink'}`}>
				{todo.firstName}
				{todo.lastName}
			</p>
		</Tooltip>
	</div>
{/snippet}

{#snippet item_delete(allowed: boolean, td: TSnippet, todo: UTodo)}
	<div class="tooltip-wrapper">
		<button
			class={allowed ? 'ok-hover' : 'no-hover'}
			onclick={() => {
				allowed && td.deleteTodo(todo.todoId)
			}}
			aria-label="Delete Todo"
			aria-hidden={true}
		>
			{#if allowed}
				<span style="color:red;">X</span>
			{:else}
				?
			{/if}
		</button>
		{@render tooltip(allowed, 'Delete ToDo')}
	</div>
{/snippet}

{#snippet item_prepare_update(allowed: boolean, td: TSnippet, todo: UTodo)}
	<!-- NOTE: without event.preventDefault()
	 					this block could not be rendered from a snippet
						as the snippet would turn action into 'toggle completed'\
						because of the event bubling 
					-->
	<div class="tooltip-wrapper">
		<button
			class={allowed ? 'ok-hover' : 'no-hover'}
			onclick={(event: MouseEvent | KeyboardEvent) => {
				event.preventDefault()
				allowed && td.prepareUpdate(todo.todoId)
			}}
			aria-label="Update Todo"
		>
			📝</button
		>
		{@render tooltip(allowed, 'Prepare for update')}
	</div>
{/snippet}
{#snippet todos(td: TSnippet, todos: UTodos, completed: boolean)}
	<div>
		{#if completed}
			<p class="caption">Completed</p>
		{:else}
			<p class="caption">Not Completed</p>
		{/if}
		{#each todos as todo (todo)}
			<!-- allowed -- todo of selected user -->
			{@const isOwner = todo.id === selectedUserId}

			<!-- <li> items undergo flip animation with unique key: todo.todoId -->
			<li
				class:uncompleted={!todo.completed}
				animate:flip={{ delay: 500, duration: 1000 }}
				in:send={{ key: todo.todoId }}
				out:receive={{ key: todo.todoId }}
			>
				<label>
					{@render tooltip_toggle_completed(isOwner, td, todo, completed)}
					{@render info_panel(isOwner, todo)}
					{@render item_delete(isOwner, td, todo)}
					{@render item_prepare_update(isOwner, td, todo)}
				</label>
			</li>
		{/each}
	</div>
{/snippet}

<div class="container">
	{@render todos(td, listTodos().filter((t) => t.completed === false) as UTodos, false)}
	{@render todos(td, listTodos().filter((t) => t.completed === true) as UTodos, true)}
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
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
	.caption {
		border-bottom: 1px solid gray;
		width: 90%;
	}
	/* ready for app.scss */
	:global(.tooltip_default) {
		position: absolute;
		left: 10rem !important;
		top: -4rem !important;
		display: grid;
		grid-template-columns: max-content 12rem !important;
		// grid-auto-rows: max-content !important;
		// grid-template-columns: 5rem 15rem !important;
		// row-gap: 6px;
		justify-content: flex-start;
		width: 20rem !important;
		// height: auto !important;
		color: skyblue !important;
		font-size: 14px;
		line-height: 14px;
		font-weight: 400;
		padding: 3px 1rem !important;
		text-align: left;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border: 1px solid pink !important;
		border-radius: 8px;
		z-index: 6;
		p:nth-child(even) {
			color: yellow;
			text-align: left;
			width: 15rem;
			padding: 2px 6px !important;
		}
	}

	:global(.tooltip_default-update),
	:global(.tooltip_default-delete),
	:global(.tooltip_default-false) {
		position: absolute;
		// top: -2rem !important;
		left: -2rem !important;
		width: max-content !important;
		grid-template-columns: 5rem 15rem !important;
		// height: auto !important;
		color: lightblue !important;
		border: 1px solid lightblue;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border-radius: 6px;
		padding: 0 1rem;
		text-align: left;
		z-index: 6;
	}
	:global(.tooltip_default-false) {
		color: pink !important;
		border-color: pink;
	}
	.blue {
		color: skyblue;
		margin-bottom: 6px !important;
	}
	.gray {
		color: lightgray;
		margin-bottom: 6px !important;
	}
	label {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		width: 100%;
		height: 100%;
	}
	.prop-value {
		width: 11rem;
	}
	span {
		flex: 1;
		padding-top: 2px;
		justify-content: center;
	}
	/* cannot be sent to app.scss event as :global*/
	.ok-hover,
	.no-hover {
		border: 1px solid transparent;
		outline: none;
		font-size: 20px;
		color: lightblue;
	}
	.no-hover {
		&:hover {
			border-color: 1px solid gray !important;
			outline: none !important;
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
	.prop-red {
		margin-bottom: 8px;
		color: red;
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
