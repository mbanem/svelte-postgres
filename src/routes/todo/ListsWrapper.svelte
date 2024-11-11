<script lang="ts">
  import { send, receive } from '$utils/transitions';
  import { flip } from 'svelte/animate';
  import { Tooltip } from 'flowbite-svelte';
  import TodoList from '$components/TodoList.svelte';

  type SelectedUser = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  type ARGS = {
    id: string;
    selectedUserId: string;
    role: string;
    uTodosProp: UTodos;
    toggleCompleted: (id: string) => void;
    deleteTodo: (id: string) => void;
    prepareUpdate: (todoId: string) => void;
  };
  let {
    id,
    selectedUserId = $bindable(),
    role,
    uTodosProp,
    toggleCompleted,
    deleteTodo,
    prepareUpdate,
  }: ARGS = $props();

  let uTodos: UTodos = $state<UTodos>(uTodosProp);
  $effect(() => {
    uTodos = uTodosProp;
  });
  const permission = 'owner only permission';

  const move = (item: string, from: string[], to: string[]) => {
    to.push(item);
    return [from.filter((i) => i !== item), to];
  };

  const moveLeft = (item: string) => {
    // @ts-expect-error
    [right, left] = move(item, right, left);
  };

  const moveRight = (item: string) => {
    // @ts-expect-error
    [left, right] = move(item, left, right);
  };
</script>

<TodoList
  {id}
  {uTodos}
  bind:selectedUserId
  {toggleCompleted}
  {prepareUpdate}
  {deleteTodo}
></TodoList>

<!-- <pre style="font-size:11px;">TodoLists.svelte uTodos {JSON.stringify(uTodos, null, 2)}</pre> -->
