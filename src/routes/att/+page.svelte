<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  const props = {
    delay: 250,
    duration: 800,
    baseScale: 0,
    caption: 'Printing the Report',
    preferredPos: 'bottom,right,top,left,',
  };
  const printReport = () => {
    console.log('printing the report...');
  };
</script>

{#snippet tooltipPanel(cssStyle: string)}
  <div class="tooltip-panel" style={cssStyle}>
    <p style="color:lightgreen;font-size:22px;margin:0;">
      Filip Isakovic, Junior
    </p>
    <p>6524 Cascade St.</p>
    <p>San Diego, 92122</p>
    <p>California</p>
  </div>
{/snippet}

<div class="grid-wrapper">
  <div class="tooltip-wrapper">
    <Tooltip
      {...props}
      {tooltipPanel}
      class_tooltipPanel={'css-prop-class_tooltipPanel'}
    >
      <button class="hovering-button" onclick={printReport}>
        Hover ove button for a tooltip
      </button>
    </Tooltip>
    <p class="text-gradient">Matia Isakovic</p>
  </div>
  <div class="right-column">
    <details>
      <summary class="summary-mostly-parent">Tooltip mostly parent code</summary
      >
      <pre>
    Parent Component wraps &lt;Tooltip&gt; component in a Div 
      &lt;div
        class="tooltip-wrapper"
        onmouseenter=&#123;toggle&#125;
        onmouseleave=&#123;toggle&#125;
        aria-hidden=true
      &gt
        &lt;Tooltip
          &#123;...props&#125;
          &#123;visible&#125;
          &#123;tooltipPanel&#125;
          class_tooltipPanel=&#123;'css-prop-class_tooltipPanel'&#125;
        &gt&lt;/Tooltip&gt
        Hover to show tooltipPanel
      &lt;/div&gt

    The Div content 'Hover to show tooltipPanel' is decorated by 'tooltip-wrapper'
    parent class that controls mouse-hover via 'toggle' function for displaying the
    tooltipPanel, which is defined as
        &#123;#snippet tooltipPanel(class_name: string)&#125;
    and renders a complex markup decorated by css class sent
    as class_tooltipPanel=&#123;'css-prop-class_tooltipPanel'&#125; prop.
    The toggle function alters variable 'visible' 
        let visible = $&#123;state&#125;(false)
    and the tooltipPanel is displayed when visible gets true animated via 
    fade-scale transition configured via props 
        let props = &#123;delay,duration,baseScale&#125;
    and Tooltip defined variables for positioning the tooltipPanel
        let translateX = '-2rem';
        let translateY = '-120%';
    as they should be evolved and controlled for scrolling the page to ensure
    the tooltipPanel is always visible.
  </pre>
    </details>
  </div>
</div>

<!-- TEST if first preferred has no space try succeeding one by one -->
<!-- <p style="margin:100rem 0 0 130rem">100rem x 100rem</p> -->

<style lang="scss">
  /* class sent as prop to component must be wrapped in :global() */

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
    color: yellow;
    margin: 2px;
    padding: 0;
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
  .tooltip-wrapper {
    width: max-content;
    // height: 1.3rem;
    // padding: 1rem 2rem;
    // margin: 6rem 10rem !important;
    // border: 1px solid gray;
    // border-radius: 5px;
    // color: white;
    // background-color: navy;
    // cursor: pointer;
  }
  :global(.css-prop-class_tooltipPanel) {
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
  .grid-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    padding: 0;
    .summary-mostly-parent {
      font-size: 1.2rem;
      color: var(--PRE-COLOR);
      margin-inline-start: 1rem;
      /* should be instead of margin-left in above details > p */
      list-style-position: outside;
      margin-left: 3rem;
      cursor: pointer;
      width: max-content;
      padding: 0 0.5rem;
    }
  }
  .text-gradient {
    @include gradient-text();
  }
  .hovering-button {
    margin: 8rem 0 0 18rem;
  }
</style>
