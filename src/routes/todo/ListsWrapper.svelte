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

  // id={locals.user.id}
  // role={locals.user.role}
  // {users}
  // uTodosProp={uTodos}
  // bind:selectedUserId
  // {toggleCompleted}
  // {prepareUpdate}
  // {deleteTodo}

  type ARGS = {
    id: string; // user id
    role: string; // USER or ADMIN, VISITOR has no ability to save todos
    users: UserPartial[];
    uTodos: UTodos;
    selectedUserId: string;
    toggleCompleted: (id: string) => void;
    prepareUpdate: (todoId: string) => void;
    deleteTodo: (id: string) => void;
  };
  let {
    id,
    role,
    users,
    uTodos,
    selectedUserId = $bindable(),
    toggleCompleted,
    prepareUpdate,
    deleteTodo,
  }: ARGS = $props();

  let stop_debugger = true;
  // let uTodos= $state<UTodos>(uTodosProp);
  // $effect(() => {
  //   uTodos = uTodosProp;
  // });

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

<!-- ===================  TodoList ===================== -->
<TodoList
  {id}
  {role}
  {users}
  {uTodos}
  bind:selectedUserId
  {toggleCompleted}
  {prepareUpdate}
  {deleteTodo}
></TodoList>

<!-- <pre style="font-size:11px;">TodoLists.svelte uTodos {JSON.stringify(uTodos, null, 2)}</pre> -->
