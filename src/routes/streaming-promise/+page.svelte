<script lang="ts">
  const { data } = $props();
</script>

<div class="two-columns">
  <div class="left-column">
    <h2>
      Regular message: <span style="color:lightgreen;font-size:14px;"
        >{data.normal.message}</span
      >
    </h2>
    <br />
    {#await data.streamed}
      <h2 class="loading">Loading user data...</h2>
      <br />
    {:then users}
      <h2 class="loaded">Users data loaded:</h2>
      <br />
      {#each users as user}
        <div class="user-wrapper">
          <p>{user.firstName} - {user.lastName}</p>
          <p>email: {user.email}</p>
          <p>role: {user.role}</p>
          <p>created: {user.createdAt.toLocaleString()}</p>
          <p>updated: {user.updatedAt.toLocaleString()}</p>
        </div>
      {/each}
    {:catch error}
      <h2>Error loading users: {error.message}</h2>
    {/await}
  </div>
  <div class="right-column">
    <pre>
The +page.server.ts returns a regular message, which is rendered
with no delay on the client, and a Promise obtained from an async
fakeFetch function which incur one second delay before returning
a Promise by querying Prisma ORM for users in local DB, and the
client used await for the users Promise to resolve while displaying
a temporary message <i>Loading users data...</i> and replacing the message
with <i>Users data loaded:</i> and the users data.
  </pre>
  </div>
</div>

<style lang="scss">
  .user-wrapper {
    display: flex;
    flex-direction: column;
    width: 20rem;
    border: 1px solid gray;
    border-radius: 4px;
    padding: 1rem 0;
    margin-left: 1rem;
    p {
      margin: 2px 0 0 2rem;
      padding: 0;
      color: skyblue;
    }
    p:first-child {
      color: lightgreen;
      font-size: 20px;
      margin-left: 1rem;
    }
  }
  .loading {
    color: pink;
  }
  .loaded {
    color: lightblue;
  }
  .two-columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1rem;
    width: 63rem;
    margin: 3rem auto;
  }
  .left-column {
    width: 18rem;
  }
  .right-column {
    width: 40rem;
    height: 70vh;
    overflow-y: auto;
  }
  i {
    color: cornsilk;
  }
</style>
