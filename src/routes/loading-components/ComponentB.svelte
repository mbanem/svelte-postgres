<script lang="ts">
  import { onMount } from 'svelte';
  onMount(() => {
    return () => console.log('exit');
  });
</script>

<h2 style="color:green;background-color:skyblue;text-align:center;">
  Hello There from Component B!
</h2>
