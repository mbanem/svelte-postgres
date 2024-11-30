<!--
@component
-->

<script lang="ts">
  import DynamicTable from './dynamic-table.svelte';
  type FamilyMember = {
    firstName: string;
    lastName: string;
  };
  let familyMembers: FamilyMember[] = [
    { firstName: 'Filip', lastName: 'Isakovic' },
    { firstName: 'Matia', lastName: 'Isakovic' },
    { firstName: 'Mia', lastName: 'MIlutinovic' },
    { firstName: 'Marko', lastName: 'MIlutinovic' },
    { firstName: 'Nikola', lastName: 'Kotur' },
    { firstName: 'Bojana', lastName: 'Kotur' },
    { firstName: 'Jovana', lastName: 'Krsmanovic' },
    { firstName: 'Milica', lastName: 'Krsmanovic' },
  ];
</script>

<div class="main">
  <DynamicTable data={familyMembers}>
    {#snippet header()}
      <p class="header first">First Name</p>
      <p class="header second">Last Name</p>
    {/snippet}
    {#snippet row(member: FamilyMember)}
      <p class="member-name">
        <span>{member.firstName}</span>
        <span>{member.lastName}</span>
      </p>
    {/snippet}
  </DynamicTable>
</div>

<style lang="scss">
  .main {
    width: 100%;
    padding: 0 0 0 2rem;
    font-size: 20px;
    p {
      text-wrap: nowrap;
      margin: 0.6rem 0;
      // span:nth-child(odd) {
      padding: 0 0 0 1rem;
      // }
    }
  }
  .header {
    // grid-column: 1 / span 2;
    background-color: cornsilk;
    font-size: 20px;
    padding: 4px 0;
    color: navy;
  }
  .first {
    padding-left: 1rem;
    margin-left: 10px !important;
  }
  .second {
    margin-right: 10px !important;
  }
  .member-name {
    color: inherit;
    font-style: italic;
  }
</style>
