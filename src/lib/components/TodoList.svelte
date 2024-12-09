<script lang="ts">
  import { send, receive } from '$utils/transitions';
  import { flip } from 'svelte/animate';
  import { Tooltip } from 'flowbite-svelte';

  type TSnippet = {
    id: string;
    selectedUserId: string;
    toggleCompleted: (todo: UTodo) => void;
    prepareUpdate: (todo: UTodo) => void;
    deleteTodo: (id: string) => void;
  };

  type PROPS = {
    id: string; // logged in locals.user.id
    role: string;
    users: UserPartial[];
    selectedUserId: string;
    uTodos: UTodo[];
    toggleCompleted: (todo: UTodo) => void;
    deleteTodo: (id: string) => void;
    prepareUpdate: (todo: UTodo) => void;
  };
  let {
    id,
    role,
    users,
    selectedUserId = $bindable(),
    uTodos,
    toggleCompleted,
    deleteTodo,
    prepareUpdate,
  }: PROPS = $props();

  const permission = 'owner only permission';
  const getSelectedRole = () => {
    return (uTodos.filter((t) => t.id === selectedUserId)[0] as UTodo)?.role;
  };
  const listTodos = () => {
    return uTodos.filter((t) => {
      return getSelectedRole() === 'ADMIN'
        ? true
        : t.id === selectedUserId
          ? true
          : false;
    });
  };
  // for Flip we need two areas, usually le3ft and right, for flipping between
  // so we make left and right from uTodos based on completed left=false, right=true
  // let left = $state<UTodo[]>([])
  // let right = $state<UTodo[]>([])
  // $effect(() => {
  // 	left = uTodos.filter((t) => t.completed === false) as UTodo[]
  // 	right = uTodos.filter((t) => t.completed === true) as UTodo[]
  // })

  let left = uTodos.filter((t) => t.completed === false) as UTodo[];
  let right = uTodos.filter((t) => t.completed === true) as UTodo[];

  const move = (item: UTodo, from: UTodo[], to: UTodo[]) => {
    to.push(item);
    return [from.filter((i) => i !== item), to];
  };

  const moveLeft = (item: UTodo) => {
    // @ts-expect-error
    [right, left] = move(item, right, left);
  };

  const moveRight = (item: UTodo) => {
    // @ts-expect-error
    [left, right] = move(item, left, right);
  };

  const td = {
    id,
    selectedUserId,
    toggleCompleted,
    prepareUpdate,
    deleteTodo,
  };
</script>

<!-- css can be dynamically changed via style:rule={value} and class:class_name={predicate} -->
{#snippet tooltip(tf: boolean, title: string)}
  {#if !tf}
    <Tooltip defaultClass="tooltip-todo-false">
      <p>{permission}</p>
    </Tooltip>
  {:else}
    <Tooltip defaultClass="tooltip-todo-delete">
      <p>{title}</p>
    </Tooltip>
  {/if}
{/snippet}

{#snippet todos(td: TSnippet, todos: UTodo[], completed: boolean)}
  <div>
    {#if completed}
      <p class="caption">Completed</p>
    {:else}
      <p class="caption">Not Completed</p>
    {/if}
    {#each todos as todo (todo)}
      <!-- tuSu -- todo of selected user -->
      {@const tuSu = todo.id === id}
      <li
        style:width={'40vw'}
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
              tuSu && td.toggleCompleted(todo);
              completed ? moveLeft(todo) : moveRight(todo);
            }}
          />
          <div class="tooltip-wrapper">
            <p
              class={`${todo.id === id ? 'blue' : 'gray'} ${tuSu ? 'ok-hover' : 'no-hover'}`}
            >
              {todo.title}
            </p>
            {todo.content}
            <Tooltip defaultClass="tooltip-todo">
              <p>priority</p>
              <p>{todo.priority}</p>
              <p>created on</p>
              <p class="prop-value">{todo.createdAt.toLocaleString()}</p>
              <p>updated on</p>
              <p class="prop-value">{todo.updatedAt?.toLocaleString()}</p>
              <p>owner: {tuSu}</p>
              <!-- NOTE: Tooltip accepts style setting but not class -->
              <p
                style={`margin-bottom:8px; color:${tuSu ? 'skyblue' : 'pink'}`}
              >
                {todo.firstName}
                {todo.lastName}
              </p>
            </Tooltip>
          </div>
          <div class="tooltip-wrapper">
            <button
              class={tuSu ? 'ok-hover' : 'no-hover'}
              onclick={() => {
                tuSu && td.deleteTodo(todo.todoId);
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
                tuSu && td.prepareUpdate(todo);
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
<!-- <pre>id {id}, role {role}, selectedUserId {selectedUserId}, uTodos{JSON.stringify(
  uTodos,
  null,
  2,
  )}</pre> -->
<!-- <pre>todo list selectedUserId {selectedUserId}</pre> -->
<!-- <pre>loggedInUserId {loggedInUserId}</pre> -->
<div class="container">
  {@render todos(
    td,
    listTodos().filter((t) => t.completed === false) as UTodo[],
    false,
  )}
  {@render todos(
    td,
    listTodos().filter((t) => t.completed === true) as UTodo[],
    true,
  )}
</div>

<style lang="scss">
  .container {
    display: grid;
    width: 98vw;
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
  .prop-value {
    margin-bottom: 8px;
    color: yellow;
  }
  .caption {
    border-bottom: 1px solid gray;
    width: 40vw;
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
