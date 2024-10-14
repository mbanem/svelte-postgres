<script>
	import ContactCard from './ContactCard.svelte'
	const members = [
		{ title: 'President', name: 'Paul Sherman', address: '12 Fifth Ave;New York' },
		{ title: 'Sherif', name: 'Caroline Wilson', address: '134 Green St;San Diego' },
		{ title: 'Atlantic CIO', name: 'Martha Sinclair', address: '112 Sherman St;Alabama' },
		{
			title: 'Greenfield Co Member',
			name: 'John Wilkinson',
			address: '4433 East Ave Road;Colorado'
		}
	]
</script>

<h4>The Third Coca-Cola Annual Meeting Members</h4>
<ContactCard {members}></ContactCard>

<style lang="scss">
	h4 {
		color: skyblue;
		margin: 3rem 0 0 4rem;
	}
</style>
