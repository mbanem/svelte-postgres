<script lang="ts">
	import InputBox from '$components/InputBox.svelte'
	type PROPS = {
		title: string
		width: string
		height: string
		fontsize: string
	}
	let { title, width, height, fontsize }: PROPS = $props()
</script>

<div class="container">
	<InputBox title="First Name"></InputBox>
	<InputBox title="Last Name"></InputBox>
	<InputBox title="Email"></InputBox>
	<InputBox title="Password"></InputBox>
</div>

<style lang="scss">
	.container {
		border: 1px solid gray;
		border-radius: 10px;
		width: max-content;
		padding: 1rem 3rem;
		margin: 5rem 0 0 15vw;
	}
</style>
