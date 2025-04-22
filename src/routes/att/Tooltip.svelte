<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { type Snippet } from 'svelte';
  import { fadeScale } from './fade-scale';
  type PROPS = {
    delay: number;
    duration: number;
    baseScale: number;
    caption: string;
    class_participant?: string;
    participant?: (class_name: string) => ReturnType<Snippet>;
    visible: boolean;
  };
  let divId = '';
  const id = () => {
    divId = `i${(Math.random() * 10 ** 8).toString(36).replace(/\./g, '')}`;
    return divId;
  };
  let {
    delay,
    duration = 2000,
    baseScale,
    caption,
    class_participant,
    participant,
    visible = $bindable(),
  } = $props();
  const toggle = () => {
    visible = !visible;
  };

  // console.log(delay,duration,baseScale,caption)
</script>

{#snippet handler()}
  {#if visible}
    <div
      id={id()}
      style={`position:absolute;transform: translate(-1.2rem,-110%);opacity:0.5;padding: 0.5rem;color: white;text-align: center;background: navy;width:max-content;height:auto;padding: 2px 1rem;border: 1px solid gray;border-radius:6px;`}
      transition:fadeScale={{
        delay,
        duration,
        easing: cubicInOut,
        baseScale,
      }}
    >
      {@render participant('css-prop-wrapper local')}
    </div>
  {/if}
{/snippet}
<button onmouseenter={toggle} onmouseleave={toggle}>
  {@render handler()}
  toggle visible
</button>

<style>
  button {
    position: relative;
    margin: 6rem 4rem;
    padding: 0 1rem;
  }
</style>
