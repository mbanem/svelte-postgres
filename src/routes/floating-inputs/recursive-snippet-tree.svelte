<!--
@component
-->
<script lang="ts">
  import * as utils from '$utils';
  type TTree = {
    name: string;
    children?: TTree[];
  };
  const families: TTree = {
    name: '',
    children: [
      {
        name: "0The Isakovic's",
        children: [
          { name: '1Ljubomir', children: [] },
          {
            name: '1Snezana',
            children: [{ name: '2Matia' }, { name: '2Filip' }],
          },
        ],
      },
      {
        name: "0The Milutinovic's",
        children: [
          { name: '1Ljuban' },
          { name: '1Tanja', children: [{ name: '2Mia' }, { name: '2Marko' }] },
        ],
      },
      {
        name: "0The Kotur's",
        children: [
          { name: '1Zeljko' },
          {
            name: '1Dragana',
            children: [{ name: '2Nikola' }, { name: '2Bojana' }],
          },
        ],
      },
      {
        name: "0The Krsmanovic's",
        children: [
          { name: '1Sasa' },
          {
            name: '1Mirjana',
            children: [{ name: '2Jovana' }, { name: '2Milica' }],
          },
        ],
      },
    ],
  };
  let generation = -1;
  const incrementGeneration = (itemName: string): void => {
    if (itemName === '' || itemName.slice(-2) === "'s") {
      generation = 0;
    } else {
      generation = generation + 1;
    }
  };
  const cls = ['lightgreen', 'skyblue', 'orange', 'tomato', 'cornsilk'];
  const generationColor = (): string => {
    return cls[generation] as string;
  };
</script>

{#snippet tree(branch: TTree)}
  <div class="item">
    {#if branch.name === '' || branch.name.slice(-2) === "'s"}
      {incrementGeneration(branch.name)}
    {/if}

    <span
      style:color={cls[Number(branch.name.replace(/\D/g, ''))]}
      class:family={branch.name.startsWith('0')}
      >{branch.name.replace(/\d/g, '')}
    </span>
    {#if branch.children}
      <ul class="ul-children">
        {#each branch.children as child}
          {incrementGeneration(branch.name)}
          <li style:color={cls[Number(branch.name.replace(/\D/g, ''))]}>
            {@render tree(child)}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/snippet}
<pre>
This is a recursive snippet tree
where items are prefixed with
a zer0-base indent number, each
incremented starts new ul list
</pre>
<div class="main">
  {@render tree(families)}
</div>

<style lang="scss">
  @use 'sass:list';
  :root {
    $GENERATION: 0;
  }

  @function number($input) {
    @return num($input);
  }
  .main {
    @include container($head: 'Families', $head-color: lightgreen);
    width: 20rem;
  }
  .ul-children {
    list-style: none;
    margin-inline-start: 0;
    padding-inline-start: 20px !important;
    padding: 0;
    margin: 6px 0;
  }
  .family {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: 400;
    font-size: 20px;
    font-style: italic;
  }
</style>
