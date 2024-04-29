<script lang="ts">
	export let callParent: (name: string) => void;

	export const getRandomNumber = () => {
		return Math.floor(Math.random() * 1000000);
	};
	// resize is exported to parent to bind to its
	// variable and to call on it
	// it is const function (str) => void
	export const resize = (msg: string) => {
		pElement.innerText = pElement.innerText === txt ? msg : txt;
	};
	let pElement: HTMLParagraphElement;
	let txt =
		'waiting for parent to trigger greeting from child via resize button or to resize window....';
	let b = true;

	const getMessage = () => {
		const msg = b ? 'Greeting from Filip Isakovic' : txt;
		b = !b;
		return msg;
	};
</script>

<button on:click={() => callParent(getMessage())}>child button to call parent</button>
<p class="info" bind:this={pElement}>{txt}</p>

<style lang="scss">
	.info {
		font-size: 14px;
		font-style: italic;
		color: skyblue;
	}
</style>
