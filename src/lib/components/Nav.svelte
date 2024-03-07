<nav>
	<a href="/">Home</a>
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
			padding: 4px 1rem;
			border: $BORDER;
			border-radius: $BORDER-RADIUS;
			text-decoration: none;
			color: $LINK-COLOR;
			opacity: 0.7;
			background-color: $BACK-COLOR;
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
