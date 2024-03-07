<script lang="ts">
	import '$styles/app.scss'
	import Nav from '$components/Nav.svelte'
</script>

<main>
	<Nav />
	<slot />
</main>

<style lang="scss">
	// @import 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css';

	:global(body) {
		padding: 2rem;
	}
	:global(input, button) {
		border-radius: 6px;
	}

	main {
		width: 98vw;
		height: 85vh;
		background-color: #3e3e3e;
	}
</style>
