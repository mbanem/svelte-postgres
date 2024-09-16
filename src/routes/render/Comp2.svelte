<script lang="ts">
	import type { Snippet } from 'svelte'
	let { cls, caption2, children }: { cls: string; caption2: string; children: Snippet<[]> } =
		$props()
</script>

<!-- just markup without TypeScript using $$props -->
<div class={cls} onclick={() => console.log('clicked')} aria-hidden={true}>
	{caption2 ?? 'Child'}
	{@render children()}
</div>
