<script lang="ts">
  type Person = {
    name: string;
    age: number;
  };

  import Box from '$lib/components/Box.svelte';

  let person = $state<Person>({ name: 'Mr. Filip Isakovic', age: 18 });

  let nameUpper = $derived(person.name.toUpperCase());
</script>

<svelte:head>
  <title>Box</title>
</svelte:head>
<h2>Child actions on bind:person parent's prop</h2>
<div class="grid-container">
  <div>
    <!-- =============== child component Box ======================= -->
    <Box bind:person />
    <!-- =============== child component Box ======================= -->
    <div class="wrapper">
      <div class="parent-estate">
        <p>Reactive child value in the parent: {nameUpper}</p>
        <p style="color:yellow">{person.name} is of age {person.age}</p>
        <input type="text" class="input-parent" bind:value={person.name} />
        <input type="text" class="input-parent" bind:value={person.age} />
        <pre>
  All actions on a parent's person object exposed via bind:parent as
  prop to child component are carried out inside the child component
  but displayed only in the parent
		</pre>
      </div>
    </div>
  </div>
  <div>
    <pre>
    Parent component holds a person object in a $state rune

      let person = $state&lt;Person&gt;(&lcub; name: 'Mr. Filip Isakovic', age: 18 &rcub;);
      
    and sends it as a single $Prop to a &lt;Box component as a bound property.

      &lt;Box bind:person /&gt;
    The &lt;Box component accepts the person object as bindable

      type PROPS = &lcub;
        person: Person;
      &rcub;;
      let &lcub; person = $bindable() &rcub;: PROPS = $props();

    so both the parent and the child components have direct access to the 
    peron properties.

    Using any of input boxes for the Name or Age in Child or Parent Estate 
    changes the value in the other component as the 

        bind:person --&gt: person = $bindable()

    is a reactive system like an entanglement in Theoretical Physics.

    </pre>
  </div>
</div>

<style lang="scss">
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 90vw;
  }
  .wrapper {
    // $border: 1px solid yellow;
    // @include container('Parent Real Estate', $border: $border);
    @include container(
      $head: 'Parent Real Estate' // $border: 1px solid tomato
    );
    margin-top: 2rem;
  }
  .input-parent {
    color: lightgreen;
  }
  p,
  input {
    display: block;
  }
</style>
