<script lang="ts">
  import InputBox from '$components/InputBox.svelte';
  import * as cssUtils from '$lib/utils';
  // import { validate } from 'uuid';
  type PROPS = {
    title: string;
    width: string;
    height: string;
    fontsize: string;
  };
  let { title, width, height, fontsize }: PROPS = $props();
  // -----------------------------------------------------------------
  let size = $state(50);
  let color = $state('#ff3e00');
  let elColor: HTMLInputElement;
  let canvas: HTMLCanvasElement;

  /*
  As setColor could be triggered by $effect(setColor) or via button click event
  it has to find the way it is triggered as via event it should read the value
  from the input field.
 */

  const setColor = (event?: MouseEvent) => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (event) {
      context.fillStyle = cssUtils.convertToHexColor(elColor.value) as string;
    } else {
      // use $state to get the current value of color
      context.fillStyle = color;
    }
    context.fillRect(0, 0, size, size);
  };

  const colorOnClick = () => {
    //console.log('colorOnClick')
    elColor.value = '';
  };
  // any change in the color = $state('#223344') will trigger coloring the box
  // so setColor could be triggered from $effect or via button click event
  $effect(setColor);
</script>

<svelte:head>
  <title>Floating Label</title>
</svelte:head>
<div class="grid-wrapper">
  <div class="families">
    <!-- <dl> -->
    <details>
      <summary>The Koturs</summary>
      <p>Bojana</p>
      <p>Nikola</p>
      <p>Dragana</p>
      <p>Zeljko</p>
    </details>
    <details>
      <summary>The Milutinovics</summary>
      <p>Mia</p>
      <p>Marko</p>
      <p>Tanja</p>
      <p>Ljuban</p>
    </details>
    <details>
      <summary>The Isakovics</summary>
      <p>Matia</p>
      <p>Filip</p>
      <p>Snezana</p>
      <p>Ljubomir</p>
    </details>
    <details>
      <summary>The Kuzmanovics</summary>
      <p>Jovana</p>
      <p>Milica</p>
      <p>MIrjana</p>
      <p>Sasa</p>
    </details>
    <!-- </dl> -->
  </div>
  <div class="container">
    <InputBox title="First Name"></InputBox>
    <InputBox title="Last Name"></InputBox>
    <InputBox title="Email"></InputBox>
    <InputBox title="Password" type="password"></InputBox>
  </div>
  <div>
    <canvas
      bind:this={canvas}
      width="100"
      height="100"
      style="border: 2px solid white"
    ></canvas>

    <div class="controls">
      <label>
        <input type="range" bind:value={size} /> size
      </label>
      <label>
        <input type="color" bind:value={color} onclick={colorOnClick} /> color
      </label>
    </div>
    <label for="c">
      Color hsa code
      <input type="text" id="c" bind:this={elColor} class="input-hsa" />
      <!-- setColor based on the above input string -->
      <button onclick={setColor}>set color</button>
    </label>
  </div>
</div>

<style lang="scss">
  .grid-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 7rem !important;
    // grid-template-columns: repeat(1fr 1fr);
    // width: 80vw;
    gap: 2rem;
  }
  .container {
    border: 1px solid gray;
    border-radius: 10px;
    width: max-content;
    padding: 1rem 3rem;
    // margin: 5rem 0 0 15vw;
  }
  .families {
    background-color: skyblue;
    width: max-content;
    padding: 1rem 3rem;
    border-radius: 1rem;
  }
  .fa {
    width: max-content;
    padding: 6px 1rem;
    border: 1px solid gray;
    border-radius: 6px;
  }
  dt {
    color: white;
    background-color: navy;
    text-transform: capitalize;
    padding: 2px 1rem;
    border-radius: 4px;
    margin-bottom: 4px;
    &:not(:first-child) {
      margin-top: 1rem;
    }
  }
  dd {
    color: black;
    background-color: cornsilk;
    padding: 0 1rem;
  }
  dt ~ dd:last-child {
    color: red;
  }
  /* ------------------------------------- */
  .controls {
    border-top: 1px solid #ccc;
    padding: 1em 0;
    margin: 1em 0;
    display: flex;
    gap: 1em;
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .input-hsa {
    width: 15rem;
    color: hsla(66, 75%, 50%, 0.855);
  }
  details {
    color: navy;
    font-size: 2em;
    cursor: pointer;
    p {
      color: brown;
      margin: 0;
      padding: 0 0 0 2rem;
      font-size: 1em !important;
    }
  }
</style>
