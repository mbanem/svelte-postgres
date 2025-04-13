<script lang="ts">
  import { browser } from '$app/environment';
  let mouse = $state({ x: 0, y: 0 });

  let { clearingOK }: { clearingOK: boolean } = $props();

  type TRange = { left: number; right: number; top: number; bottom: number };
  type TDot = { x: number; y: number };
  const putDot = (e: MouseEvent) => {
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
    const dot = document.getElementById('dot');
    const clone = dot?.cloneNode(true) as HTMLDivElement;
    // clone.style.position = 'absolute';
    clone.style.left = `${e.clientX}px`;
    clone.style.top = `${e.clientY}px`;
    document.body.appendChild(clone);
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
<slot></slot>
<svelte:window
  onmousemove={(e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }}
  onclick={putDot}
/>
<div class="main">
  <p>{mouse.x}x{mouse.y}</p>
  <div id="dot" class="dot-class"></div>
  <!-- mouse = null  exception!-->
  <button onclick={() => (mouse = null)}>
    whatever you do, don't click this button
  </button>
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
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: blue;
  }
</style>
