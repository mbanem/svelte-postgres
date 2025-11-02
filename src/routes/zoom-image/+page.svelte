<script lang="ts">
  let images = [
    'bird.webp',
    'cat.webp',
    'lake.jpg',
    'bridge.jpg',
    'eiffel-tower.jpg',
  ];

  let hoverImg: string | null = null;
  let cursorX = 0;
  let cursorY = 0;
  let boxSize = 25;
  let imgRect: DOMRect | null = null;

  function handleMouseMove(e: MouseEvent, img: string, el: HTMLImageElement) {
    const rect = el.getBoundingClientRect();
    imgRect = rect;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursorX = Math.max(boxSize / 2, Math.min(x, rect.width - boxSize / 2));
    cursorY = Math.max(boxSize / 2, Math.min(y, rect.height - boxSize / 2));

    hoverImg = img;
  }

  function handleMouseLeave() {
    hoverImg = null;
    imgRect = null;
  }

  function zoomStyle(): string {
    if (!hoverImg || !imgRect) return '';
    const scale = 600 / boxSize;

    const bgX = -(cursorX - boxSize / 2) * scale;
    const bgY = -(cursorY - boxSize / 2) * scale;

    return `background-image: url("/${hoverImg}");
      background-size: ${imgRect.width * scale}px ${imgRect.height * scale}px;
      background-position: ${bgX}px ${bgY}px;`;
    // console.log(rv);
    // return rv;
    // return {
    //   backgroundImage: `url("/${hoverImg}")`,
    //   backgroundSize: `${imgRect.width * scale}px ${imgRect.height * scale}px`,
    //   backgroundPosition: `${bgX}px ${bgY}px`,
    // };
  }
</script>

<div class="grid">
  <div class="left">
    {#each images as img}
      <div class="thumb-wrapper" on:mouseleave={handleMouseLeave}>
        <!-- eslint-disable-next-line svelte/valid-aria-roles -->
        <img
          src={'/' + img}
          alt="thumbnail"
          aria-hidden={true}
          role="presentation"
          width="100"
          height="100"
          on:mousemove={(e) =>
            handleMouseMove(e, img, e.currentTarget as HTMLImageElement)}
        />
        {#if hoverImg === img}
          <div
            class="zoom-box"
            style="left:{cursorX - boxSize / 2}px; top:{cursorY -
              boxSize / 2}px"
            aria-hidden={true}
          ></div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="right">
    <p>Hover over an image to see it in greater details</p>
    {#if hoverImg}
      <div class="zoomed" style={zoomStyle()}></div>
    {/if}
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    height: 100vh;
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .thumb-wrapper {
    position: relative;
  }
  .thumb-wrapper img {
    display: block;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  .zoom-box {
    position: absolute;
    width: 25px;
    height: 25px;
    border: 1px solid yellow;
    background: rgba(255, 255, 0, 0.1);
    pointer-events: none;
  }
  .right {
    position: relative;
    padding: 1rem;
  }
  .zoomed {
    position: absolute;
    top: 0;
    left: 0;
    width: 600px;
    height: 600px;
    border: 1px solid #ccc;
    background-repeat: no-repeat;
    z-index: 10;
  }
</style>
