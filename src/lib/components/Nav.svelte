<script lang="ts">
</script>

<nav>
	<a href="/">Home</a>
	<a href="/login">login</a>
	<a href="/register">register</a>
	<a href="/users">user list</a>
	<a href="/post">new post</a>
	<a href="/profile">new profile</a>
	<a href="/todo">todos</a>
	<a href="/crossfade">crossfade</a>
	<a href="/flip">FLIP</a>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: left;
		text-align: center;
		gap: 0.5rem;
		width: 90vw;
		height: 2rem;
		a:any-link {
			display: inline-block;
			width: 6rem;
			padding: 4px 0;
			border: $BORDER;
			border-radius: $BORDER-RADIUS;
			text-decoration: none;
			color: $LINK-COLOR;
			opacity: 0.7;
			background-color: $BACK-COLOR;
			// text-wrap: nowrap;
			&:hover {
				background-color: $BACK-COLOR;
				color: $LINK-HOVER;
				border: $BORDER-HOVER;
				border-radius: $BORDER-RADIUS;
				opacity: 1;
			}
		}
	}
</style>
