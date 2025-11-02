<script lang="ts">
  import Comp from '$lib/components/Comp.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  let btnCreate: HTMLButtonElement;
  let firstName = '';

  const enhanceSubmit: SubmitFunction = async ({ action, formData }) => {
    console.log('enhanceSubmit called', action);
    const firstName = formData.get('firstName');
    console.log('firstName', firstName);
  };
</script>

<form action="?/create" method="POST" use:enhance={enhanceSubmit}>
  <input id="f1" name="firstName" bind:value={firstName as string} />
  <Comp caption="submit" bind:button={btnCreate} formaction="?/create"></Comp>
  <button type="submit">submit</button>
</form>
