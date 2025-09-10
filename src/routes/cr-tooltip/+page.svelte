<script lang="ts">
  // ---------------------- scroller begin ---------------------------------
  // import { tick } from 'svelte';

  // let center = 1; // center number of visible triplet
  // let offset = 0; // -1 for left scroll, +1 for right scroll
  // let container: HTMLDivElement;

  // // Current sequence
  // let numbers = [center - 1, center, center + 1];

  // const scroll = (direction: 'left' | 'right') => {
  //   offset = direction === 'left' ? -1 : 1;

  //   // Trigger the animation by shifting the container
  //   // await tick(); // Wait for DOM update
  //   container.style.transition = 'transform 2s ease';
  //   container.style.transform = `translateX(${direction === 'left' ? '42%' : '-42%'})`;

  //   // Wait for the animation to complete
  //   setTimeout(() => {
  //     // Reset styles
  //     container.style.transition = '';
  //     container.style.transform = '';

  //     // Update center and sequence
  //     center += offset;
  //     offset = 0;
  //   }, 980);
  // };
  // ---------------------- scroller end ---------------------------------
  import Tooltip from '$components/CRTooltip.svelte';
  import { onMount } from 'svelte';
  import * as utils from '$lib/utils/helpers';
  import { colors_hex } from '$lib/utils/helpers';
  // let preferPos = 'top,left,right,bottom,';
  // const getPreferredPos = () => {
  //   let list = '';
  //   let current = cssPos;
  //   ['top', 'left', 'right', 'bottom'].forEach((p) => {
  //     if (p === current) {
  //       list = p + ',' + list;
  //     } else {
  //       list = list + p + ',';
  //     }
  //   });
  //   return list;
  // };

  let preferPos = $state<string>('top,left,right,bottom,');
  const props = $derived({
    delay: 250,
    duration: 800,
    baseScale: 0,
    toolbarHeight: 32,
    preferredPos: preferPos,
  });
  const printReport = () => {
    console.log('printing the report...');
  };

  const setPosList = (e: MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const pos = target.textContent as string;
    if (preferPos.includes(pos)) {
      // remove the position from the list
      preferPos = preferPos.replace(pos + ',', '');
      preferPos = pos + ',' + preferPos;
    } else {
      // add the position to the list
      if (pos === 'reset') {
        preferPos = 'top,left,right,bottom';
      } else {
        preferPos += pos + ',';
      }
    }
  };

  onMount(() => {
    utils.scrollToPosition(80 * 16, 80 * 16);
    const top = document.getElementById('top');
    if (top) {
      console.log(top.getBoundingClientRect());
    }
  });
  // type TZip = string | number;
  type TPerson = [
    string,
    string,
    string,
    string,
    string | number,
    string,
    number,
  ];
  const filip: TPerson = [
    'Filip',
    'Isakovic',
    '6425 Cascade St.',
    'San Diego',
    92122,
    'California',
    6.0,
  ];
  const matia: TPerson = [
    'Matia',
    'Isakovic',
    '6425 Cascade St.',
    'San Diego',
    92122,
    'California',
    6.1,
  ];
</script>

<p>TOOLBAR_HEIGHT{(globalThis as any).TOOLBAR_HEIGHT}</p>
<div
  id="top"
  style="margin:0;width:10rem;height:10rem;border:1px solid yellow;background-color:aqua;"
></div>
{#snippet userDetails(s: TPerson)}
  <div class="tooltip-panel">
    <p style="color:lightgreen;">{s[0]} {s[1]}</p>
    <p>{s[2]}</p>
    <p>{s[3]} {s[4]}</p>
    <p>{s[5]}</p>
  </div>
{/snippet}

<div class="tooltip-wrapper">
  <Tooltip panel={userDetails} panelArgs={filip} {...props}>
    <button class="hovering-button" onclick={printReport}>
      {filip[0]}
      {filip[1]}
    </button>
  </Tooltip>
  <p style="margin-left:12rem;">Change Preferred Tooltip Position</p>
  <input class="input" bind:value={preferPos} />
  <p class="preferable-info">Clicking a button sets it preferable</p>
  <div class="radio-wrapper">
    {#each ['top', 'left', 'right', 'bottom', 'reset'] as caption}
      <button onclick={setPosList}>{caption}</button>
    {/each}
  </div>
  <pre class="scroll-info">
  Hover over button to  trigger a tooltip.

  Scroll to make no space available for
  top or left so tooltip should examine
  next available positions from the input
  box that you can enter the next list
  </pre>
  <Tooltip panel={userDetails} panelArgs={matia} {...props}>
    <button class="hovering-button" onclick={printReport}>
      {matia[0]}
      {matia[1]}
    </button>
  </Tooltip>
</div>
<!-- TEST if first preferred has no space try succeeding one by one -->
<!-- <p style="margin:100rem 0 0 130rem">100rem x 100rem</p> -->
<div
  style="position:absolute;top:140rem;left:280rem;width:14rem;margin-bottom:2rem !important;"
>
  enabling page scrolling
</div>
<div style="position:absolute;top:94rem;left:114rem;">shim</div>

<style lang="scss">
  /* class sent as prop to component must be wrapped in :global() */

  .tooltip-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    padding: 3px 1rem 0.5rem 1rem !important;
    border: 1px solid yellow;
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
    line-height: 26px;
    padding: 3px 0 8px 0;
  }
  .tooltip-wrapper {
    width: max-content;
    margin: 80rem 0 0 80rem !important;
    // border: 1px solid yellow;
    pre,
    .input {
      margin-left: 12rem;
    }
  }
  .hovering-button {
    margin: 0; //8rem 0 0 18rem;
    padding: 6px 1rem;
  }
  .input {
    color: navy;
    padding: 2px 0.5rem;
    text-align: center;
    font-size: 17px;
    color: navy;
  }

  .radio-wrapper {
    margin-left: 11rem;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .preferable-info {
    margin-left: 12rem;
    color: gray;
    font-size: 0.9rem;
  }
  .scroll-info {
    margin-left: 10rem !important;
  }
</style>
