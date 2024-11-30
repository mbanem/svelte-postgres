<!--
@component
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type TData = {
    firstName: string;
    lastName: string;
  };
  type PROPS = {
    data: TData[];
    header: Snippet;
    row: Snippet<[item: TData]>;
  };
  let { data, header, row }: PROPS = $props();
  const colors = [
    'lightgreen',
    'cornflowerblue',
    'orange',
    'tomato',
    'pink',
    'forestgreen',
  ];
</script>

<div class="main">
  <div class="table">
    {@render header()}
    {#each data as item, ix}
      <div style:color={colors[ix % 6]}>
        {@render row(item)}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .main {
    margin: 3rem 0 0 1rem;
    border: 1px solid gray;
    .table {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
    }
  }
</style>
