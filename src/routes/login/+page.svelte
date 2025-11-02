<script lang="ts">
  import type { PageData, ActionData, Snapshot } from '../$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import * as utils from '$lib/utils';
  import InputBox from '$lib/components/InputBox.svelte';

  // export let form: ActionData;
  type ARGS = {
    data: PageData;
    form: ActionData;
  };
  let { data, form }: ARGS = $props();

  type TSnapLogin = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  let snap: TSnapLogin = $state({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  export const snapshot: Snapshot = {
    capture: () => {
      return snap;
    },
    restore: (value) => {
      snap = value;
    },
  };
  let loading = false;
  let ignoreFormMessage = false;
  let message: string;

  const enhanceLogin: SubmitFunction = ({ action, formData }) => {
    formData.set('firstName', snap.firstName);
    formData.set('lastName', snap.lastName);
    formData.set('email', snap.email);
    formData.set('password', snap.password);

    console.log('formData', formData);
    ['firstName', 'lastName', 'email', 'password'].forEach((name) => {
      if (formData.get(name) === '')
        `${name}IsRequired=${name[0]?.toUpperCase()}${name.slice(1)} is required`;
    });
    loading = true;
    ignoreFormMessage = true;
    // cannot use page.status === 200 as on successful login we redirect to the home page
    message =
      action.search === '?/register'
        ? 'registering account...'
        : 'updating account...';
  };

  $effect(() => {
    utils.setPlaceholderColor(
      form?.message
        ? form.message.includes('successfully')
          ? 'lightgreen'
          : 'pink'
        : 'lightgreen',
    );
    message = form?.message || '';
  });
  onMount(() => {
    return () => {
      utils.setMrPath(page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
<h1>Log In</h1>
<div class="container">
  {#if form?.data}
    <p class="error">Insufficient or incorrect data supplied</p>
  {/if}
  <form method="POST" action="?/login" use:enhance={enhanceLogin}>
    <div>
      <InputBox
        id="x1"
        type="text"
        title="firstName"
        bind:value={snap.firstName}
        exportValueOn="blur"
        capitalize={true}
      />
    </div>
    <div>
      <InputBox
        id="x2"
        type="text"
        title="lastName"
        bind:value={snap.lastName}
        exportValueOn="blur"
        capitalize={true}
      />
    </div>
    <div>
      <InputBox
        id="x3"
        type="text"
        title="email"
        exportValueOn="blur"
        bind:value={snap.email}
      />
    </div>
    <div>
      <InputBox
        id="x4"
        type="password"
        exportValueOn="blur"
        title="password"
        bind:value={snap.password}
      />
    </div>
    <button type="submit" style="margin-top:1rem;">login</button>
  </form>
</div>

<style lang="scss">
  .container {
    width: 20rem;
    margin: 3rem auto;
    padding: 1rem;
  }
</style>
