<script lang="ts">
  import InputBox from '$components/InputBox.svelte';
  import * as cssUtils from '$lib/utils';
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

  // InputBox props
  let F = $state({
    FirstName: '',
    LastName: '',
    email: '',
    password: '',
  });

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
    elColor.value = '';
  };

  // any change in the color = $state('#223344') will trigger coloring the box
  // so setColor could be triggered from $effect or via button click event
  $effect(setColor);

  const toggleExpand = (event: MouseEvent) => {
    const el = event.target as HTMLButtonElement;
    const expand = el.innerText === 'expand all';
    // if (document.querySelector('details')) {
    // Fetch all the details elements
    const details = document.querySelectorAll('details');
    // Add onclick listeners
    if (details) {
      el.innerText = expand ? 'collapse all' : 'expand all';
      details.forEach((detail) => {
        detail.addEventListener('click', () => {
          details.forEach((detail) => {
            detail.open = true;
          });
        });
        detail.open = expand;
      });
    }
  };
  let is_hidden: boolean = $derived(
    Object.values(F).reduce((acc, el) => (el.length > 1 ? acc + 1 : acc), 0) ===
      4
      ? false
      : true,
  );
</script>

<!-- <pre>{JSON.stringify(F, null, 2)}</pre> -->
<svelte:head>
  <title>Floating Label</title>
</svelte:head>
<p>{F.email.length}</p>
<div class="grid-wrapper">
  <div class="families">
    <p onclick={toggleExpand} aria-hidden={true} class="expand-button">
      expand all
    </p>
    <details>
      <summary>The Koturs</summary>
      <p class="child">Bojana</p>
      <p class="child">Nikola</p>
      <p>Dragana</p>
      <p>Zeljko</p>
    </details>
    <details>
      <summary>The Milutinovics</summary>
      <p class="child">Mia</p>
      <p class="child">Marko</p>
      <p>Tanja</p>
      <p>Ljuban</p>
    </details>
    <details>
      <summary>The Isakovics</summary>
      <p class="child">Matia</p>
      <p class="child">Filip</p>
      <p>Snezana</p>
      <p>Ljubomir</p>
    </details>
    <details>
      <summary>The Kuzmanovics</summary>
      <p class="child">Jovana</p>
      <p class="child">Milica</p>
      <p>Mirjana</p>
      <p>Sasa</p>
    </details>
  </div>
  <div class="container">
    <InputBox
      title="firstName"
      bind:value={F.FirstName}
      capitalize={true}
      exportValueOn="keypress|blur"
      margin="0"
    ></InputBox>
    <InputBox
      title="lastName"
      bind:value={F.LastName}
      capitalize={true}
      exportValueOn="keypress|blur"
      margin="0"
    ></InputBox>
    <InputBox
      title="email"
      bind:value={F.email}
      exportValueOn="keypress|blur"
      margin="0"
    ></InputBox>
    <InputBox
      title="password"
      type="password"
      bind:value={F.password}
      exportValueOn="keypress|blur"
      margin="0"
    ></InputBox>
    <pre class:hidden={is_hidden}>
    let User = &lcub;
      {F.FirstName}
      {F.LastName}
      {F.email}
      {F.password.replace(/./g, '•')}
    &rcub;
    </pre>
  </div>
  <div>
    <canvas
      bind:this={canvas}
      width="200"
      height="200"
      style="border: 2px solid white"
    ></canvas>

    <div class="controls">
      <label for="m">
        <input id="m" type="range" bind:value={size} min="30" max="200" /> size
        range (30--200) currently
        <span class="size-text">{size}</span>
      </label>
      <label for="mm">
        <input id="mm" type="color" bind:value={color} onclick={colorOnClick} />
        color
      </label>
    </div>
    <label for="c">
      Enter color in some format and press set color
      <input
        type="text"
        id="c"
        bind:this={elColor}
        class="input-hsa"
        value="rgba(48, 223, 32, 0.855)"
      />
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
    margin-top: 4rem !important;
    gap: 2rem;
  }
  .container {
    border: 1px solid gray;
    border-radius: 10px;
    width: max-content;
    padding: 0 3rem;
    margin: 0;
  }
  .families {
    background-color: skyblue;
    width: max-content;
    padding: 1rem 3rem;
    border-radius: 1rem;
  }
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
    color: hwb(115 13% 13% / 0.855);
  }
  details {
    color: navy;
    font-size: 1.5em;
    cursor: pointer;
    p {
      color: crimson;
      margin: 0;
      padding: 0 0 0 2rem;
      font-size: 0.8em !important;
      font-style: italic;
    }
  }
  .size-text {
    position: relative;
    color: yellow;
    font-size: 2em;
    padding: 0 2rem 10px 0;
    margin-right: 2rem;
    &::after {
      position: absolute;
      color: #e3e3e3;
      content: 'px';
      font-size: 0.5em;
      top: 14px;
      left: auto;
    }
  }
  .child {
    color: forestgreen;
  }
  .expand-button {
    color: white;
    padding: 3px 1rem;
    border: 1px solid gray;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    background-color: royalblue;
  }
</style>
