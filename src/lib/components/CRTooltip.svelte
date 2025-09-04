<!-- 
@component
CRTooltip could accept the following props, though all are optional
  type TProps = {
    delay?: number;                 // transform params delay duration and baseScale
    duration?: number;
    baseScale?: number;

    caption?: string;               // caption, a string, and tooltipPanel snippet are mutually exclusive.
                                    // The caption string can be styled by CSS style string or a class name
                                    // sent as captionCSS prop. When both tooltipPanel and caption are specified 
                                    // inside the props the caption string is ignored

    captionCSS?: string;            // user styling as a CSS class name or a style string applied e.g. captionCSS="caption-class'
                                    // with :global(.caption-class){...} or with style captionCSS='font-size:14px; color:orange;'

                                    // When parent page has several hovering elements with tooltip captions the same class name
                                    // or a style string variable is used in props structure with a name that differ from other
                                    // props structure if their contents are different, so there could be prop structures
                                    // for several panels and others for some caption strings: propsPanel, propsCaption1,...

    tooltipPanel?: TPanel;          // A snippet object defined by parent page and sent as object name to a component via $props().
                                    // If caption and tooltipPanel snippet name are both specified the caption is ignored
                                    // e.g. for {#snippet userDetails(user)} we specify $props()
                                    // tooltipPanel={userDetails}   -- a function reference, not as a string tooltipPanel="userDetails"

    children?: Snippet;             // Any HTML markup content between <Tooltip> children... </Tooltip> tags.
                                    // Children is a hovering element triggering tooltip visibility via mouseenter/mouseleave
                                    // so children HTML markup is usually encapsulated in a single HTML hovering element

    preferredPos?: string;          // When, due to scrolling, there is a lack of space around the hovering element CRTooltip
                                    // tries to find an available space following the recommended sequence by the preferredPos
                                    // prop string or, if not specified, by the default one 'top,left,right,bottom'

  };
  NOTE: If app uses +layout.svelte to implement a toolbar, it impacts how to check if there is space for tooltip top position
        the app needs toolbarHeight a number (of pixels) to send to CRTooltip as a prop.
        To avoid specifying toolbarHeight in props for every page that uses CRTooltip a global constant is declared in app.debugger.ts
        declare global{
          const TOOLBAR_HEIGHT: number;
        }
        and then initialized in some xx.ts file that runs before the pages (the /$lib/utils/index.ts is used) like the following
        (globalThis as any).TOOLBAR_HEIGHT=60;

        Then in any page we can use it as (globalThis as any).TOOLBAR_HEIGHT
-->

