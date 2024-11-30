<script lang="ts">
  import { createState, CounterState } from './state.svelte';

  let {
    firstName,
    lastName,
    step,
  }: {
    firstName: string;
    lastName: string;
    step: number;
  } = $props();

  // NOTE: class is not a static one and must be instantiated
  // call factory to instantiate state and save it as stateOne
  const stateOne = createState();

  // instantiate state class itself ans save it as stateTwo
  const stateTwo = new CounterState();
</script>

<div class="container">
  <h1>
    {#if step === 1}
      {firstName}
    {:else if step >= 2}
      {firstName} {lastName}
    {/if}
  </h1>
  <p>Two class instances of CounterState class</p>
  <button onclick={stateOne.increment}>
    counterOne count: {stateOne.value}</button
  >
  <button onclick={() => stateTwo.increment()}
    >counterTwo count: {stateTwo.value}</button
  >
</div>

<style lang="scss">
  .container {
    @include container($title: 'User Name', $head-color: lightgreen);
  }
</style>
