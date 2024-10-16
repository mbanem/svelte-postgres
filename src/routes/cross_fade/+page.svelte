<script>
	import MoveButtons from './MoveButtons.svelte'
	import Explanation from './Explanation.svelte'

	import { crossfade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { flip } from 'svelte/animate'
	import { onMount } from 'svelte'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'
	// dirty function to quickly generate some keys
	const randomId = () => {
		return (Math.random() + 1).toString(36).slice(2, 5)
	}

	let pix = 0
	let cix = 0
	const parents = [
		['Snezana', 'Ljubomir', 'Isakovic'],
		['Tanja', 'Ljuban', 'Milutinovic'],
		['Dragana', 'Zeljko', 'Kotur'],
		['Mirjana', 'Sasa', 'Krsmanovic']
	]
	const children = [
		['Matia', 'Filip'],
		['Mia', 'Marko'],
		['Bojana', 'Nikola'],
		['Jovana', 'Milica']
	]
	// state
	const createOuter = (inner) => {
		let _text = `outer-${randomId()}`
		let _inner = $state(inner)

		return {
			get text() {
				return _text
			},
			get inner() {
				return _inner
			}
		}
	}

	const createInner = () => {
		let _text = `inner-${randomId()}`

		return {
			get text() {
				return _text
			}
		}
	}

	// for moving items
	function moveOuter(outer, shift) {
		const from = list.indexOf(outer)
		// make sure to check array bounds
		const to = from + shift > list.length || from + shift < 0 ? from : from + shift

		list.splice(to, 0, list.splice(from, 1)[0])
	}

	function moveInner(outer, inner, shift) {
		const outerFrom = list.indexOf(outer)
		const innerFrom = outer.inner.indexOf(inner)

		// check array bounds, but make sure to move the inner to the adjacent outer
		// if one is available
		let outerTo = outerFrom
		let innerTo = 0
		if (innerFrom + shift < outer.inner.length && innerFrom + shift >= 0) {
			// we shift within the same outer!
			innerTo = innerFrom + shift
		} else if (innerFrom + shift >= outer.inner.length && outerFrom + shift < list.length) {
			// we shift to first item of the next outer
			outerTo += 1
			innerTo = 0
		} else if (innerFrom + shift < 0 && outerFrom + shift >= 0) {
			// we shift to the last item of the previous outer
			outerTo -= 1
			innerTo = list[outerTo].inner.length
		}

		const moved = list[outerFrom].inner.splice(innerFrom, 1)[0]
		list[outerTo].inner.splice(innerTo, 0, moved)
	}

	// for adding new items
	function appendInner(outer) {
		outer.inner.push(createInner())
	}

	function appendOuter() {
		list.push(createOuter([]))
	}

	// create the initial list
	let list = $state([
		createOuter([createInner(), createInner()]),
		createOuter([createInner(), createInner()])
	])

	// transition
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback() {
			return {
				duration: 300,
				easing: cubicInOut,
				css: () => `
				opacity: 0;
			`
			}
		}
	})

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<div class="wrap-all">
	<Explanation />

	<ul class="container">
		<div class="header">
			<button onclick={() => appendOuter()}> append new outer </button>
		</div>
		{#each list as outer, index (outer.text)}
			<li class="outer container" animate:flip={{ duration: 300 }}>
				<MoveButtons actionUp={moveOuter(outer, -1)} actionDown={moveOuter(outer, 1)} />
				<ul class="content">
					<div class="header">
						<span>{outer.text}</span>
						<button onclick={() => appendInner(outer)}> append new inner </button>
					</div>
					{#each outer.inner as inner, i (inner.text)}
						<li
							class="inner container"
							in:receive={{ key: inner.text }}
							out:send={{ key: inner.text }}
							animate:flip={{ duration: 300 }}
						>
							<MoveButtons
								actionUp={moveInner(outer, inner, -1)}
								actionDown={moveInner(outer, inner, 1)}
							/>
							<div class="content">
								{inner?.text}
							</div>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>

<style>
	.wrap-all {
		margin-left: 5rem !important;
	}
	.container {
		border: 1px solid gray;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 80vw;
		/* margin: 0 auto; */
	}

	.outer,
	.inner {
		display: flex;
		flex-direction: row;
		width: 98.4%;
		background-color: bisque;
		/* border: 1px solid pink; */
	}

	.outer > .content,
	.inner > .content {
		flex: 1;
		padding: 0 0 0 1rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 90%;
		background-color: aliceblue;
		font-size: 18px;
		color: black;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		/* border: 1px solid yellow; */
	}
</style>
