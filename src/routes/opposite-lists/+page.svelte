<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import InsetButtons from './inset-buttons.svelte';

  const [send, receive] = crossfade({ duration: 1000 });

  let left = ['red', 'orange', 'green', 'purple'];
  let right = ['yellow', 'blue'];

  const move = (item: string, from: string[], to: string[]) => {
    to.push(item);
    return [from.filter((i) => i !== item), to];
  };

  const moveLeft = (item: string) => {
    // @ts-expect-error
    [right, left] = move(item, right, left);
  };

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
    <div class="list">
      {#each left as item (item)}
        <button
          animate:flip={{ duration: 2000 }}
          in:receive={{ key: item }}
          out:send={{ key: item }}
          onclick={() => moveRight(item)}
          style="background-color:{item} !important;font-weight:700"
          style:color={item === 'yellow' ? 'black' : 'white'}
        >
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
          style:color={item === 'yellow' ? 'black' : 'white'}
        >
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
    // margin: 0 auto;
    // margin-left: 4rem;
    width: max-content;
    grid-template-columns: 1fr 1fr;
    margin-left: 3rem;
    .first-grid-row {
      grid-column: 1/3;
      margin: 1rem 2rem 1rem 0;
    }
  }
  button {
    // background-color: cornflowerblue;
    border: none;
    // color: white;
    padding: 10px;
    margin-bottom: 10px;
    width: 5rem;
    text-align: center !important;
  }

  .list {
    display: inline-block;
    margin-right: 30px;
    vertical-align: top;
    width: 70px;
  }
  .left-item,
  .right-item {
    border: 1px solid yellow;
    border-radius: 8px;
  }
  .right-item {
    border-color: skyblue;
  }
</style>
