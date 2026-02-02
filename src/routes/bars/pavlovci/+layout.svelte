<script lang="ts">
  import { type Snippet } from 'svelte';
  type ARGS = {
    locals: App.Locals;
    children: Snippet<[]>;
  };
  let { locals, children }: ARGS = $props();
</script>

<div>
  {@render children()}
</div>
