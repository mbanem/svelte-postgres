<script lang="ts">
	import type { Snippet } from 'svelte'
	type ARGS = {
		cls: string
		caption1: string
		children: Snippet<[]>
	}
	let { cls, caption1, children }: ARGS = $props()
</script>

<div class={cls} onclick={() => console.log('clicked')} aria-hidden={true}>
	{caption1 ?? 'Child'}
	{@render children()}
</div>
