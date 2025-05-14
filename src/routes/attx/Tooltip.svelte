<script lang="ts">
  import { browser } from '$app/environment';
  import { type Snippet, onMount } from 'svelte';
  const r = Math.round;
  interface IProps {
    delay?: number;
    preferredPos?: string;
    tooltipPanel: (panelStyle: string) => ReturnType<Snippet>;
    children?: Snippet;
  }
  let {
    delay = 800,
    preferredPos = 'top,left,right,bottom',
    tooltipPanel,
    children,
  }: IProps = $props();
  const preferred = preferredPos.replace(/\s+/g, '').split(',') as string[];

  type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
  let tooltipDiv: HTMLDivElement | null = $state(null);
  let ttRect: DOMRect | null = $state(null);
  let ttpRect: DOMRect | null = $state(null);
  let hoverRect: DOMRect | null = $state(null);
  let initial = $state(true);

  let cssPos = $state('top');
  let ttPos = $state('');

  const OK = $state({
    top: false,
    bottom: false,
    leftRightBottom: false,
    left: false,
    right: false,
  });

  const setTooltipPos = () => {
    // NOTE: Toolbar height is 32px
    const toolbarHeight = 32;
    ttPos = '';
    if (!ttpRect || !hoverRect) {
      return console.log('no  rectangles');
    }

    OK.top = hoverRect.top - window.scrollY - toolbarHeight > ttpRect.height;
    OK.bottom =
      hoverRect.bottom - window.scrollY + ttpRect.height < window.innerHeight;
    OK.leftRightBottom =
      hoverRect.top - window.scrollY + ttpRect.height < window.innerHeight;

    OK.left =
      hoverRect.left - window.scrollX > ttpRect.width && OK.leftRightBottom;
    OK.right =
      hoverRect.right - window.scrollX + ttpRect.width < window.innerWidth &&
      OK.leftRightBottom;
    for (let i = 0; i < preferred.length; i++) {
      switch (preferred[i] as string) {
        case 'top':
          if (OK.top) {
            return `top:${-ttpRect.height}px;left:0;`;
          }
          break;
        case 'left':
          if (OK.left && OK.bottom) {
            return `top:0;left:${-ttpRect.width}px;`;
          }
          break;
        case 'right':
          if (OK.right && OK.bottom) {
            return `top:0;left:${hoverRect.width}px;`;
          }
          break;
        case 'bottom':
          if (OK.bottom) {
            return `top:${hoverRect.height}px;left:0;`;
          }
          break;
        default:
          console.log('default');
          break;
      }
    }
  };
  const toggle = (event: MouseEvent) => {
    // if (tooltipDiv) {
    if (event.type === 'mouseenter') {
      ttPos = setTooltipPos() as string;
    }
    // toggle hidden on mouse enter and then on mouse leave
    setTimeout(() => {
      tooltipDiv?.classList.toggle('hidden');
    }, delay);
    // }
  };
  let W = $state({ X: 0, Y: 0, W: 0, H: 0 });
  let H = $state({ hL: 0, hT: 0, hB: 0, hW: 0, hH: 0 });

  onMount(() => {
    // updateTTPRect();
    // console.log('ttRect',ttRect)
    setTimeout(() => {
      const ttp = document.querySelector('.tooltip-panel') as HTMLDivElement;
      if (ttp) {
        ttpRect = ttp.getBoundingClientRect() as DOMRect;
        ttpRect.width = r(ttpRect.width);
        ttpRect.height = r(ttpRect.height);
        // console.log('ttpRect', ttpRect);
        initial = false;
      }
      ttp.remove();
    }, 0);
    setTimeout(() => {
      const hw = document.querySelector('.child-wrapper') as HTMLDivElement;
      if (hw) {
        hoverRect = hw.children[0]?.getBoundingClientRect() as DOMRect;
        hoverRect.width = r(hoverRect.width);
        hoverRect.height = r(hoverRect.height);
        // console.log('hoverRect',hoverRect)
      }

      // else{
      // 	console.log('no hoverWrapper')
      // }
      const ttw = document.querySelector('.tooltip-wrapper') as HTMLDivElement;
      if (ttw) {
        ttRect = ttw.getBoundingClientRect() as DOMRect;
        if (!ttRect) {
          console.log('no ttRect');
        }
        // else {
        //   console.log('ttRect', ttRect);
        // }
      }
    }, 500);
    // } else {
    //   console.log('no ttWrapper');
    // }
    // Optional: Update on window resize
    // window.addEventListener('resize', updateTTPRect);
    // return () => {
    //   window.removeEventListener('resize', updateTTPRect);
    // };
    if (window) {
      window.addEventListener('scroll', function () {
        W.X = r(window.scrollX);
        W.Y = r(window.scrollY);
        W.W = r(window.innerWidth);
        W.H = r(window.innerHeight);

        if (hoverRect) {
          H.hL = r(hoverRect.left);
          H.hT = r(hoverRect.top);
          H.hB = r(hoverRect.bottom);
          H.hW = r(hoverRect.width);
          H.hH = r(hoverRect.height);
        }
      });

      window.addEventListener('scrollend', setTooltipPos);
    }
  });
</script>

<p>{preferred} ttPos {ttPos}</p>
{#each ['top', 'left', 'right', 'bottom'] as pos}
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
{/each}
<p>Selected position: {cssPos}</p>
{#if initial}
  {@render tooltipPanel(
    `position:absolute;top:0.left:0;background-color:navy; padding: 10px;visibility:hidden;`,
  )}
{:else}
  <div
    class="tooltip-wrapper"
    onmouseenter={toggle}
    onmouseleave={toggle}
    aria-hidden={true}
  >
    {#if tooltipPanel}
      <div bind:this={tooltipDiv} class="relative hidden">
        {@render tooltipPanel(
          `position:absolute;${ttPos}background-color:navy; padding: 10px;`,
        )}
      </div>
    {/if}
    <div class="child-wrapper">
      {@render children?.()}
    </div>
  </div>
{/if}
{#if hoverRect && ttpRect}
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
</p>

<style>
  .tooltip-wrapper {
    margin: 7rem 8rem;
    width: max-content;
    height: auto;
  }
  .hidden {
    visibility: hidden;
  }
  .relative {
    position: relative;
  }
  .child-wrapper {
    padding: 0;
    margin: 0;
  }
</style>
