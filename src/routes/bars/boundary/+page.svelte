<script lang="ts">
  import CRTooltip from '$components/CRTooltip.svelte';
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
    (event.target as HTMLParagraphElement).classList.toggle('hover');
  };
</script>

<svelte:boundary>
  <CRTooltip
    caption={'click to render random number blocks'}
    preferredPos="right,bottpm,left,top"
  >
    <button id="btn" onclick={flakyClick}> render random numbers </button>
  </CRTooltip>

  <FlakyComponent {clearingOK}>
    <p>Flaky Component Children</p>
    <p style="color:lightgreen;">
      Rendering dots where you click in the Document
    </p>
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
      <div bind:this={divEl}></div>
    </div>
  </FlakyComponent>
  {#snippet failed(error: unknown, reset: () => void)}
    <!-- safe extraction -->
    <p>
      {error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error)}
    </p>

    <button onclick={reset}>oops! try again</button>
  {/snippet}
</svelte:boundary>

<pre class="right-column">
      The &lt;svelte:boundary&gt; could wrap a component in order to handle
      exceptions caused by the component and could inform of the
      exception and then on user's request (e.g. by selecting a button)
      reestablishes the previous state.
      Here a component deliberately tries to set the mouse state to null, 
      which causes the exception on which &lt;svelte:boundary&gt; reacted 
      with a message and a button 'try again'.
    </pre>

<style lang="scss">
  .grid-wrapper {
    grid-template-columns: 25rem 25rem 25rem;
  }
  .div-class {
    position: relative;
    width: 20rem;
    height: 20.5rem;
    padding: 0 2rem;
    background-color: cornsilk;
    border: 1px solid gray;
    border-radius: 1rem;
    border: 1px solid gray;
    overflow-y: auto;
  }
  .right-column {
    position: absolute;
    top: 2rem;
    right: 1rem;
  }
  .outline {
    border: 1px solid yellow;
    width: max-content;
  }
  .flaky-header {
    color: lightgreen;
    background-color: navy;
    text-align: center;
    margin: 0.5rem 0;
    cursor: pointer;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 6px 1rem;
    &:hover {
      color: yellow;
    }
  }
</style>
