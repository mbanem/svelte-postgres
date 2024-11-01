<!--
@component
Component renders a button with a 3/4 circle spinner in front of the button caption.
The mandatory props are
	- bindTo   -- bound parent variable, say btnCreate of type HTMLButtonElement, e.g. bind:bindTo={btnCreate)
	- spinOn   -- boolean flag true/false to set spinner ON and OFF
  - caption  -- button caption, e.g. create, update, delete ...
Optional props have default values
	- spinnerColor  -- default is skyblue
  - duration      -- # of seconds for a spinner single turn, but interval is spinOn lasting from true to false
  - size          -- diameter of the spinner circle arc
  - top           -- controls snipper vertical position, default is 5px
  - formaction    -- not specified for default form action (<form action='?/createPost') othervise
                    should be specified, e.g. formaction="?/updatePost" where action is specified in
                    +page.server.ts export const actions: Actions = { updateTodo: async ({ request }) => {...
  - width         -- button width large enough to accommodate spinner and caption, default is 6rem
  - hidden        -- hidden={hidden}, mandatory for initial button like create ( let hidden = false);
                    where hidden is parent boolean variable used as prop.
                    As other buttons are only visible on  condition we omit the hidden prop
  - disabled      -- controlled by parent boolean let disabled = false, default is false
  - cursor        -- boolean, usually boolean expression for pointer ot=r not allowed

Usage
<ButtonSpinner 	bind:bindTo={btnDelete} spinOn={loading} caption="delete" 
              formaction="?/deleteTodo" cursor={true} hidden={hidden} width='7rem'>
</ButtonSpinner>
-->

<script lang='ts'>
	type ARGS = {
		color?: string
		duration?: string
		size?: string
		top?: string
		bindTo?: any
		formaction?: string
		spinOn: boolean
		caption: string
		hidden?:boolean
		disabled?:boolean
		cursor?: boolean
	}
	let {
		color = `skyblue`,
		duration = `1.5s`,
		size = `1em`,
		top = `0`,
		bindTo=$bindable(),
		formaction,
		spinOn,
		caption,
		hidden=$bindable(true),
		disabled=$bindable(false),
		cursor=$bindable(true)
	}: ARGS = $props()
</script>

{#snippet spinner(color: string)}
	<div
		class="comrunner-div"
		style:border-color='{color} transparent {color}
		{color}'
		style='--duration: {duration}'
		style:width={size}
		style:height={size}
		style:top={top}
	></div>
{/snippet}

<p style='position:relative;margin:0;padding:0;'>
	<button bind:this={bindTo as HTMLButtonElement} type='submit' class:hidden={hidden} {formaction} disabled={disabled} style:cursor={cursor?'pointer':'not-allowed'}>
		{#if spinOn}
			<!-- NOTE: must have ancestor with position relative to get proper position -->
			{@render spinner(color)}
		{/if}
		{caption}
	</button>
</p>
<style>
	.comrunner-div {
		display: inline-block;
		vertical-align: middle;
		margin: 0 4pt;
		height:1rem;
		border-width: calc(1em / 5);
		border-style: solid;
		border-radius: 50%;
		animation: var(--duration) infinite rotate;
		position: absolute;
		left: 0;
		top: 8px !important;
		color: black;
	}
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
	.hidden{
		display:none;
	}
</style>