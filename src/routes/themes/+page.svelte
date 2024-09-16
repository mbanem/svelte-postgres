<script lang="ts">
	import { onMount } from 'svelte'
	import { stringify } from 'uuid'
	let defaultColor: string = '#e3e3e3'
	let defaultBackgroundColor: string = '#3e3e3e'
	type Theme = {
		color: string
		bgColor: string
	}
	type Themes = Record<string, Theme>
	const themes: Themes = {
		system: { color: defaultColor, bgColor: defaultBackgroundColor },
		def: { color: 'pink', bgColor: 'navy' },
		lightgreen: { color: 'blue', bgColor: 'lightgreen' },
		royalblue: { color: 'pink', bgColor: 'royalblue' },
		rebeccapurple: { color: '#e3e3e3', bgColor: 'rebeccapurple' }
	}
	let divEl: HTMLDivElement
	// Get the root element
	var root: HTMLElement

	const showColor = () => {
		const rs = getComputedStyle(r as HTMLElement)
		const s =
			'--BODY-COLOR is ' +
			rs.getPropertyValue('--BODY-COLOR') +
			'--BODY-BACKGROUND-COLOR is ' +
			rs.getPropertyValue('--BODY-BACKGROUND-COLOR')
		alert(s)
	}
	// Create a function for getting a variable value
	const myFunction_get = () => {
		// Get the styles (properties and values) for the root
		const rs = getComputedStyle(root)
		// console.log('--BODY-COLOR', rs.getPropertyValue('--BODY-COLOR'))
		const s =
			'--BODY-COLOR= ' +
			rs.getPropertyValue('--BODY-COLOR') +
			'<br/> --BODY-BACKGROUND-COLOR=' +
			rs.getPropertyValue('--BODY-BACKGROUND-COLOR')
		return s
	}

	// applying a class name in succession reset to default
	const setTheme = (themeKey: string) => {
		// console.log(themes[themeKey])
		root.style.setProperty('--BODY-COLOR', `${themes[themeKey]?.color}`)
		// console.log('--BODY-COLOR', `'${themes[themeKey].color}'`)
		root.style.setProperty('--BODY-BACKGROUND-COLOR', `${themes[themeKey]?.bgColor}`)
		divEl.innerHTML = myFunction_get()
	}
	const reset = () => {
		divEl.innerHTML =
			'Shows current :root variables <br />--BODY-COLOR and<br /> --BODY-BACKGROUND-COLOR'
	}
	// start with an aaa class of given size
	// createClass('.aaa', "background-color: green; border: 3px solid gray;border-radius:8px;");
	const beforeUnload = () => {
		setTheme('system')
	}
	onMount(() => {
		root = document.querySelector(':root') as HTMLElement

		const rs = getComputedStyle(root)
		defaultColor = rs.getPropertyValue('--BODY-COLOR')
		defaultBackgroundColor = rs.getPropertyValue('--BODY-BACKGROUND-COLOR')
		console.log(defaultColor, defaultBackgroundColor)
		setTheme('def')
		return beforeUnload
	})
</script>

<!-- <svelte:window on:beforeunload={beforeUnload} /> -->
<div class="container">
	<div>
		<div bind:this={divEl} class="div-class">
			Shows current :root variables <br />--BODY-COLOR and<br /> --BODY-BACKGROUND-COLOR
		</div>
		<br />
		<button onclick={() => setTheme('lightgreen')} style="color:lightgreen;"
			>apply lightgreen class</button
		>
		<br />
		<button onclick={() => setTheme('royalblue')} style="color:royalblue;"
			>apply royalblue class</button
		>
		<br />
		<button onclick={() => setTheme('rebeccapurple')} style="color:rebeccapurple;"
			>apply rebeccapurple class</button
		>
		<br />
		<button onclick={() => setTheme('def')} style="color:#e3e3e3;">reset</button>
	</div>
	<div style="display:inline-block;">
		<pre style="color:var(--BODY-COLOR)">
		The :root node, defined in app.scss, holds variables with default values for the Theme -- 
		i.e. all CSS variables that define the theme used in the app like
		:root &lcub;
			--BODY-COLOR: #e3e3e3;
			--BODY-BACKGROUND-COLOR: #3e3e3e;
		&rcub;
		We get reference to the :root node, defined in TypeScript as
			let root:HTMLElement
		at
			onMount(() =&gt; &lcub;
				root = document.querySelector(':root')
			&rcub;)

		The Themes structure is defined for example as a Record structure with
			type Theme =  &lcub;
				color: string
				bgColor: string
			 &rcub;	
			type Themes = Record&lt;string, Theme&gt;
			const themes:Themes =  &lcub;
				def: &lcub; color: 'yellow', bgColor: 'navy' &rcub;,
				lightgreen: &lcub; color: 'blue', bgColor: 'lightgreen' &rcub;,
				royalblue: &lcub; color: 'pink', bgColor: 'royalblue' &rcub;,
				rebeccapurple: &lcub; color: '#e3e3e3', bgColor: 'rebeccapurple' }
			 &rcub;

		A TypeScript function(s) change the values of Theme variables based on some settings defined for every button that change them
		when clicked, e.g.
			const newTheme = (themeKey:string) =&gt; &lcub;
				root.style.setProperty('--BODY-COLOR', `$&lcub;themes[themeKey]?.color&rcub;`);
				root.style.setProperty('--BODY-BACKGROUND-COLOR', `$&lcub;themes[themeKey]?.bgColor&rcub;`);
			&rcub;
		</pre>
	</div>
</div>

<style lang="scss">
	// :root {
	// 	--BODY-COLOR: yellow;
	// 	--BODY-BACKGROUND-COLOR: #3e3e3e;
	// }
	.container {
		display: grid;
		grid-template-columns: 1fr 2fr;
		width: 80vw;
		margin: 1rem 0 0 10vw;
	}
	.div-class {
		display: inline-block;
		width: 300px;
		height: 300px;
		padding: 1rem;
		font-size: 18px;
		font-weight: 400;
		color: var(--BODY-COLOR);
		background-color: var(--BODY-BACKGROUND-COLOR);
		border: 2px solid gray;
		border-radius: 8px;
	}

	// button {
	// 	width: 12rem;
	// }
	pre {
		font-size: 16px;
	}
</style>
