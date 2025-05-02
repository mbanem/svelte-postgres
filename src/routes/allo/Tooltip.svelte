<script lang="ts">
  import { browser } from '$app/environment';
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet, onMount } from 'svelte';
  import { fadeScale } from './fade-scale';
  import Tooltip from './Tooltip.svelte';

  //   const getPermutationsArray = (str: string): string[] => {
  //     const result: string[] = [];
  //     let ix =1
  //     let space=''
  //     const permute = (arr: string[], m: string[] = []) => {
  //         // m is accumulator for permuted items
  //         if (arr.length === 0) {
  //             result.push(m.join(''));
  //         } else {
  //             for (let i = 0; i < arr.length; i++) {
  //                 // make a copy of the arr
  //                 const current = arr.slice();
  //                 // next is i-th arr item, removed from the arr
  //                 const next = current.splice(i, 1);
  //                 space = current.length? ' ':''
  //                 permute(current, m.concat(`${next}${space}`));
  //             }
  //         }
  //     }

  //     permute(str.split(''));
  //     return result
  // }
  // const TPosArr = getPermutationsArray('tlrb')

  // executing getPermutationsArray in TypeScript Playground to get below array
  // and turning it into union type using cast with [number] we get type for PreferredPos
  const arrPos = [
    't l r b',
    't l b r',
    't r l b',
    't r b l',
    't b l r',
    't b r l',
    'l t r b',
    'l t b r',
    'l r t b',
    'l r b t',
    'l b t r',
    'l b r t',
    'r t l b',
    'r t b l',
    'r l t b',
    'r l b t',
    'r b t l',
    'r b l t',
    'b t l r',
    'b t r l',
    'b l t r',
    'b l r t',
    'b r t l',
    'b r l t',
  ] as const;
  type TPreferredPos = (typeof arrPos)[number];

  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    children?: Snippet<[]>;
    tooltipPanel?: (class_name: string) => ReturnType<Snippet>;
    css_class_tooltipPanel?: string;
    css_class_tooltip_wrapper?: string;
    translateX: number;
    translateY: number;
    preferredPos?: string; //TPreferredPos;
  };
  let {
    delay,
    duration = 2000,
    baseScale,
    caption,
    children,
    tooltipPanel,
    css_class_tooltipPanel,
    css_class_tooltip_wrapper = '',
    translateX,
    translateY,
    preferredPos = 't l r b',
  } = $props();

  let ttPanel = $state({
    navBarHeight: 28,
    tpTop: 0,
    tpLeft: 0,
    tpHeight: 0,
    tpWidth: 0,
    wScrollX: 0,
    wScrollY: 0,
  });
  let ttRect: DOMRect;
  const preferred = preferredPos.split(' '); // like ['t','l','r','b']
  console.log(preferred);
  let visible = $state(false);

  const getTooltipPanelRect = () => {
    try {
      if (visible) {
        const ttp = document.querySelector(
          `.${css_class_tooltipPanel}`,
        ) as HTMLDivElement;
        ttRect = ttp.getBoundingClientRect();
        // ttPanel.tpTop = Math.round(rect.top);
        // ttPanel.tpLeft = Math.round(rect.left);
        // ttPanel.tpHeight = Math.round(rect.height);
        // ttPanel.tpWidth = Math.round(rect.width);
        // ttPanel.wScrollX = Math.round(window.scrollX);
        // ttPanel.wScrollY = Math.round(window.scrollY);
        // // console.log(ttPanel, rect);
      }
    } catch (err) {}
  };
  // let timerId: ReturnType<typeof setTimeout> = setTimeout(() => '', 1800);
  const toggle = () => {
    visible = !visible;
    return;
    if (!visible) return;
    // TOP  hoverRect.top > ttRect.height
    // LEFT hoverRect.left > ttRect.width
    // RIGHT  window.innerWidth > hoverRect.right + ttRect.width
    // BOTTOM window.innerHeight > hoverRect.bottom + ttRect.height
    setTimeout(
      () => {
        // getTooltipPanelSize();
        const hoverRect = (
          document.getElementById('hoverDivId') as HTMLDivElement
        ).getBoundingClientRect() as DOMRect;
        const ttRect = (
          document.querySelector(`.${css_class_tooltipPanel}`) as HTMLDivElement
        ).getBoundingClientRect() as DOMRect;
        // verify there is enough space for a preferred position
        for (let i = 0; i < 4; i++) {
          console.log(preferred[0]);
          switch (preferred[0]) {
            // @ts-expect-error
            case 't':
              if (hoverRect.top > ttRect.height) {
                [translateX, translateY] = [0, Math.round(-ttRect.height)];
                return;
              } // @ts-expect-error
            case 'l':
              if (hoverRect.left > ttRect.width) {
                [translateX, translateY] = [Math.round(-ttRect.width), 0];
                return;
              }
            // @ts-expect-error
            case 'r':
              if (window.innerWidth > hoverRect.right + ttRect.width) {
                return ([translateX, translateY] = [
                  Math.round(hoverRect.width),
                  0,
                ]);
              }
            case 'b':
            default:
              if (window.innerHeight > hoverRect.bottom + ttRect.height) {
                [translateX, translateY] = [0, Math.round(ttRect.height)];
                return;
              }
          }
        }
      },
      delay + duration * 0.8,
    );
  };

  // const position = () => {
  //   console.log(window.scrollX, window.scrollY);
  //   const div = document.getElementById(wrapperDivId) as HTMLDivElement;
  //   console.log(div.getBoundingClientRect());
  //   // get tooltipPanel rect
  //   console.log(ttPanel);
  // };
  const hoverAttrs = $state({
    top: 0,
    left: 0,
    topDelta: 0,
    leftDelta: 0,
  });
  let wrapperDiv: HTMLDivElement;
  let hoverDiv: HTMLDivElement;
  let hoverRect: DOMRect;
  let wrapperDivId = '';
  const id = () => {
    // if (wrapperDivId !== 'Filip') return wrapperDivId;
    wrapperDivId = `i${(Math.random() * 10 ** 8).toString(36).replace(/\./g, '')}`;
    return wrapperDivId;
  };
  let x = 0,
    y = 0;
  onMount(() => {
    // wrapperDiv = document.getElementById(wrapperDivId) as HTMLDivElement;

    hoverDiv = document.getElementById('hoverDivId') as HTMLDivElement;
    hoverRect = hoverDiv.getBoundingClientRect();
    // // window.addEventListener('scroll', () => {
    //   x = window.scrollX;
    //   y = window.scrollY;
    //   hoverAttrs.top = rect.top;
    //   hoverAttrs.left = rect.left;
    //   hoverAttrs.topDelta = rect.top - ttPanel.tpHeight - 28;
    //   hoverAttrs.leftDelta = rect.left - ttPanel.tpWidth;
    // // });
  });
