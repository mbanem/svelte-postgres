<script lang="ts">
  import Tooltip from './Tooltip.svelte';

  const props = {
    delay: 250,
    duration: 800,
    baseScale: 0,
    caption: 'Printing the Report',
  };

  const printReport = () => {
    console.log('printing the report');
  };
</script>

<div class="main">
  {#snippet tooltipPanel(class_name?: string)}
    <div class={class_name}>
      <p style="color:lightgreen;font-size:22px;margin:0;">
        Filip Isakovic, Junior
      </p>
      <p style="color:yellow;margin:2px;">6524 Cascade St.</p>
      <p style="color:yellow;margin:2px;">San Diego, 92122</p>
      <p style="color:yellow;margin:2px;">California</p>
    </div>
  {/snippet}

  <Tooltip
    {...props}
    {tooltipPanel}
    class_tooltipPanel={'css-prop-tooltipPanel'}
  >
    <button onclick={printReport}>print report</button>
  </Tooltip>
</div>
<button style="margin:250rem 0 0 250rem;">print report</button>

<style>
  /* for test on scrolling down */
  .main {
    height: 3vh;
    width: 2vw;
  }
  /* classes sent as props to component must be wrapped in :global() */
  .tooltip-wrapper {
    /* position: relative; */
    width: max-content;
    padding: 1rem 2rem;
    margin: 6rem 10rem !important;
    border: 1px solid gray;
    border-radius: 5px;
    color: white;
    background-color: navy;
    cursor: pointer;
  }
  :global(.css-prop-tooltipPanel) {
    position: absolute;
    top: 0 !important;
    left: 0;
    color: navy;
    background-color: skyblue;
    width: 14.5rem;
    padding: 3px 1.4rem;
    border-radius: 5px;
    margin: 2rem 0 0 2.3rem;
    text-align: center;
    z-index: 10;
  }
</style>
