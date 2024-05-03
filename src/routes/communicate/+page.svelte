<script lang="ts">
	// https://svelte.dev/repl/ba7f569af4a44553b201a9efd8dc6ec2?version=4.2.14
	import { page } from '$app/stores';
	import { onMount, getContext } from 'svelte';
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
		rand.innerText = 'from child random: ' + String(randomNumber());
	};
	let p: HTMLParagraphElement;
	let g: HTMLParagraphElement;
	let mrPath = getContext('mrPath') as SvelteStore<string>;

	onMount(() => {
		return () => {
			mrPath.set($page.url.pathname);
		};
	});
</script>

<svelte:head>
	<title>Communicate</title>
</svelte:head>

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
<button on:click={() => onResize('Hello Filip')} class="resize">parent resize button</button>
<br />
<Child bind:resize={resizeChild} bind:getRandomNumber={randomNumber} callParent={greeting} />
<p bind:this={g} class="info">waiting for greeting from child....</p>
<p bind:this={p} class="info">App react on window resize</p>
<hr style="width:35vw;margin-left:0;" />
<!-- for parent to call child function do not use bind
	as bind is used for child to call parent function
-->

<pre class="width:35vw;">clicking on resize or resizing the window itself will
render here 'Hello Filip' or 'Window resized' respectively</pre>
<hr style="width:35vw;margin-left:0;" />

<div class="random-container">
	<p>call child function for random number</p>
	<p bind:this={rand}>render here the random number</p>
	<button on:click={callRandom}>parent child random button</button>
</div>

<style lang="scss">
	.resize {
		color: skyblue;
	}
	.random-container {
		width: 30rem;
		border: 1px solid gray;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		text-align: center;
	}
	.info {
		font-size: 14px;
		font-style: italic;
		color: yellow;
	}
</style>
