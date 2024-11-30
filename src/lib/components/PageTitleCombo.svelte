<script lang="ts">
  import { id } from '$lib/utils';
  import { onMount } from 'svelte';

  type ARGS = {
    PageName: string;
    user: UserPartial;
    users: UserPartial[] | [];
    selectedUserId: string;
    result: string;
  };
  let {
    PageName,
    result = $bindable(),
    selectedUserId = $bindable(),
    user,
    users,
  }: ARGS = $props();

  if (users.length === 0) {
    users[0] = user as UserPartial;
  }

  let msgEl: HTMLSpanElement;
  let selectBox: HTMLSelectElement;
  let timer: NodeJS.Timeout | string | number | undefined; //ReturnValue<typeof setTimeout>;
  const killTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  const scheduleClearMessage = () => {
    killTimer();
    timer = setTimeout(() => {
      result = '';
      if (msgEl) {
        msgEl.innerText = '';
      }
    }, 2000);
  };
  const showResult = () => {
    scheduleClearMessage();
    return result;
  };
  let userName = $derived.by(() => {
    let aUser = users.filter((u) => u.id === selectedUserId)[0] as UserPartial;
    if (aUser) {
      return `${aUser?.firstName} ${aUser?.lastName}`;
    } else {
      return `${user.firstName} ${user.lastName}`;
    }
  });
  // $effect(() => {
  //   selectBox.value = selectedUserId.slice(0, -2);
  // });

  onMount(() => {
    selectedUserId = user.id;
    // if (selectBox) {
    //   selectBox.value = selectedUserId;
    // }
  });
</script>

<h1>
  {PageName} Page
  {#if user?.role === 'ADMIN'}
    <select bind:this={selectBox} bind:value={selectedUserId}>
      <!-- <option value="x" selected={true}>Select an Author</option> -->
      {#each users as the_user}
        <option value={the_user.id}>
          {the_user.firstName}
          {the_user.lastName}
        </option>
      {/each}
    </select>
  {/if}
  <span class="user-name">{userName}</span>
  {#key result}
    {#if result !== ''}
      <span bind:this={msgEl} class="message">{showResult()}</span>
    {/if}
  {/key}
</h1>

<style lang="scss">
  h1 {
    display: flex;
    align-items: baseline;
    margin-left: 1rem;
    .message,
    .user-name {
      display: inline-block;
      font-size: 14px;
      font-weight: 100;
      color: yellow;
      margin-left: 1rem;
    }
    .user-name {
      color: white;
    }
    // select {
    //   margin-left: 1rem;
    // }
  }
</style>
