<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state'; // for $age.status code on actions
  import * as utils from '$lib/utils';

  import type { PageData } from './$types';

  let { data }: PageData = $props();

  onMount(() => {
    return () => {
      utils.setMrPath(page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>
<main class="main">
  <div class="container-left">
    <h1>Admin Page</h1>
    <br />
    <pre>
this is an empty page just to show it is protected and accessible only by ADMIN
		</pre>
    <pre>
+page.svelte received data from hooks.server.ts as 'locals'
and from +page.server.ts as 'greeting'

{JSON.stringify(data, null, 2)}</pre>
  </div>
  <div class="container-right">
    <pre
      style="font-size:14px;">page content holds data as well {JSON.stringify(
        page,
        null,
        2,
      )}</pre>
  </div>
</main>

<style lang="scss">
  .main {
    margin: 1rem 0 0 4rem;
    display: flex;
    width: 80vw;
  }
  .container-left {
    @include container('Admin Page Content', $head-color: skyblue);
  }
  .container-right {
    @include container('Page Object From svelte/stores', $head-color: skyblue);
    margin-left: 1rem;
  }
</style>
