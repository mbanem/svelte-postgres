<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import UserCRUDForm from '$lib/components/UserCRUDForm.svelte';

  type ARGS = {
    data: PageData;
    form: ActionData;
  };
  let { data, form }: ARGS = $props();
</script>

<h1>User CRUD Form</h1>
<UserCRUDForm></UserCRUDForm>
<pre>{JSON.stringify(data, null, 2)}</pre>
