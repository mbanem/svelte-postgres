<!-- just markup without TypeScript using $$props -->
<div class={$$props.cls} onclick={console.log('clicked')} aria-hidden={true}>
	{$$props.caption ?? 'Child'}
	<slot></slot>
</div>
<!-- <script>
	// with script extracting props first and then rendering markup
	let {cls, caption, children} = $props()
</script>
<div class={cls} onclick={console.log('clicked')} aria-hidden={true}>
{caption ?? 'Child'}
	{@render children()}
</div> -->
