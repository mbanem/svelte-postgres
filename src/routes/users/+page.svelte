<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import * as utils from '$lib/utils';

  import type { PageData } from './$types';
  type TLocals = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };

  type TUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    userAuthToken: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  type TProps = {
    locals: TLocals;
    users: TUser[];
    status: string;
  };

  let { data }: TProps = $props();

  let locals = $state<TLocals>(data.locals);
  let users = $state<TUsers>(data.users);
  console.log('locals', locals);
  console.log('users', users);
  // $: ({ users } = data);
  // let users = $state<TUser[]>(data);
  const postDelete = async (id: string) => {
    // we immediately get a promise
    const response = await fetch(`/api/delete/[user]x[${id}]`, {
      method: 'POST',
      body: id,
    });

    // and with the promise we have to wait for the result
    const data = await response.json();
    // console.log(JSON.stringify(data, null, 2));
  };

  // onMount(() => {
  //   return () => {
  //     // @ts-expect-error
  //     utils.setMrPath.set(page.url.pathname);
  //   };
  // });
</script>

<svelte:head>
  <title>Users List</title>
</svelte:head>
<h1>User List</h1>
<!-- <pre>{JSON.stringify(data,null,2)}</pre> -->
<ul>
  {#if users}
    {#each users as { id, firstName, lastName, email }}
      <li class="post-list">
        <button onclick={() => postDelete(id)} type="button">❌</button>
        <a href="/user?id={id}">{firstName} {lastName}</a>
      </li>
    {/each}
  {:else}
    <pre>There are no registered users in database yet</pre>
  {/if}
</ul>

<style lang="scss">
  .post-list {
    display: flex;
    gap: 8px;
    align-items: center;
    a {
      display: inline-block;
      width: 10rem;
      height: 1.6rem;
      line-height: 1.6rem;
      text-align: left;
    }
  }
</style>
