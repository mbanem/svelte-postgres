<script lang="ts">
  // user/+page.svelte
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

  type UserPartial = {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    role: Types.Role | null;
    updatedAt: Date | null;
  };
  let nullSnap = {
    email: null,
    firstName: null,
    id: null,
    lastName: null,
    password: null,
    role: null,
    updatedAt: null,
  } as UserPartial;

  const crId_ = () => {
    return snap_().id;
  };
  let snap = $state<UserPartial>((data.locals.user as UserPartial) ?? nullSnap);
  const snap_ = () => {
    return snap;
  };
  let selectedUserId = $state(data.locals.user.id);
  const selectedUserId_ = () => {
    return selectedUserId;
  };

  $effect(() => {
    const selUserId = selectedUserId_();
    if (selUserId && data.users) {
      const u = data.users.filter((user) => user.id === selUserId)[0]; // as UserPartial;
      if (u) {
        snap = {
          email: u.email,
          firstName: u.firstName,
          id: u.id,
          lastName: u.lastName,
          password: '',
          role: u.role,
          updatedAt: u.updatedAt,
        };
      }
    }
    // set buttons state based on id value and formValid status
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

  let formDataValid: boolean[] = $derived.by((): boolean[] => {
    if (!snap_()) return [false, false];
    const status = [true, false]; // formDataValid, anyFieldForUpdate
    for (const [key, value] of Object.entries(snap_())) {
      if ('id|updatedAt'.includes(key)) continue;
      if (!value) status[0] = false;
      if (value) status[1] = true;
    }
    return status;
  });

  $effect(() => {
    let idOK = ((crId_() as string).length === 36) as boolean;
    btnCreate.disabled = idOK || !formDataValid[0];
    btnUpdate.disabled = !idOK || !formDataValid[1];
    btnDelete.disabled = !idOK;
  });

  const capitalize = (str: string) => {
    const spaceUpper = (su: string) => {
      return ` ${su[1]?.toUpperCase()}`;
    };

    return str
      .replace(/(_\w)/, spaceUpper)
      .replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase());
  };

  const clearForm = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    snap = nullSnap;
    utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
  };

  const enhanceSubmit: SubmitFunction = async ({ action, formData }) => {
    const required: string[] = [];
    for (const [key, value] of Object.entries(snap)) {
      formData.set(key, value as string);
      if (!value) {
        const req = key + ' is required';
        const el = document.querySelector('[title="' + key + '"]');
        if (el) {
          (el as HTMLInputElement).placeholder += req;
          required.push(req);
        }
      }
    }

    if (required.join('').length) {
      return;
    }
    loading = true; // start spinner animation

    result =
      action.search === '?/create'
        ? 'creating user...'
        : action.search === '?/update'
          ? 'updating user...'
          : 'deleting user...';
    if (action.search === '?/delete') {
      utils.hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
    }

    return async ({ update }) => {
      await update();

      if (action.search === '?/create') {
        result = page.status === 200 ? 'user created' : 'create failed';
      } else if (action.search === '?/update') {
        result = page.status === 200 ? 'user updated' : 'update failed';
      } else if (action.search === '?/delete') {
        result = page.status === 200 ? 'user deleted' : 'delete failed';
        // iconDelete.classList.toggle('hidden');
        utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
      }
      invalidateAll();
      await utils.sleep(1000);
      loading = false; // stop spinner animation
      clearForm();
      utils.hideButtonsExceptFirst([btnCreate, btnUpdate, btnDelete]);
      clearMessage();
    };
  };
  let owner = true;
  const toggleColor = (event: MouseEvent, caption?: string) => {
    console.log('caption', caption);
    const grand = (event.target as HTMLSpanElement)?.parentElement
      ?.parentElement;

    const style = grand?.parentElement?.style;
    if (style) {
      style.color = style.color === 'red' ? 'blue' : 'red';
    }
  };
</script>

<svelte:head>
  <title>user Page</title>
</svelte:head>
<CRActivity
  PageName="user"
  bind:result
  bind:selectedUserId
  user={data.locals.user}
  users={data.users}
></CRActivity>

<form action="?/create" method="post" use:enhance={enhanceSubmit}>
  <div class="form-wrapper">
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
      title="firstName"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.firstName as string}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="id"
      exportValueOn="enter|blur"
      type="text"
      capitalize={false}
      bind:value={snap.id as string}
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
      title="password"
      exportValueOn="enter|blur"
      type="password"
      capitalize={false}
      bind:value={snap.password as string}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="role"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.role as Types.Role}
      required={true}
      width="22.5rem"
    ></CRInput>
    <CRInput
      title="updatedAt"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.updatedAt as Date}
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
        ></CRSpinner>
        <CRSpinner
          bind:button={btnUpdate}
          spinOn={loading}
          caption="update"
          formaction="?/update"
          disabled={!formDataValid}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnDelete}
          spinOn={loading}
          caption="delete"
          formaction="?/delete"
        ></CRSpinner>
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
  CRTooltip:has(> span) {
    display: flex;
    align-items: baseline;
  }
</style>
