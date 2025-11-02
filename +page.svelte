<script lang="ts">
// aaa-user/+page.svelte
import type { Snapshot } from '../$types';
import { onMount } from 'svelte';
import type { PageData, ActionData } from './$types';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { page } from '$app/state'; // for page.status code on actions

import * as utils from '$lib/utils';
import * as Types from '$lib/types/types';
import CRInput from '$lib/components/CRInput.svelte';
import CRSpinner from '$lib/components/CRSpinner.svelte';
import CRActivity from '$lib/components/CRActivity.svelte';
import CRTooltip from '$lib/components/CRTooltip.svelte';
import CRSummaryDetail from '$lib/components/CRSummaryDetail.svelte';

type ARGS = {
  data: PageData;
  form: ActionData;
};
let { data, form }: ARGS = $props();

let nullSnap = {
  email: null,
  firstName: null,
  id: null,
  lastName: null,
  password: null,
  role: null,
  updatedAt: null
} as UserPartial;
let snap = $state<UserPartial>(data.locals.user ?? nullSnap);
const snap_ = () => {
  return snap;
};
let selectedUserId = $state<string>(
  (data.locals.user && data.locals.user.id) ?? '',
);
const selectedUserId_ = () => {
  return selectedUserId;
};
$effect(() => {
    const suId = selectedUserId_();
    if (suId) {
      const u: UserPartial = data.users.filter(
        (user) => user.id === suId,
      )[0] as UserPartial;
      if (u) {
        snap = {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          password: '',
          role: u.role,
        };
      }
    }
  });
let loading = $state<boolean>(false); // toggling the spinner
let btnCreate: HTMLButtonElement;
let btnUpdate: HTMLButtonElement;
let btnDelete: HTMLButtonElement;
let iconDelete: HTMLSpanElement;
let result = $state('');
const clearMessage = () => {
  setTimeout(() => {
    result = '';
  }, 2000);
};
    
const capitalize = (str:string) => {
  const spaceUpper = (su:string) => {
    return ` ${su[1]?.toUpperCase()}`
  }
        
  return str
  .replace(/(_\w)/, spaceUpper)
  .replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase())
}
    
