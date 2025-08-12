<script lang="ts">
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet, onMount } from 'svelte';
  import fadeScale from './fade-scale';
  const r = Math.round;

  type TProps = {
    delay?: number;
    duration?: number;
    baseScale?: number;
    caption?: string;
    tooltipPanel?: (class_name: string) => ReturnType<Snippet>;
    children?: Snippet;
    translateX?: string;
    translateY?: string;
    class_tooltipPanel?: string;
    preferredPos?: string;
  };

  let {
    delay = 800,
    duration = 1000,
    baseScale = 0,
    caption = '',
    tooltipPanel,
    children,
    translateX = '0px',
    translateY = '0px',
    preferredPos = 'top,left,right,bottom',
  }: TProps = $props();
  const preferred = $derived(
    preferredPos.replace(/\s+/g, '').split(',') as string[],
  );

  let snippet: HTMLDivElement | null = null;
  let visible = $state(false);
  let ttpRect: DOMRect | null = $state(null);
  let hoverRect: DOMRect | null = $state(null);
  let initial = $state(true);

  const OK = $state({
    top: false,
    bottom: false,
    leftRightBottom: false,
    topBottomRight: false,
    left: false,
    right: false,
  });

  const setTooltipPos = () => {
    // NOTE: Toolbar height is 32px
    const toolbarHeight = 32;
    translateX = '';
    if (!ttpRect || !hoverRect) {
      return console.log('no  rectangles');
    }
    OK.topBottomRight =
      hoverRect.left - window.scrollX + ttpRect.width < window.innerWidth;
    OK.leftRightBottom =
      hoverRect.top - window.scrollY + ttpRect.height < window.innerHeight;

    OK.top = hoverRect.top - window.scrollY - toolbarHeight > ttpRect.height;
    OK.bottom =
      hoverRect.bottom - window.scrollY + ttpRect.height < window.innerHeight;
    OK.left = hoverRect.left - window.scrollX > ttpRect.width;
    OK.right =
      hoverRect.right - window.scrollX + ttpRect.width < window.innerWidth;

    for (let i = 0; i < preferred.length; i++) {
      switch (preferred[i] as string) {
        case 'top':
          if (OK.top && OK.right) {
            translateX = '0px';
            translateY = `${-ttpRect.height}px`;
          }
          break;
        case 'left':
          if (OK.left && OK.leftRightBottom) {
            translateX = `${-ttpRect.width}px`;
            translateY = '0px';
          }
          break;
        case 'right':
          if (OK.right && OK.leftRightBottom) {
            translateX = `${hoverRect.width}px`;
            translateY = '0px';
          }
          break;
        case 'bottom':
          if (OK.bottom && OK.topBottomRight) {
            translateX = '0px';
            translateY = `${hoverRect.height + 5}px`;
          }
          break;
        default:
          break;
      }
      if (translateX !== '') {
        visible = true;
        break;
      }
    }
    if (translateX === '') {
      translateY = OK.top ? `${-ttpRect.height}px` : `${hoverRect.height}px`;
      translateX = OK.left
        ? `${window.innerWidth - (hoverRect.right - window.scrollX) - hoverRect.width}px`
        : '0px';
      visible = true;
    }
  };

  const toggle = (event: MouseEvent) => {
    if (event.type === 'mouseenter') {
      setTooltipPos();
    } else {
      visible = false;
    }
  };

  onMount(() => {
    setTimeout(() => {
      if (snippet) {
        const child = (snippet as HTMLElement).children[0] as HTMLElement;
        if (child) {
          ttpRect = child.getBoundingClientRect() as DOMRect;
        }

        // Clean up after logging
        (snippet as HTMLElement).remove();
      }

      const hw = document.querySelector('.child-wrapper') as HTMLDivElement;
      if (hw) {
        const child = hw.children[0] as HTMLElement;
        if (child) {
          hoverRect = child.getBoundingClientRect() as DOMRect;
          hoverRect.width = r(hoverRect.width);
          hoverRect.height = r(hoverRect.height);
        } else {
          ('no child');
        }
      } else {
        console.log('no hoverRect');
      }
    }, 0);

    window.addEventListener('scrollend', () => {
      translateX = '0px';
      translateY = '0px';
    });
    // }
  });
</script>

<!-- NOTE: transform:translate is defined in the fade-scale and must specify
    the same left/top values as the one in this snippet handler
-->
{#if initial}
  <div bind:this={snippet} class="ttWrapper">
    {@render tooltipPanel?.(
      `position:absolute;top:-9999px;left:-9999px;visibility:visible;`,
    )}
  </div>
{/if}

{#snippet handler()}
  {#if visible}
    <div
      id="ttWrapperId"
      style={`position:absolute;  
      transform: translate(${translateX},${translateY});
      opacity:0.5;
      padding: 0;
      width:0;
      height:0;
      padding:0;
      border:none;
      outline:none;
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
      {@render tooltipPanel?.(
        'position:absolute;top:0;left:0;color:yellow;z-index:-10;',
      )}
    </div>
  {/if}
{/snippet}

<div
  class="child-wrapper"
  onmouseenter={toggle}
  onmouseleave={toggle}
  aria-hidden={true}
>
  {@render handler()}
  {@render children?.()}
</div>

<style>
  .child-wrapper {
    margin: 3rem 0 0 16rem;
    width: max-content;
    height: auto;
    border: none;
    outline: none;
    z-index: 10;
  }
  .ttWrapper {
    width: max-content;
    height: auto;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }
</style>
