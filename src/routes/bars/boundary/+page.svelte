<script lang="ts">
  // import { Tooltip } from 'flowbite-svelte';
  import FlakyComponent from './FlakyComponent.svelte';
  let divEl: HTMLDivElement;
  let clearingOK = $state(true);
  const flakyClick = () => {
    if (!divEl) return;
    for (let i = 0; i < 8; i++) {
      divEl.innerHTML += `<span style='display: inline-block;color:black;text-align:left;width:4rem;;margin-right: 0.5rem;'>${Math.floor(Math.random() * 100000000)}</span>`;
    }
  };
  const clearPanel = (event: MouseEvent) => {
    event.preventDefault();
    divEl.innerHTML = '';
  };
  const mouseOver = (event: MouseEvent) => {
    clearingOK = event.type === 'mouseenter' ? false : true;
    event.preventDefault();
    // console.log('mouseOver', event.type);
    (event.target as HTMLParagraphElement).classList.toggle('hover');
  };
</script>

{#snippet tooltip(title: string)}
  <!-- cannot control tooltip styling -->
  <!-- <Tooltip> -->
    {title}
  <!-- </Tooltip> -->
{/snippet}
<svelte:boundary>
  <FlakyComponent {clearingOK}>
    <p>Flaky Component Children</p>
    <p style="color:lightgreen;">
      Rendering dots where you click in the Document
    </p>
    <button id="btn" onclick={flakyClick}>flaky child button</button>
    <div class="div-class">
      <div
        class="flaky-header"
        onclick={clearPanel}
        onmouseenter={mouseOver}
        onmouseleave={mouseOver}
        aria-hidden={true}
      >
        flaky child button renders random numbers
      </div>
      {@render tooltip('click to clear the panel')}
      <div bind:this={divEl}></div>
    </div>
  </FlakyComponent>

  {#snippet failed(_, reset)}
    <button onclick={reset}>oops! try again</button>
  {/snippet}
</svelte:boundary>

<style lang="scss">
  .div-class {
    position: relative;
    // top: 4rem;
    // left: 50vw;
    width: 20rem;
    height: 20.5rem;
    padding: 0 2rem;
    background-color: cornsilk;
    border: 1px solid gray;
    border-radius: 1rem;
    border: 1px solid gray;
    overflow-y: auto;
  }
  .flaky-header {
    color: black;
    text-align: center;
    margin: 0.5rem 0;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
</style>
