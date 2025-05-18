<script lang="ts">
  import SnippetTable from '$routes/floating-inputs/snippet/Snippet-Table.svelte';
  import { type Snippet } from 'svelte';
  type PROPS = {
    class_wrapper: string;
    class_participant: string;
    class_circle: string;
    participant: (class_name: string) => ReturnType<Snippet>;
  };
  let {
    class_wrapper: CLASS_WRAPPER,
    class_participant,
    class_circle,
    participant,
  }: PROPS = $props();
</script>

<!-- 
    there are two ways to include class_wrapper prop
    1st as a class name class_wrapper along the local class name
        <div class="local class_wrapper">
    2nd as a variable CLASS_WRAPPER along the local class name
        <div class="local {CLASS_WRAPPER}">

-->
<div class="{CLASS_WRAPPER} local">
  <p>Filip Isakovic</p>
  <p>6524 Cascade St.</p>
  <p>San Diego, 92122</p>
</div>

<!-- send snippet CSS class name implemented here in Component.svelte-->
<div>{@render participant('css-prop-wrapper local')}</div>
<p class={class_participant}>Participant Name</p>
<div class={class_circle}>A CIRCLE</div>

<pre style="color:lightgreen">
  If a :global(.css-prop-class) contains pseudo class ::before
  the prop class delivered to the component does not render component
  correctly in vsCode but did it OK in Svelte REPL playground.
  See the REPL file <span style="color:lightblue;"
    >Send CSS class from parent to child component</span
  >
</pre>

<style lang="scss">
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
      color: navy !important;
      font-size: 20px !important;
      line-height: 2rem;
      height: 140% !important;
      width: 140% !important;
      border: 2px solid black !important;
      border-radius: 8px !important;
      z-index: -1 !important;
      background-color: cornsilk !important;
    }
  }
</style>
