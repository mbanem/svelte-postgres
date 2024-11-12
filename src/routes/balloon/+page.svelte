<script lang="ts">
  import Balloon from '$components/Balloon.svelte';
  import Child from '$components/Child.svelte';
  import { sleep } from '$utils';
  // import { splitColor } from 'gsap';

  // let size = $state(15);
  // let power = $state(5);
  // let burst = $state(false);
  type SizePowerBurst = {
    size: number;
    power: number;
    burst: boolean;
  };
  const spb = $state<SizePowerBurst>({ size: 15, power: 5, burst: false });

  const reset = async () => {
    spb.size = 1;
    spb.burst = false;
    for (let i = 0; i < 15; i++) {
      spb.size += 1;
      await sleep(50);
    }
  };

  // bindable parent and child have access to the same function

  let array = $state([0, 1, 2, 3]);

  const addNew = () => {
    array.push(array.length);
  };
  const removeLast = () => {
    array.pop();
  };
  const inflate = (power: number) => {
    spb.size += power;
    if (spb.size > 50) {
      spb.burst = true;
      setTimeout(() => {
        reset();
      }, 1000);
    }
  };
</script>

<svelte:head>
  <title>Inflatable Balloon</title>
</svelte:head>
<div class="wrapper">
  <div class="parent-container">
    <button onclick={addNew}>add next</button>
    <button onclick={removeLast}>remove the last</button>
    <pre>We can change pump power in parent
			Pump power: {spb.power} <button onclick={() => spb.power--}>-</button> <button
        onclick={() => spb.power++}>+</button
      >
		</pre>
  </div>
  <div class="child-container">
    <div>
      <Balloon
        bind:size={spb.size}
        bind:power={spb.power}
        {inflate}
        deflate={(power: number) => {
          if (spb.size > 0) spb.size -= power;
        }}
      />
      {#if spb.burst}
        <!-- <button onclick={reset} class="new-balloon">new balloon</button> -->
        <span class="boom">💥</span>
      {:else}
        <span class="balloon" style="scale: {0.01 * spb.size}"> 🎈 </span>
      {/if}
    </div>
    <Child bind:array />
  </div>
</div>

<style lang="scss">
  .parent-container {
    @include container('Parent Estate', $head-color: lightgreen);
    margin: 2rem 0 0 1rem;
    padding: 2rem;
  }
  .child-container {
    @include container('Child Estate', $head-color: lightgreen);
    margin-top: 2rem;
  }
  .wrapper {
    display: grid;
    width: 80vw;
    grid-template-columns: 1fr 1fr;
  }
  button {
    display: inline-block;
  }
  span {
    position: fixed;
    left: 40vw;
    top: 10rem;
    width: 30%;
    height: 30%;
    font-size: 100vw;
    text-align: center;
    line-height: 1;
    pointer-events: none;
    /* cursor: pointer; */
  }

  .balloon {
    transition: scale 0.2s;
  }

  .boom {
    animation: boom 0.5s forwards;
  }

  @keyframes boom {
    0% {
      scale: 0.6;
    }
    25% {
      scale: 0.75;
    }
    100% {
      scale: 0;
    }
  }
</style>
