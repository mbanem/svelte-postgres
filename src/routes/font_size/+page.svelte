<script lang="ts">
	import * as utils from '$utils'
	let inputFontSize: HTMLInputElement
	let fontSize = $state<string>('22px')

	const setFontSize = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return
		fontSize = inputFontSize.value
		utils.setCSSValue('--FONT-SIZE', fontSize)
	}
</script>

<div class="container">
	<div class="clamp" style={`font-size:${fontSize}`}>
		<!--cSpell:disable -->
		FONT SIZE based on clamp lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat natus
		dolorem perspiciatis aspernatur minus ab! Eligendi doloremque provident voluptate, voluptas debitis,
		veritatis, molestiae in aut odit atque nemo vero aspernatur!
		<!--cSpell:enable -->
	</div>

	<div id="list-container" class="list-container">
		<section class="list-section">
			<ul style="margin-left:2rem;">
				<li class="list-item">list item one</li>
				<li class="list-item">list item two</li>
				<li class="list-item">list item three</li>
				<li class="list-item">list item four</li>
			</ul>
		</section>
	</div>
	<div>
		<section class="input-section">
			<!-- <pre style="margin:0;">Enter font size in selected units e.g. 16px, 2rem, 1em, 6ch</pre> -->
			<input
				type="text"
				bind:this={inputFontSize}
				on:keyup={setFontSize}
				placeholder="enter font size"
				class="input-box"
				on:focus={() => {
					inputFontSize.select()
				}}
			/>
		</section>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		width: 50vw;
		align-items: center;
		margin: 1rem auto;
	}
	.list-container {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: center;
	}
	.clamp {
		font-size: clamp(10px, 2vw, 20px);
		width: 50vw;
		margin: 1rem auto;
		color: skyblue;
	}
	.input-section {
		padding: 10px 20px 10px 20px;
		border: 1px solid gray;
		border-radius: 6px;
		margin-left: 2rem;
		text-align: center;
	}
	.input-box::placeholder {
		color: black;
		opacity: 1;
	}
	.list-item {
		font-size: var(--FONT-SIZE);
	}
</style>
