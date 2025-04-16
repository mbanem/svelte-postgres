<!--
@component
-->

<script lang="ts">
  import { type Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
  import DynamicTable from './Dynamic-Table.svelte';
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
  <!-- 
    parent +page.svelte set <SnippetTable and included a Div
    element with Hello from Snippet Children text so we here
    @render children, i.e. that Div element  
  -->
  Children {@render children()}
  <!-- 
    we include <DynamicTable but she rely on two snippets
    for rendering header and rows, so we define snippets
    here that actually render the markup with inline styles
    The header snipper is parameter-less but row needs
    a FamilyMember argument to render their full names
    We render markup with CSS classes as we can send CSS
    classes to <DynamicTable but do not know how it could
    implement the classes as she jus @render sent snippets

    We also send prop data, i.e. FamilyMembers so when
    @render row(familyMember) it gets family member
  -->
  <DynamicTable data={familyMembers}>
    {#snippet header()}
      <p class="header first">Family Members</p>
      <p class="header second"></p>
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
