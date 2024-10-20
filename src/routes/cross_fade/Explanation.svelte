<script lang="ts">
</script>

<div class="container">
	<h3>Crossfade only working in some occasions</h3>
	<p>
		This demo reproduces what I ran into in sveltekit. I tried to replicate it as closely as
		possible, which means most of the logic is within the same component (App.svelte).
	</p>

	<p>
		First: Try moving the inner items between the two different outer items. Going up should work as
		expected, but going down to the next outer item produces the fallback animation.
	</p>

	<p>
		Secondly: Swap the outer items (by moving one of them up or down), then try to move the inner
		items between them again. You should notice that now moving <i>up</i> is faulty, but moving down
		seems to work correctly.
	</p>

	<p>
		You have the ability to append new outer and inner items. I haven't noticed a pattern, but there
		is some weird behavior between when moving inner items between newly added outer items as well.
	</p>
</div>

<style lang="scss">
	.container {
		margin: 0 auto;
	}
</style>
