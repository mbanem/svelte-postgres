<script lang="ts">
  import { onMount } from 'svelte';
  // import { Tooltip } from 'flowbite-svelte';
  // component to get CSS class prop from parent
  import Component from './Component.svelte';
  // import XTooltip from '$lib/utils/tooltip.svelte';
  import { string } from 'zod';

  //
  let buttonEl: HTMLButtonElement;
  const createdAt = new Date('2023-10-01T02:15:00Z');
  const updatedAt = new Date('2024-08-06T04:10:00Z');
  let hth: number = 0;
  let wht: number = 0;
  onMount(() => {
    const rect = document.getElementById('divEl')?.getBoundingClientRect();
    if (rect) {
      hth = -2 * rect.height;
      wht = rect.width;
    }
  });
</script>

<br style="margin-top:4rem" />
{#snippet tooltip()}
  event.preventDefault()
  <div class="tt-container">
    <p class="title"></p>
  </div>
{/snippet}
<!-- <XTooltip
  position="top-left"
  renderingSnippet={tooltip}
  cssClass="tooltip-local"
  hoveringElement={buttonEl}
  hoveringDelayMs={500}
></XTooltip> -->
<!-- 
    Component to get CSS class prop from parent
    we cannot specify prop name as {class} as it is CSS keyword
    so we send it as css-prop-class and the class must be :global()

    We define a snippet that renders markup with Participant name
    and address and send snippet reference to <Component so she
    call @render participant() without sending any parameters to
    participant() snippet function
-->

<!-- 
    Argument was named class, a CSS/TS keyword and cause 
    unexpected token compiler error
    so we use class_name instead
-->
<button bind:this={buttonEl}>hovering button</button>
{#snippet participant(class_name: string)}
  <div class={class_name}>
    <p>Filip Isakovic</p>
    <p>6524 Cascade St.</p>
    <p>San Diego, 92122</p>
  </div>
{/snippet}
<div>
  <Component
    class_wrapper={'css-prop-wrapper'}
    class_participant={'css-prop-participant'}
    class_circle={'css-prop-circle'}
    {participant}
  ></Component>
</div>

<style lang="scss">
  // .tooltip-local-wrapper {
  //   position: relative;
  //   display: inline-block;
  //   // width: max-content;
  //   padding: 0 3rem;
  //   margin: 0 !important;

  //   button:not(last-child) {
  //     margin: 0 10px 0 0 !important;
  //   }
  // }

  /* NOTE: IMPORTANT! tooltip defaultClass must be defined as :global class
    Here are default rules for the tooltip panel itself and could be overridden
    by the local rules inside the component itself
  */
  :global(.tooltip-local) {
    position: absolute;
    display: grid;
    grid-template-columns: max-content max-content !important;
    grid-template-rows: 1.2rem;
    justify-content: flex-start;
    align-items: baseline;
    row-gap: 0;
    color: skyblue;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    text-wrap: wrap;
    background-color: var(--TOOLTIP-BACKGROUND-COLOR);
    border: 1px solid gray;
    border-radius: 8px;
    padding: 0 !important;
    z-index: 6;
    p {
      padding: 0 0.5rem;
      margin: 6px;
    }
    p:nth-child(even) {
      color: lightgreen;
      text-align: left;
    }
  }
  /* --------------------------------------- */
  /* class to be sent to component as a prop */

  :global(.css-prop-wrapper) {
    position: relative;
    width: max-content;
    padding: 1rem 2rem;
    background-color: navy !important;
    color: black;
    font-size: 20px;
    line-height: 6px;
    border: 4px solid red !important;
    border-radius: 8px;
    margin: 3rem 1rem 1rem 3rem;
    padding: 1rem 2rem !important;
    z-index: 2 !important;
    &::before {
      position: absolute !important;
      content: ' User Details ';
      top: -2rem !important;
      left: -1rem !important;
      color: blue !important;
      font-size: 15px !important;
      height: 140% !important;
      width: 140% !important;
      border: 2px solid black !important;
      border-radius: 8px !important;
      z-index: -1 !important;
      background-color: cornsilk !important;
    }
  }
  :global(.css-prop-participant) {
    color: navy;
    background-color: skyblue;
    width: 14.5rem;
    padding: 3px 1.4rem;
    border-radius: 5px;
    margin: 2rem 0 0 2.3rem;
    text-align: center;
  }
  :global(.css-prop-circle) {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background-color: lightgreen;
    margin: 1rem 0 0 7rem;
    text-align: center;
    line-height: 8rem;
    font-size: 20px;
    color: navy;
  }
  .local {
    font-size: 16px;
    p {
      color: black;
      padding-left: 0.5rem;
      &:first-child {
        padding-left: 0;
        color: blue;
        font-size: 24px !important;
      }
    }
  }
</style>
