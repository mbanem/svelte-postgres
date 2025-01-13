<script lang="ts">
  import { SvelteURL } from 'svelte/reactivity';
  // const url = new SvelteURL(
  //   'https://translate.google.com/#view=home&op=translate&sl=en&tl=sr',
  // );
  // Snippet is a construct that is imported from svelte
  import type { Snippet } from 'svelte';
  import * as utils from '$utils';

  // snippets could accept parameters so we define their types
  // we render two tables Fruit and Employees
  type Fruit = {
    name: string;
    quantity: number;
    price: number;
  };
  type Employee = {
    id: number;
    name: string;
    role: string;
    salary: number;
  };

  type Data = Fruit | Employee;
  let fruitUrl: SvelteURL;
  let employeeUrl: SvelteURL;
  // header snippet gets no parameters so it is of type Snippet
  // while row snippet works on Fruit or Employee and is so
  // defined as Snippet<Fruit|Employee>
  type PROPS = {
    data: Data[];
    header: Snippet;
    row: Snippet<Data[]>;
    s_url?: string;
  };
  let { data, header, row, s_url }: PROPS = $props();
  let url = $derived(
    s_url === undefined ? '' : new SvelteURL(s_url),
  ) as SvelteURL;

  // if (utils.isKeyOf('price', data[0])) {
  if (Object.keys(data[0] as Data).includes('price')) {
    fruitUrl = url;
  } else {
    employeeUrl = url;
  }

  let table = Object.keys(data[0] as Fruit | Employee).includes('price')
    ? 'table-fruit'
    : 'table-employee';
</script>

<div class={table}>
  {@render header()}
  <!-- {#each data as item} -->
  {@render row(data)}
  <!-- {/each} -->
</div>

{#snippet snippet_url(url: SvelteURL)}
  <div style="margin-top:2rem;">
    <p>href</p>
    <input bind:value={url.href} /><br />
    <p>protocol</p>
    <input bind:value={url.protocol} /><br />
    <p>hostname</p>
    <input bind:value={url.hostname} /><br />
    <p>pathname</p>
    <input bind:value={url.pathname} /><br />
  </div>
{/snippet}

{#if Object.keys(data[0] as Data).includes('price')}
  {@render snippet_url(fruitUrl)}
{:else}
  {@render snippet_url(employeeUrl)}
{/if}

<style lang="scss">
  .table-fruit,
  .table-employee {
    display: grid;
    width: 24rem;
    grid-template-columns: 1fr 1fr 3rem;
    grid-template-rows: 3.5rem 1.6rem 1.6rem 1.6rem;
    justify-content: space-between;
  }
  .table-employee {
    margin-top: 2rem;
    grid-template-columns: repeat(4, 1fr);
  }
  input {
    display: inline-block;
    margin-top: 0.6em;
    width: 26rem;
  }
  p {
    display: inline-block;
    width: 5rem;
    padding: 0;
    margin: 0;
  }
</style>
