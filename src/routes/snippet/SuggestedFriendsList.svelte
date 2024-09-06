<script lang="ts">
	import type { Snippet } from 'svelte';
	type UserType = { id: string; name: string; profileImage: string };

	let { friendsData, userPreview } = $props<{
		friendsData: { id: string; name: string; profileImage: string }[];
		userPreview: Snippet<{
			user: UserType;
			buttonText: string;
			buttonAction: (id: string) => void;
		}>;
	}>();

	async function addUserAsFriend(id) {
		await db.addFriend(id);
	}
</script>

<h1>Your Friends</h1>

{#each friendsData as friend}
	{@render userPreview(friend, 'Add Friend', addUserAsFriend)}
{/each}
