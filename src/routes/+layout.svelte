<script lang="ts">
	import '$styles/app.scss'
	import { navBars, navPath, navButtons } from '$utils/helpers.svelte.js'
	import { getNavButtons } from '$lib/utils/navButtons.svelte'
	import NavBar from '$components/NavBar.svelte'

	let { data, children } = $props()

	let role = 'VISITOR'
	if (data?.locals?.user) {
		role = data.locals.user.role
	}
	// array of individual button props
	let navButtonObjects = $state<TNavButtonObject[]>(getNavButtons())
	// navButtonObjects.forEach((btn) => console.log(btn));
	/*
	to iterate over ButtonProps as it is an array of PartialRecord<TButtonParam, string>
	we need outer loop over the array and inner loop over the Record props
		navButtonProps.forEach(button=> {
        for (const key in button){
            console.log(key, button[key as TButtonParam])
        }
    })
*/
</script>

<!--
<a-button href="/caterpillar">caterpillar</a-button>
<cr-button>cr-button</cr-button>
<cr-button>cr-button</cr-button>
<cr-button>caterpillar</cr-button> -->

<!-- <pre style="font-size:11px;">layout role {data?.locals?.user?.role}</pre> -->
<div class="wrapper">
	{#key data?.locals?.user?.role}
		<NavBar bind:navButtonObjects role={data?.locals?.user?.role} />
	{/key}
	<main>{@render children()}</main>
</div>

<!-- <div class="footer"> -->
<!-- <p>ComRUNNER Software Inc 2024 All rights reserved</p> -->

<!-- </div> -->

<!-- svelte-ignore css_unused_selector -->
<style lang="scss'">
	body {
		margin: 0 0 0 1rem;
		background-color: #3e3e3e;
	}
	.wrapper {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		/* cannot help scrolling when selecting button Two or Three */
		overflow-anchor: none;
	}

	.footer {
		/* position: absolute; */
		text-align: left;
		margin-left: 1rem;
		/* left: 0;
		top: 100vh;
		z-index: 1; */
	}
	div {
		font-size: 16px;
		&:target {
			background-color: $BACK-COLOR;
		}
	}
</style>
