<script lang="ts">
  import CRTooltip from '$lib/components/CRTooltip.svelte';

  let owner = true;
  const toggleColor = (event: MouseEvent, caption?: string) => {
    console.log('caption', caption);
    const grand = (event.target as HTMLSpanElement)?.parentElement
      ?.parentElement;

    const style = grand?.parentElement?.style;
    if (style) {
      style.color = style.color === 'red' ? 'blue' : 'red';
    }
  };
</script>

<svelte:head>
  <title>Icon Handler</title>
</svelte:head>

<h1>Icon Handler</h1>
<div class="wrapper">
  <div class="sub-wrapper">
    <pre>How to use a Font Awesome iconHandler -- a child of a parent
It is rendered as @render iconHandler(boolean, caption, faIconClass, clickHandler?)
The fist argument when true allows action to be carried on, otherwise
it shows a 'not-allowed pointer' with tooltip 'no owner permission'.
The caption argument is a tooltip text displayed with delay when icon is hovering.
The faIconClass is the class name copied from an https://fontawesome.com/ page when
searching for an icon and extracting className from icon <i class="className"
      ></i>.
A clickHandler is an optional function reference to be called when icon is
clicked. As the icon is deeply buried in CRTooltip and span elements the user's 
clickHandler, which gets mouse event, should access its grandParent wrapper as
const parent = (event.target as HTMLSpanElement)?.parentElement.parentElement;
There are three examples above two to delete the parent with owner and not owner
and the third to toggle parent's color. 
</pre>

    <div style="border:0;padding:0; color:green;">
      This is a list item to be deleted{@render iconHandler(
        true,
        'delete item',
        'fa fa-trash',
      )}
    </div>
    <div style="border:0;padding:0; color:green;">
      This is a list item to be deleted by not owner{@render iconHandler(
        false,
        'delete item',
        'fa fa-trash',
      )}
    </div>
    <div style="border:0;padding:0; color:blue;">
      This is a list item for toggling color{@render iconHandler(
        true,
        'toggle color',
        'fa-duotone fa-solid fa-paint-roller',
        (event: MouseEvent) => toggleColor(event, 'toggle color'),
      )}
    </div>
  </div>
</div>
{#snippet iconHandler(
  owner: boolean,
  caption: string,
  iconClass: string,
  clickHandler?: Function | undefined,
)}
  {#if owner}
    <CRTooltip {caption}>
      <span
        onclick={clickHandler
          ? (event: MouseEvent) => clickHandler(event, caption)
          : (event: MouseEvent) =>
              // @ts-expect-error
              event.target.parentElement?.parentElement?.parentElement.remove()}
        aria-hidden={true}
        style:cursor={owner ? 'pointer' : 'not-allowed'}
        style="margin=0 0.5rem;font-size:20px;color:cornsilk;border:1px solid gray;border-radius:4px;padding:2px 6px;"
      >
        <i class={iconClass}></i>
      </span>
    </CRTooltip>
  {:else}
    <CRTooltip caption="no owner permission">
      <span
        style:cursor={owner ? 'pointer' : 'not-allowed'}
        style="margin=0 0.5rem;font-size:20px;color:#c3909b;border:1px solid gray;border-radius:4px;padding:2px 6px;"
      >
        <i class={iconClass}></i>
      </span>
    </CRTooltip>
  {/if}
{/snippet}

<style lang="scss">
  .wrapper {
    margin: 0 auto;
  }
  .sub-wrapper,
  h1 {
    margin-left: 3rem;
    padding: 0;
  }
  pre {
    margin: 0;
    padding: 2rem 0;
  }
  CRTooltip:has(> span) {
    display: flex;
    align-items: baseline;
  }
</style>
