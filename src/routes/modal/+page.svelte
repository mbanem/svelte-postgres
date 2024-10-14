<script lang="ts">
	let divEl: HTMLDivElement
	let updateButton: HTMLButtonElement
	let preEl: HTMLPreElement
	let init = true
	let showModal = false
	const mainCallback = () => {
		preEl.innerHTML += 'main callback function<br/>'
	}
	const render = () => {
		if (!showModal) return
		preEl.innerHTML += 'render()<br/>'
	}
	const clickOutside = (
		element: HTMLDivElement,
		callbackFunction: () => void,
		addListener: boolean = true
	) => {
		const onClick = (event: MouseEvent) => {
			event.stopPropagation()
			// ignore clicking inside the modal dialog it mist be clickOutside
			// @ts-expect-error
			if (!element.contains(event.target)) {
				callbackFunction()
			}
		}
		if (addListener) {
			preEl.innerHTML += 'add click event listener to document.body<br/>'
		}
		document.body.addEventListener('click', onClick)
		document.body.style.cursor = 'pointer'
		divEl.innerHTML =
			"<span style='color:lightgreen;'>Modal&nbsp;Dialog</span> <p style='font-size:10px;font-style:italic;margin:0;'>click&nbsp;outside&nbsp;to&nbsp;close</p>"
		updateButton.classList.toggle('hidden')
		return {
			update(newCallbackFunction: () => void) {
				callbackFunction = newCallbackFunction
			},
			destroy() {
				preEl.innerHTML += 'remove click event listener from document.body</br>'
				document.body.removeEventListener('click', onClick)
				document.body.style.cursor = 'default'
				divEl.innerHTML += "<span class='span'>Modal&nbsp;Dialog</span><br/>"
				updateButton.classList.toggle('hidden')
			}
		}
	}

	const update = (event: MouseEvent) => {
		event.stopPropagation()
		updateButton.classList.toggle('hidden')
		if (divEl && true) {
			init = false
			clickOutside(divEl, render, false) // false do not add Listener message
			preEl.innerHTML += 'callbackFunction replaced with render function<br/>'
		} else {
			preEl.innerHTML += 'no divEl bound<br/>'
		}
	}
</script>

<pre style="margin-top:4rem;">
  Div element below rendered as a button &lt;Modal Dialog&gt; relies on an
                  action <span style="color:yellow;">use:clickOutside</span> for the click action.
  On click event a mainCallback function is called and a modal dialog is
  displayed ignoring clicking on it for closing the dialog, as the click
  is expecting to be outside the modal dialog.
  When modal dialog is shown an update callback button allows for
  replacing the mainCallback function with the render one
</pre>

<div class="wrapper">
	{#if showModal}
		<div
			class="modal"
			bind:this={divEl}
			use:clickOutside={() => {
				showModal = false
				preEl.innerHTML += 'close modal<br/>'
			}}
		>
			<span class="span">Modal&nbsp;Dialog</span>
		</div>
	{:else}
		<!-- do not allow event to bubble to the document body as that
		will close the modal instead of clicking outside the modal
	-->
		<button
			type="button"
			class="button"
			onclick={(event: MouseEvent) => {
				showModal = true
				event.stopPropagation()
			}}><span class="span">Modal&nbsp;Dialog</span> <span class="to-close"></span></button
		>
	{/if}

	<button type="button" bind:this={updateButton} class="button hidden" onclick={update}
		>update callback</button
	>
</div>

<pre
	style="position:fixed;top:50vh;left:0rem;"
	onclick={(event: MouseEvent) => {
		event.stopPropagation()
		preEl.innerText = ''
	}}
	aria-hidden={true}>Activities   <i style="color:yellow;cursor:pointer;">clear messages</i>

  <pre style="margin:1rem;" bind:this={preEl}></pre>
</pre>

>

<style>
	.wrapper {
		margin: 1rem 33vw;
	}
	.modal {
		/* position: fixed;
		top: 6rem;
		left: 33vw; */
		padding: 16px;
		/* color: lightgreen; */
		border: 1px solid lightgreen;
		border-radius: 10px;
		cursor: not-allowed;
		white-space: pre-wrap;
	}
	.button {
		display: block;
		margin-top: 1rem;
		padding: 4px 0;
		width: 9rem;
	}
	.span {
		color: lightgreen;
	}
	.to-close {
		font-size: 10px;
		font-style: italic;
	}
	.hidden {
		display: none;
	}
	.pointer {
		cursor: pointer;
	}
	pre {
		margin: 0 0 0 calc(50vw - 22rem);
		font-size: 16px;
		width: 30rem;
	}
	.clear-messages {
		display: inline-block;
    position:fixed;
    top:47vh;
    left:2rem
		/* margin-left: 2rem; */
		color: yellow;
		cursor: pointer;
	}
</style>
