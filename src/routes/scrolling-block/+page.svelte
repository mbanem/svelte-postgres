<script lang="ts">
  import { onMount } from 'svelte';
  // import { tick } from 'svelte';

  const transformSeconds = 2;
  const transformStr = `transform 2s ease`;

  let blockSize = $state(5);
  let divItemWidth = $state(50); // width of number-box CSS 100px
  let blockWidth = $derived(divItemWidth * blockSize);
  const arr = (start: number) =>
    Array.from({ length: blockSize }, (_, k) => k + start);
  const block = (ix: number) => {
    return arr(ix);
  };
  let center = $state(1); // center number of visible triplet
  const getCenter = () => {
    return center;
  };
  let offset = 0; // -1 for left scroll, +1 for right scroll
  let container: HTMLDivElement;

  // Current sequence
  let numbers = [center - 1, center, center + 1];

  let inProgress = $state(false);
  const scroll = (direction: 'left' | 'right') => {
    inProgress = true;
    offset = direction === 'left' ? -1 : 1;

    // Trigger the animation by shifting the container
    // await tick(); // Wait for DOM update
    container.style.transition = transformStr;
    container.style.transform = `translateX(${direction === 'left' ? blockWidth + 'px' : -1 * blockWidth + 'px'})`;

    // Wait for the animation to complete
    setTimeout(() => {
      // Reset styles
      container.style.transition = '';
      container.style.transform = '';

      // Update center and sequence
      center += offset * blockSize;
      // offset = 0;
      inProgress = false;
    }, transformSeconds * 1000);
  };
</script>

<pre>
	Sequence is initially set to [center - blockSize, center, center + blockSize] with
  center = 1, and updated to the next and previous 3 blocksize array elements
	based on the scrolling direction that increment/decrement the center. 
    For blocksize=3 the row is 1 2 3 4 5 6 7 8 9 where only 4 5 6 are visible.
  Blocksize numbers are wrapped in div elements with no gap.
	In order to display only the middle block the container 'row' is confined inside a
  viewport of the proper width that allows only a blocksize elements to be visible and 
  is moved to the left via Svelte style="width:{3 *
    blockWidth}px;margin-left:{-blockWidth}px"
</pre>
<div class="container">
  <div class="viewport" style="width:{blockWidth}px;">
    <div
      class="row"
      bind:this={container}
      style="width:{3 * blockWidth}px;margin-left:{-blockWidth}px"
    >
      {#each [getCenter() - blockSize, getCenter(), getCenter() + blockSize] as start}
        <div class="block" style="width:{blockWidth}px">
          {#each arr(start) as num}
            <div class="number-box" style="width:{divItemWidth}px">{num}</div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <label for="r">Block size</label><br />
  <input
    id="r"
    type="range"
    min="1"
    max="5"
    bind:value={blockSize}
    list="values"
  />
  <datalist id="values">
    {#each [...5] as val}
      <option value={val + 1} label={val + 1}></option>
    {/each}
  </datalist>
  <div class="buttons">
    <button onclick={() => scroll('left')} disabled={inProgress}
      >Scroll Left</button
    >
    <button onclick={() => scroll('right')} disabled={inProgress}
      >Scroll Right</button
    >
  </div>
</div>

<style lang="scss">
  .container {
    margin: 1rem 0 0 8rem;
    padding: 0;
  }
  .viewport {
    overflow: hidden;
    border: 0;
    outline: none;
    padding: 0;
    border-radius: 5px;
    background-color: cornsilk;
    margin-top: 1px;
  }
  .block {
    display: flex;
    color: navy;
    background-color: cornsilk;
    border: 0;
    outline: none;
    padding: 0;
  }
  .row {
    display: flex;
    margin-top: 0; /* to suppress interfering with animation*/
    border: 0;
    outline: none;
    padding: 0;
  }

  .number-box {
    flex-shrink: 0;
    text-align: center;
    font-size: 2em;
    border: 0;
    outline: none;
    padding: 0;
  }
  datalist {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    writing-mode: horizontal-tb;
    width: 250px;
  }

  input[type='range'] {
    width: 250px;
    margin: 0;
  }

  .buttons {
    margin-top: 1rem;
  }
</style>
