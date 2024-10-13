<script lang="ts">
	import Communicate from '$components/Communicate.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores' // get data from main +layout.server.ts if any
	import type { PageData } from './$types'
	import * as utils from '$utils'
	type Person = {
		name: string
		age: number
		city: string
	}

	let { data } = $props()

	let city = 'San Diego'
	let age = 18
	let person = $state<Person>({ name: 'Mr. Filip Isakovic', age: 18, city: 'San Diego' })
	let nameUpper = $derived(person.name.toUpperCase())


	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Box</title>
</svelte:head>
<main>
	<h2>Parent Page</h2>
	<h4 style="font-weight:400;margin:0;width:60rem;">
		On a bound Person object both parent and Communicate.svelte child component have access. See the
		child component's effects on a bound object rendered in blue text and parent's effects rendered
		in yellow text below
	</h4>
	<Communicate bind:person userAge={age} {city} />

	<section class="parent-estate">
		<p style="color:yellow">This is the parent block</p>
		<div class="container">
			<p>
				A reactive variable in parent show person name in uppercase set by child component in the<br
				/>
				above child block -- add, say Junior in child block to see the value in parent block : {nameUpper}
			</p>
			<p style="color:yellow">Person {person.name} is of age {person.age} from {person.city}</p>
		</div>
		<pre></pre>

		<label for="city" style=" color:skyblue;">
			Input box that handle person.city is handled by parent so every change to the city wil be<br
			/>
			shown also in the child block; e.g. add California to the input box below to see the changes
		</label>
		<input
			id="city"
			bind:value={person.city}
			placeholder="please enter city"
			style="margin-top:6px;"
		/>
	</section>
</main>

<style lang="scss">
	main {
		margin: 1rem 0 0 2rem;
	}
	.parent-estate {
		border: 1px solid yellow;
		border-radius: 6px;
		padding-left: 1rem;
		width: 81vw;
	}
	getContext p {
		margin: 0;
		padding: 6px 0 0 0;
	}
</style>
