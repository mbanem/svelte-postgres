<script lang="ts">
	import NavBar from '$components/NavBar.svelte'
	import { page } from '$app/stores'
	const navButtonObjects: TXNavButtonObject[] = [
		{
			position: 0,
			title: 'NOTIFICATIONS',
			href: '/bars/notifications',
			cssRules: 'width:10rem;',
			condition: 'VISITOR'
		},
		{ position: 1, title: 'PAVLOVCI', href: '/bars/pavlovci/village', condition: 'VISITOR' }
	]
</script>

<br />
<NavBar {navButtonObjects} />
<pre>It is a small village near city of Ruma
in Vojvodina, a Northern part of Serbia
with population of around 200 people
</pre>
<!-- <pre style="font-size:11px;">$page {JSON.stringify($page, null, 2)}</pre> -->
