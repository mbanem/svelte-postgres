<script lang="ts">
	import InputBox from '$components/InputBox.svelte'
	type PROPS = {
		title: string
		width: string
		height: string
		fontsize: string
	}
	let { title, width, height, fontsize }: PROPS = $props()
	// -----------------------------------------------------------------
	let size = $state(50)
	let color = $state('#ff3e00')
	let elColor: HTMLInputElement
	let canvas: HTMLCanvasElement

	const setColor = (event?: MouseEvent) => {
		const context = canvas.getContext('2d') as CanvasRenderingContext2D
		context.clearRect(0, 0, canvas.width, canvas.height)
		let v_color = ''
		if (event) {
			v_color = elColor.value as string
			// this will re-run whenever `color` or `size` change
			if (v_color && v_color.length === 7) {
				context.fillStyle = v_color
			}
		} else {
			context.fillStyle = color
		}
		context.fillRect(0, 0, size, size)
	}
	const colorOnClick = () => {
		//console.log('colorOnClick')
		elColor.value = ''
	}
	$effect(setColor)
</script>

<svelte:head>
	<title>Floating Label</title>
</svelte:head>
<div class="grid-wrapper">
	<div class="families">
		<dl>
			<dt>The Koturs</dt>
			<dd>Bojana</dd>
			<dd>Nikola</dd>
			<dd>Dragana</dd>
			<dd>Zeljko</dd>
			<dt>The Milutinovics</dt>
			<dd>Mia</dd>
			<dd>Marko</dd>
			<dd>Tanja</dd>
			<dd>Ljuban</dd>
			<dt>The Isakovic</dt>
			<dd>Matia</dd>
			<dd>Filip</dd>
			<dd>Snezana</dd>
			<dd>Ljubomir</dd>
		</dl>
	</div>
	<div class="container">
		<InputBox title="First Name"></InputBox>
		<InputBox title="Last Name"></InputBox>
		<InputBox title="Email"></InputBox>
		<InputBox title="Password"></InputBox>
	</div>
	<div>
		<canvas bind:this={canvas} width="100" height="100"></canvas>

		<div class="controls">
			<label>
				<input type="range" bind:value={size} onclick={setColor} /> size
			</label>
			<label>
				<input type="color" bind:value={color} onclick={colorOnClick} /> color
			</label>
		</div>
		<label for="c">
			Color hsa code
			<input type="text" id="c" bind:this={elColor} class="input-hsa" />
			<button onclick={setColor}>set color</button>
		</label>
	</div>
</div>

<style lang="scss">
	.grid-wrapper {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		margin-top: 7rem !important;
		// grid-template-columns: repeat(1fr 1fr);
		// width: 80vw;
		gap: 2rem;
	}
	.container {
		border: 1px solid gray;
		border-radius: 10px;
		width: max-content;
		padding: 1rem 3rem;
		// margin: 5rem 0 0 15vw;
	}
	.families {
		background-color: skyblue;
		width: max-content;
		padding: 1rem 3rem;
		border-radius: 1rem;
	}
	.fa {
		width: max-content;
		padding: 6px 1rem;
		border: 1px solid gray;
		border-radius: 6px;
	}
	dt {
		color: white;
		background-color: navy;
		text-transform: capitalize;
		padding: 2px 1rem;
		border-radius: 4px;
		margin-bottom: 4px;
		&:not(:first-child) {
			margin-top: 1rem;
		}
	}
	dd {
		color: black;
		background-color: cornsilk;
		padding: 0 1rem;
	}
	dt ~ dd:last-child {
		color: red;
	}
	/* ------------------------------------- */
	.controls {
		border-top: 1px solid #ccc;
		padding: 1em 0;
		margin: 1em 0;
		display: flex;
		gap: 1em;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	.input-hsa {
		width: 5rem;
	}
</style>
