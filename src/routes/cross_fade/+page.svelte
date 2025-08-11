<script lang="ts">
  // import MoveButtons from './MoveButtons.svelte';
  // import Explanation from './Explanation.svelte'

  import { crossfade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { flip } from 'svelte/animate';
  import { onMount } from 'svelte';
  import { page } from '$app/state'; // for $age.status code on actions
  import * as utils from '$lib/utils';
  // dirty function to quickly generate some keys
  const randomId = () => {
    return (Math.random() + 1).toString(36).slice(2, 5);
  };

  type Inner = {
    text: string;
  };
  type Outer = {
    text: string;
    inners: Inner[];
  };
  // type Inner = typeof createInner
  // state
  const createOuter = (inners: Inner[]): Outer => {
    let _text = `outer-${randomId()}`;
    let _inners = $state<Inner[]>(inners);

    return {
      get text() {
        return _text;
      },
      get inners() {
        return _inners;
      },
    };
  };

  const createInner = (): Inner => {
    let _text = `inner-${randomId()}`;

    return {
      get text() {
        return _text;
      },
    };
  };
  // type MoveOuterUp = (outer: any, shift: -1) => void;
  // type MoveOuterDown = (outer: any, shift: 1) => void;
  // type MoveInnerUp = (inner: any, shift: -1) => void;
  // type MoveInnerDown = (inner: any, shift: 1) => void;

  // create the initial list
  let list = $state<Outer[]>([]);
  list.push(createOuter([createInner(), createInner()]) as Outer);

  // for moving items
  function moveOuterUp(outer: Outer) {
    moveOuter(outer, -1);
  }
  function moveOuterDown(outer: Outer) {
    moveOuter(outer, 1);
  }
  function moveOuter(outer: Outer, shift: number) {
    const from = (list as Outer[]).indexOf(outer);
    // make sure to check array bounds
    const to =
      from + shift > list.length || from + shift < 0 ? from : from + shift;
    if (from === to) return;
    // (list.splice(from, 1) removes the element from index from, and returns
    // that as an an array of one element, so we extract the element as the first [0]
    list.splice(to, 0, list.splice(from, 1)[0] as Outer);
  }
  // function moveInnerUp(outer:Outer){
  // moveInner(outer,-1)
  // }
  // function moveInnerDown(outer:Outer){
  // moveInner(outer,1)
  // }
  function moveInner(outer: Outer, inner: Inner, shift: number) {
    const outerFrom = list.indexOf(outer);
    const innerFrom = outer.inners.indexOf(inner);

    // check array bounds, but make sure to move the inner to the adjacent outer
    // if one is available
    let outerTo = outerFrom;
    let innerTo = 0;
    if (innerFrom + shift < outer.inners.length && innerFrom + shift >= 0) {
      // we shift within the same outer!
      innerTo = innerFrom + shift;
    } else if (
      innerFrom + shift >= outer.inners.length &&
      outerFrom + shift < list.length
    ) {
      // we shift to first item of the next outer
      outerTo += 1;
      innerTo = 0;
    } else if (innerFrom + shift < 0 && outerFrom + shift >= 0) {
      // we shift to the last item of the previous outer
      outerTo -= 1;
      if (list[outerTo]?.inners) {
        innerTo = (list[outerTo]?.inners as Inner[]).length;
      }
    }

    const moved = (list[outerFrom]?.inners as Inner[]).splice(
      innerFrom,
      1,
    )[0] as Inner;
    (list[outerTo]?.inners as Inner[]).splice(innerTo, 0, moved);
  }

  // for adding new items
  function appendInner(outer: Outer) {
    (outer?.inners as Inner[]).push(createInner());
  }

  function appendOuter() {
    list.push(createOuter([]));
  }

  // transition
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback() {
      return {
        duration: 300,
        easing: cubicInOut,
        css: () => `opacity: 0;`,
      };
    },
  });

  onMount(() => {
    return () => {
      utils.setMrPath(page.url.pathname);
    };
  });
</script>

<svelte:head>
  <title>Cross Fade</title>
</svelte:head>
<a href="/crossfade2">to Cross Fade 2</a>
<!-- <div class="wrap-all"> -->
<!-- <Explanation /> -->

<ul class="container">
  <li class="header">
    <button onclick={() => appendOuter()}> append new outer </button>
  </li>
  {#each list as Outer[] as outer, index (outer.text)}
    <li class="outer-item" animate:flip={{ duration: 300 }}>
      <div class="stacked-buttons top">
        <button onclick={() => moveOuter(outer, -1)}> ↑</button>
        <button onclick={() => moveOuter(outer, 1)}> ↓</button>
      </div>
      <div>
        <ul class="content">
          <div class="outer-header">
            <span>{outer.text}</span>
            <button onclick={() => appendInner(outer)}>
              append new inner
            </button>
          </div>
          {#each outer.inners as Inner[] as inner, i (inner.text)}
            <li
              class="inner-container"
              in:receive={{ key: inner.text }}
              out:send={{ key: inner.text }}
              animate:flip={{ duration: 300 }}
            >
              <div class="inner">
                <div class="stacked-buttons">
                  <button onclick={() => moveInner(outer, inner, -1)}>
                    ↑</button
                  >
                  <button onclick={() => moveInner(outer, inner, 1)}> ↓</button>
                </div>
                <div>
                  {inner.text}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </li>
  {/each}
</ul>

<!-- </div> -->

<style>
  /* .wrap-all {
    margin-left: 5rem !important;
  } */
  .container {
    border: 1px solid gray;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 90vw;
    list-style: none;
    /* margin: 0 auto; */
    border: 1px solid gray;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    row-gap: 1rem;
    align-items: center;
    width: 100%;
  }
  .outer-item {
    display: flex;
    width: 100%;
    border-top: 1px solid gray;
    /* border:1px solid pink; */
  }
  .outer-header {
    display: flex;
    justify-content: space-between;
    width: 98%;
    margin-top: 6px;
  }
  .content {
    width: 80vw;
    /* border-top:1px solid gray; */
    margin-top: 1rem;
    /* border:1px solid lightgreen; */
  }
  .stacked-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    .top {
      margin-top: 1rem;
    }
  }
  .inner {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    &:not(:last-child) {
      border-bottom: 6px;
      /* border:1ps solid blue; */
    }
  }
  .inner-container {
    border: 1px solid gray;
    border-radius: 8px;
    width: 98%;
    list-style: none;
  }
</style>
