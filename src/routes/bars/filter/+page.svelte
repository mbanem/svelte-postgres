<script lang="ts">
  import FilterableList from './FilterableList.svelte';
  import { colors, type Color } from './colors';

  // let row = colors[0];
</script>

<svelte:head>
  <title>Filterable List</title>
</svelte:head>

<FilterableList data={colors} field="name">
  {#snippet header()}
    <header class="row">
      <span class="color"></span>
      <span class="name">name</span>
      <span class="hex">hex</span>
      <span class="rgb">rgb</span>
      <span class="hsl">hsl</span>
    </header>
  {/snippet}

  {#snippet item_row(c: Color)}
    <div class="row">
      <span class="color" style="background-color: {c.hex}"></span>
      <span class="name">{c.name}</span>
      <span class="hex">{c.hex}</span>
      <span class="rgb">{c.rgb}</span>
      <span class="hsl">{c.hsl}</span>
    </div>
  {/snippet}
</FilterableList>

<style lang="scss">
  .row {
    display: grid;
    width: 47rem;
    align-items: flex-start;
    grid-template-columns: 6rem 9rem 6rem 12rem 12rem;
    gap: 1em;
    border-radius: 0.2em;
    color: navy;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 16px;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    height: 1.6rem;
  }
  .row:not(header) {
    color: lightgreen;
    border: none;
  }
  header {
    font-weight: normal;
    text-transform: capitalize;
    background-color: cornsilk;
  }

  .row:not(header):hover {
    color: yellow;
    cursor: pointer;
    border-bottom: 1px solid yellow;
  }

  .color {
    aspect-ratio: 1;
    height: 30px;
    width: 6rem;
    border-radius: 0.1em;
  }

  .rgb,
  .hsl {
    display: none;
  }

  @media (min-width: 50rem) {
    .row {
      grid-template-columns: 6rem 9rem 6rem 12rem 12rem;
      margin-right: 0;
    }

    .rgb {
      display: block;
    }
  }

  @media (min-width: 60rem) {
    .row {
      grid-template-columns: 6rem 9rem 6rem 12rem 12rem;
    }

    .hsl {
      display: block;
    }
  }
</style>
