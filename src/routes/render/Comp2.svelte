<script>
	let { cls, caption2, children } = $props()
</script>

<div class={cls} onclick={console.log('clicked')} aria-hidden={true}>
	{caption2 ?? 'Child'}
	{@render children()}
</div>
