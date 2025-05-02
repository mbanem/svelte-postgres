<script lang="ts">
  
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet } from 'svelte';
  import { fadeScale } from './fade-scale';
    import { string } from 'zod';

  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    children: Snippet<[]>;
    tooltipPanel?: (class_name: string) => ReturnType<Snippet>;
    class_tooltipPanel?: string;
    translateX: string;
    translateY: string;
    preferredPos?:string
  };
  let {
    delay,
    duration = 1500,
    baseScale,
    caption,
    children,
    tooltipPanel,
    class_tooltipPanel,
    translateX,
    translateY,
    preferredPos
  } = $props();

  let ttRect: DOMRect;
  let hoverRect: DOMRect;
  // translateX/translateY arguments for fade-scale function
  // based on ttRect and hoverRect taken on mouseenter
  let translate =['','']

  let visible = $state(false);


  type TPos = 'top'|'right'|'bottom'|'left'

  // returns tuple [string, string] for [translateX, translateY]
  const panelPos = (
    ttRect: DOMRect,
    hoverRect: DOMRect,
    pos: TPos,
  ): [string, string] => {
    if (!visible) return { x: '', y: '' };
    switch (pos) {
      case 'top':
        return [`4rem`, `-4rem`]
      case 'right':
        return [`${64 + hoverRect.width}px`, `0`]
      case 'bottom':
        return [`4rem`, `${ttRect.height}px`]
      case 'left':
        return [`${-64 - ttRect.width}px`, `0`]
      default:
        return ['', ''];
    }
  };
  const toggle = (event:MouseEvent) => {
    if(event.type==='mouseleave') return 
    visible = !visible;
    setTimeout(() => {
      // ttRect = document
      //   .querySelector(`.${class_tooltipPanel}`)
      //   ?.getBoundingClientRect() as DOMRect;
      ttRect = document
        .querySelector('.css-prop-class_tooltipPanel')
        ?.getBoundingClientRect() as DOMRect;
      hoverRect = document
        .querySelector('.tooltip-hover')
        ?.getBoundingClientRect() as DOMRect;
      translate.right = panelPos(ttRect, hoverRect, 'right');
      translate.bottom = panelPos(ttRect, hoverRect, 'bottom');
      translate.left = panelPos(ttRect, hoverRect, 'left');
      const scrollX = Math.round(window.scrollX)
      const scrollY = Math.round(window.scrollY)
      // scrollX + ttRect.width < hoverRect.left        -- left position for tooltipPanel is OK
      // scrollY + ttRect.height < hoverRect.top        -- top  position is OK
      
      if (
        hoverRect.top - ttRect.height > 0 &&
        hoverRect.left - ttRect.width > 0
      ) {
        [translateX, translateY] = panelPos(ttRect, hoverRect, 'top');
      }else if(hoverRect.right + ttRect.width < window.innerWidth){
        [translateX, translateY] = panelPos(ttRect, hoverRect, 'right');
      }else if(hoverRect.bottom + ttRect.height < window.innerHeight){
        [translateX, translateY] = panelPos(ttRect, hoverRect, 'bottom');
      }else if(hoverRect.left-ttRect.width)
    }, delay + duration);
    // now set translateX and translateY based on actual tooltip-hover position
  };
  // let divId = 'Filip';
  // const id = () => {
  //   divId = `i${(Math.random() * 10 ** 8).toString(36).replace(/\./g, '')}`;
  //   return divId;
  // };


  console.log(class_tooltipPanel);
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
        translate: { x: translateX, y: translateY },
      }}
    >
      {@render tooltipPanel(class_tooltipPanel)}
    </div>
  {/if}
{/snippet}

{@render handler()}
<div
  class="tooltip-hover"
  onmouseenter={toggle}
  onmouseleave={toggle}
  aria-hidden={true}
>
  {@render children()}
</div>

<p>{JSON.stringify(translate, null, 2)}</p>
<div style="margin: 200rem 200rem">margin: 200rem 200rem</div>

<style>
  .tooltip-hover {
    margin: 16rem 46rem;
    width: max-content;
    height: 2rem !important;
    line-height: 2rem;
    padding: 3px 1rem;
    border: 1px solid yellow;
    border-radius: 5px;
    color: white;
    background-color: navy;
    cursor: default;
  }
</style>
