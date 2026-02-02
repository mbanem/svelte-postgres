<script module lang="ts">
  export type TMember = {
    title: string;
    name: string;
    address: string;
  };
</script>

<script lang="ts">
  import CRTooltip from '$components/CRTooltip.svelte';
  type TProps = {
    members: TMember[];
    selectedMember: TMember;
    prop_class: string;
  };
  let { members, selectedMember = $bindable(), prop_class }: TProps = $props();
  let preferredPos = 'right,left,top,bottom';
</script>

<div class={prop_class}>
  {#each members as member}
    <CRTooltip caption={'click to set it selected'} {preferredPos}>
      <div
        class="card-wrapper"
        onclick={() => (selectedMember = member)}
        onkeyup={() => (selectedMember = member)}
        aria-hidden={true}
      >
        <p class="title">{member.title}</p>
        <p class="name">{member.name}</p>
        {#each member.address.split(';') as txt}
          <p>
            {txt}
          </p>
        {/each}
      </div>
    </CRTooltip>
  {/each}
</div>

<style>
  .card-wrapper {
    width: 12rem;
    margin: 4px 0 0 0;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 6px 0 6px 1rem;
    margin: 0;
    color: lightgray;
    &:hover {
      cursor: pointer;
    }
  }
  p {
    margin: 0;
    padding: 0;
  }
  .name {
    color: yellow;
    margin: 5px 0 1rem 0;
  }
  .title {
    color: lightgreen;
    font-style: italic;
    margin: 8px 0;
  }
</style>
