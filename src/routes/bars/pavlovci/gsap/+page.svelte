<script lang="ts">
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	let timeline: gsap.core.Timeline
	onMount(() => {
		/*
		gsap.from('.header', {
			duration: 1,
			y: '-100%',
			ease: 'bounce'
		})
		gsap.from('.link', { duration: 1, opacity: 0, delay: 1, stagger: 0.5 })
		gsap.from('.right', { duration: 2, x: '-100vw', delay: 1, ease: 'power2.in' })
		gsap.from('.left', { duration: 1, delay: 1.5, x: '-100%' })
		gsap.fromTo(
			'.footer',
			{ opacity: 0, width: 0 },
			{ opacity: 1, width: '100vw', ease: 'elastic', delay: 3 }
		)
		gsap.fromTo(
			'.button',
			{ opacity: 0.5, scale: 0.3, rotation: 720 },
			{ duration: 1, delay: 3.5, opacity: 1, rotation: 0 }
		)
    */
		timeline = gsap.timeline({ defaults: { duration: 1 } })
		timeline
			.from('.header', {
				y: '-100%',
				ease: 'bounce'
			})
			.from('.link', { opacity: 0, stagger: 0.5 })
			.from('.right', { x: '-100vw', ease: 'power2.in' })
			.from('.left', { x: '-100%' }, '<0,8')
			.fromTo('.footer', { opacity: 0, width: 0 }, { opacity: 1, width: '100vw', ease: 'elastic' })
			.fromTo(
				'.button',
				{
					opacity: 0,
					scale: 0,
					rotation: 720,
					borderWidth: '36px',
					borderRadius: '1rem'
				},
				{
					opacity: 1,
					scale: 1,
					rotation: 0,
					borderWidth: 1,
					borderRadius: '5px',
					borderColor: 'gray'
				}
			)
	})
</script>

<main>
	<div class="header">
		<div class="links">
			<div class="link">Link 1</div>
			<div class="link">Link 2</div>
			<div class="link">Link 3</div>
		</div>
	</div>
	<div class="content">
		<div class="sidebar left"></div>
		<button class="button" onclick={() => timeline.reverse()}>Reverse</button>
		<div class="sidebar right"></div>
	</div>
	<div class="footer"></div>
</main>

<style lang="scss">
	main {
		margin: 0;
		height: 80vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.header {
		height: 2rem;
		background-color: #303030;
	}
	.links {
		display: flex;
		justify-content: space-around;
		height: 100%;
		align-items: center;
		color: white;
	}
	.content {
		display: flex;
		flex-grow: 1;
		justify-content: space-between;
	}
	.button {
		align-self: center;
		// hard to avoid item grow; this is probably the only way
		// flex: 0 0 2rem;
		font-size: 20px;
		border: 2px solid yellow;
		// opacity: 0;
	}
	.sidebar {
		align-self: stretch;
		background-color: rgb(9, 9, 79);
		width: 6rem;
	}
	.footer {
		// transform: translate(100%);
		height: 2rem;
		background: navy;
	}
</style>