<script lang="ts">
  import { cubicInOut } from 'svelte/easing'; // for animated transition
  import { type Snippet, onMount } from 'svelte';

  import type { EasingFunction } from 'svelte/transition';

  // fade scale animation for displaying/hiding tooltip
  export interface FadeScaleParams {
    delay?: number;
    duration?: number;
    easing?: EasingFunction;
    baseScale?: number;
    translateX?: string;
    translateY?: string;
  }

  const fadeScale = <IProps extends FadeScaleParams>(
    node: HTMLElement,
    {
      delay = 100,
      duration = 1600,
      easing = (x: number) => x,
      baseScale = 0,
      translateX = '1rem',
      translateY = '-160%',
    }: IProps,
  ) => {
    const opacity = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const scale = m ? Number(m[1]) : 1;
    const is = 1 - baseScale;
    // console.log(translateX, translateY)
    // transform: translate uses matrix's last two entries for translate x and y
    // with scaleX=1 skewX=0 skewY=0  scaleY=1 (1-no scale and 0-no skew) just translate
    // NOTE: transform: translate is defined in the Tooltip.svelte and must specify
    // the same left/top values as the one in this css return value
    return {
      delay,
      duration,
      css: (t: number) => {
        const eased = easing(t);
        return `opacity: ${eased * opacity}; transform: translate(${translateX},${translateY}) scale(${eased * scale * is + baseScale}) `;
      },
    };
  };

  const sixHash = () => {
    const a = (Math.random() * 46656) | 0;
    const b = (Math.random() * 46656) | 0;
    return a.toString(36).slice(-3) + b.toString(36).slice(-3);
  };

  const hoveringId = 'hovering-' + sixHash();
  // as caption and tooltipPanel are mutually exclusive
  // even when both are received via $props()
  // we use the same tooltipPanelId for both
  // const tooltipPanelId = 'tooltip-' + sixHash();
  let tooltipPanelEl = $state<HTMLElement | null>(null);
  const round = Math.round;

  type TPanel = ((className?: string) => ReturnType<Snippet>) | null;

  type TProps = {
    delay?: number;
    duration?: number;
    baseScale?: number;
    caption?: string;
    captionCSS?: string;
    tooltipPanel?: TPanel;
    children?: Snippet;
    preferredPos?: string;
  };

  let {
    duration = 1000,
    delay = 800,
    baseScale = 0,
    caption = '',
    captionCSS = '',
    tooltipPanel,
    children,
    preferredPos = 'top,left,right,bottom',
  }: TProps = $props();

  console.log('captionCSS', captionCSS);
  // Need to define variables as the setTooltipPos function adjusted them
  // to position properly based on preferredPos settings and available
  // space around the hovering elements
  let translateX = $state<string>('');
  let translateY = $state<string>('');
  let panel: TPanel = tooltipPanel
    ? tooltipPanel
    : caption
      ? captionPanel
      : null;

  if (!panel) {
    throw new Error('tooltipPanel or caption is mandatory');
  }

  const getPreferred = () => {
    return preferredPos.replace(/\s+/g, '').split(',') as string[];
  };

  let visible = $state(false);
  // let ttRect: DOMRect | null = $state(null);
  // let hoverRect: DOMRect | null = $state(null);
  let initial = $state(true);

  // the setTooltipPos examine necessary parameters for applying
  // tooltip at required position and is forced to iterate over
  // the preferredPos list until params for a position match
  const OK = $state({
    top: false,
    bottom: false,
    leftRightBottom: false,
    topBottomRight: false,
    left: false,
    right: false,
  });

  // the setTooltipPos is triggered via mouseenter and has to have
  // rectangles for hovering element and its accompanying tooltip
  // to move tooltip to the proper space. The HoverData is bound
  // to accompanying hovering element via its id set by this
  // component initially in onMount and is saved in a Record list
  type HoverData = {
    hoverRect: DOMRect;
    tooltipRect: DOMRect;
  };
  // Record is an array type of a given key type and value type
  // where  key is a hovering element id inserted inside onMount
  // and registered in hoverRec array easy to fetch it when
  // onmouseenter handler has to display tooltip in a required
  // preferredPos position
  type HoverRecord = Record<string, HoverData>;
  const hoverRec: HoverRecord = {};

  const addRecord = (key: string, hr: DOMRect, tr: DOMRect) => {
    hoverRec[key] = { hoverRect: hr, tooltipRect: tr };
  };

  // triggered via mouseenter of the hovering elements to set its
  // accompanying tooltip in requiredPos position
  const setTooltipPos = (hoveringElement: HTMLElement) => {
    // NOTE: If your app has a Toolbar its height should be included in calculation.
    // For svelte-postgres app the toolbar height is 32px

    // console.log('setTooltipPos called', hoveringElement);
    const { hoverRect, tooltipRect } = hoverRec[
      hoveringElement.id
    ] as HoverData;
    if (!hoverRect || !tooltipRect) {
      // console.log('No rectangles found for the hovering element.');
      return;
    }

    translateX = '';

    // is there enough space before the right side of the screen
    OK.topBottomRight =
      hoverRect.left - window.scrollX + tooltipRect.width < window.innerWidth;
    // is there enough space before the bottom side of the screen
    OK.leftRightBottom =
      hoverRect.top - window.scrollY + tooltipRect.height < window.innerHeight;

    OK.top =
      hoverRect.top - window.scrollY - (globalThis as any).TOOLBAR_HEIGHT >
      tooltipRect.height;
    console.log(
      'OK/top',
      hoverRect.top - window.scrollY - (globalThis as any).TOOLBAR_HEIGHT,
      '>',
      tooltipRect.height,
    );
    OK.bottom =
      hoverRect.bottom - window.scrollY + tooltipRect.height <
      window.innerHeight;
    OK.left = hoverRect.left - window.scrollX > tooltipRect.width;
    OK.right =
      hoverRect.right - window.scrollX + tooltipRect.width < window.innerWidth;

    console.log(
      'OK.top',
      OK.top,
      'OK.bottom',
      OK.bottom,
      'OK.left',
      OK.left,
      'OK.right',
      OK.right,
      'OK.leftRightBottom',
      OK.leftRightBottom,
      'OK.topBottomRight',
      OK.topBottomRight,
    );

    for (let i = 0; i < getPreferred().length; i++) {
      const pref = getPreferred();
      switch (pref[i] as string) {
        case 'top':
          if (OK.top && OK.topBottomRight) {
            translateX = '0px';
            translateY = `${-tooltipRect.height}px`;
          }
          break;
        case 'left':
          if (OK.left && OK.leftRightBottom) {
            translateX = `${-tooltipRect.width}px`;
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
      translateY = OK.top
        ? `${-tooltipRect.height}px`
        : `${hoverRect.height}px`;
      translateX = OK.left
        ? `${window.innerWidth - (hoverRect.right - window.scrollX) - hoverRect.width}px`
        : '0px';
      visible = true;
    }
  };

  const toggle = (event: MouseEvent) => {
    if (event.type === 'mouseenter') {
      setTooltipPos(event.currentTarget as HTMLElement);
    } else {
      visible = false;
    }
  };

  onMount(() => {
    setTimeout(() => {
      // tooltipPanelEl holds tooltipPanel or captionPanel
      // depending on the $props() passed to this component
      // and we take the child as a panel
      // const ttPanelWrapper = document.getElementById(
      //   tooltipPanelId,
      // ) as HTMLElement;

      // if (ttPanelWrapper) {
      if (tooltipPanelEl) {
        // ttPanel is tooltipPanel  or captionPanel to be show as a tooltip
        const ttPanel = tooltipPanelEl.children[0] as HTMLElement;

        // hoveringEl is the element that triggers the tooltip

        // child wrapper children are hovering elements mouseenter/mouseleave
        const hoveringEl = document.getElementById(hoveringId) as HTMLElement;

        if (ttPanel && hoveringEl) {
          addRecord(
            hoveringId,
            hoveringEl.getBoundingClientRect() as DOMRect,
            ttPanel.getBoundingClientRect() as DOMRect,
          );

          // console.log('hoverRect', hoverRec[hoveringId].hoverRect);
          // console.log('tooltipRect', hoverRec[hoveringId].tooltipRect);
        }

        // Clean up after logging
        (tooltipPanelEl as HTMLElement).remove();
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
    the same left/top values as the one in this tooltipPanelEl handler
-->
{#if initial}
  <div
    bind:this={tooltipPanelEl}
    style="`position:absolute;top:-9999px !important;left:-9999px !important;visibility:hidden;padding:0;margin:0;border:none;outline:none;width:max-content;"
    class="ttWrapper"
  >
    {@render panel?.()}
  </div>
{/if}

{#snippet captionPanel(style?: string)}
  {#if captionCSS.includes(':')}
    <div
      bind:this={tooltipPanelEl}
      style={captionCSS +
        'position:absolute;top:0;left:0;margin:0;padding:0;outline:none;'}
    >
      <p style="margin:0; padding:0;">{caption}</p>
    </div>
  {:else}
    <div
      bind:this={tooltipPanelEl}
      class={captionCSS}
      style={style ??
        'padding:6px 0.5rem;margin:0 !important;height: 1rem !important;'}
    >
      <p style="margin:0; padding:0;">{caption}</p>
    </div>
  {/if}
{/snippet}

{#snippet handler()}
  {#if visible}
    <div
      id="ttWrapperId"
      style={`position:absolute;  
      transform: translate(${translateX},${translateY});
      opacity: 0.85;
      padding: 0;
      margin:0;
      width:0;
      height:0;
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
      <div class="ttWrapper">
        {@render panel?.(
          'position:absolute;top:0;left:0;color:yellow;z-index:-10;padding:6px 0.5rem;margin:0;',
        )}
      </div>
    </div>
  {/if}
{/snippet}

<div
  id={hoveringId}
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
    margin: 3rem 0 0 16rem; /* just global position to adjust with other elements*/
    padding: 0;
    width: max-content;
    height: auto;
    border: none;
    outline: none;
    z-index: 10;
  }
  .ttWrapper {
    width: max-content;
    /*height: auto;*/
    margin: 1rem !important;
    padding: 6px 1rem !important;
    border: none;
    outline: none;
  }
  .caption-default {
    border: 1px solid yellow;
    border-radius: 5px;
    color: yellow;
    background-color: navy;
    width: max-content;
    padding: 3px 1rem;
    margin: 0 !important;
    text-align: center;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    z-index: 10;
  }
</style>
