<script lang="ts">
  import { onMount, tick } from 'svelte';
  import * as utils from '$lib/utils';
  let divEl: HTMLDivElement;
  type TImage = {
    src: string;
    width: number;
    height: number;
    caption: string;
    href: string;
    alt: string;
  };
  let imgWidth = 120;
  const imgWH = () => {
    const id = utils.id();
    const img = {
      src: `https://picsum.photos/${imgWidth}/120`,
      width: 120,
      height: 120,
      caption: id,
      href: '',
      alt: id,
    };
    return img as TImage;
  };
  // to get different picture change width or height slightly
  let images = $state<TImage[]>([]);
  // 	{
  // 		src: 'https://picsum.photos/120/120',
  // 		width: 120,
  // 		height: 120,
  // 		caption: 'this image has a link',
  // 		href: 'https://picsum.photos/121/120'
  // 	},
  // 	{
  // 		src: 'https://picsum.photos/120/121',
  // 		width: 120,
  // 		height: 120,
  // 		caption: 'this one does not',
  // 		href: ''
  // 	},
  // 	{
  // 		src: 'https://picsum.photos/122/120',
  // 		width: 120,
  // 		height: 120,
  // 		caption: 'this one does not',
  // 		href: ''
  // 	}
  // ])
  const addImage = () => {
    //console.log('addImage')
    images.push(imgWH());
    imgWidth += 1;
    scroll();
  };
  const removeImage = (event: MouseEvent) => {
    //console.log('removeImage')
    if ((event.target as HTMLButtonElement).innerText.includes('last')) {
      images = images.slice(0, -1);
    } else {
      images = images.slice(1);
    }
    imgWidth -= 1;
    scroll();
  };
  const deleteImg = (event: MouseEvent) => {
    // @ts-expect-error
    const image = event.target as TImage;
    images = images.filter((img) => img.alt !== image.alt);
    scroll();
  };

  const scroll = () => {
    // console.log(divEl.offsetHeight, divEl.scrollTop, divEl.getBoundingClientRect().height)
    // height - 20 is to react properly to scroll
    if (
      divEl.offsetHeight + divEl.scrollTop >
      divEl.getBoundingClientRect().height - 20
    ) {
      tick().then(() => {
        divEl.scrollTo(0, divEl.scrollHeight);
      });
    }
  };
  onMount(() => {
    // @ts-expect-error
    [...6].forEach((_) => {
      images.push(imgWH());
      imgWidth++;
    });
  });
  let imgPixel = '';
  let stretchFactor = $state(1.5);
  const onMouseEnter = (event: MouseEvent) => {
    if (!event.ctrlKey) return;
    const img = event.target as HTMLImageElement;
    imgPixel = img.style.width;
    img.style.width = `${img.width * stretchFactor}px`;
    img.style.height = `${img.width}px`;
  };
  const onMouseLeave = (event: MouseEvent) => {
    // if (!event.ctrlKey) return;
    const img = event.target as HTMLImageElement;
    img.style.width = imgPixel;
    img.style.height = imgPixel;
  };
</script>

<svelte:head>
  <title>Snippets</title>
</svelte:head>

<div class="main">
  {#snippet countdown(n: number)}
    {#if n > 0}
      <span>{n}, </span>
      {@render countdown(n - 1)}
    {:else}
      {@render blastoff()}
    {/if}
  {/snippet}
  <div class="block">
    <pre>Snippet @render countdown(20)</pre>
    {@render blast()}fixed
    {@render countdown(20)}
    <div class="buttons">
      <button onclick={addImage}>add image</button>
      <button onclick={removeImage}>remove first</button>
      <button onclick={removeImage}>remove last</button>
      <div class="range-wrapper">
        stretch by {stretchFactor}
        <div class="stretch-range">
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            bind:value={stretchFactor}
            list="values"
          />
          <datalist id="values">
            {#each [...5] as val}
              <option value={val + 1} label={val + 1}></option>
            {/each}
          </datalist>
        </div>
      </div>
      <pre>CtrlKey + hover over image to enlarge, click on it to remove</pre>
    </div>
  </div>
  <!-- snippet is called as a function sending it arguments
		but the caller can send thw whole object and snippet
		could be defined by destructuring elements of the
		object argument. Here @render calls figure(image)
		and snippet destructure image into its props
		src, caption, width, height
	-->
  {#snippet figure({ src, caption, width, height, href }: TImage)}
    {#if href}
      <a {href}>
        <div>
          <figure>
            <img
              alt={caption}
              {src}
              {width}
              {height}
              onmouseenter={onMouseEnter}
              onmouseleave={onMouseLeave}
            />
            <figcaption>{caption}</figcaption>
          </figure>
        </div>
      </a>
    {:else}
      <div>
        <figure>
          <img
            alt={caption}
            {src}
            {width}
            {height}
            onmouseenter={onMouseEnter}
            onmouseleave={onMouseLeave}
          />
          <figcaption>{caption}</figcaption>
        </figure>
      </div>
    {/if}
  {/snippet}

  <div>
    <div
      bind:this={divEl}
      class="container"
      onclick={deleteImg}
      aria-hidden={true}
    >
      {#each images as image}
        {@render figure(image)}
      {/each}
    </div>
  </div>
</div>
{#snippet blast()}
  <span>🇷🇸 </span>
{/snippet}
{#snippet blastoff()}
  <span>🚀</span>
{/snippet}

<style>
  .main {
    margin: 0 0 0 4rem;
  }
  .container {
    /* position: absolute; */
    /* display: flex;
		justify-content: flex-start;
		align-items: flex-start; */
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    row-gap: px;
    column-gap: 1rem;
    height: 70vh;
    width: 80vw;
    margin: 0 3rem 0 7rem;
    overflow: auto;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 1rem;
    /* padding: 4rem; */
  }
  .block {
    display: block;
    margin: 1rem 0 0 4rem;
  }
  .buttons {
    display: block;
    position: sticky;
    top: 0;
    left: 0;
    margin: 0 0 1rem 4rem;
    /* button {
			display: block;
			margin: 6px 0 0 0;
			cursor: pointer;
		} */
  }
  figure {
    background: white;
    padding: 1em;
    margin: 0 0 1em 0;
    filter: drop-shadow(2px 4px 10px rgba(0, 0, 0, 0.1));
  }

  img {
    width: 100%;
    height: auto;
    background: #eee;
    cursor: pointer;
  }
  .range-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: 1rem;
    .stretch-range {
      display: inline-block;
      margin-left: 1rem;
      datalist {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        writing-mode: horizontal-tb;
        width: 130px;
      }
    }
  }
  pre {
    display: inline-block;
    margin-left: 4rem;
    margin-right: 3rem;
    padding: 0;
  }
</style>
