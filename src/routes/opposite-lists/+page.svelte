<script lang="ts">
  // NOTE when element move from a source group to another group via crossfade
  // module the source group is animated into proper layout via the flip module
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import InsetButtons from './inset-buttons.svelte';

  // crossfade moves elements from a send group to the receive group
  const [send, receive] = crossfade({ duration: 1000 });

  // two groups of elements are generated based on color names
  // and are used as send and receive groups
  let left = ['red', 'orange', 'green', 'purple'];
  let right = ['yellow', 'blue'];

  const move = (item: string, from: string[], to: string[]) => {
    to.push(item);
    return [from.filter((el) => el !== item), to];
  };

  // two columns are involved and clicking on an element in right group moves it to the left one
  const moveLeft = (item: string) => {
    // @ts-expect-error
    [right, left] = move(item, right, left);
  };

  // two columns are involved and clicking on an element in left group moves it to the right one
  const moveRight = (item: string) => {
    // @ts-expect-error
    [left, right] = move(item, left, right);
  };
</script>

<svelte:head>
  <title>Opposite Lists</title>
</svelte:head>
<main class="main-class">
  <div>
    <InsetButtons></InsetButtons>
  </div>
  <div class="grid-block">
    <div class="first-grid-row">
      Click a button to move it<br /> to the opposite list.
    </div>
    <!-- two column buttons are rendered and the only difference are in onclick, style and color
        where onclick defines where item is moved to the left or right column
    -->
    <div class="list">
      {#each left as item (item)}
        <button
          animate:flip={{ duration: 2000 }}
          in:receive={{ key: item }}
          out:send={{ key: item }}
          onclick={() => moveRight(item)}
          style="background-color:{item} !important;font-weight:700"
          style:color={'yellow|orange'.includes(item) ? 'black' : 'white'}
        >
          <!-- if yellow or orange use black as more readable instead of white color -->
          {item}
        </button>
      {/each}
    </div>

    <div class="list">
      {#each right as item (item)}
        <button
          animate:flip={{ duration: 2000 }}
          in:receive={{ key: item }}
          out:send={{ key: item }}
          onclick={() => moveLeft(item)}
          style="background-color:{item} !important;opacity:0.5;"
          style:color={'yellow|orange'.includes(item) ? 'black' : 'white'}
        >
          <!-- if yellow or orange use black as more readable instead of white color -->
          {item}
        </button>
      {/each}
    </div>
  </div>
</main>

<style lang="scss">
  .main-class {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid gray;
    border-radius: 8px;
    width: 44rem;
    margin: 0 auto;
    margin-top: 3rem;
    text-align: center;
  }
  .grid-block {
    display: grid;
    width: max-content;
    grid-template-columns: 1fr 1fr;
    margin-left: 3rem;
    .first-grid-row {
      grid-column: 1/3;
      margin: 1rem 2rem 1rem 0;
    }
  }
  button {
    border: none;
    padding: 10px;
    margin: 0 0 6px 0;
    width: 5rem;
    text-align: center !important;
  }

  .list {
    display: inline-block;
    margin-right: 30px;
    vertical-align: top;
    width: 70px;
  }
</style>
