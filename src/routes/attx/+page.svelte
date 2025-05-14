<!-- Parent.svelte -->
<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  const printReport = () => {
    console.log('printing the report...');
  };
  const props = {
    delay: 800,
    preferredPos: 'bottom,right,top,left',
  };
</script>

{#snippet tooltipPanel(panelStyle: string)}
  <div class="tooltip-panel" style={panelStyle}>
    <p>John Doe</p>
    <p>44 Sunset Ave</p>
    <p>Los Angeles</p>
    <p>California</p>
  </div>
{/snippet}

<div style="margin: 36rem 10rem">
  <Tooltip {tooltipPanel} {...props}>
    <button onclick={printReport}>Print Report</button>
  </Tooltip>
  <!-- TEST make viewport -->
  <p style="margin: 80rem 180rem">80rem x 80rem</p>
</div>

<style lang="scss">
  .tooltip-panel {
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