</script>

<!-- <svelte:window bind:scrollX={x} bind:scrollY={y} /> -->
<!-- 
	NOTE: transform:translate is defined in the fade-scale and must specify
  the same left/top values as the one in this snippet handler
-->
{#snippet handler()}
  {#if visible}
    <!-- render and show tooltipPanel using animation -->
    <div
      id={id()}
      style={`position:absolute;
      transform: translate(${translateX},${translateY});
        opacity:1;
        top:${translateY};
        left:${translateX};
        width:max-content;
        height:auto;
        padding: 0;
        margin: 0;
        border: none;
        overline:none;
      `}
      ontransitionend={getTooltipPanelRect}
      transition:fadeScale={{
        delay,
        duration,
        easing: cubicInOut,
        baseScale,
        translateX,
        translateY,
      }}
    >
      {@render tooltipPanel(css_class_tooltipPanel)}
    </div>
  {/if}
{/snippet}

<!-- <p>{visualViewport?.offsetTop} {visualViewport?.offsetLeft}</p> -->
<!-- <p style="margin:2rem">
  hoverAttrs {JSON.stringify(
    hoverAttrs ?? { x: 'hoverAttrs not found' },
    null,
    2,
  )}
  {x}
  {y}
</p>
<p style="margin-top:1rem">
  ttPanel {JSON.stringify(ttPanel ?? { y: 'ttPanel not found' }, null, 2)}
</p> -->

<!-- 
	if prop css_class_tooltip_wrapper is not defined
	use local tooltip_wrapper css class
-->
<div
  id="hoverDivId"
  class={css_class_tooltip_wrapper
    ? css_class_tooltip_wrapper
    : 'tooltip-wrapper'}
  onmouseenter={toggle}
  onmouseleave={toggle}
  aria-hidden={true}
>
  {@render children()}
  {@render handler()}
</div>

<!-- <p style="margin-left:10rem;">
  hoverAttrs {JSON.stringify(hoverAttrs, null, 2)}
</p> -->

<style>
  .tooltip-wrapper {
    position: relative;
    width: max-content;
    height: 2rem;
    line-height: 2rem;
    padding: 2px 1rem;
    margin: 9rem 20rem !important;
    border-radius: 5px;
    color: white;
    background-color: navy;
    cursor: pointer;
  }
</style>
