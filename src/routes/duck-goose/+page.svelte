<script lang="ts">
  import { browser } from '$app/environment';
  import InputBox from '$lib/components/InputBox.svelte';
  // const duck = new URL('./duck.jpeg', import.meta.url).href;
  // const goose = new URL('./goose.jpeg', import.meta.url).href;

  import duck from './duck.jpeg';
  import goose from './goose.jpeg';
  // import { read } from '$app/server';
  type TUser = {
    firstName: string;
    lastName: string;
  };
  const not_specified = 'not specified';
  const user: TUser = {
    firstName: '',
    lastName: '',
  };
  let bird = duck;
  let btn: HTMLButtonElement;
  const get = () => {
    bird = bird === duck ? goose : duck;
    btn.innerText = bird === duck ? 'show goose' : 'show duck';
  };
</script>

<svelte:head>
  <title>Duck - Goose</title>
</svelte:head>

<div class="wrapper">
  <div>
    <InputBox
      title="firstName"
      exportValueOn="enter|blur"
      capitalize={true}
      bind:value={user.firstName}
      required={true}
    />
    <InputBox
      title="lastName"
      exportValueOn="enter|blur"
      capitalize={true}
      bind:value={user.lastName}
      required={true}
    />
    {#if bird}
      <img src={bird} alt="" />
    {/if}
    <button bind:this={btn} onclick={get}>show goose</button>
  </div>
  <div>
    <pre>
  Enter First Name and Last Name pressing Enter key

  type TUser = &lcub;
    firstName:string
    lastName:string
  &rcub; 
  User &lcub; 
    firstName: <span class:user={user.firstName !== not_specified}
        >{user.firstName}</span
      >
    lastName: <span class:user={user.lastName !== not_specified}
        >{user.lastName}</span
      >
  &rcub;
  </pre>
  </div>
</div>
<!-- even onMount click on a button to get bird does not work
	looks like this is the only solution, though there is a flick
-->
<svelte:window on:load={() => get()} />

<style lang="scss">
  .wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: max-content;
    margin: 3rem auto;
    img {
      width: 20rem;
      height: 20rem;
      background: #222;
    }
    button {
      display: block;
      margin: 1rem 0 0 3rem;
      width: 14rem;
    }
  }
  .user {
    color: yellow;
  }
</style>
