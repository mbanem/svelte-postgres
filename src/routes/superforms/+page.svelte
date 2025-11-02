<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  // import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import { z } from 'zod';
  import type { PageData } from './$types';
  import InputBox from '$components/InputBox.svelte';
  import * as utils from '$lib/utils';

  // export let data: PageData;
  let { data } = $props();

  // Client API:
  // const { form } = superForm(data.form);
  type Key = keyof typeof $errors;
  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    company: z.string().min(1),
  });

  /* $constraints: { "firstName": { "minlength": 3, "required": true }, 
    "lastName": { "minlength": 3, "required": true }, "email": { "required": true }, 
    "company": { "minlength": 3, "required": true } }
  */
  const { form, errors, enhance, constraints } = superForm(data.form, {
    dataType: 'json',
    taintedMessage: 'Are you sure you want leave?',
    // validators: schema
  });

  $effect(() => {
    if (Object.keys($errors).length > 0) {
      utils.setPlaceholderColor('pink');
    } else {
      utils.setPlaceholderColor('#8e8e8e');
    }
  });
  // let F = $state({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   company: '',
  // });
  const error = (err: string[] | undefined) => {
    if (err && err[0]) {
      return (err.shift(), err);
    }
  };
</script>

<!-- <SuperDebug data={$form} /> -->

<!-- <p>constraints {JSON.stringify($constraints, null, 2)}</p> -->
<article>
  <header>
    <h1>New Contact</h1>
  </header>
  <form method="POST" use:enhance>
    <InputBox
      id="x1"
      title="First Name"
      bind:value={$form.firstName as string}
      err={error($errors.firstName as string[])}
      exportValueOn="keypress"
      capitalize={true}
    />
    <InputBox
      id="x2"
      title="Last Name"
      bind:value={$form.lastName as string}
      err={$errors.lastName as string[]}
      exportValueOn="keypress"
      capitalize={true}
    />

    <InputBox
      id="x3"
      title="eMail"
      bind:value={$form.email as string}
      err={$errors.email as string[]}
    />
    <InputBox
      id="x4"
      title="password"
      type="password"
      bind:value={$form.email as string}
      err={$errors.email as string[]}
    />
    <InputBox
      id="x5"
      title="Company Name"
      bind:value={$form.company as string}
      as
      string
      err={$errors.company as string[]}
    />
    <button type="submit">Submit</button>
  </form>
</article>

<!-- <pre>{JSON.stringify($form, null, 2)}</pre> -->

<style>
  article {
    margin-left: 25vw;
  }
</style>
