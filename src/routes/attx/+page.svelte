<!-- Parent.svelte -->
<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  const printReport = () => {
    console.log('printing the report...');
  };
  const props = {
    delay: 800,
    duration: 1000,
    baseScale: 0,
    // translateX: '-0.2rem',
    // translateY: '-5.4rem',
    preferredPos: 'left,right,bottom,top,',
  };
</script>

{#snippet tooltipPanel(cssStyle: string)}
  <div class="tooltip-panel" style={cssStyle}>
    <p style="color:lightgreen;font-size:22px;margin:0;">
      Filip Isakovic, Junior
    </p>
    <p style="color:yellow;margin:2px;">6524 Cascade St.</p>
    <p style="color:yellow;margin:2px;">San Diego, 92122</p>
    <p style="color:yellow;margin:2px;">California</p>
  </div>
{/snippet}

<div style="margin: 40rem 86rem">
  <Tooltip {tooltipPanel} {...props}>
    <button onclick={printReport}>Print Report</button>
  </Tooltip>
</div>
<p style="margin: 80rem 180rem">80rem x 80rem</p>

<style lang="scss">
  .tooltip-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    padding: 0 1rem 0.5rem 1rem;
    border: 3px solid yellow;
    border-radius: 5px;
    color: yellow;
    background-color: navy;
  }
  .tooltip-panel p {
    padding: 0;
    margin: 0;
    text-align: center;
    height: 1rem;
    font-size: 14px;
  }
  .tooltip-panel p:first-child {
    color: skyblue;
    font-family: Times;
    font-size: 22px;
    padding: 3px 0 8px 0;
  }
</style>
