<script lang="ts">
  // https://github.com/mbanem/svelte-postgres.git
  import { onMount } from 'svelte';
  import '$styles/app.scss';
  import { getNavButtons } from '$lib/utils/navButtons.svelte';
  import NavBar from '$components/NavBar.svelte';
  import NavContainer from '$components/NavContainer.svelte';
  // import '@fontawesome/fontawesome-free/css/all.min.css'

  let { data, children } = $props();

  let role = 'VISITOR';
  if (data?.locals?.user) {
    role = data.locals.user.role;
  }
  // array of individual button props
  let navButtonObjects = $state<TNavButtonObject[]>(getNavButtons());

  /*
	to iterate over ButtonProps as it is an array of PartialRecord<TButtonParam, string>
	we need outer loop over the array and inner loop over the Record props
		navButtonProps.forEach(button=> {
        for (const key in button){
            console.log(key, button[key as TButtonParam])
        }
    })
*/
  onMount(() => {
    document.querySelector('.hidden')?.classList.remove('hidden');
  });
</script>

<svelte:head>
  <title>Users Layout</title>
</svelte:head>

<div class="wrapper hidden">
  {#key data?.locals?.user?.role}
    <div class="nav-fixed">
      <NavBar {navButtonObjects} role={data?.locals?.user?.role ?? 'VISITOR'}
      ></NavBar>
    </div>
    <main>{@render children()}</main>
  {/key}
</div>

<!-- <div class="footer"> -->
<!-- <p>ComRUNNER Software Inc 2024 All rights reserved</p> -->

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
  // NOTE: suppressing :global(body) destroys NavBar buttons turning
  // them into list of strings instead of button captions
  :global(body) {
    color: var(--BODY-COLOR);
    background-color: var(--BODY-BACKGROUND-COLOR);
  }
  .wrapper {
    padding: 0;
    width: 100vw;
    height: 89vh;
    /* cannot help scrolling when selecting button Two or Three */
    overflow-anchor: none;
    background-color: var(--BODY-BACKGROUND-COLOR);
  }
  .nav-fixed {
    position: fixed;
    top: 0;
    z-index: 4;
  }
  main {
    margin-top: 3rem !important;
  }

  .footer {
    text-align: left;
    margin-left: 1.5rem;
  }
  div {
    font-size: 16px;
    &:target {
      background-color: var(--BODY-BACKGROUND-COLOR);
    }
  }
</style>
