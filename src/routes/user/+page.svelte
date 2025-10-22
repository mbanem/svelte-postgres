<script lang="ts">
  import type { Snapshot } from '../$types';
  import { onMount } from 'svelte';
  import type { PageData, ActionData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/state'; // for page.status code on actions

  import * as utils from '$lib/utils';
  import CRInput from '$lib/components/CRInput.svelte';
  import CRSpinner from '$lib/components/CRSpinner.svelte';
  import CRActivity from '$lib/components/CRActivity.svelte';
  import CRTooltip from '$lib/components/CRTooltip.svelte';
  import CRSummaryDetail from '$lib/components/CRSummaryDetail.svelte';
  import type { User, Role, Profile, Article, Post, Category, Todo }  from '$lib/types/types';
  type TFormData = {
    firstName: String | null;
    lastName: String | null;
    email: String | null;
    password: String | null;
    
  };
  let snap = $state<TFormData>({
    
    firstName: null,
    lastName: null,
    email: null,
    password: null
  });

  type ARGS = {
    data: PageData;
    form: ActionData;
  };
  let { data, form }: ARGS = $props();
  let loading = $state<boolean>(false); // toggling the spinner
  let btnCreate: HTMLButtonElement;
  let btnUpdate: HTMLButtonElement;
  let btnDelete: HTMLButtonElement;
  let iconDelete: HTMLSpanElement;
  let result = '';
  const clearMessage = () => {
    setTimeout(() => {
      result = '';
    }, 2000);
  };


  function noType(name: string){
    return name.match(/([a-zA-z0-9_]+):?.*/)?.[1]
  }

  // include only selected fields by user via this extension
  const nullSnap = {
    firstName: null,
    lastName: null,
    email: null,
    password: nullfirstName: null,
    lastName: null,
    email: null,
    password: null
  }

  let formDataValid = $derived.by(() => {
    for (const [key, value] of Object.entries(snap)) {
      if (key === 'id') continue;
      if (!value) return false;
    }
    return true;
  });

  const clearForm = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    snap = nullSnap;
    utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
  };
  
  const enhanceSubmit: SubmitFunction = async ({ action, formData }) => {
    const required:string[] = [];
    for (const [key, value] of Object.entries(snap)) {
      formData.set(key, value as string);
      if(!value){
        const req = key +' is required';
        const el = document.querySelector('[title="' + key +'"]')
        if (el){
          (el as HTMLInputElement).placeholder += req;
          required.push(req)
        }
      }
    }  

    if (required.join('').length){
      return;
    }
    loading = true; // start spinner animation

    result =
      action.search === '?/create'
        ? 'creating `${routeName}`...'
        : action.search === '?/update'
          ? 'updating `${routeName}`...'
          : 'deleting `${routeName}`...';
    if (action.search === '?/delete') {
      utils.hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
    }

    return async ({ update }) => {
      await update();

      if (action.search === '?/create') {
        result = page.status === 200 ? '`${routeName}` created' : 'create failed';
      } else if (action.search === '?/update') {
        result = page.status === 200 ? '`${routeName}` updated' : 'update failed';
      } else if (action.search === '?/delete') {
        result = page.status === 200 ? '`${routeName}` deleted' : 'delete failed';
        iconDelete.classList.toggle('hidden');
        utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
      }
      invalidateAll();
      await utils.sleep(1000);
      loading = false; // stop spinner animation
      clearForm();
      utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
      clearMessage();
  }

  // buttons_() called here
  }
  let owner = true;
</script>

{#snippet deleteIcon(owner: boolean)}
  {#if owner}
    <CRTooltip caption="delete the item">
      <span
        onclick={() => {
          btnDelete.click();
        }}
        aria-hidden={true}
        class="icon-delete"
        style:cursor={owner ? 'pointer' : 'not-allowed'}
      >
        X
      </span>
    </CRTooltip>
  {:else}
    <CRTooltip caption="delete the item">
      <span
        class="icon-delete pink"
        style:cursor={owner ? 'pointer' : 'not-allowed'}
      >
        X
      </span>
    </CRTooltip>
  {/if}
{/snippet}

<form action="?/create" method="post" use:enhance={enhanceSubmit}>
  <div class="form-wrapper">
    <CRInput
      title="firstName"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.firstName as string}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="lastName"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.lastName as string}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="email"
      exportValueOn="enter|blur"
      type="text"
      capitalize={false}
      bind:value={snap.email as string}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="password"
      exportValueOn="enter|blur"
      type="password"
      capitalize={false}
      bind:value={snap.password as string}
      required={true}
      width="22.5rem"
    ></CRInput>

    <div class="buttons-row">
      <div class="buttons">
        <CRSpinner
          bind:button={btnCreate}
          spinOn={loading}
          caption="create"
          formaction="?/create"
          disabled={!formDataValid}
          hidden={false}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnUpdate}
          spinOn={loading}
          caption="update"
          formaction="?/update"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnDelete}
          spinOn={loading}
          caption="delete"
          formaction="?/delete"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnCreate}
          spinOn={loading}
          caption="create"
          formaction="?/create"
          disabled={!formDataValid}
          hidden={false}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnUpdate}
          spinOn={loading}
          caption="update"
          formaction="?/update"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnDelete}
          spinOn={loading}
          caption="delete"
          formaction="?/delete"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnCreate}
          spinOn={loading}
          caption="create"
          formaction="?/create"
          disabled={!formDataValid}
          hidden={false}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnUpdate}
          spinOn={loading}
          caption="update"
          formaction="?/update"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnDelete}
          spinOn={loading}
          caption="delete"
          formaction="?/delete"
          disabled={!formDataValid}
          hidden={true}
        ></CRSpinner>
        <button onclick={clearForm}>clear form</button>
      </div>
    </div>
  </div>
</form>
<pre>How to use deleteIcon an HTMLSpanElement
The delete icon X has to be rendered via render deleteIcon(true/false)
inside a list elements item meant to be deleted specifying a boolean
which when true allows deletion  but when false show not-allowed pointer
and a tooltip 'owner permission'
</pre>

<div style="border:0;padding:0">
  This is a list item to be deleted{@render deleteIcon(true)}
</div>

<style lang="scss">
  .form-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: max-content;
    padding: 1rem;
    margin: 5rem auto;
    border: 0.3px solid gray;
    border-radius: 8px;
    .buttons {
      display: flex;
      gap: 0.3rem;
      justify-content: flex-end;
      align-items: center;
      button {
        display: inline-block;
      }
    }
  }
  .icon-delete {
    display: inline-block;
    width: max-content;
    padding: 3px 8px;
    border: 1px solid gray;
    border-radius: 4px;
  }
  .pink {
    color: pink;
  }
</style>
