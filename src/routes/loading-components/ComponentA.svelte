<script lang="ts">
  import { onMount } from 'svelte';
  onMount(() => {
    return () => console.log('exit');
  });
</script>

<h2 style="color:blue;background-color:#fffe71;text-align:center;">
  Hello There from Component A!
</h2>
