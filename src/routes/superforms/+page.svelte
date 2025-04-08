<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  // import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import { z } from 'zod';
  import type { PageData } from './$types';
  import InputBox from '$components/InputBox.svelte';
  import * as utils from '$utils';

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
      return err.shift(), err;
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
      title="First Name"
      bind:value={$form.firstName}
      err={error($errors.firstName)}
      exportValueOn="keypress"
      capitalize={true}
    />
    <InputBox
      title="Last Name"
      bind:value={$form.lastName}
      err={$errors.lastName}
      exportValueOn="keypress"
      capitalize={true}
    />

    <InputBox title="eMail" bind:value={$form.email} err={$errors.email} />
    <InputBox
      title="password"
      type="password"
      bind:value={$form.email}
      err={$errors.email}
    />
    <InputBox
      title="Company Name"
      bind:value={$form.company}
      err={$errors.company}
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
