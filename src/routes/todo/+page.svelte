<script lang="ts">
  import type { Snapshot } from './$types';
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores'; // for $age.status code on actions
  import { invalidateAll } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Tooltip } from 'flowbite-svelte';
  import { setColor, hideButtonsExceptFirst } from '$utils';

  import ListsWrapper from './ListsWrapper.svelte';
  import { onMount, tick } from 'svelte';
  import CircleSpinner from '$components/CircleSpinner.svelte';
  import PageTitleCombo from '$components/PageTitleCombo.svelte';
  import ButtonSpinner from '$components/ButtonSpinner.svelte';
  import * as utils from '$utils';

  type ARGS = {
    data: PageData;
    form: ActionData;
  };
  let { data, form }: ARGS = $props();
  let { users } = data;
  let hidden = $state(true);

  // NOTE: When the page updates uTodos = $state<UTodos>() is not refreshed but data.uTodos are refreshed.
  // In order to have uTodos refreshed we need two steps: let uTodos = $state<UTodos>() like a definition
  // and $effect that get uTodos from refreshed data prop
  let uTodos = $state<UTodos>();
  $effect(() => {
    uTodos = data.uTodos;
  });
  let selectedUserId = $state<string>(data.locals.user.id);
  let loading = $state<boolean>(false);
  // form?.message cannot be cleared by code but could be ignored when necessary
  let ignoreFormMessage = false;
  let titleIsRequired = '';
  let contentIsRequired = '';
  let updatePrepared = false;
  let btnCreate: HTMLButtonElement;
  let btnUpdate: HTMLButtonElement;
  let btnDelete: HTMLButtonElement;
  let theForm: HTMLFormElement;

  $effect(() => {
    setColor(
      form?.message
        ? form.message.includes('successfully') || result === ''
          ? 'lightgreen'
          : 'pink'
        : 'lightgreen',
    );
  });

  let snap = $state<TodoFormData>({
    id: '',
    authorId: '',
    title: '',
    content: '',
    priority: 0,
  });

  // keep message displayed for several seconds
  const clearMessage = () => {
    setTimeout(() => {
      ignoreFormMessage = false;
      result = '';
    }, 2000);
    hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
  };

  // if form is filled with  data for update, but user chose other action, we
  // clear the form input elements
  const clearForm = async () => {
    hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
    (document.querySelector("input[name='title']") as HTMLInputElement).value =
      '';
    (document.querySelector("[name='content']") as HTMLInputElement).value = '';
    (document.querySelector("input[type='number']") as HTMLInputElement).value =
      '0';
    titleIsRequired = contentIsRequired = '';
    setColor('lightgreen');

    await tick();
    setColor('lightgreen');
  };

  // on update todo action we do not load todos again but we have to change
  // uTodos list with the updated todo flag
  const updateTodos = (formData: FormData) => {
    if (uTodos) {
      uTodos = uTodos.map((t) => {
        if (t.todoId === formData.get('id')) {
          t.title = formData.get('title') as string;
          t.content = formData.get('content') as string;
          t.priority = Number(formData.get('priority'));
        }
        return t;
      }) as UTodos;
    }
  };

  // get params action for URL and formData to check on required fields
  const enhanceTodo: SubmitFunction = async ({ action, formData }) => {
    titleIsRequired = '';
    contentIsRequired = '';
    ignoreFormMessage = false;

    if (action.search !== '?/deleteTodo') {
      if (formData.get('title') === '') {
        titleIsRequired = 'Title is required field';
      }
      if (formData.get('content') === '') {
        contentIsRequired = 'Content is required field';
      }

      if (titleIsRequired || contentIsRequired) return;
    }

    // turn on spinner before form submit
    loading = true;
    // show the intent of the action that follows
    result =
      action.search === '?/addTodo'
        ? 'creating todo...'
        : action.search === '?/updateTodo'
          ? 'updating todo...'
          : 'deleting todo...';

    return async ({ update }) => {
      await update();
      if (action.search === '?/addTodo') {
        result = $page.status === 200 ? 'todo created' : 'create failed';
      } else if (action.search === '?/updateTodo') {
        result = $page.status === 200 ? 'todo updated' : 'update failed';
      } else if (action.search === '?/deleteTodo') {
        result = $page.status === 200 ? 'todo deleted' : 'delete failed';
      }

      await invalidateAll();
      loading = false; // turn the spinner off
      ignoreFormMessage = true;
      hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
      clearMessage();
    };
  };
  // captionCreate must be #state but hiddenCreate must not
  let captionCreate = $state<string>('create');
  let hiddenCreate = false;

  const toggleCompleted = async (id: string) => {
    captionCreate = 'toggling';
    loading = true;
    hiddenCreate = false; // NOTE: changing captionCreate above turns button hidden?!
    const completed = (
      uTodos?.filter((uTodo) => uTodo.todoId === id)[0] as UTodo
    ).completed;
    const currentState = completed ? 'completed' : 'active';
    const newState = completed ? 'active' : 'completed';
    result = `toggling ${currentState} into ${newState}...`;
    // if form fields are prepared for update but user
    // select different action we clear the form fields
    clearForm();
    // instead of easier action in +page.server.ts we demonstrate
    // here endpoint HTML remote communication via fetch
    const response = await fetch(`/todo?id=${id}`, {
      method: 'PATCH',
      body: id,
    });
    const data = await response.json();
    await utils.sleep(2000);
    loading = false; // TODO: comment out for production
    result = `toggled into ${newState}`;
    // setting the message will dynamically set the result, which in turn will
    // show message for several seconds and then clear it out

    if (data.toggled) {
      uTodos = (uTodos as UTodos).map((todo) => {
        if (todo.todoId === id) {
          todo.completed = !todo.completed;
        }
        invalidateAll();
        setTimeout(() => {
          result = '';
        }, 2000);
        return todo;
      });
    }
    captionCreate = 'create';
  };

  const deleteTodo = async (id: string) => {
    // snap.id = id
    hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
    btnDelete.focus();
    todoIdEl.value = id;
    loading = true;
    result = 'deleting todo...';
    btnDelete.click();

    utils.sleep(2000);
  };

  let todoIdEl: HTMLInputElement;
  const prepareDataForEdit = (todoId: string) => {
    const uTodo = data.uTodos.filter(
      (uTodo) => uTodo.todoId === todoId,
    )[0] as UTodo;
    // prevent ADMIN to update others todos
    selectedUserId = uTodo.id as string;
    snap.id = uTodo.todoId;
    snap.authorId = uTodo.id;
    snap.title = uTodo.title;
    snap.content = uTodo.content;
    snap.priority = Number(uTodo.priority);

    hideButtonsExceptFirst([btnUpdate, btnCreate, btnDelete]);
  };

  // updatePrepared say data is copied into the form elements
  // and should be cleared if action other than click on the
  // update button is taken

  const prepareUpdate = async (todoId: string) => {
    prepareDataForEdit(todoId);
    updatePrepared = true;
    // hide create and delete buttons and show the update one
    hideButtonsExceptFirst([btnUpdate, btnCreate, btnDelete]);
  };

  let formMessage = ignoreFormMessage ? '' : form?.message || '';
  let result = $state<string>(formMessage);

  // setting result will call showMessage and this one will setTimeout
  // to clear the message after several seconds
  // let result = $derived(message || formMessage)

  let authorId = $state<string>(data.locals.user.id);

  export const snapshot: Snapshot<TodoFormData> = {
    capture: () => {
      return snap;
    },
    restore: (value) => {
      snap = value;
    },
  };

  // const tooltipMouseWheel = () => {  // do not work with input type=number
  // 	console.log('tooltipMouseWheel')
  // 	document.querySelector('.tooltip-mouse-wheel')?.classList.toggle('hidden')
  // 	setTimeout(() => {
  // 		document.querySelector('.tooltip-mouse-wheel')?.classList.toggle('hidden')
  // 	}, 1500)
  // }
  // const todoUserToSnap = (tUser: UTodo, snap: TodoFormData) => {
  // 	snap.id = tUser.todoId;
  // 	snap.authorId = tUser.id;
  // 	snap.title = tUser.title;
  // 	snap.content = tUser.content;
  // 	snap.priority = Number(tUser.priority);
  // };
  onMount(() => {
    if (selectedUserId !== data.locals.user.id) {
      return;
    }
    const tUser = utils.selectRecordItems<UTodo>(
      'id',
      selectedUserId,
      data.uTodos,
    );
    snap.authorId = selectedUserId;
    authorId = selectedUserId;
    hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
    (
      document.querySelector("input[name='title']") as HTMLInputElement
    )?.focus();
    return () => {
      utils.setMrPath($page.url.pathname);
    };
  });
