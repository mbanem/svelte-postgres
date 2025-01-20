<script>
  import Comp1 from './Comp1.svelte';
  import Comp2 from './Comp2.svelte';
  const caption1 = 'Component One';
  const caption2 = 'Component Two';
  import ContactCard from './ContactCard.svelte';

  import SnippetComponent from './snippet/+page.svelte';
</script>

<svelte:head>
  <title>Visit Cards</title>
</svelte:head>
<a href="/prop-class/snippet">Snippet</a>
<div class="container">
  <div>
    <div class="components-wrapper">
      <div>
        <div class="parent1">
          <Comp1 cls="class-one" {caption1}>Matia Isakovic</Comp1>
        </div>
        <div class="parent2">
          <Comp2 cls="class-two" {caption2}>Filip Isakovic</Comp2>
        </div>
      </div>
      <div>
        <pre style="margin:0.8rem 0 0 0.8rem;padding:0;">
Parent page imports and renders two components Child1 as
&lt;Comp1 cls="class-one" &lcub;caption1&rcub;&gt;Matia Isakovic&lt;/Comp1&gt;
and Child2 as
&lt;Comp2 cls="class-two" &lcub;caption1&rcub;&gt;Filip Isakovic&lt;/Comp2&gt;
The components implement classes as. e.g. Child1
  &lt;div class=&lcub;cls&rcub;&gt;
    &lcub;caption1 ?? 'Child'&rcub;
    &lcub;@render children()&rcub;
  &lt;/div&gt;

        </pre>
      </div>
    </div>
    <pre>
      In order to send a class to child component parent has to declare class as
          :global(.class-one)
      and send it as a prop with a name different then 'class' as it is a keyword
      as we see above it is sent as &lt;Comp2 cls="class-one" ...
</pre>
    <div class="wrapper">
      <pre>
ContactCard component should get name and Address props as snippets
from 1 and should render them @render name(), @render address()
calling snippets as functions as they are such.
The parent send snippets as component content, i.e. specifying them
between the component tags
&lt;ContactCard&gt;
  &lcub;#snippet name()&rcub;
    P. Sherman
  &lcub;/snippet&rcub;

  &lcub;#snippet address()&rcub;
    42 Wallaby Way
    Sydney
  &lcub;/snippet&rcub;
&lt;/ContactCard&gt;
		</pre>

      <ContactCard>
        {#snippet name()}
          P. Sherman
        {/snippet}

        {#snippet address()}
          42 Wallaby Way <br />
          Sydney
        {/snippet}
      </ContactCard>
    </div>
  </div>
  <div class="snippet-component">
    <SnippetComponent></SnippetComponent>
  </div>
</div>

<!-- sending a CSS class to child component -->
<style lang="scss">
  .container {
    display: grid;
    width: 80vw;
    grid-template-columns: 1fr 1fr;
    margin-left: 4rem;
    column-gap: 3rem;
  }
  .components-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
    row-gap: 1rem;
  }
  .parent1,
  .parent2 {
    margin: 1rem 0 0 4rem;
  }
  .parent1 :global(.class-one),
  .parent2 :global(.class-two) {
    color: lightgreen;
    border: 1px solid lightgreen;
    width: 11rem;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    &:hover {
      color: yellow;
      border-color: yellow;
      cursor: pointer;
    }
  }
  .parent2 :global(.class-two) {
    color: skyblue;
    border: 1px solid skyblue;
    &:hover {
      color: pink;
      border-color: pink;
    }
  }
  /*	:global(.x) {
		:hover {
			color: yellow;
			border-color: yellow;
		}
	}
	:global(.comp) {
		color: lightgreen;
		border: 1px solid lightgreen;
		:hover {
			color: yellow;
			border: 1px solid yellow;
		}
	}*/
  .wrapper {
    width: max-content;
    padding: 6px 1rem;
    margin: 5px 0 0 4rem;
    border: 1px solid gray;
    border-radius: 8px;
  }
</style>
