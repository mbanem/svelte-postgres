<script lang="ts">
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet, onMount } from 'svelte';
  import { fadeScale } from './fade-scale';

  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    visible: boolean;
    children: Snippet<[]>;
    tooltipPanel?: (class_name: string) => ReturnType<Snippet>;
    class_tooltipPanel?: string;
  };

  let wrapperDivId = 'Filip';
  let wrapperDiv: HTMLDivElement | null = null;
  const id = () => {
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
  } = $props();

  try {
    console.log(children());
  } catch (e) {
    console.log('Error in children', e);
  }

  let visible = $state(false);
  let translateX = '-31px';
  let translateY = '-122px';

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
      initPos.panelX = Math.floor(rect.x);
      initPos.panelY = Math.floor(rect.y);
      initPos.panelWidth = Math.floor(rect.width);
      initPos.panelHeight = Math.floor(rect.height);
      initPos.availableWidth = Math.floor(window.innerWidth - rect.x);
      initPos.availableHeight = Math.floor(window.innerHeight - rect.y);
      wrapperDiv?.classList.add('hidden');
    }
  };

  const toggle = () => {
    // visible = !visible;
    wrapperDiv?.classList.toggle('hidden');
  };

  onMount(() => {
    if (browser) {
      wrapperDiv = document.getElementById(wrapperDivId) as HTMLDivElement;
      setTimeout(() => {
        setInitialPosition();
      }, 0);
    }
  });
</script>

<!-- NOTE: transform:translate is defined in the fade-scale and must specify
    the same left/top values as the one in this snippet handler
-->
{#snippet handler()}
  {#if visible}
    <div
      style={`position:absolute;  
        transform: translate(${translateX},${translateY});
        opacity:0;
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
        translateX,
        translateY,
      }}
    >
      {@render tooltipPanel('css-prop-wrapper local')}
      {@render children()}
    </div>
  {/if}
{/snippet}
<div
  id={id()}
  class="tooltip-wrapper"
  onmouseenter={toggle}
  onmouseleave={toggle}
  aria-hidden={true}
>
  {@render handler()}
  {@render children()}
</div>

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
    z-index: 5;
  }
  .hidden {
    display: none;
  }
  .visibility {
    visibility: hidden;
  }
</style>
