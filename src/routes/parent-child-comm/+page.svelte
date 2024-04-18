<script lang="ts">
	// https://svelte.dev/repl/ba7f569af4a44553b201a9efd8dc6ec2?version=4.2.14
	import Child from './Child.svelte';
	let resizeChild: (msg: string) => void;
	let randomNumber: () => number;

	const greeting = (msg: string) => {
		g.innerText = msg;
	};
	const onResize = (msg: string) => {
		resizeChild(msg);
	};
	let rand: HTMLParagraphElement;
	const callRandom = () => {
		rand.innerText = String(randomNumber());
	};
	let p: HTMLParagraphElement;
	let g: HTMLParagraphElement;
</script>

<p bind:this={rand}>random number</p>
<!-- svelte:window reacts on resize event as specified
		with on:resize={...} when the app is calling onResize
		with a message 'OK' displayed when user resize window
-->
<svelte:window on:resize={() => onResize('Window resized')} />
<!-- resize is exported from child component and
		we bind child resize to parent variable
		resizeChild, which we can call from parent
		<Child bind:resize={to parent component}/>
-->

<!-- for parent to call child function do not use bind
		as bind is used for child to call parent function
-->
<Child bind:resize={resizeChild} bind:getRandomNumber={randomNumber} callParent={greeting} />

<p bind:this={g} class="info">waiting for greeting....</p>
<button on:click={() => onResize('Hello Filip')}>greeting</button>

<p bind:this={p} class="info">App react on window resize</p>
<button on:click={callRandom}>call random</button>

<style lang="scss">
	.info {
		font-size: 14px;
		font-style: italic;
		color: yellow;
	}
</style>
