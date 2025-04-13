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

  // let firstNameIsRequired = '';
  // let lastNameIsRequired = '';
  // let emailIsRequired = '';
  // let passwordIsRequired = '';

  let loading = false;
  let ignoreFormMessage = false;

  const enhanceRegister: SubmitFunction = ({ action, formData }) => {
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
    password: string;
  };
  let snap: RegisterSnap = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  // export const snapshot: Snapshot = {
  //   capture: () => {
  //     return snap;
  //   },
  //   restore: (value) => {
  //     snap = value;
  //   },
  // };

  // const shallowCopy = (source: Object, target: Object) => {
  // 	for (const [k, v] of Object.entries(source)) {
  // 		target[key] = v;
  // 	}
  // };
  onMount(() => {
    // utils.shallowCopy(data, snap);
    return () => {
      utils.setMrPath(page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<h2>Register Page</h2>
<!-- <p>snap {JSON.stringify(snap, null, 2)}</p> -->
<div class="container">
  {#if form?.message}
    <p class="error">{form.message}</p>
  {/if}
  <form method="POST" action="?/register" use:enhance={enhanceRegister}>
    <div>
      <InputBox
        title="firstName"
        bind:value={snap.firstName}
        required={true}
        exportValueOn="enter|blur"
        capitalize={true}
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="lastName"
        bind:value={snap.lastName}
        required={true}
        exportValueOn="enter|blur"
        capitalize={true}
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="email"
        bind:value={snap.email}
        required={true}
        exportValueOn="enter|blur"
      ></InputBox>
    </div>
    <div>
      <InputBox
        title="password"
        type="password"
        bind:value={snap.password}
        required={true}
        exportValueOn="enter|blur"
      ></InputBox>
    </div>
    <button type="submit" style="margin-top:1rem;">Register</button>
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
