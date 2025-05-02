<script lang="ts">
  import { browser } from '$app/environment';
  import Tooltip from './Tooltip.svelte';
  // allow user to set transition and translate parameters
  const props = {
    delay: 250,
    duration: 800,
    baseScale: 0,
    caption: 'Printing the Report',
    translateX: '-1.2rem',
    translateY: '-4.2rem',
    preferredPos: 't l r b',
  };
  let x = 0,
    y = 0;
</script>

<!-- 
	For creating complex tooltipPanel user should use snippet function
	and css classes should be local to the snippet as the <Tooltip>
	could send a class name for e.g. <div> element but what of embedded
	<p> and other tags. Looks like css/scss could be problematic
-->

{#snippet tooltipPanel(class_name: string)}
  <div class={class_name}>
    <p style="color:lightgreen;font-size:22px;margin:0;">
      Filip Isakovic, Junior
    </p>
    <p>6524 Cascade St.</p>
    <p>San Diego, 92122</p>
    <p>California</p>
  </div>
{/snippet}

<div class="main">
  <p>this is 200px x 200px page</p>
  <Tooltip
    {...props}
    {tooltipPanel}
    css_class_tooltipPanel={'css-prop-class_tooltipPanel'}
  >
    Hover to show tooltipPanel
  </Tooltip>
  <p style="margin: 10rem 0 0 10rem">position 10/10rem</p>
  <p style="margin: 20rem 0 0 20rem">position 20/20rem</p>
  <p style="margin: 50rem 0 0 50rem">position 50/50rem</p>
  <p style="margin: 100rem 0 0 100rem">position 100/100rem</p>
  <p style="margin: 150rem 0 0 150rem">position 150/150rem</p>
</div>

<style lang="scss">
  /* class sent as prop to component must be wrapped in :global() */
  :global(.css-prop-class_tooltipPanel) {
    position: absolute;
    top: 0 !important;
    left: 0;
    color: lightgreen !important;
    background-color: navy;
    width: 14.5rem;
    border: 1px solid gray;
    border-radius: 5px;
    margin: 2rem 0 0 2.3rem;
    text-align: center;
    z-index: 10;
    p {
      margin: 0;
      padding: 0;
      border: none;
      outline: none;
      /*  crucial for the gap between <p> elements */
      height: 22px;
      color: yellow;
      &:last-child {
        margin-bottom: 10px;
      }
    }
  }
  :global(.css-prop-tooltip-wrapper) {
    width: max-content;
    height: 2rem;
    line-height: 1.5rem;
    padding: 0 1rem;
    margin: 9rem 20rem;
    border-radius: 5px;
    color: white;
    background-color: navy;
    cursor: pointer;
    border: 4px solid lightgreen;
  }
</style>
