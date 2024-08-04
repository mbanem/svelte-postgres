<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'
	import { onMount } from 'svelte'
	import type { NewsArticle, NewsArticles, TNotification } from '$lib/types/common'

	// root +layout.ts loaded notifications {count:number, items[]}
	// and when called news +page.server.ts loaded articles so we
	// end up with data.data as nested data is NewsArticles
	// so this page got data with notifications and news_articles
	// Record<string, { title: String; slug: String; content: String }>;
	export let data: {
		count: number // from root/layout.ts
		items: any[]
		data: NewsArticles
	}
	const articles = data.data as NewsArticles
	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<div class="">
	<p class="page-title">News Page</p>
	<ul>
		{#each articles as { title, slug, content }}
			<li>
				<!-- <p>slug {slug}</p> -->
				<a href="{base}/news/{slug}">{title}</a>
				<p class="content">{content}</p>
				<p class="content-add">add "/{slug}" to base URL in address to open the news</p>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.content,
	.content-add {
		color: lightgreen;
		font-size: 22px;
		padding: 0;
		margin: 4px 0 8px 1rem;
		width: 50vw;
		margin-bottom: 1.5rem;
	}
	.content-add {
		color: skyblue;
	}
	a {
		font-style: italic;
		font-size: 18px;
	}
	// .container {
	// 	margin: 2rem 0 0 4rem;
	// 	padding-bottom: 2rem;
	// }
</style>
