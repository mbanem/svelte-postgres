<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
</script>

<h1>Sample /data-fetching/sub page</h1>
<br />
<a href="/data-fetching/">Data-Fetching Page</a>
<br />
<pre>Layout data 
obtained from root parent +layout.server.ts
</pre>

<p>{data.fakeLayoutData.toString()}</p>

<p>array length: {data.fakeLayoutDataLength}</p>
