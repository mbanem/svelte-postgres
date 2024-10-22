<!-- 
@component
	new CustomEvent(type)
	new CustomEvent(type, options)

	in this example parent defined optional CustomEvent type as
		type TCustomEvent = {
			type: string
			detail: { chance: number }
		}
	than delivers value for chance in its detail property
	CustomEvent Parameters
		type
    A string providing the name of the event. Event names are case-sensitive.
		options are optional
    An object that, in addition of the properties defined in Event(), can have the following properties:
    detail -- which is again optional
      An event-dependent value associated with the event.
			This value is then available to the handler using the CustomEvent.detail property. It defaults to null.
			In this example event 'onforward' is handled at parent in function
				const go = (direction: string, e?: TCustomEvent)
			accessing the chance value as e.detail.chance
-->
<svelte:options customElement="comp-dispatcher" />

<script lang="ts">
	let chance: number
	function dispatch(type: any) {
		const evt = new CustomEvent(type, {
			detail: {
				chance
			}
		})
		$host().dispatchEvent(evt)
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>

<button
	onclick={() => {
		;(chance = Math.round(Math.random() * 1000) / 1000) > 0.5
			? dispatch('forward')
			: dispatch('backward')
	}}
>
	where to go?
</button>
