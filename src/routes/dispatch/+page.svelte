<script lang="ts">
	import { goto } from '$app/navigation'
	import './dispatcher.svelte'

	type TCustomEvent = {
		type: string
		detail: { chance: number }
	}
	let count = $state(0)
	let WHERE = $state('')
	let whereRepeated = 0

	const go = (direction: string, e?: TCustomEvent) => {
		if (e) {
			let color = e.detail.chance > 0.5 ? 'lightgreen' : 'pink'
			let chance = e.detail.chance

			if (WHERE === direction) {
				whereRepeated += 1
				WHERE = `<span style='color:${color};'> ${direction} ${whereRepeated} ${chance}</span>`
			} else {
				whereRepeated = 1
				WHERE = `<span style='color:${color};'> ${direction} ${chance}</span>`
			}
		}
	}
</script>

<svelte:head>
	<title>Svelte 5 compiled component with CustomEvent type</title>
</svelte:head>

<div class="container">
	<pre>
	Component dispatcher.svelte is compiled as a custom element using
		&lt;svelte:options customElement="comp-dispatcher" /&gt;
	where the customElement give component a name of "comp-dispatcher"
	that we use below as a tag specifying two handlers for a 'dispatch'
	event that a comp-dispatcher is programmed to provide, so the parent
	implement two event handlers 'ondecrement' and 'onincrement' that
	expect comp-dispatcher to dispatch using clicks on its corresponding buttons

	Component randomly fires 'forward' or 'backward' events by clicking on 
	'where to go?' button that we render the response below
				<p class="where-count">where to go? {@html WHERE}</p>
				<p class="where-count">count: {count}</p>
				<comp-dispatcher
			onincrement={() => (count += 1)}
			ondecrement={() => (count -= 1)}
			onforward={(e: TCustomEvent) => go('forward', e)}
			onbackward={(e: TCustomEvent) => go('backward', e)}></comp-dispatcher>
				
			</pre>
</div>

<style lang="scss">
	.container {
		margin: 5rem 10vw;
		width: 30vw;
	}
	.where-count {
		font-size: 14px;
		color: yellow;
		margin: 0 0 0 6rem;
		padding: 0;
	}
</style>
