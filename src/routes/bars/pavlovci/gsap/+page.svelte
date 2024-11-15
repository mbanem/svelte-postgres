<script lang="ts">
  import { gsap } from 'gsap';
  import { onMount } from 'svelte';

  let timeline: gsap.core.Timeline;
  onMount(() => {
    /*
		gsap.from('.header', {
			duration: 1,
			y: '-100%',
			ease: 'bounce'
		})
		gsap.from('.link', { duration: 1, opacity: 0, delay: 1, stagger: 0.5 })
		gsap.from('.right', { duration: 2, x: '-100vw', delay: 1, ease: 'power2.in' })
		gsap.from('.left', { duration: 1, delay: 1.5, x: '-100%' })
		gsap.fromTo(
			'.footer',
			{ opacity: 0, width: 0 },
			{ opacity: 1, width: '100vw', ease: 'elastic', delay: 3 }
		)
		gsap.fromTo(
			'.button',
			{ opacity: 0.5, scale: 0.3, rotation: 720 },
			{ duration: 1, delay: 3.5, opacity: 1, rotation: 0 }
		)
    */
    timeline = gsap.timeline({ defaults: { duration: 1 } });
    timeline
      .from('.header', {
        y: '-100%',
        x: '-100%',
        ease: 'power1',
      })
      .from('.border', {
        height: '25vh',
        ease: 'ease-in-out',
      })
      .from('.link', { opacity: 0, stagger: 0.5, duration: 0.5 })
      .from('.right', {
        x: '-100vw',
        ease: 'power1',
        duration: 2,
        rotation: 360,
      })
      .from('.left', { x: '-100%' }, '<0,8')
      .fromTo(
        '.footer',
        { opacity: 0, width: 0 },
        { opacity: 1, width: '40vw', ease: 'power1', duration: 2 },
      )
      .fromTo(
        '.button',
        {
          opacity: 0,
          scale: 0,
          rotation: 720,
          borderWidth: '36px',
          borderRadius: '1rem',
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          borderWidth: 1,
          borderRadius: '5px',
          borderColor: 'gray',
        },
      );
  });
</script>

<main>
  <div class="header">
    <div class="links">
      <div class="link">Link 1</div>
      <div class="link">Link 2</div>
      <div class="link">Link 3</div>
    </div>
  </div>
  <div class="content">
    <div class="sidebar left"></div>
    <button class="button" onclick={() => timeline.reverse()}>Reverse</button>
    <div class="sidebar right"></div>
  </div>
  <div class="footer">&#169; ComRUNNER Software Inc.</div>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    width: 45rem;
    margin: 0;
    height: 65vh;
    overflow: hidden;
    /* set border opacity as an898 alpha channel */
    border: 1px solid rgba(128, 128, 128, 0);
    .border {
      border: 1px solid rgba(128, 128, 128, 0.8);
      height: 65vh;
    }
  }
  .header {
    height: 3rem;
    line-height: 3rem;
    font-size: 1.6em;
    font-family: Georgia, 'Times New Roman', Times, serif;
    background-color: burlywood; //var(--BODY-BACKGROUND-COLOR);
  }
  .links {
    display: flex;
    justify-content: space-around;
    height: 100%;
    align-items: center;
    font-family: Georgia, 'Times New Roman', Times, serif;
    text-shadow: 2px 2px 10px blue;
    color: navy;
  }
  .content {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
  }
  .button {
    align-self: center;
    // hard to avoid item grow; this is probably the only way
    // flex: 0 0 2rem;
    font-size: 20px;
    border: 2px solid yellow;
    // opacity: 0;
  }
  .sidebar {
    align-self: stretch;
    width: 6rem;
    &.right,
    &.left {
      background-color: rgba(24, 125, 165, 0.8);
      // margin-right: 2rem;
    }
  }
  .footer {
    // transform: translate(100%);
    height: 3rem;
    background: burlywood;
    text-align: center;
    line-height: 3rem;
    color: navy;
  }
</style>
