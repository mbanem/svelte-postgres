<script lang="ts">
  import NavBar from '$components/NavBar.svelte';
  import { page } from '$app/state';
  const {
    data: { locals },
    data: { notifications },
  } = page;
  // otherwise, when extract data are on the same hierarchy level
  // const { locals, notifications } = page?.data;
  const navButtonObjects: TXNavButtonObject[] = [
    // {
    // 	position: 0,
    // 	title: 'NOTIFICATIONS',
    // 	href: '/bars/notifications',
    // 	cssRules: 'width:10rem;',
    // 	condition: 'VISITOR'
    // },
    {
      position: 0,
      title: 'PAVLOVCI',
      href: '/bars/pavlovci/village',
      condition: 'VISITOR',
    },
    {
      position: 1,
      title: 'GSAP',
      href: '/bars/pavlovci/gsap',
      condition: 'VISITOR',
    },
  ];
</script>

<svelte:head>
  <title>Pavlovci</title>
</svelte:head>
<br />
<NavBar {navButtonObjects} role="VISITOR" />
<pre class="pre_">It is a small village near city of Ruma
in Vojvodina, a Northern part of Serbia
with population of around 200 people
</pre>

<!-- <pre style="font-size:11px;">page {JSON.stringify(page, null, 2)}</pre> -->
<div class="container">
  <pre class="_pre">import &lcub;page&rcub; from '$app/state';
const &lcub;
  data: &lcub;locals&rcub;,
  data: &lcub;notifications&rcub;,
&rcub; = page;
</pre>
  <pre class="_pre">locals instead of $app/state.data.locals
locals{JSON.stringify(locals, null, 2)}</pre>
  <pre class="_pre">notifications instead of $app/state.data.notifications
notifications{JSON.stringify(notifications, null, 2)}</pre>
</div>

<style lang="scss">
  ._pre,
  .pre_ {
    display: block;
    margin: 0.5rem 0 0 0;
    padding: 0;
    font-size: 11.5px;
  }
  .pre_ {
    margin: 0;
  }
  .container {
    @include container(
      $head: 'The $app/state Collection',
      $head-color: lightgreen,
      $padding: 0 2rem
    );
    margin: 0;
  }
</style>
