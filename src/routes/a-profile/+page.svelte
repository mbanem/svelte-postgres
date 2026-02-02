<script lang="ts">
  // a-profile/+page.svelte
  import type { Snapshot } from '../$types';
  import { onMount } from 'svelte';
  import type { PageData, ActionData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/state'; // for page.status code on actions

  import * as utils from '$lib/utils';
  // import * as Types from '$lib/types/types';
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
    bio: null,
    id: null,
    updatedAt: null,
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

  const capitalize = (str: string) => {
    const spaceUpper = (su: string) => {
      return ` ${su[1]?.toUpperCase()}`;
    };

    return str
      .replace(/(_\w)/, spaceUpper)
      .replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase());
  };

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
        ? 'creating a-profile...'
        : action.search === '?/update'
          ? 'updating a-profile...'
          : 'deleting a-profile...';
    if (action.search === '?/delete') {
      utils.hideButtonsExceptFirst([btnDelete, btnCreate, btnUpdate]);
    }

    return async ({ update }) => {
      await update();

      if (action.search === '?/create') {
        result = page.status === 200 ? 'a-profile created' : 'create failed';
      } else if (action.search === '?/update') {
        result = page.status === 200 ? 'a-profile updated' : 'update failed';
      } else if (action.search === '?/delete') {
        result = page.status === 200 ? 'a-profile deleted' : 'delete failed';
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
</script>

<svelte:head>
  <title>a-profile Page</title>
</svelte:head>
<CRActivity
  PageName="a-profile"
  bind:result
  bind:selectedUserId
  user={data.locals.user}
  users={data.users}
></CRActivity>

<form action="?/create" method="post" use:enhance={enhanceSubmit}>
  <div class="form-wrapper">
    <CRInput
      title="bio"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.bio as string}
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
      title="updatedAt"
      exportValueOn="enter|blur"
      type="text"
      capitalize={true}
      bind:value={snap.updatedAt}
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
          hidden={!formDataValid}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnUpdate}
          spinOn={loading}
          caption="update"
          formaction="?/update"
          disabled={!formDataValid}
          hidden={!formDataValid}
        ></CRSpinner>
        <CRSpinner
          bind:button={btnDelete}
          spinOn={loading}
          caption="delete"
          formaction="?/delete"
          disabled={!formDataValid}
          hidden={!formDataValid}
        ></CRSpinner>
        <button onclick={clearForm}>clear form</button>
      </div>
    </div>
  </div>
</form>

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
</style>
