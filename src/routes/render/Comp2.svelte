<script lang="ts">
	import type { Snippet } from 'svelte'
	type ARGS = {
		cls: string
		caption2: string
		children: Snippet<[]>
	}
	let { cls, caption2, children }: ARGS = $props()
</script>

<div class={cls} onclick={() => console.log('clicked')} aria-hidden={true}>
	{caption2 ?? 'Child'}
	{@render children()}
</div>
