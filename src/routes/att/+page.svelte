<script lang="ts">
  // ---------------------- scroller begin ---------------------------------
  // import { tick } from 'svelte';

  let center = 1; // center number of visible triplet
  let offset = 0; // -1 for left scroll, +1 for right scroll
  let container: HTMLDivElement;

  // Current sequence
  let numbers = [center - 1, center, center + 1];

  const scroll = (direction: 'left' | 'right') => {
    offset = direction === 'left' ? -1 : 1;

    // Trigger the animation by shifting the container
    // await tick(); // Wait for DOM update
    container.style.transition = 'transform 2s ease';
    container.style.transform = `translateX(${direction === 'left' ? '42%' : '-42%'})`;

    // Wait for the animation to complete
    setTimeout(() => {
      // Reset styles
      container.style.transition = '';
      container.style.transform = '';

      // Update center and sequence
      center += offset;
      offset = 0;
    }, 980);
  };
  // ---------------------- scroller end ---------------------------------
  import Tooltip from './Tooltip.svelte';
  let cssPos = $state<string>('top');
  // let preferPos = 'top,left,right,bottom,';
  const getPreferredPos = () => {
    let list = '';
    let current = cssPos;
    ['top', 'left', 'right', 'bottom'].forEach((p) => {
      if (p === current) {
        list = p + ',' + list;
      } else {
        list = list + p + ',';
      }
    });
    return list;
  };
  let preferPos = $derived(getPreferredPos());
  const props = {
    delay: 250,
    duration: 800,
    baseScale: 0,
    caption: 'Printing the Report',
    // preferredPos: preferPos,
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
    <div class="scroller">
      <pre style="margin:0;padding:0;">
Sequence is initially set to [0, 1, 2] and updated to next and previous 3 digit
based on the scrolling direction. Digits are wrapped in div elements with no gap.
In order to always display the middle digit the container 'row' is moved the left
via CSS margin-left: -100%; 
      </pre>
      <div class="container">
        <div class="viewport">
          <div class="row" bind:this={container}>
            {#each [center - 1, center, center + 1] as num}
              <div class="number-box">{num}</div>
            {/each}
          </div>
        </div>

        <div class="buttons">
          <button onclick={() => scroll('left')}>Scroll Left</button>
          <button onclick={() => scroll('right')}>Scroll Right</button>
        </div>
      </div>
    </div>
    <Tooltip
      {...props}
      preferredPos={preferPos}
      {tooltipPanel}
      class_tooltipPanel={'css-prop-class_tooltipPanel'}
    >
      <button class="hovering-button" onclick={printReport}>
        Filip Isakovic
      </button>
    </Tooltip>
    <pre>Hover over button for a tooltip</pre>
    <p style="margin-left:12rem;">Change Preferred Tooltip Position</p>
    <input class="input" bind:value={preferPos} />
    <div class="radio-wrapper">
      {#each ['top', 'left', 'right', 'bottom'] as pos}
        <label>
          <input
            type="radio"
            checked={pos === cssPos}
            name="position"
            id={pos}
            value={pos}
            bind:group={cssPos}
          />
          {pos}
        </label>
      {/each}
    </div>
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
    pre,
    .input {
      margin-left: 12rem;
    }
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
  .input {
    color: navy;
    padding: 2px 0.5rem;
    text-align: center;
    font-size: 17px;
    color: navy;
  }
  /* ------------  scroller ------------ */
  .scroller {
    margin: 0;
  }
  .container {
    margin-left: 3rem;
    padding: 0;
  }
  .viewport {
    overflow: hidden;
    width: 100px;
    /* border: 1px solid gray; */
    border-radius: 5px;
    color: navy;
    background-color: cornsilk;
    margin-left: 1.6rem;
    margin-top: 1px;
  }

  .row {
    display: flex;
    width: 300%; /* 3 items */
    margin-top: 0; /* to suppress interfering with animation*/
    margin-left: -100%;
  }

  .number-box {
    width: 100px;
    flex-shrink: 0;
    text-align: center;
    font-size: 2em;
  }

  .buttons {
    margin-top: 1rem;
  }
</style>
