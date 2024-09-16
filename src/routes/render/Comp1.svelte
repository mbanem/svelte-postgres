<script lang="ts">
	import type { Snippet } from 'svelte'
	let { cls, caption1, children }: { cls: string; caption1: string; children: Snippet<[]> } =
		$props()
</script>

<div class={cls} onclick={() => console.log('clicked')} aria-hidden={true}>
	{caption1 ?? 'Child'}
	{@render children()}
</div>
