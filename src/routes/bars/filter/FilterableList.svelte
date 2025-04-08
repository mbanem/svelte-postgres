<script lang="ts">
  import type { Snippet } from 'svelte';
  import { type Color } from './colors';
  import InputBox from '$lib/components/InputBox.svelte';

  const inputBoxWidth = '16rem';
  type ARGS = {
    data: Color[];
    field: string;
    header: Snippet;
    item_row: Snippet<[Color]>;
  };
  let { data, field, header, item_row }: ARGS = $props();

  let search = $state('');

  let regex = $derived(search ? new RegExp(search, 'i') : null);
  // @ts-expect-error
  const matches = (item: Data) => (regex ? regex.test(item[field]) : true);
  const returnFalse = (event: MouseEvent) => {
    event.preventDefault();
    return false;
  };
</script>

<div class="list">
  <!-- to prevent clicking on label to turn focus on input we add returnFalse -->
  <label class="title" onclick={returnFalse} aria-hidden={true}>
    <p>Select color names containing this substring: &nbsp;</p>
    <!-- <input bind:value={search} /> -->
    <InputBox
      title="match substring"
      bind:value={search}
      width={inputBoxWidth}
      exportValueOn="keypress"
    ></InputBox>
  </label>

  <div class="header">
    {@render header()}
  </div>

  <div class="content">
    {#each data.filter(matches) as item}
      {@render item_row(item)}
    {/each}
  </div>
</div>

<style>
  /* input {
    padding: 2px 6px;
    height: 1.5rem;
    font-size: 18px;
    margin-top: 0.5rem;
  } */
  .list {
    display: flex;
    flex-direction: column;
    width: 49rem;
    height: 80vh;
    border: 1px solid gray;
    border-radius: 10px;
    margin: 0 auto;
    margin-top: 2rem;
    padding: 0 1rem;
    overflow-y: auto;
    font-size: 18px;
  }

  .header {
    padding: 0.2em 0;
    background-color: aliceblue;
    color: black;
    height: 1.5rem;
  }

  .content {
    flex: 1;
    overflow: auto;
    padding-top: 0.5em;
  }
  .title {
    display: flex;
    flex-direction: column;
    color: skyblue;
    margin: 1rem 0 0 3rem;
    display: inline-block;
    width: max-content;
  }
</style>
