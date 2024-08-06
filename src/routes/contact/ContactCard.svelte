<script>
	let { name, address } = $props();
</script>

<div>
	<div class="name">{@render name()}</div>
	<div class="address">{@render address()}</div>
</div>
