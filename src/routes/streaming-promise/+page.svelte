<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="main">
  <div>
    <pre>{JSON.stringify(data, null, 2).replace(/"/g, "'")}</pre>
    <p class="message">Regular message: {data.regular.message}</p>
  </div>
  <div>
    {#await data.categories}
      <h2>Waiting for Categories promise to resolve...</h2>
    {:then data}
      <div class="nested-grid">
        <div>
          <p class="categories">Categories</p>
          <ul>
            {#each data.categories as category}
              <li>id {category.id}: name {category.name}</li>
            {/each}
          </ul>
        </div>
        <div>
          <div class="array">
            <p>Returned Array</p>
            {@html JSON.stringify(data.categories, null, 2)
              .replace(/"(\d+|id|name)"/g, '$1')
              .replace(/"/g, "'")
              .replace(/}./g, '},<br/>')
              .replace(/(\[)/g, '[<br/>')
              .replace(/(\])/g, '<br/>]')
              .replace(/\{/g, ' &nbsp; &nbsp; {')}
          </div>
        </div>
      </div>
    {/await}
  </div>
</div>

<style lang="scss">
  .main {
    display: grid;
    grid-template-columns: 1fr 2fr;
    margin: 4rem 0 0 5rem;
    width: 60rem;
  }
  .nested-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  li,
  .categories {
    color: lightgreen;
  }
  .message {
    color: lightblue;
    font-size: 20px;
  }
  .array {
    font-size: 14px;
    color: skyblue;
  }
</style>
