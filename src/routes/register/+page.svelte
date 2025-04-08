<script lang="ts">
  import type { Snapshot } from '../$types'; // .sveltekit/$types
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import * as utils from '$utils';
  import type { SubmitFunction } from '@sveltejs/kit';
  import InputBox from '$lib/components/InputBox.svelte';
  import type { ActionData } from './$types';
  type TData = {
    locals: App.Locals;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
  };
  type TProps = { data: TData; form: ActionData };
  let { data, form }: TProps = $props();
  // let data = $derived(form.data)

  let firstNameIsRequired = '';
  let lastNameIsRequired = '';
  let emailIsRequired = '';
  let passwordIsRequired = '';

  let loading = false;
  let ignoreFormMessage = false;
  const enhanceRegister: SubmitFunction = ({ action, formData }) => {
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
  let result: string;
  let message: string;
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

  type RegisterSnap = {
    firstName: string;
    lastName: string;
    email: string;
  };
  let snap = $state<RegisterSnap>({
    firstName: '',
    lastName: '',
    email: '',
  });
  export const snapshot: Snapshot = {
    capture: () => {
      return snap;
    },
    restore: (value) => {
      snap = value;
    },
  };

  // const shallowCopy = (source: Object, target: Object) => {
  // 	for (const [k, v] of Object.entries(source)) {
  // 		target[key] = v;
  // 	}
  // };
  onMount(() => {
    utils.shallowCopy(data, snap);
    return () => {
      utils.setMrPath(page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<h2>Register Page</h2>

<div class="container">
  {#if form?.message}
    <p class="error">{form.message}</p>
  {/if}
  <form method="POST" action="?/register" use:enhance={enhanceRegister}>
    <div>
      <!-- <label for="firstName">
        First Name
        <input
          type="text"
          name="firstName"
          bind:value={snap.firstName}
          placeholder={firstNameIsRequired || 'Enter first name here'}
        />
      </label> -->
      <InputBox
        title="first name"
        bind:value={snap.firstName}
        entryIsRequiredMsg="first name is required"
        exportValueOn="enter"
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="last name"
        bind:value={snap.lastName}
        entryIsRequiredMsg="last name is required"
        exportValueOn="enter"
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="email"
        bind:value={snap.email}
        entryIsRequiredMsg="email is required"
        exportValueOn="enter"
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="first name"
        type="password"
        entryIsRequiredMsg="password is required"
        exportValueOn="enter"
      ></InputBox>
    </div>
    <button type="submit">Register</button>
  </form>
</div>

<style lang="scss">
  .container {
    width: 20rem;
    margin: 3rem auto;
    padding: 1rem;
  }
  .error {
    color: pink;
  }
</style>
