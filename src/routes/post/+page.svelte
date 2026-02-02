<script lang="ts">
  // @ts-check
  import type { Snapshot } from '../$types'; // .sveltekit/$types
  import type { PageData, ActionData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores'; // for $age.status code on actions
  import { onMount } from 'svelte';
  import CRTooltip from '$components/CRTooltip.svelte';
  import CircleSpinner from '$components/CircleSpinner.svelte';
  import ButtonSpinner from '$components/ButtonSpinner.svelte';
  import PageTitleCombo from '$components/PageTitleCombo.svelte';
  import MultiSelectBox, {
    setSelectedOptions,
  } from '$components/MultiSelectBox.svelte';
  import PostList from '$components/PostList.svelte';
  import { hideButtonsExceptFirst } from '$lib/utils';
  import * as utils from '$lib/utils';
  import { Role } from '@prisma/client';

  type ARGS = {
    data: PageData;
    form: ActionData;
  };
  let { data, form }: ARGS = $props();

  // let { postAuthors } = data;
  let message = '';
  let loading = $state<boolean>(false);
  let ignoreFormMessage = $state<boolean>(false);
  const requiredCategory = '';
  let selectedUserId = $state<string>('');
  let titleIsRequired = '';
  let contentIsRequired = '';
  let categoryIsRequired = requiredCategory;

  let btnCreate: HTMLButtonElement;
  let btnDelete: HTMLButtonElement;
  let btnUpdate: HTMLButtonElement;
  let updateSpinner: typeof ButtonSpinner;
  const authorId = data?.user?.id;
  let hidden = $state(true);

  let preferPos = $state<string>('top,left,right,bottom,');
  const props = $derived({
    delay: 250,
    duration: 800,
    baseScale: 0,
    toolbarHeight: 32,
    preferredPos: preferPos,
  });

  let categoryIds: number[] = [];
  $effect(() => {
    utils.setColor(
      form?.message
        ? form.message.includes('successfully')
          ? 'lightgreen'
          : 'pink'
        : 'lightgreen',
    );
  });

  // keep message displayed for several seconds
  const clearMessage = () => {
    setTimeout(() => {
      message = '';
      ignoreFormMessage = false;
      result = '';
      categoryIsRequired = requiredCategory;
    }, 2000);
    hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
    utils.setColor('lightgreen');
  };

  const clearForm = (event?: MouseEvent) => {
    event?.preventDefault();
    utils.shallowCopy(initialSnap, snap);
    snap.authorId = data.locals.user.id;
    // const els = ['id', 'title', 'content', 'categoryIds'];
    // els.forEach((k) => {
    // 	(document.querySelector(`input[name='${k}']`) as HTMLInputElement).value = '';
    // });
    // (document.querySelector(`input[name='published']`) as HTMLInputElement).checked = false;
    setSelectedOptions([], requiredCategory);
    utils.setColor('lightgreen');
    utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
  };

  const required = {
    title: '',
    content: '',
    categoryIds: '',
  };

  const categoryList = (arr: number[]) => {
    return arr.map((n) => data.categories[n - 1]?.name).join(',');
  };
  let selectedCategoryIds = '3,5';

  /*
		After processing the request (for example, logging the user in by setting a cookie),
		the action can respond with data that will be available through the form property on
		the corresponding page and through $page.form app-wide until the next update.
	*/
  const enhancePost: SubmitFunction = ({ action, formData, cancel }) => {
    if (action.search === '?/clearForm') {
      return cancel();
    }
    if (action.search !== '?/deletePost' && !snap.categoryIds) {
      categoryIsRequired = requiredCategory;
      message = 'Please select corresponding categories';
      utils.setColor('pink');
      console.log('missimg data', snap);
      return;
    }

    titleIsRequired = '';
    ignoreFormMessage = false;
    contentIsRequired = '';
    console.log('enhancePost1', action.search);
    for (const key of Object.keys(required)) {
      if (formData.get(key) == '') {
        switch (key) {
          case 'title':
            titleIsRequired = 'Title is required';
            break;
          case 'content':
            contentIsRequired = 'Content is required';
            break;
          case 'categoryIds':
            categoryIsRequired = 'Category is required';
            break;
          default:
            break;
        }
      }
    }
    loading = true; // start spinner animation
    if (action.search === '?/createPost') {
      result = 'creating post...';
    } else if (action.search === '?/deletePost') {
      utils.hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
      result = 'deleting post...';
    } else if (action.search === '?/updatePost') {
      result = 'updating post...';
    }
    // console.log('enhancePost2 result', result)
    return async ({ update }) => {
      await update();
      ignoreFormMessage = true;
      //console.log('enhancePost after action', action.search, $page.status)
      if (action.search === '?/createPost') {
        result = $page.status === 200 ? 'post created' : 'create failed';
      } else if (action.search === '?/deletePost') {
        result = $page.status === 200 ? 'post deleted' : 'delete failed';
      } else if (action.search === '?/updatePost') {
        result = $page.status === 200 ? 'post updated' : 'update failed';
      }
      invalidateAll();
      clearForm(); // also set buttons
      loading = false; // stop spinner animation
      // utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete])
      clearMessage();
      utils.setColor('lightgreen');
    };
  };

  let boardBlock: HTMLDivElement;
  let adminSelected: boolean;
  const userSelected = () => {
    // if no admin is selected hide boardBlock if not hidden already
    if (boardBlock.classList.contains('hidden')) {
      if (adminSelected) {
        boardBlock.classList.toggle('hidden');
      }
    } else {
      if (!adminSelected) {
        boardBlock.classList.toggle('hidden');
      }
    }
  };

  const postsAuthors = () => {
    const arr: PostAuthor[] = [];
    (data.postAuthors as PostAuthor[]).forEach((post) => {
      if (selectedUserId === post.authorId && post.role === Role.ADMIN) {
        post['firstName'] = 'T-' + post['firstName'];
      }
      arr.push(post);
    });
    return arr;
  }; //categoryNames,

  // let setSelectedOptions: (arr: number[] | [], nameList: string) => void

  const toUpdatePost = (event: MouseEvent | KeyboardEvent, postId: string) => {
    event.preventDefault();
    const authorPost = data.postAuthors.filter(
      (pa) => pa.id === postId,
    )[0] as PostAuthor;
    utils.shallowCopy(authorPost, snap);
    const { title, content, published, categoryIds } = authorPost; //as PostAuthor
    // selectOptions(categoryIds);
    const els = [
      // { published: published },
      { title },
      { content },
      { categoryIds },
    ];

    utils.hideButtonsExceptFirst([btnUpdate, btnCreate, btnDelete]);
    console.log(btnUpdate.classList);
    // NOTE: in TypeScript Playground instead of using nested loops as we use below,
    // the spread operators works, but here does not
    // for (const [k,v] of Object.entries([...els])) { code here }
    els.forEach((el) => {
      for (const [k, v] of Object.entries(el)) {
        (
          document.querySelector(`input[name='${k}']`) as HTMLInputElement
        ).value = `${v}`;
      }
    });
    (
      document.querySelector(`input[name='published']`) as HTMLInputElement
    ).checked = published;
    const numArr = utils.csvToNumArr(categoryIds);
    setSelectedOptions(numArr, categoryList(numArr));
    utils.setColor('lightgreen');
  };

  const deletePost = async (id: string) => {
    // event.preventDefault()
    hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
    btnDelete.focus();
    loading = true;
    result = 'deleting post...';
    // if (browser) {
    (document.querySelector("input[name='id']") as HTMLInputElement).value = id;

    btnDelete.click();
    utils.sleep(2000);
    // }
  };

  let formMessage = ignoreFormMessage ? '' : form?.message || '';
  let result = $state<string>(formMessage);
  let wrongUser = $derived(selectedUserId !== data.locals.user.id);

  type TSnap = {
    id: string;
    authorId: string;
    categoryIds: string;
    title: string;
    content: string;
    published: boolean;
  };
  const initialSnap: TSnap = {
    id: '',
    authorId: '',
    categoryIds: '',
    title: '',
    content: '',
    published: false,
  };
  // NOTE: without $state for snap, whose properties are bound to form input elements
  // we could not get data to create post action in +page.server.ts
  let snap = $state<TSnap>({
    id: '',
    authorId: '',
    categoryIds: '',
    title: '',
    content: '',
    published: false,
  });
  export const snapshot: Snapshot = {
    capture: () => {
      return snap;
    },
    restore: (value) => {
      snap = value;
    },
  };

  onMount(() => {
    // if (data.postAuthors[0]) {
    // 	utils.shallowCopy(data.postAuthors[0], snap);
    // }
    snap.authorId = authorId as string;
    boardBlock.classList.toggle('hidden');
    selectedUserId = data.user.id as string;
    adminSelected = data.locals.user.role === 'ADMIN';
    utils.shallowCopy(initialSnap, snap);
    snap.authorId = data.locals.user.id;
    setSelectedOptions([], categoryIsRequired);
    return () => {
      utils.setMrPath($page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Post</title>
</svelte:head>
<!-- <pre>selectedCategoryIds {selectedCategoryIds}</pre> -->
<!-- <pre style="font-size:13px;">postAuthors {JSON.stringify(
    data.postAuthors,
    null,
    2,
  )}</pre> -->
<PageTitleCombo
  PageName="Post"
  bind:result
  bind:ignoreFormMessage
  bind:selectedUserId
  user={data.locals.user}
  users={data.users}
/>
{#snippet tooltip(title: string)}
  <!-- NOTE the way to toggle string content based on a predicate -->
  <CRTooltip caption={title}></CRTooltip>
{/snippet}

{#snippet toggle_published(title: string)}
  <div class="tooltip-wrapper">
    <button class="ok-hover">
      <input
        type="checkbox"
        name="published"
        id="published"
        bind:checked={snap.published}
      />
      {@render tooltip(title)}
    </button>
  </div>
{/snippet}
<div bind:this={boardBlock} class="board">
  <div>
    <form method="POST" action="?/createPost" use:enhance={enhancePost}>
      <input type="hidden" name="id" bind:value={snap.id} />
      <input type="hidden" name="authorId" bind:value={snap.authorId} />
      <input type="hidden" name="categoryIds" bind:value={snap.categoryIds} />
      <input
        type="text"
        name="title"
        bind:value={snap.title}
        placeholder={titleIsRequired || 'enter post title'}
        class="edit-box"
      />
      <textarea
        type="text"
        name="content"
        bind:value={snap.content}
        placeholder={contentIsRequired || 'enter post content'}
        cols="55"
        rows="6"
        class="exit-box"
      ></textarea>
      <div class="multi-select-container">
        <MultiSelectBox
          categories={data.categories}
          bind:categoryIsRequired
          bind:selectedCategoryIds={snap.categoryIds}
          class_multiselect={'multi-select-component'}
        ></MultiSelectBox>
      </div>
      <label for="published" class="label-save">
        {@render toggle_published('Toggle the Published Flag')}
        <span class="toggle-published">Toggle the Published Flag</span>
        {#if !wrongUser}
          <ButtonSpinner
            bind:button={btnCreate}
            spinOn={loading}
            caption="create"
            formaction="?/createPost"
            hidden={false}
          ></ButtonSpinner>
          <ButtonSpinner
            bind:button={btnDelete}
            spinOn={loading}
            caption="delete"
            formaction="?/deletePost"
            {hidden}
          ></ButtonSpinner>
          <ButtonSpinner
            bind:button={btnUpdate}
            spinOn={loading}
            caption="update"
            formaction="?/updatePost"
          ></ButtonSpinner>
        {/if}
        <button
          formaction="?/clearForm"
          onclick={() => {
            clearForm();
            return false;
          }}
        >
          clear
        </button>
      </label>
    </form>
  </div>

  <div>
    {#key data.postAuthors}
      <!-- {#key selectedUserId} -->
      <PostList
        postAuthors={postsAuthors()}
        {toUpdatePost}
        {deletePost}
        {selectedUserId}
      ></PostList>
      <!-- {/key} -->
    {/key}
  </div>
</div>

<style lang="scss">
  .tooltip-wrapper {
    position: relative;
    &:hover {
      cursor: pointer;
    }
  }
  :global(.tooltip_default) {
    position: absolute;
    left: 12rem !important;
    top: -4rem !important;
    display: grid;
    grid-template-columns: 6rem max-content;
    justify-content: flex-start;
    width: 15rem !important;
    color: skyblue !important;
    font-size: 14px;
    line-height: 14px;
    font-weight: 400;
    padding: 3px 1rem !important;
    text-align: center;
    background-color: var(--TOOLTIP-BACKGROUND-COLOR);
    border: 1px solid gray;
    border-radius: 8px;
    z-index: 6;
    p:nth-child(even) {
      color: yellow;
    }
  }
  :global(.tooltip_default-update) {
    position: absolute;
    // top: -2rem !important;
    left: -2rem !important;
    width: max-content !important;
    color: lightblue !important;
    border: 1px solid lightblue;
    background-color: var(--TOOLTIP-BACKGROUND-COLOR);
    border-radius: 6px;
    padding: 3px 1rem;
    text-align: center;
    z-index: 6;
    p {
      padding: 0 1rem !important;
    }
  }
  .ok-hover {
    border: none; //1px solid transparent;
    outline: none;
    padding: 0;
    font-size: 14px;
    color: lightblue;
  }
  .board {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-width: 60rem;
    width: 80vw;
    gap: 2px;
    padding: 0 1rem 1rem 1rem;
    margin-left: 1rem;
    form {
      width: calc(40vw - 1rem);
    }
  }
  .label-save {
    display: flex;
    flex-shrink: 1;
    align-items: baseline;
    gap: 4px;
    margin: 0;
    padding: 0;
  }
  .toggle-published {
    user-select: none;
    margin: 0 8px 0 -1rem;
    cursor: pointer;
  }
  .edit-box {
    width: 30.3rem;
  }
  .multi-select-container {
    width: 30.3rem;
  }
  :global(.multi-select-component) {
    width: 8rem;
    height: 14rem;
    margin-left: 2rem !important;
    border-color: gray !important;
    color: rgb(174, 169, 169) !important;
  }
  // label input {
  // 	display: inline-block;
  // 	width: 1rem;
  // 	height: 1rem;
  // }
  label {
    display: flex;
    gap: 1.5rem;
  }
</style>
