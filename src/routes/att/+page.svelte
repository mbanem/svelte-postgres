<script lang="ts">
  import Tooltip from './Tooltip.svelte';

  const props = {
    delay: 250,
    duration: 800,
    baseScale: 0,
    caption: 'Printing the Report',
  };
</script>

{#snippet participant(class_name: string)}
  <div class={class_name}>
    <p style="color:lightgreen;font-size:22px;margin:0;">Filip Isakovic</p>
    <p style="color:yellow;margin:2px;">6524 Cascade St.</p>
    <p style="color:yellow;margin:2px;">San Diego, 92122</p>
  </div>
{/snippet}

<Tooltip {...props} class_participant={'css-prop-participant'} {participant}
></Tooltip>

<style>
  /* class sent as prop to component must be wrapped in :global() */
  :global(.css-prop-participant) {
    position: absolute;
    top: -4rem !important;
    left: 0;
    color: navy;
    background-color: skyblue;
    width: 14.5rem;
    padding: 3px 1.4rem;
    border-radius: 5px;
    margin: 2rem 0 0 2.3rem;
    text-align: center;
    z-index: 10;
  }
</style>
