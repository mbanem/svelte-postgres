<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => {
    const getExtData = async () => {
      const res = await fetch('/data-fetching/api');
      const extData = (await res.json()) as {
        userTodos: {
          id: string | null;
          name: string;
          done: boolean;
        }[];
        categories: {
          id: number;
          name: string;
        };
      };
      // console.log('from page.svelte', extData);
    };
    getExtData();
  });

  let withBackground = $state(false);
  let bColor = $derived(withBackground ? 'white' : '#3e3e3e');
  const toggleBgColor = () => {
    withBackground = !withBackground;
  };
  // const complementaryHSL = (hex: string): string => {
  //   // Remove '#' if present
  //   hex = hex.slice(1);

  //   // Parse r, g, b components
  //   const r = parseInt(hex.slice(0, 2), 16);
  //   const g = parseInt(hex.slice(2, 4), 16);
  //   const b = parseInt(hex.slice(4, 6), 16);

  //   // Get complementary values
  //   const compR = (255 - r).toString(16).padStart(2, '0');
  //   const compG = (255 - g).toString(16).padStart(2, '0');
  //   const compB = (255 - b).toString(16).padStart(2, '0');

  //   return withBackground ? `#${compR}${compG}${compB}` : '';
  // };
</script>

<a href="/data-fetching/sub">Sub Page</a><br />
<div class="two-column-grid">
  <div>
    <h3>Fake Layout Data</h3>
    <p>{data.fakeLayoutData.toString()}</p>

    <h3>Random Strings</h3>
    {#await data.randomStrings}
      <p>Loading Strings</p>
    {:then randomStrings}
      <ul>
        {#each randomStrings as rStr}
          <li>{rStr}</li>
        {/each}
      </ul>
    {/await}

    <p>Sample Todos</p>
    <ul>
      {#each data.sampleTodos as sTodo}
        <li>{sTodo.name} - {sTodo.done ? 'Completed' : 'Todo'}</li>
      {/each}
    </ul>
    <p>Categories</p>
    <ul class="categories">
      {#each data.categories as category}
        <li>{category.name}</li>
      {/each}
    </ul>
  </div>

  <div onclick={toggleBgColor} onkeydown={toggleBgColor} aria-hidden={true}>
    <p class="title">Sample CSS Colors</p>
    Turn background white &nbsp;<input
      type="checkbox"
      bind:checked={withBackground}
    />
    &nbsp; click anywhere in this area to toggle the background color
    <ul class="columns" style={`background-color:${bColor}`}>
      {#each data.sampleCSSColors as sColor}
        <li style={`color: ${sColor.hex};`}>
          {sColor.name} - {sColor.hex}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  .two-column-grid {
    display: grid;
    grid-template-columns: 1fr 6fr;
    width: 99vw;
    // height: 70vh !important;
    gap: 0.5rem;
    div {
      border: 1px solid gray;
      border-radius: 1rem;
    }
  }
  .title {
    color: lightgreen;
    margin: 1rem 4.5rem 0 2rem;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 1rem;
    height: 76.5vh;
    overflow-y: auto;
  }
  .categories {
    height: 5rem;
    overflow-y: auto;
  }
</style>
