<script lang="ts">
	import NavButton from '$lib/components/NavButton.svelte'
	const turn = () => {
		console.log('turn')
	}
	const items = [
		{ color: 'Pink', title: 'Home', href: '/' },
		{ color: 'Blue', title: 'Derived', href: '/derived' },
		{ title: 'Scroll', href: '/scroll' }, // make one with no color to use default color -- red
		{ color: 'Tomato', title: 'Caterpillar', href: '/caterpillar' },
		{ color: 'Green', title: 'Balloon', href: '/balloon' },
		{ color: 'Purple', title: 'Render', href: '/render' },
		{ color: 'LightGreen', title: 'Bars', href: '/bars' },
		{ color: 'Pink', title: 'Bindable', href: '/bindable' },
		{ color: 'Yellow', title: 'Flip', href: '/flip' }
	]

	// using $effect
	import { tick } from 'svelte'
	let inputBox: HTMLInputElement
	let div: HTMLDivElement
	let messages = $state<string[]>([])

	$effect.pre(() => {
		if (!div) return // not yet mountedChip
		// reference `messages` array length so that this code re-runs whenever it changes
		messages.length
		// autoscroll when new messages are added
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div?.scrollTo(0, div.scrollHeight)
			})
		}
	})

	const change = (event: KeyboardEvent) => {
		const char = event.key
		// console.log(char)
		if (event.key !== 'Enter') return
		if (event.target) {
			messages.push(inputBox.value as string)
			inputBox.value = ''
		}
	}
</script>

<pre>Using $effect based on messages.length to render
	a list of values entered in the below input box
</pre>
<input
	type="text"
	placeholder="Enter item for the list and press Enter key"
	size="20"
	class="input-box"
	bind:this={inputBox}
	onkeydown={change}
/>
<div bind:this={div}>
	{#each messages as message}
		<p class="names">{message}</p>
	{/each}
</div>

<!-- snipper default color is red -->
{#snippet icon(color = 'Red')}
	<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16">
		<circle cx="8" cy="8" r="8" fill={color} />
	</svg>
{/snippet}
<!-- snippet with default icon of Svelte -->
{#snippet profile(url = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg')}
	<img src={url} width="16" height="16" alt="pfp" />
{/snippet}
{#snippet snippetName()}
	<p>This is the snippet content</p>
{/snippet}
{@render snippetName()}
<!-- <NavButton label="home" title="Home" href="/" {snippetName}></NavButton> -->
{#each items as item}
	<p onclick={turn} aria-hidden={true}>
		<NavButton colorName={item.color ?? 'Red'} title={item.title} href={item.href}>
			{#snippet media()}
				{#if item.color}
					{@render icon(`${item.color}`)}
				{:else}
					{@render icon()}
				{/if}
			{/snippet}
		</NavButton>
	</p>
{/each}

<NavButton title="Svelte" href="/button">
	{#snippet media()}
		{@render profile()}
	{/snippet}
</NavButton>
<NavButton title="Vue" href="/counter">
	{#snippet media()}
		{@render profile('https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg')}
	{/snippet}
</NavButton>

<!-- using $effect -->
<style>
	.input-box {
		width: 20rem;
	}
	svg {
		display: inline-flex;
		margin-right: 8px;
	}
	p {
		/* must engulf the <Chip> in order to cover it for mouse click */
		display: inline-block;
		margin: 0;
		padding: 3px 6px;
		color: lightgreen;
		border-top: 1px solid gray;
		border-bottom: 1px solid gray;
	}
	p.names {
		color: yellow;
	}
	:global(.greeting) {
		font-style: italic;
		:hover {
			color: yellow;
			border-color: yellow;
		}
	}
</style>
