<script>
  import ContactCard from './ContactCard.svelte';
  const members = [
    {
      title: 'President',
      name: 'Paul Sherman',
      address: '12 Fifth Ave;New York',
    },
    {
      title: 'Sherif',
      name: 'Caroline Wilson',
      address: '134 Green St;San Diego',
    },
    {
      title: 'Atlantic CIO',
      name: 'Martha Sinclair',
      address: '112 Sherman St;Alabama',
    },
    {
      title: 'Greenfield Co Member',
      name: 'John Wilkinson',
      address: '4433 East Ave Road;Colorado',
    },
  ];
</script>

<svelte:head>
  <title>Contact</title>
</svelte:head>
<div class="wrapper">
  <div>
    <h4>The Third Coca-Cola Annual Meeting Members</h4>
    <ContactCard {members}></ContactCard>
  </div>

  <div style="margin-top:1rem;">
    <pre>
Component ContactCard gets members array as $props
			const members = [
				&lcub;
					title: 'President',
					name: 'Paul Sherman',
					address: '12 Fifth Ave;New York',
				&rcub;,
				...
			]
			and render then in an #each loop
		</pre>
  </div>
</div>

<style lang="scss">
  h4 {
    color: skyblue;
    margin: 3rem 0 1rem 0;
  }
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 2rem;
    width: 40vw;
    margin: 0 auto;
  }
</style>
