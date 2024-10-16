<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { crossfade } from 'svelte/transition'
	// import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$utils'
	let showTooltip = false

	let user = {
		firstName: 'Filip',
		lastName: 'Isakovic',
		age: 18
	}
	let start: boolean = true
	let [send, receive] = crossfade({
		duration: 2000
	})

	function handleClick() {
		start = !start
		showTooltip = true
	}

	let loading = false
	const toggleLoading = () => {
		loading = !loading
		showTooltip = true
		handleClick()
	}

	// unable to handle other events just on:outroend={handleEnd}
	const handleEnd = () => {
		console.log('Transition ended!')
		loading = !loading
		showTooltip = false
	}

	const toggleStartAndLoading = () => {
		start = !start
		loading = !loading
		showTooltip = true
	}
	let createdAt = new Date('2/18/2006').toLocaleString()
	let updatedAt = new Date('8/22/2007').toLocaleString()

	const add_ShadowDom = (str: string) => {
		const list = document.getElementById('beveragesList')
		if (list && list.firstChild?.textContent === str) {
			list.firstChild.remove()
			return
		}
		const newNode = document.createElement('li')
		const textNode = document.createTextNode('Water')
		newNode.appendChild(textNode)

		// Insert before existing child:
		if (list != null && list.children[0]) {
			list.insertBefore(newNode, list.children[0])
		}
	}
	const addShadowDOM = (event: MouseEvent) => {
		add_ShadowDom('Water')
		const el = event.target as HTMLButtonElement
		if (el.innerText.startsWith('add')) {
			el.innerText = el.innerText.replace(/^add/, 'remove')
		} else {
			el.innerText = el.innerText.replace(/^remove/, 'add')
		}
	}
	const insertShadowDom = (event: MouseEvent) => {
		const el = event.target as HTMLButtonElement
		el.innerText = el.innerText.startsWith('insert')
			? el.innerText.replace(/insert/, 'remove')
			: el.innerText.replace(/remove/, 'insert')
		const host = document.getElementById('host')
		console.log(host, host.children[0])
		if (host && host.children[0].children[0]) {
			host.children[0].children[0].remove()
			return
		}
		//const newNode = document.createElement('div')
		const newNode = utils.parseToHTML(
			"<div style='color:yellow;padding: 6px 1rem;border: 1px solid gray'>Newly inserted text</div>"
		)
		//newNode.appendChild(textNode)
		if (host && host.children[0]) {
			host?.insertBefore(newNode, host.children[0])
		}
	}
	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>CrossFade</title>
</svelte:head>

<main>
	<div>
		<h1>Crossfade Page</h1>
		<div class="relative" onclick={toggleStartAndLoading} aria-hidden={true}>
			{#if start}
				<div class="a" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
					click me
				</div>
			{:else}
				<div class="b" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
					once more
				</div>
			{/if}
		</div>
		<div style="position:relative">
			<button onclick={toggleLoading} style="text-align:center;">
				<!-- {#if loading}
				<CircleSpinner color="skyblue" />
			{/if} -->
				toggle loading
			</button>
		</div>
		<br style="margin-top:4rem" />
		<div class="tooltip-wrapper">
			<button style="width:100%">Post content is here having a tooltip</button>
			<Tooltip placement="top" defaultClass="local-tooltip" class="local-master" arrow={false}>
				<p>created on</p>
				<p class="prop-value">{createdAt.toLocaleString()}</p>
				<p>updated on</p>
				<p class="prop-value">{updatedAt?.toLocaleString()}</p>
			</Tooltip>
		</div>

		<p style="margin:5rem 0 0 5rem;">
			Button is flying... <span style="color:yellow;font-size:18px;">{showTooltip}</span>
		</p>
	</div>
	<div>
		<pre>On click an option to a list box is added and on succeeding click is removed
		</pre>
		<button onclick={addShadowDOM}> add list element </button>
		<ul id="beveragesList">
			<li>Coffee</li>
			<li>Tea</li>
		</ul>
	</div>
	<div class="shadow-block">
		<pre>Shadow DOM</pre>
		<br />
		<button onclick={insertShadowDom}>insert shadow DOM</button>
		<div id="host">
			A host element for shadow DOM
			<div id="here">insert shadow here</div>
		</div>
		<div id="target">the target for shadow element</div>
	</div>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		width: 80vw;
		margin: 8rem auto 0 auto;
		border: 1px solid gray;
		border-radius: 1rem;
		padding: 2rem;
		// margin-top: 2rem;
		// margin-left: 5rem;
		& > div {
			/* direct div children not nested ones */
			border: 1px solid gray;
			border-radius: 1rem;
			padding: 0 1rem;
		}
	}
	#host {
		margin-top: 1rem;
	}
	.a,
	.b {
		border: 1px solid gray;
		border-radius: 5px;
		width: max-content;
		padding: 3px 1rem;
		margin-top: 1rem;
		cursor: pointer;
		&:hover {
			color: yellow;
		}
		&:active {
			color: lightgreen;
			border: 4px solid lightgreen;
		}
	}
	.a {
		position: absolute;
		top: 2rem;
		left: 2rem;
		border: 4px solid yellow;
		display: none;
	}
	.b {
		position: absolute;
		top: 12rem;
		left: 20rem;
		border: 4px solid lightgreen;
	}
</style>
