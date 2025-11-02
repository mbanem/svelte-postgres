<script lang="ts">
  import Tooltip from '$components/CRTooltip.svelte';

  type ARGS = {
    postAuthors: PAuthor[];
    deletePost: (id: string) => void;
    toUpdatePost: (event: MouseEvent | KeyboardEvent, id: string) => void;
    selectedUserId: string;
  };
  let { postAuthors, deletePost, toUpdatePost, selectedUserId }: ARGS =
    $props();
</script>

<!-- <pre>{selectedUserId} {JSON.stringify(postAuthors, null, 2)}</pre> -->

{#snippet tooltip(allowed: boolean, title: string)}
  <!-- NOTE the way to toggle string content based on a predicate -->
  <!-- <Tooltip defaultClass={`tooltip_default-${allowed ? 'delete' : 'false'}`}> -->
  <p>
    {allowed ? title : 'owner only permission'}
  </p>
  <!-- </Tooltip> -->
{/snippet}

{#snippet item_delete(allowed: boolean, pA: PAuthor)}
  <div class="tooltip-wrapper">
    <button
      class={allowed ? 'ok-hover' : 'no-hover'}
      onclick={(event: MouseEvent | KeyboardEvent) => {
        event.preventDefault();
        allowed && deletePost(pA.id);
      }}
      aria-label="Delete Post"
      aria-hidden={true}
    >
      <span style="color:red;">X</span>
    </button>
    <Tooltip panel={tooltip} panelArgs={[allowed, 'Delete Post']}></Tooltip>
  </div>
{/snippet}
{#snippet item_prepare_update(allowed: boolean, pA: PAuthor)}
  <!-- NOTE: without event.preventDefault()
		this block could not be rendered from a snippet
		as the snippet would turn action into 'toggle completed'\
		because of the event bubbling 
	-->
  <div class="tooltip-wrapper">
    <button
      class={allowed ? 'ok-hover' : 'no-hover'}
      onclick={(event: MouseEvent | KeyboardEvent) => {
        event.preventDefault();
        allowed && toUpdatePost(event, pA.id);
      }}
      aria-label="Update Post"
      aria-hidden={true}
    >
      📝
    </button>
    {@render tooltip?.(allowed, 'Prepare for update')}
  </div>
{/snippet}

{#snippet title_with_content(allowed: boolean, pA: PAuthor)}
  <section
    onclick={(event: MouseEvent | KeyboardEvent) => {
      event.preventDefault();
      allowed && toUpdatePost(event, pA.id);
    }}
    aria-hidden={true}
  >
    <p
      class={`${allowed ? 'blue' : 'gray'} ${allowed ? 'ok-hover' : 'no-hover'}`}
    >
      {pA.title}
    </p>
    <p>{pA.content}</p>
  </section>
{/snippet}

{#snippet infoPanel(pA: PostAuthor)}
  <!-- .info-panel{ -->
  <p>published</p>
  <p>{pA.published ? 'YES' : 'Not Yet'}</p>
  <p>created at</p>
  <p>{pA.createdAt.toLocaleString()}</p>
  <p>updated at</p>
  <p>{pA.updatedAt.toLocaleString()}</p>
  <p>categories</p>
  <p class="category-names">{pA.categoryNames}</p>
  <!-- } -->
{/snippet}

{#snippet category_names()}
  <div class="category-names">
    <p>
      Categories:
      {#if postAuthors[0]?.categoryNames?.length}
        {#each postAuthors[0].categoryNames as category, index (postAuthors[0].id)}
          {postAuthors[0].firstName}
          {postAuthors[0].lastName}{index <
          postAuthors[0].categoryNames.length - 1
            ? ', '
            : ''}
        {/each}
      {:else}
        None
      {/if}
    </p>
  </div>
{/snippet}

{#snippet info_panel(allowed: boolean, pA: PAuthor)}
  <div class="tooltip-wrapper">
    <!-- <p class="content">{pA.content}</p> -->
    <!-- {@render title_with_content?.(allowed, pA)} -->
    <Tooltip
      panel={title_with_content}
      panelArgs={[allowed, pA]}
      preferredPos="bottom,top,left,right"
    ></Tooltip>
  </div>
{/snippet}

<!-- Todo it was {postAuthors[0].firstName.slice(0, -1)} below-->
<!-- <pre style="font-size:11px;">postAuthors[0] {JSON.stringify(postAuthors[0], null, 2)}</pre> -->
<div class="post-container">
  <ul>
    {#if postAuthors[0]}
      <p class="author_name">
        {postAuthors[0].firstName.replace(/T$/, '')}
        {postAuthors[0].lastName}
        <span class="count"
          >{postAuthors.length} post{postAuthors.length === 1 ? '' : 's'}</span
        >
      </p>

      {#if postAuthors}
        {#each postAuthors as pA}
          {@const isOwner = pA.author}
          <li class="post-block">
            <label>
              {@render item_delete?.(isOwner, pA)}
              {@render item_prepare_update?.(isOwner, pA)}
              {@render info_panel?.(isOwner, pA)}
            </label>
          </li>
        {/each}
      {/if}
    {/if}
  </ul>
</div>

<style lang="scss">
  .post-container {
    // border: 1px solid gray;
    // border-radius: 8px;
    // padding: 0.5rem;
    // margin: 0.5rem 0;
    // background-color: var(--BODY-BACKGROUND-COLOR); // #3e3e3e;
    // box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
    max-width: 40rem;
    min-width: 20rem;
  }
  .info-panel {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem 1rem;
    padding: 0.5rem;
    font-size: 14px;
    background-color: var(--BODY-BACKGROUND-COLOR); // #3e3e3e;
    border: 1px solid gray;
    border-radius: 8px;
    max-width: 20rem;
  }
  .tooltip-wrapper {
    position: relative;
    display: inline-block;

    p {
      color: yellow;
      padding: 0 0 0 5px;
      margin: 0;
    }
    p:first(child) {
      color: lightgreen;
    }
    p &:hover {
      color: lightgreen;
      cursor: pointer;
    }
  }
  .category-names {
    width: 10rem;
    text-wrap: wrap;
    // overflow-x: auto;
  }
  .author_name {
    position: sticky;
    top: -5px;
    font-style: italic;
    color: lightgreen;
    font-size: 16px;
    margin-bottom: 8px;
    height: 1.6rem;
    padding: 4px 1rem 0 1rem;
    background-color: vat(--BODY-BACKGROUND-COLOR); // #3e3e3e;
    opacity: 1;
    z-index: 5;
    .count {
      font-size: 12px;
      margin-left: 1.5rem;
    }
  }
  .post-block {
    position: relative;
    list-style: none;
    margin: 0.6rem 0 0 0;
    padding: 0 5px 0 0;
    margin-bottom: 1rem;
  }

  .highlight {
    width: 1rem !important;
  }
  .content {
    display: inline-block;
    font-size: 20px;
    // font-family: Verdana, sans-serif;
    font-family: 'Times New Roman', Times, serif;
    font-weight: 300;
    padding: 0 1rem;
    margin: 0;
  }
  label {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    height: 100%;
  }
  .ok-hover,
  .no-hover {
    border: none; //1px solid transparent;
    outline: none;
    font-size: 20px;
    color: lightblue;
  }
  .no-hover {
    &:hover {
      // border-color: gray;
      cursor: not-allowed;
    }
  }
</style>