</script>

<!-- scroll to  onmouseenter={tooltipMouseWheel} where tooltip is activated-->
<!-- <div class="tooltip-mouse-wheel hidden">focus & use mouse wheel</div> -->
<svelte:head>
  <title>To Do</title>
</svelte:head>
<PageTitleCombo
  PageName="Todo"
  bind:result
  bind:ignoreFormMessage
  bind:selectedUserId
  amendTrueFalseUserId={false}
  user={data.locals.user}
  users={data.users}
/>

<div class="board">
  <form
    bind:this={theForm}
    method="POST"
    action="?/addTodo"
    use:enhance={enhanceTodo}
  >
    <div class="inputs-title-priority">
      <input
        type="hidden"
        bind:this={todoIdEl}
        name="id"
        bind:value={snap.id}
      />
      <input type="hidden" name="userId" bind:value={snap.authorId} />
      <input
        type="text"
        name="title"
        placeholder={titleIsRequired || 'enter todo title'}
        bind:value={snap.title}
      />

      <!-- onmouseenter={tooltipMouseWheel} -->
      <input
        type="number"
        name="priority"
        placeholder="Priority"
        bind:value={snap.priority}
      />
    </div>
    <div class="two-columns">
      <textarea
        rows={2}
        cols={80}
        name="content"
        placeholder={contentIsRequired || 'enter To Do content'}
        bind:value={snap.content}
        style="width:98%;height:8rem;overflowY:auto"
      ></textarea>
    </div>
    <div class="button-spinners">
      <ButtonSpinner
        bind:button={btnUpdate}
        spinOn={loading}
        caption="update"
        formaction="?/updateTodo"
        cursor={selectedUserId === authorId}
      ></ButtonSpinner>

      <ButtonSpinner
        bind:button={btnCreate}
        spinOn={loading}
        hidden={hiddenCreate}
        caption={captionCreate}
      ></ButtonSpinner>

      {#if selectedUserId !== authorId}
        <Tooltip
          placement="top"
          defaultClass="tooltip-update-false"
          class="master-todo"
          arrow={false}
        >
          <p>owner only permission</p>
        </Tooltip>
      {/if}
      <ButtonSpinner
        bind:button={btnDelete}
        spinOn={loading}
        caption="delete"
        formaction="?/deleteTodo"
        cursor={selectedUserId === authorId}
        {hidden}
      ></ButtonSpinner>

      {#if selectedUserId !== authorId}
        <Tooltip
          placement="top"
          defaultClass="tooltip-update-button"
          class="master-todo"
          arrow={false}
        >
          <p>owner only permission</p>
        </Tooltip>
      {/if}
      <button onclick={clearForm}>clear</button>
    </div>
  </form>
  <div class="two-columns">
    <ListsWrapper
      id={data.locals.user.id}
      role={data.locals.user.role}
      uTodosProp={data.uTodos}
      bind:selectedUserId
      {toggleCompleted}
      {prepareUpdate}
      {deleteTodo}
    ></ListsWrapper>
  </div>
</div>

<style lang="scss">
  :global(.tooltip-update-button),
  :global(.tooltip-update-false) {
    position: absolute;
    left: 8rem !important;
    top: 1.1rem !important;
    width: 11rem !important;
    color: yellow !important;
    font-size: 14px;
    font-weight: 400;
    padding: 3px 1rem;
    text-align: center;
    background-color: var(--TOOLTIP-BACKGROUND-COLOR);
    border: 1px solid gray;
    border-radius: 6px;
  }
  :global(.tooltip-update-false) {
    color: pink !important;
    border-color: pink;
  }
  // .tooltip-mouse-wheel {
  // 	position: fixed;
  // 	width: 12rem;
  // 	text-align: center;
  // 	color: lightgreen;
  // 	background-color: #3e3e3e;
  // 	border: 1px solid lightgreen;
  // 	border-radius: 5px;
  // 	top: 4.3rem;
  // 	left: 35rem;
  // 	cursor: progress;
  // }
  .board {
    min-width: 36em;
    width: max-content;
    padding: 1rem;
    border: 1px solid gray;
    border-radius: 8px;
    margin-left: 1rem;
    .two-columns {
      grid-column: span 2;
    }

    :nth-child(1) {
      display: flex;
      grid-column: span 2;
      flex-direction: column;
      margin: 0;
      .inputs-title-priority {
        display: flex;
        display: inline-block;
        font-size: 1.1em;
        grid-column: 1/3;
        width: calc(100% - 5rem);
        [type='number'] {
          width: 4rem;
          padding-left: 1rem;
        }
      }
    }
  }

  .button-spinners {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    gap: 0.3rem;
  }
  button {
    position: relative;
    /* adjust margin-top from app.scss class */
    margin-top: 1rem !important;
  }
</style>
