<script lang="ts">
  import { browser } from '$app/environment';
  import { type Snippet, onMount } from 'svelte';
  import { cubicInOut } from 'svelte/easing';
  import fadeScale from './fade-scale';
  const r = Math.round;
  interface IProps {
    delay?: number;
    duration?: number;
    baseScale?: number;
    tooltipPanel: (panelStyle: string) => ReturnType<Snippet>;
    children?: Snippet;
    translateX?: string;
    translateY?: string;
    preferredPos?: string;
  }
  let {
    delay = 800,
    duration = 2000,
    baseScale = 0,
    tooltipPanel,
    children,
    translateX,
    translateY,
    preferredPos = 'top,left,right,bottom',
  }: IProps = $props();
  const preferred = preferredPos.replace(/\s+/g, '').split(',') as string[];
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

    // right (120,0) bottom (0,47) left (-224,0) top (0,-94)
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

    // console.log(
    //   OK.top,
    //   OK.right,
    //   OK.bottom,
    //   OK.left,
    //   OK.topBottomRight,
    //   OK.leftRightBottom,
    // );
    // console.log(
    //   hoverRect,
    //   ttpRect,
    //   window.scrollX,
    //   window.scrollY,
    //   window.innerWidth,
    //   window.innerHeight,
    // );
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
        break;
      }
      console.log('unsuccessful', preferred[i]);
    }
    if (translateX === '') {
      //
      translateY = OK.top ? `${-ttpRect.height}px` : `${hoverRect.height}px`;
      translateX = OK.left
        ? `${window.innerWidth - (hoverRect.right - window.scrollX) - hoverRect.width}px`
        : '0px';
      // console.log('no preferred position available', translateX, translateY);
    }
    setTimeout(() => {
      visible = !visible;
    }, 0);
  };

  const toggle = (event: MouseEvent) => {
    if (event.type === 'mouseenter') {
      setTooltipPos();
    } else {
      visible = !visible;
    }
  };
  // let W = $state({ X: 0, Y: 0, W: 0, H: 0 });
  // let H = $state({ hL: 0, hT: 0, hB: 0, hW: 0, hH: 0 });

  onMount(() => {
    setTimeout(() => {
      const ttp = document.querySelector('.tooltip-panel') as HTMLDivElement;
      if (ttp) {
        ttpRect = ttp.getBoundingClientRect() as DOMRect;
        ttpRect.width = r(ttpRect.width);
        ttpRect.height = r(ttpRect.height);
        initial = false;
      }
      ttp.remove();

      const hw = document.querySelector('.child-wrapper') as HTMLDivElement;
      if (hw) {
        hoverRect = hw.getBoundingClientRect() as DOMRect;
        hoverRect.width = r(hoverRect.width);
        hoverRect.height = r(hoverRect.height);
      } else {
        console.log('no hoverRect');
      }
    }, 0);
    // if (window) {
    //   window.addEventListener('scroll', function () {
    //     W.X = r(window.scrollX);
    //     W.Y = r(window.scrollY);
    //     W.W = r(window.innerWidth);
    //     W.H = r(window.innerHeight);

    //     if (hoverRect) {
    //       H.hL = r(hoverRect.left);
    //       H.hT = r(hoverRect.top);
    //       H.hB = r(hoverRect.bottom);
    //       H.hW = r(hoverRect.width);
    //       H.hH = r(hoverRect.height);
    //     }
    //   });

    window.addEventListener('scrollend', () => {
      translateX = '0px';
      translateY = '0px';
    });
    // }
  });
</script>

<!-- {#each ['top', 'left', 'right', 'bottom'] as pos}
  <label>
    <input
      type="radio"
      name="position"
      id={pos}
      value={pos}
      bind:group={cssPos}
    />
    {pos}
  </label>
{/each} -->
<!-- <p>Selected position: {cssPos}</p> -->
{#if initial}
  {@render tooltipPanel(
    `position:absolute;top:4rem;left:3rem;padding: 3px 1rem;visibility:hidden;`,
  )}
{/if}

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
      {@render tooltipPanel(
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

<!-- {#if hoverRect && ttpRect}
  <p>
    {H.hB}, {W.Y}
    {r(ttpRect.height)}
    {W.H}
  </p>
{/if}
<p>
  scroll X,Y W,H {W.X},{W.Y},{W.W},{W.H}
</p>
<p>OKs t l r b {OK.top} {OK.left} {OK.right} {OK.bottom}</p>
{#if hoverRect}
  <p>
    hoverRect l,t,b w,h {H.hL - W.X}, {H.hT - W.Y}, {H.hB},{H.hW},{H.hH}
  </p>
{/if}

<p>
  ttpRect l {r(ttpRect?.left ?? 0)}, t {r(ttpRect?.top ?? 0)}, r {r(
    ttpRect?.right ?? 0,
  )}
  b {r(ttpRect?.bottom ?? 0)}, w {r(ttpRect?.width ?? 0)}, h {r(
    ttpRect?.height ?? 0,
  )}
</p> -->

<style>
  .child-wrapper {
    position: relative;
    box-sizing: content-box;
    padding: none;
    margin: none;
    width: max-content;
    height: auto;
    outline: none;
    z-index: 10;
  }
</style>
