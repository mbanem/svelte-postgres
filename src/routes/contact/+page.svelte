<script lang="ts">
  import ContactCard from './ContactCard.svelte';
  import { type TMember } from './ContactCard.svelte';

  const members: TMember[] = [
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
    {
      title: 'OpenAI Co Member',
      name: 'Julia McRoy',
      address: '22 East Ave;California',
    },
    {
      title: 'Microsoft Co Member',
      name: 'Jane Culver',
      address: '72 Sunny Ave;Texas',
    },
    {
      title: 'Atlantis Co Member',
      name: 'Rony Green',
      address: '66 Conard Ave;Florida',
    },
    {
      title: 'Sunton Co Member',
      name: 'Ricki Martin',
      address: '99 Holly Rd;Tennessee',
    },
  ];
  let member = $state<TMember>(members[0] as TMember);
</script>

<svelte:head>
  <title>Contact</title>
</svelte:head>
<div class="wrapper">
  <div>
    <h4>The Third Coca-Cola Annual Meeting Members</h4>
    <ContactCard {members} prop_class={'container'} bind:selectedMember={member}
    ></ContactCard>
    <pre>The ContactCard component renders cards in a loop
when there are more the one member supplied.
The parent send a CSS class to the component to apply
as a whole so here it is a two-column grid
    </pre>
  </div>

  <div class="selected-member">
    <pre>
      <span style="color:lightgreen;">Selected Meeting Member</span>

Component ContactCard gets members array as $props
			const members = [
				&lcub;
					title: {member.title},
					name: <span style="color:yellow;">{member.name}</span>,
					address: {member.address},
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
    grid-template-columns: 28.3rem 30rem;
    // grid-auto-rows: 30rem;
    align-items: start;
    column-gap: 1rem;
    width: 40vw;
    margin: 0 auto;
    // height: 25rem;
  }
  .selected-member {
    border: 1px solid gray;
    border-radius: 8px;
    margin-top: 5.6rem;
    height: 25rem;
  }
  :global(.container) {
    // display: flex;
    // flex-direction: column;
    // gap: 0.5rem;
    display: grid;
    grid-template-columns: repeat(2, 13rem);
    grid-auto-rows: 8rem;
    margin: 0;
    column-gap: 0.5rem;
    height: 24rem;
    overflow-y: auto;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 0.5rem;
  }
</style>
