<script lang="ts">
  import { browser } from '$app/environment';
  import { type Snippet } from 'svelte';
  type TRange = { left: number; right: number; top: number; bottom: number };
  type TDot = { x: number; y: number };
  const dot: TDot = { x: -1, y: 0 };
  let mouse = $state(dot);

  let { clearingOK, children }: { clearingOK: boolean; children: Snippet } =
    $props();

  const allDots: HTMLDivElement[] = [];
  const putDot = (e: MouseEvent) => {
    if (!browser || mouse.x < 0) return;
    if (!clearingOK || !browser || !document) return;
    const inside = (range: TRange, dot: TDot): boolean => {
      return (
        dot.x >= range.left &&
        dot.x <= range.right &&
        dot.y >= range.top &&
        dot.y <= range.bottom
      );
    };
    const btn = document.getElementById('btn') as HTMLButtonElement;

    const { clientX, clientY } = e;
    const point = { x: clientX, y: clientY };

    if (inside(btn.getBoundingClientRect(), point)) return;
    // const dot = document.getElementById('dot');
    // const clone = dot?.cloneNode(true) as HTMLDivElement;
    // // clone.style.position = 'absolute';
    // clone.style.left = `${e.clientX - 5}px`;
    // clone.style.top = `${e.clientY - 55}px`;
    // document.body.appendChild(clone);
    // allDots.push(clone);
  };
  const clearAllDots = () => {
    // await tick() is not enouh as click left a new dot on
    // the 'clear all dots' button
    setTimeout(() => {
      for (const dot of allDots) {
        dot.remove();
      }
    }, 0);
  };
</script>

<!-- 
	cannot 
		import {type Snippet} from 'svelte'
	in order to get children props
		let { children }: {children: Snippet<[]>} = $props()
	and to render children
		<div>{@render children()}</div>
-->
<!-- <slot></slot> -->
{@render children()}
<svelte:window
  onmousemove={(e: MouseEvent) => {
    mouse = { x: e.clientX, y: e.clientY };
  }}
  onclick={putDot}
  onbeforeunload={clearAllDots}
/>
<div class="main">
  <p>{mouse.x} x {mouse.y}</p>
  <div id="dot" class="dot-class"></div>
  <!-- mouse = null  exception!
    <svelte:boundary> could handle exceptions so we put
    inappropriate tyoe to the mouse state  
  -->
  <button onclick={() => (mouse = null)}>
    whatever you do, don't click this button
  </button>
  <button onclick={clearAllDots}>clear all dots</button>
</div>

<style>
  .main {
    width: 100vw;
    height: 100vh;
  }
  .dot-class {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border: 2px solid navy;
    border-radius: 50%;
    background-color: lightgreen;
  }
</style>
