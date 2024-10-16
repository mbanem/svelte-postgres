<script lang="ts">
	import CRButton from '$components/CRButton.svelte'
	let cssRules: string =
		'background-color: pink;text-align:center;font-size:16px;color:navy;margin-left:1rem;'

	// should be prefixed by a dot char
	const cssName = (str: string) => {
		return str[0] === '.' ? str : `.${str}`
	}

	// should not be prefixed by a dot char
	const flatName = (str: string) => {
		if (str[0] === '.') {
			return str.slice(1)
		}
		return str
	}
	const createCssClass = (className: string, rules: string) => {
		className = cssName(className)
		const style = document.createElement('style') as HTMLStyleElement
		const head = document.getElementsByTagName('head')[0] as HTMLHeadElement
		head.appendChild(style)
		style.sheet?.insertRule(className + '{' + rules + '}')
	}
	const getElement = (qSelector: string): HTMLElement | null => {
		let element: HTMLElement
		const retVal = document.querySelector(qSelector) as HTMLElement | NodeList | HTMLCollection
		if (!retVal) return null
		if (retVal instanceof NodeList || retVal instanceof HTMLCollection) {
			element = retVal[0] as HTMLElement
		}
		return retVal as HTMLElement
	}
	const addClass = (className: string, qSelector: string) => {
		const el = getElement(qSelector)
		createCssClass('.' + className, cssRules)
		el?.classList.add(className)
	}

	const toggleClass = (className: string, qSelector: string) => {
		className = flatName(className)
		if (!classExists) return
		const el = getElement(qSelector)
		// createCssClass(className, cssRules)
		el?.classList.toggle(className)
	}
	const classExists = (className: string): boolean => {
		const classes = getAllClasses()
		return classes.has(cssName(className)) || classes.has(flatName(className))
	}
	let allClassNames: String[]
	const getAllClasses = () => {
		const rs = new Set<String>()
		const cssSheets = document.styleSheets as StyleSheetList
		for (let i = 0; i < cssSheets.length; i++) {
			const rules = (cssSheets[i] as CSSStyleSheet).cssRules
			for (let j = 0; j < rules.length; j++) {
				rs.add((rules[j] as CSSStyleRule).selectorText)
			}
		}
		allClassNames = [...rs]
		return rs
	}
	$: classNames = allClassNames

	const makeCSSClass = (cssClassDef: string) => {
		let s = document.createElement('style')
		s.innerHTML = cssClassDef
		document.head.appendChild(s)
	}
	const makeClass = () => {
		makeCSSClass(`.crClass {
			color:yellow;
			width:200px;
			height:200px;
			background-color:skyblue;
			border:2px solid transparent;
			&:hover{
				border-color:lightgreen;
				cursor:pointer;
			}
		}`)
	}
</script>

<div class="container">
	<div class="left-side">
		<textarea id="txt" rows="5" cols="50" bind:value={cssRules} placeholder="enter css rules" />

		<div id="bbb" style="width:200px;height:50px;border:2px solid gray;">
			Dynamic style will be applied here
		</div>
		<button on:click={() => addClass('crClass', '#txt')}>Add class</button>
		<button on:click={() => toggleClass('crClass', '#txt')}>Toggle class</button>
		<button on:click={getAllClasses}>get all classes</button>

		<CRButton
			title="CR Button"
			href="/notifications"
			css_style="background-color:darkred;color:lightgreen;"
			css_on_hover="border:2px solid yellow;"
		/>
	</div>
	<div class="right-side">
		{#if classNames}
			<span class="class-list-title">All CSS class names</span>
			<ul>
				{#each classNames as className}
					<li>
						{className}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
<button on:click={makeClass}>create class</button>
<div class="crClass">Not defined until button click</div>

<style lang="scss">
	.container {
		display: grid;
		border: 2px solid gray;
		border-radius: 10px;
		width: 96vw;
		grid-template-columns: 2fr 1fr;
		// gap: 1rem;
		justify-items: center;
		align-items: flex-start;
		padding-right: 1.5rem;
		.left-side,
		.right-side {
			width: 90%;
			min-height: 70%;
			max-height: 60vh;
			padding: 1rem;
			margin: 1rem;
			border: 2px solid gray;
			.class-list-title {
				display: inline-block;
				font-size: 18px;
				color: yellow;
				margin-left: 30%;
			}
		}
		.right-side {
			overflow-y: auto;
			color: skyblue;
		}
	}
	// .class-list {
	// 	height: 60vh;
	// 	overflow-y: auto;
	// 	&:ul {
	// 		list-style: none;
	// 	}
	// }
	textarea {
		font-size: 18px;
		padding: 3px 1rem;
		border-radius: 6px;
	}
</style>
