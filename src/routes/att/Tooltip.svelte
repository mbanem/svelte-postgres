<script lang="ts">
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet } from 'svelte';
  import { fadeScale } from './fade-scale';

  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    visible: boolean;
    tooltipPanel?: (class_name: string) => ReturnType<Snippet>;
    class_tooltipPanel?: string;
    translateX?: number;
    translateY?: number;
  };
  // let divId = 'Filip';
  // const id = () => {
  //   divId = `i${(Math.random() * 10 ** 8).toString(36).replace(/\./g, '')}`;
  //   return divId;
  // };
  let {
    delay,
    duration = 2000,
    baseScale,
    caption,
    visible,
    tooltipPanel,
    class_tooltipPanel,
    translateX,
    translateY,
  } = $props();
</script>

<!-- NOTE: transform:translate is defined in the fade-scale and must specify
    the same left/top values as the one in this snippet handler
-->
{#snippet handler()}
  {#if visible}
    <div
      style={`position:absolute;  
        transform: translate(${translateX},${translateY});
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
        translateX,
        translateY,
      }}
    >
      {@render tooltipPanel('{class_tooltipPanel}')}
    </div>
  {/if}
{/snippet}

{@render handler()}

<style>
</style>
