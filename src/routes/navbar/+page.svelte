<script lang="ts">
  import InputBox from '$lib/components/InputBox.svelte';
  import NavButton from '$lib/components/NavButton.svelte';

  type TButtonProp = { color: string; title: string; href: string };
  const buttonsList = [
    { color: 'Pink', title: 'Home', href: '/' },
    { color: 'Blue', title: 'Derived', href: '/derived' },
    { title: 'Scroll', href: '/bars/scroll' }, // make one with no color to use default color -- red
    { color: 'Tomato', title: 'Caterpillar', href: '/caterpillar' },
    { color: 'Green', title: 'Balloon', href: '/balloon' },
    { color: 'Purple', title: 'Prop-Class', href: '/prop-class' },
    { color: 'LightGreen', title: 'Bars', href: '/bars' },
    { color: 'Pink', title: 'Bindable', href: '/bindable' },
    { color: 'SkyBlue', title: 'Communicate', href: '/communicate' },
    { color: 'ForestGreen', title: 'ContactCard', href: '/contact' },
    { color: 'Yellow', title: 'Duck-Goose', href: '/duck-goose' },
    { color: 'Rebeccapurple', title: 'Themes', href: '/themes' },
    { color: 'Red', title: 'Floating Labels', href: '/floating-label' },
    { color: 'LightGreen', title: 'Before-Input', href: '/before-input' },
    { color: 'Pink', title: 'A-Button', href: '/a-button' },
    { color: 'Green', title: 'Box', href: '/box' },
    { color: 'Yellow', title: 'Detail Summary', href: '/detail-summary' },
    { color: 'Purple', title: 'Floating Inputs', href: '/floating-inputs' },
    { color: 'Pink', title: 'Permissions', href: '/permissions' },
    {
      color: 'Purple',
      title: 'Parent call child func',
      href: '/parent-call-child',
    },
    { color: 'LightGreen', title: 'Flex Grid', href: '/flex-grid' },
    { color: 'Yellow', title: 'Flip', href: '/flip' },
  ];

  // using $effect
  import { tick } from 'svelte';
  let inputBox: InputBox;
  let ulEl: HTMLUListElement;
  let messages = $state<string[]>([]);

  let inputBoxEntry = $state('');
  const onInputIsReadyCallback = () => {
    const para = document.createElement('p');
    para.innerHTML = `${inputBoxEntry}`;
    para.style.setProperty('color', 'yellow');
    para.style.setProperty('margin', 0);
    ulEl.appendChild(para);
    ulEl.scrollTo(0, ulEl.scrollHeight);
    inputBox.setInputBoxValue('', true); // true to blur as well
  };
  $effect.pre(() => {
    if (!ulEl) return; // not yet mountedChip
    // reference `messages` array length so that this code re-runs whenever it changes
    messages.length;
    // auto scroll when new messages are added
    if (ulEl.offsetHeight + ulEl.scrollTop > ulEl.scrollHeight - 20) {
      tick().then(() => {
        ulEl?.scrollTo(0, ulEl.scrollHeight);
      });
    }
  });

  let buttonListIndex = $state(0);
  const buttonsLength = buttonsList.length;

  const addNavButtonToList = () => {
    if (buttonListIndex < buttonsLength) {
      ulEl.innerHTML += `<p style='margin:0;color:lightgreen;'>${(buttonsList[buttonListIndex++] as TButtonProp).title}</p>`;
      ulEl.scrollTo(0, ulEl.scrollHeight);
    }
  };
</script>

<svelte:head>
  <title>Navigation Bar</title>
</svelte:head>
<!-- snipper default color is red -->
{#snippet icon(color = 'Red')}
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16">
    <circle cx="8" cy="8" r="8" fill={color} />
  </svg>
{/snippet}
<!-- snippet with default icon of Svelte -->
{#snippet profile(
  url = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg',
)}
  <img src={url} width="16" height="16" alt="pfp" />
{/snippet}
{#snippet snippetName()}
  <p>This is the snippet content</p>
{/snippet}
{@render snippetName()}
<!-- <NavButton label="home" title="Home" href="/" {snippetName}></NavButton> -->
{#each buttonsList as btn}
  <p>
    <NavButton colorName={btn.color ?? 'Red'} title={btn.title} href={btn.href}>
      {#snippet media()}
        {#if btn.color}
          {@render icon(`${btn.color}`)}
        {:else}
          {@render icon()}
        {/if}
      {/snippet}
    </NavButton>
  </p>
{/each}

<NavButton title="Svelte" href="/button">
  {#snippet media()}
    {@render profile()}
  {/snippet}
</NavButton>
<NavButton title="Vue" href="/counter">
  {#snippet media()}
    {@render profile(
      'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
    )}
  {/snippet}
</NavButton>

<pre>Using $effect based on messages.length to render
	a list of values entered in this input box
</pre>

<div class="select-user-block">
  <InputBox
    bind:this={inputBox}
    title="Enter item for the list and press Enter key"
    height="2rem;"
    width="20rem"
    margin="10px 0 5px 0"
    bind:value={inputBoxEntry}
    exportValueOn="enter"
    capitalize={true}
    {onInputIsReadyCallback}
  ></InputBox>
  <p style="display:block;width:12rem;border:none;">
    The List with {buttonListIndex} button{buttonListIndex == 1 ? '' : 's'}
  </p>
  <ul bind:this={ulEl} class="message-container">
    {#each messages as message, index}
      <li class="names">{index > 0 ? ', ' : ''} {message}</li>
    {/each}
  </ul>
</div>
<button onclick={addNavButtonToList} class="add-button-to-list"
  >add nav button to the list</button
>

<!-- using $effect -->
<style lang="scss">
  .message-container {
    @include border-small();
    width: 10rem;
    padding-left: 1rem;
    height: 7.76rem;
    overflow-y: auto;
  }
  .add-button-to-list {
    display: block;
  }
  .input-box {
    width: 20rem;
  }
  svg {
    display: inline-flex;
    margin-right: 8px;
  }
  p {
    /* must engulf the <Chip> in order to cover it for mouse click */
    display: inline-block;
    margin: 0;
    padding: 3px 6px;
    color: lightgreen;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
  }
  // p.names {
  //   color: yellow;
  //   padding: 0;
  //   margin: 0;
  // }
  :global(.greeting) {
    font-style: italic;
    :hover {
      color: yellow;
      border-color: yellow;
    }
  }
</style>
