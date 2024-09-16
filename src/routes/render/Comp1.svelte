<script lang="ts">
	import type { Snippet } from 'svelte'
	let { cls, caption1, children }: { cls: string; caption1: string; children: Snippet<[]> } =
		$props()
</script>

<!-- just markup without TypeScript using $$props -->
<div class={cls} onclick={() => console.log('clicked')} aria-hidden={true}>
	{caption1 ?? 'Child'}
	{@render children()}
</div>
<!-- <script>
	// with script extracting props first and then rendering markup
	let {cls, caption, children} = $props()
</script>
<div class={cls} onclick={console.log('clicked')} aria-hidden={true}>
{caption ?? 'Child'}
	{@render children()}
</div> -->
