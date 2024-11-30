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

<!-- =============== child component Box ======================= -->
<Box bind:person />
<!-- =============== child component Box ======================= -->
<div class="wrapper">
  <div class="parent-estate">
    <p>Reactive child value in the parent: {nameUpper}</p>
    <p style="color:yellow">{person.name} is of age {person.age}</p>

    <pre>
  All actions on a parent's person object exposed via bind:parent as
  prop to child component are carried out inside the child component
  but displayed only in the parent
		</pre>
  </div>
</div>

<style lang="scss">
  .wrapper {
    // $border: 1px solid yellow;
    // @include container('Parent Real Estate', $border: $border);
    @include container(
      $title: 'Parent Real Estate',
      // $border: 1px solid tomato
    );
    margin-top: 2rem;
  }
</style>
