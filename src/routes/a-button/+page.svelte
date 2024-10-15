<script lang="ts">
	import { fade } from 'svelte/transition'
	let foo = false
</script>

<div class="container">
	<div>
		<h1>The attr() Function</h1>
		<pre>
    An anchor-button is defined as &lt;a-button&gt;&lt;a href="https://www.w3schools.com" title='THE TITLE'&gt;&lt;/a&gt;&lt;/a-button&gt;
    where SCSS uses anchor tag &lt;a with :before and :after pseudo classes
    The :after pseudo class is hidden but functional as &lt;a tag with specified href
    displayed as a:after content -- content: " (" attr(href) ")";
    while the :before class is visible and displays a given title as content -- content: " " attr(title) "";
    </pre>

		<a href="https://www.w3schools.com" title="anchor title" aria-label="w3c school">&nbsp;</a>
	</div>
	<div style="margin-top:4rem;">
		css ul &lcub; list-style-type: lower-greek; &rcub;
		<div class="wrapper">
			<ul>
				<li>alpha</li>
				<li>beta</li>
				<li>gamma</li>
				<li>delta</li>
				<li>epsilon</li>
				<li>zeta</li>
				<li>eta</li>
				<li>theta</li>
				<li>iota</li>
				<li>kappa</li>
				<li>lambda</li>
				<li>mi</li>
			</ul>
			<ul>
				<li>ni</li>
				<li>ksi</li>
				<li>omicron</li>
				<li>pi</li>
				<li>ro</li>
				<li>sigma</li>
				<li>tau</li>
				<li>ipsilon</li>
				<li>fi</li>
				<li>hi</li>
				<li>psi</li>
				<li>omega</li>
			</ul>
		</div>
	</div>
</div>
<hr />
{#if foo}
	<button in:fade={{ delay: 500 }} out:fade on:click={() => (foo = !foo)}>on</button>
{:else}
	<button in:fade={{ delay: 500 }} out:fade on:click={() => (foo = !foo)}>off</button>
{/if}

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr;
		margin: 2rem 0 0 4rem;
	}
	.wrapper {
		display: grid;
		grid-template-columns: 10rem 10rem;
	}

	/* nothing to show of the a-button except its :before */
	a[title]:link,
	a[title]:visited {
		text-decoration: none;
	}

	/* should be only visible part  */

	a[title]:before {
		display: inline-block;
		inline-size: auto;
		padding: 8px 1rem;
		border-radius: 8px;
		border: 2px solid transparent;
		/*outline:1px solid navy;*/
		color: white;
		background-color: navy;
		content: attr(title);
	}
	/*  only a:before part should be affected by hovering over*/
	a[title]:hover:before {
		color: yellow;
		border-color: yellow;
	}

	/*  should be hidden but functional part */
	a[title]:after {
		content: ' (' attr(href) ')';
		visibility: hidden;
	}

	/*greek lower-green works but not upper-greek */
	ul {
		list-style-type: lower-greek;
		color: lightgreen;
		li {
			font-size: 20px;
		}
	}
</style>