let formDataValid = $derived.by(() => {
  if (!snap_()) return false;
    for (const [key, value] of Object.entries(snap_())) {
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
    ? "creating aaa-user..."
    : action.search === '?/update'
    ? "updating aaa-user..."
    : "deleting aaa-user..."
  if (action.search === '?/delete') {
    utils.hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
  }
    
  return async ({ update }) => {
    await update();
      
    if (action.search === '?/create') {
      result = page.status === 200 ? "aaa-user created" : 'create failed';
    } else if (action.search === '?/update') {
      result = page.status === 200 ? "aaa-user updated" : 'update failed';
    } else if (action.search === '?/delete') {
      result = page.status === 200 ? "aaa-user deleted" : 'delete failed';
      // iconDelete.classList.toggle('hidden');
      utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
    }
    invalidateAll();
    await utils.sleep(1000);
    loading = false; // stop spinner animation
    clearForm();
    utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
    clearMessage();
  }

      
  }
  let owner = true;
  const toggleColor = (event: MouseEvent, caption?: string) => {
  console.log('caption', caption)
  const grand = (event.target as HTMLSpanElement)?.parentElement?.parentElement;
  
  const style = grand?.parentElement?.style;
  if (style){
    style.color = style.color === 'red' ? 'blue' : 'red';
  }
};
</script>
<svelte:head>
  <title>aaa-user Page</title>
</svelte:head>
<CRActivity
  PageName='aaa-user'
  bind:result
  bind:selectedUserId
  user={data.locals.user}
  users={data.users}
></CRActivity>

<form action="?/create" method="post" use:enhance={enhanceSubmit}>
  <div class='form-wrapper'>
    <CRInput title="email"
        exportValueOn="enter|blur"
        type='text'
        capitalize={false}
        bind:value={snap.email as string}
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="firstName"
        exportValueOn="enter|blur"
        type='text'
        capitalize={true}
        bind:value={snap.firstName as string}
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="id"
        exportValueOn="enter|blur"
        type='text'
        capitalize={false}
        bind:value={snap.id as string}
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="lastName"
        exportValueOn="enter|blur"
        type='text'
        capitalize={true}
        bind:value={snap.lastName as string}
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="password"
        exportValueOn="enter|blur"
        type='password'
        capitalize={false}
        bind:value={snap.password as string}
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="role"
        exportValueOn="enter|blur"
        type='text'
        capitalize={true}
        bind:value={snap.role }
        required={true}
        width='22.5rem'
      >
      </CRInput>
      <CRInput title="updatedAt"
        exportValueOn="enter|blur"
        type='text'
        capitalize={true}
        bind:value={snap.updatedAt }
        required={true}
        width='22.5rem'
      >
      </CRInput>
      
    <div class='buttons-row'>
      <div class='buttons'>
          <CRSpinner
            bind:button={btnCreate}
            spinOn={loading}
            caption=create
            formaction="?/create"
            disabled={!formDataValid}
            hidden={!formDataValid}
          >
          </CRSpinner>
              <CRSpinner
            bind:button={btnUpdate}
            spinOn={loading}
            caption=update
            formaction="?/update"
            disabled={!formDataValid}
            hidden={!formDataValid}
          >
          </CRSpinner>
              <CRSpinner
            bind:button={btnDelete}
            spinOn={loading}
            caption=delete
            formaction="?/delete"
            disabled={!formDataValid}
            hidden={!formDataValid}
          >
          </CRSpinner>
          <button onclick={clearForm}>clear form</button>
      </div>
    </div>
  </div>
</form>
<div style="border:0;padding:0; color:green;">
  This is a list item to be deleted{@render iconHandler(
    true,
    'delete item',
    'fa fa-trash',
  )}
</div>
<div style="border:0;padding:0; color:green;">
  This is a list item to be deleted by not owner{@render iconHandler(
    false,
    'delete item',
    'fa fa-trash',
  )}
</div>
<div style="border:0;padding:0; color:blue;">
  This is a list item for toggling color{@render iconHandler(
    true,
    'toggle color',
    'fa-duotone fa-solid fa-paint-roller',
    (event: MouseEvent) => toggleColor(event, 'toggle color'),
  )}
</div>

{#snippet iconHandler(
  owner: boolean,
  caption: string,
  iconClass: string,
  clickHandler?: Function | undefined,
)}
  {#if owner}
    <CRTooltip {caption}>
      <span
        onclick={clickHandler
          ? (event: MouseEvent) => clickHandler(event, caption)
          : (event: MouseEvent) =>
              // @ts-expect-error
              event.target.parentElement?.parentElement?.parentElement.remove()}
        aria-hidden={true}
        style:cursor={owner ? 'pointer' : 'not-allowed'}
        style="margin=0 0.5rem;font-size:20px;color:cornsilk;border:1px solid gray;border-radius:4px;padding:2px 6px;"
      >
        <i class={iconClass}></i>
      </span>
    </CRTooltip>
  {:else}
    <CRTooltip caption="no owner permission">
      <span
        style:cursor={owner ? 'pointer' : 'not-allowed'}
        style="margin=0 0.5rem;font-size:20px;color:#c3909b;border:1px solid gray;border-radius:4px;padding:2px 6px;"
      >
        <i class={iconClass}></i>
      </span>
    </CRTooltip>
  {/if}
{/snippet}
<pre>How to use an Font Awesome iconHandler -- a child of a parent
It is rendered as @render iconHandler(boolean, caption, faIconClass, clickHandler?)
The fist argument when true allows action to be carried on, otherwise
it shows a 'not-allowed pointer' with tooltip 'no owner permission'.
The caption argument is a tooltip text displayed with delay when icon is hovering.
The faIconClass is the class name copied from an https://fontawesome.com/ page when
searching for an icon and extracting className from icon <i class="className"
  ></i>.
A clickHandler is an optional function reference to be called when icon is
clicked. As the icon is deeply buried in CRTooltip and span elements the user's 
clickHandler, which gets mouse event, should access its grandParent wrapper as
const parent = (event.target as HTMLSpanElement)?.parentElement.parentElement;
There are three examples above two to delete the parent with owner and not owner
and the third to toggle parent's color. 
</pre>

<style lang='scss'>
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
  .icon-delete{
    display: inline-block;
    width: max-content;
    padding: 3px 8px;
    border: 1px solid gray;
    border-radius: 4px;
  }
  .pink{
    color: pink;
  }
  CRTooltip:has(> span) {
    display: flex;
    align-items: baseline;
  }
</style>
