<script lang="ts">
  const colors = ['orange', 'red', 'purple', 'green', 'blue', 'navy', 'violet'];
  let selected = $state(colors[0]);
</script>

<h1 style="color: {selected}">Pick a color</h1>

<div>
  {#each colors as color, i}
    <button
      style="background-color:{color} !important;"
      aria-label={color}
      aria-current={selected === color}
      onclick={() => (selected = color)}>{i + 1}</button
    >
  {/each}
</div>

<style>
  h1 {
    transition: color 0.2s;
  }

  div {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-row-gap: 4rem;
    max-width: 400px;
    margin-left: 2rem;
  }

  button {
    aspect-ratio: 1;
    border-radius: 50%;
    transform: translate(-2px, -2px);
    /* a shadow behind the button */
    filter: drop-shadow(6px 5px 5px rgba(202, 235, 82, 0.2));
    transition: all 0.2s;
  }

  button[aria-current='true'] {
    transform: none;
    filter: none;
    /* make button sink down on click */
    box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.4);
  }
</style>
