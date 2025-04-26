<script lang="ts">
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet, onMount } from 'svelte';
  import { fadeScale } from './fade-scale';
  import { setRole } from '$lib/utils/navButtons.svelte';

  type TSnippet = (class_name: string) => ReturnType<Snippet>;

  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    children: Snippet<[]>;
    tooltipPanel?: TSnippet;
    class_tooltipPanel?: string;
  };
  // For tooltipPanel to be whole visible on the screen we need to
  // get initial position of the tooltipPanel and its dimensions
  // and ensure that
  //        tooltipPanel.height > tooltipPanel.y - window.scrollY
  //        tooltipPanel.width > tooltipPanel.x - window.scrollX
  type TInitialPosition = {
    panelX: number;
    panelY: number;
    panelWidth: number;
    panelHeight: number;
    availableWidth: number;
    availableHeight: number;
  };
  let initPos: TInitialPosition = {
    panelX: 0,
    panelY: 0,
    panelWidth: 0,
    panelHeight: 0,
    availableWidth: 0,
    availableHeight: 0,
  };
  const setInitialPosition = () => {
    if (!browser) return;
    // wrapperDiv = document.getElementById(wrapperDivId) as HTMLDivElement;
    // if (!wrapperDiv) return;
    const rect = document.getElementById(wrapperDivId)?.getBoundingClientRect();
    if (rect) {
      wrapperDiv.classList.remove('visibility');
      initPos.panelX = Math.floor(rect.x);
      initPos.panelY = Math.floor(rect.y);
      initPos.panelWidth = Math.floor(rect.width);
      initPos.panelHeight = Math.floor(rect.height);
      initPos.availableWidth = Math.floor(window.innerWidth - rect.x);
      initPos.availableHeight = Math.floor(window.innerHeight - rect.y);
      wrapperDiv.classList.remove('visibility');
    }
  };
  // NOTE: wrapperDivId is used to identify the tooltipPanel
  let wrapperDivId = 'Filip';
  let wrapperDiv: HTMLDivElement;
  const id = () => {
    // if (wrapperDivId !== 'Filip') return wrapperDivId;
    wrapperDivId = `i${(Math.random() * 10 ** 8).toString(36).replace(/\./g, '')}`;
    return wrapperDivId;
  };
  let {
    delay,
    duration = 2000,
    baseScale,
    caption,
    children,
    tooltipPanel,
    class_tooltipPanel,
  }: PROPS = $props();

  const toggle = () => {
    wrapperDiv.classList.toggle('hidden');
  };
  onMount(() => {
    wrapperDiv = document.getElementById(wrapperDivId) as HTMLDivElement;
    // wrapperDiv.style.visibility = 'hidden';
    setTimeout(() => {
      setInitialPosition();
      wrapperDiv.classList.add('hidden');
    }, 0);
  });
</script>

<!-- NOTE: transform:translate is defined in the fade-scale and must specify
    the same left/top values as the one in this snippet handler
-->
{#snippet handler()}
  <div
    id={id()}
    onmouseenter={toggle}
    onmouseleave={toggle}
    aria-hidden={true}
    style={`
        position:absolute;
        transform: translate(-2rem,-120%);
        opacity:0.5;
        padding: 0.5rem;
        color: white;
        text-align: center;
        background: navy;
        width:max-content;
        height:auto;
        padding: 2px 1rem;
        border: 4px solid gray;
        border-radius:6px;
      `}
    transition:fadeScale={{
      delay,
      duration,
      easing: cubicInOut,
      baseScale,
    }}
    class="visibility"
  >
    {@render (tooltipPanel as TSnippet)('css-prop-wrapper local')}
  </div>
{/snippet}

<!-- toolbarPanel-->

<!-- children is mandatory and must contain an owner of the tooltip  -->
<div
  class="tooltip-wrapper"
  onmouseenter={toggle}
  onmouseleave={toggle}
  aria-hidden={true}
>
  {@render handler()}
  {@render children()}
</div>

<!-- <p>Visible {visible}</p> -->

<style lang="scss">
  .tooltip-wrapper {
    position: relative;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    width: max-content;
    height: auto;
    margin: 18rem 50rem !important;
  }
  .hidden {
    display: none;
  }
  .visibility {
    visibility: hidden;
  }
</style>
