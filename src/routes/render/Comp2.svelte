<script>
	let { cls, style, caption, children } = $props();
</script>

<div class={cls} {style} onclick={console.log('clicked')} aria-hidden={true}>
	{caption ?? 'Child'}
	{@render children()}
</div>
