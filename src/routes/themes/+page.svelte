<script lang="ts">
	import { onMount } from 'svelte'

	type Theme = {
		color: string
		bgColor: string
	}
	type Themes = Record<string, Theme>
	const themes: Themes = {
		def: { color: 'yellow', bgColor: '#3e3e3e' },
		lightgreen: { color: 'blue', bgColor: 'lightgreen' },
		royalblue: { color: 'pink', bgColor: 'royalblue' },
		rebeccapurple: { color: '#e3e3e3', bgColor: 'rebeccapurple' }
	}
	let divEl: HTMLDivElement
	// Get the root element
	var r: HTMLElement

	const showColor = () => {
		var rs = getComputedStyle(r as HTMLElement)
		var s =
			'--COLOR is ' +
			rs.getPropertyValue('--COLOR') +
			'--BACKGROUND-COLOR is ' +
			rs.getPropertyValue('--BACKGROUND-COLOR')
		alert(s)
	}
	// Create a function for getting a variable value
	const myFunction_get = () => {
		// Get the styles (properties and values) for the root
		var rs = getComputedStyle(r)
		console.log('rs', rs)
		console.log('--COLOR', rs.getPropertyValue('--COLOR'))
		var s =
			'--COLOR= ' +
			rs.getPropertyValue('--COLOR') +
			'<br/> --BACKGROUND-COLOR=' +
			rs.getPropertyValue('--BACKGROUND-COLOR')
		return s
	}

	// applying a class name in succession reset to default
	const setTheme = (themeKey: string) => {
		console.log(themes[themeKey])
		r.style.setProperty('--COLOR', `${themes[themeKey]?.color}`)
		// console.log('--COLOR', `'${themes[themeKey].color}'`)
		r.style.setProperty('--BACKGROUND-COLOR', `${themes[themeKey]?.bgColor}`)
		divEl.innerHTML = myFunction_get()
	}
	const reset = () => {
		setTheme('def')
		divEl.innerHTML = 'Shows current :root variables <br />--COLOR and<br /> --BACKGROUND-COLOR'
	}
	// start with an aaa class of given size
	// createClass('.aaa', "background-color: green; border: 3px solid gray;border-radius:8px;");

	onMount(() => {
		r = document.querySelector(':root')
	})
</script>

<div class="container">
	<div>
		<div bind:this={divEl} class="div-class">
			Shows current :root variables <br />--COLOR and<br /> --BACKGROUND-COLOR
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
		<pre>
		The :root node, defined in app.scss, holds variables with default values for the Theme -- 
		i.e. all CSS variables that define the theme used in the app like
		:root &lcub;
			--COLOR: yellow;
			--BACKGROUND-COLOR: #3e3e3e;
		&rcub;
		We get reference to the :root node, defined as
			let r:HTMLElement
		via
			onMount(() =&gt; &lcub;
				r = document.querySelector(':root')
			&rcub;)

		The Themes are defined for example as a Record structure
			type Theme =  &lcub;
				color: string
				bgColor: string
			 &rcub;	
			type Themes = Record&lt;string, Theme&gt;
			const themes:Themes =  &lcub;
				blue:  &lcub;color:'blue', bgColor:'red' &rcub;,
				green: &lcub;color:'green', bgColor:'lightgreen' &rcub;
			 &rcub;

		A TypeScript function(s) change the values of Theme variables based on some settings defined for every button that change them
		when clicked, e.g.
			const newTheme = (themeKey:string) =&gt; &lcub;
				r.style.setProperty('--COLOR', `$&lcub;themes[themeKey]?.color&rcub;`);
				r.style.setProperty('--BACKGROUND-COLOR', `$&lcub;themes[themeKey]?.bgColor&rcub;`);
			&rcub;
		</pre>
	</div>
</div>

<style lang="scss">
	:root {
		--COLOR: yellow;
		--BACKGROUND-COLOR: #3e3e3e;
	}
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
		color: var(--COLOR);
		background-color: var(--BACKGROUND-COLOR);
		border: 2px solid gray;
		border-radius: 8px;
	}

	button {
		width: 12rem;
	}
	pre {
		font-size: 16px;
	}
	.def {
		width: 10rem;
	}
</style>
