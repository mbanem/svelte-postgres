<script lang="ts">
  import { gsap } from 'gsap';
  import * as utils from '$lib/utils';
  import { onMount } from 'svelte';

  let angle = $state(360);
  const options = $derived({ rotation: angle, duration: 2 });
  const to = (
    element: HTMLElement,
    options: { rotation: number; duration: number },
  ) => {
    gsap.to(element, options);
  };

  let theBox: HTMLDivElement;
  const rotateTopBox = () => {
    utils.setCSSValue('--BOX-COLOR', angle === 0 ? 'aqua' : 'lightgreen');
    to(theBox, options);
    // flip the sign
    angle = angle > 0 ? 0 : 360;
  };

  let rox: HTMLDivElement;
  let rox_angle = 180;
  const rotateRox = () => {
    to(rox, { rotation: rox_angle, duration: 1 });
    rox_angle = rox_angle > 0 ? 0 : 180;
  };

  let attEl: HTMLElement;
  const go = (element: HTMLElement) => {
    gsap.to(element, { rotation: 360, duration: 2 });
  };
  let attachAngle = 360;
  const rotateAttach = (event: MouseEvent | KeyboardEvent) => {
    // if (event.type === 'MouseEvent') {
    to(event.target as HTMLDivElement, { rotation: attachAngle, duration: 2 });
    // }
    attachAngle = attachAngle > 0 ? 0 : 360;
  };

  const attach = (element: HTMLElement) => {
    // console.log('element mounted');
    gsap.to(element, { rotation: 360, duration: 2 });
    // return () => console.log('element unmounted');
  };

  const noOptions = (options: Object) => {
    return (element: HTMLElement) => {
      gsap.to(element, options);
    };
  };
  const rotate = (element: HTMLElement) => {
    // return (element: HTMLElement) =>
    gsap.to(element, { rotation: -720, duration: 4 });
  };
</script>

<div class="two-column-grid">
  <div>
    <div class="row">
      <div class="top-box" bind:this={theBox}>Top Box</div>
      <!-- <div {@attach rotate} class="second-box">Second &nbsp; Box</div> -->
    </div>
    <div class="box" use:to={{ rotation: 360, duration: 1 }}>on load rotor</div>
    <button onclick={rotateTopBox}>rotate top box</button>
    <pre>
All boxes are &lt;div elements. The 'top box', referenced with a 
variable theBox:HTMLDivElement is animated with a function triggered 
via 'rotate top box' button issuing gsap.to(theBox, options) toggling
rotation between 360 and 0 on every click while changing direction.

The 'Second Box' has new &lcub;@attach rotate&rcub; prop with options
&lcub; rotation: -720, duration: 4 &rcub;

    </pre>
  </div>
  <div>
    <div class="rox" bind:this={rox}>ROX</div>
    <button onclick={rotateRox}>rotate ROX</button>

    <div
      bind:this={attEl}
      onclick={rotateAttach}
      onkeydown={rotateAttach}
      class="attach-box"
      aria-hidden={true}
    >
      click me using @attach
    </div>
    <!-- <div {@attach noOptions({ rotation: 360, duration: 2 })} class="box">
      on load using @attach
    </div> -->
  </div>
</div>

<style lang="scss">
  :root {
    --BOX-COLOR: aqua;
  }
  .two-column-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .box,
  .top-box,
  .second-box,
  .attach-box,
  .rox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    aspect-ratio: 1;
    background-color: aqua;
    border-radius: 8px;
    margin: 4rem 8rem;
    color: blue;
    text-align: center;
  }
  .top-box {
    background-color: var(--BOX-COLOR);
  }
  .second-box {
    color: white;
    background-color: forestgreen;
  }
  .rox {
    color: white;
    background-color: red;
  }
  .row {
    display: flex;
  }
  .attach-box {
    color: white;
    background-color: navy;
    cursor: pointer;
  }
  button {
    margin-left: 6rem;
  }
</style>
