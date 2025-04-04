<script lang="ts">
  import { hasPermission } from './Permissions.svelte';
  /* 
		we usually have value/text pairs for options but we can use 
		objects with more properties, though we still bindle pairs
		of value/text for presenting the options in a select box,
		but then, like here, we can use additional properties to set
		condition for selected option attribute, e.g. ADMIN
	*/
  // type TRole = 'VISITOR' | 'USER' | 'ADMIN';
  // type Option = {
  //   id: number;
  //   value: string;
  //   role: TRole[];
  // };

  // let options: Option[] = [
  //   { id: 4, value: '2019', role: ['VISITOR', 'ADMIN'] },
  //   { id: 3, value: '2018', role: ['VISITOR', 'ADMIN'] },
  //   { id: 2, value: '2023', role: ['VISITOR', 'ADMIN'] },
  //   { id: 1, value: '2024', role: ['VISITOR', 'USER', 'ADMIN'] },
  // ];

  let selected_id = $state(2);
  const authorId = 12345678;
  // --------------------------------------------------------------
  let firstName = $state('');
  let permission = $state('view:comments');

  type TUser = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  // type Users = { name: keyof typeof users; user: TUser };

  const users: Record<string, TUser> = {
    Matia: {
      id: '12345678',
      firstName: 'Matia',
      lastName: 'Isakovic',
      role: 'admin',
    },
    Filip: {
      id: '12345678',
      firstName: 'Filip',
      lastName: 'Isakovic',
      role: 'user',
    },
    Marko: {
      id: '12345678',
      firstName: 'Marko',
      lastName: 'MIlutinovic',
      role: 'visitor',
    },
    Mia: {
      id: '12345678',
      firstName: 'Mia',
      lastName: 'MIlutinovic',
      role: 'moderator',
    },
  } as const;
  const ma = users.Matia as TUser;
  const fi = users.Filip as TUser;
  const mr = users.Marko as TUser;
  const mi = users.Mia as TUser;
  // let selected = $derived(options.find((o) => o.role === 'ADMIN'));
  let selected = $derived(
    Object.values(users).filter(
      (u) => u.firstName.toLowerCase() === firstName.toLowerCase(),
    )[0],
  );

  let thePermission = $derived(
    hasPermission(
      users[firstName as keyof typeof users] as TUser,
      permission,
      authorId,
    ),
  );
  const checkPermission = (event: MouseEvent) => {
    event.preventDefault();
    const span = event.target as HTMLSpanElement;
    const spans = span.parentNode?.childNodes;
    spans?.forEach((span) => {
      (span as HTMLSpanElement).style.backgroundColor = 'navy';
    });
    (span as HTMLSpanElement).style.backgroundColor = 'blue';
    permission = (event.target as HTMLSpanElement)?.innerText;
  };
  let viewSpanButton: HTMLSpanElement;
  const clearSelectedPermission = () => {
    let spans = document.querySelector('.permission-block')?.childNodes;
    spans?.forEach((span) => {
      (span as HTMLSpanElement).style.backgroundColor = 'navy';
    });
    viewSpanButton.click();
  };
</script>

<!-- <p>{firstName}</p> -->
<div class="wrapper">
  <div>
    <pre>
  Users are defined as:
  const users = &lcub;
		<span>{ma.firstName}</span>: &lcub;
			id: {ma.id},
			firstName: {ma.firstName},
			lastName: {ma.lastName},
			role: '{ma.role}
		&rcub;,
		<span>{fi.firstName}</span>: &lcub;
			id: {fi.id},
			firstName: {fi.firstName},
			lastName: {fi.lastName},
			role: '{fi.role}
		&rcub;,
		<span>{mr.firstName}</span>: &lcub;
			id: {mr.id},
			firstName: {mr.firstName},
			lastName: {mr.lastName},
			role: '{mr.role}
		&rcub;,
		<span>{mi.firstName}</span>: &lcub;
			id: {mi.id},
			firstName: {mi.firstName},
			lastName: {mi.lastName},
			role: '{mi.role}
		&rcub;,
	&rcub; as const;
  So to access role of the first user we use:
    users[item as keyof typeof users].role
  where item is either 'filip','matia' or 'Marko' taking care of case-sensitivity

  const ROLES = &lcub;
    admin: ['view:comments', 'create:comments', 'update:comments', 'delete:comments'],
    moderator: ['view:comments', 'create:comments', 'delete:comments'],
    user: ['view:comments', 'create:comments'],
    visitor: ['view:comments']
  &rcub; as const;
  NOTE: type Users = &lcub; name: keyof typeof users; user: TUser &rcub;
  has big impact on &lt;input type="text" bind:value=&lcub;firstName&rcub; placeholder="enter firstName" /&gt;
  as <i>keyof typeof users</i> is <span>"filip" | "Marko" | "matia"</span
      > and only those strings are acceptable 
  no matter what string we enter in the input box 
    </pre>
  </div>
  <div class="container">
    <div>
      {#if Object.keys(users).includes(firstName)}
        <p class="user-permission-line">
          Does <span>{firstName}</span> has permission for
          <span>{permission}?</span>
          <span
            class:has-permission={thePermission}
            class:warning={!thePermission}
          >
            {thePermission}
          </span>
        </p>
      {:else}
        <p class="warning">Please select a User</p>
      {/if}
      <!-- <input
        type="text"
        onkeyup={firstNameOnChange}
        placeholder="enter firstName"
      /> -->
      <select bind:value={firstName} onchange={clearSelectedPermission}>
        <option value="">Select a User</option>
        {#each Object.entries(users) as [k, v]}
          <option value={k}>{v.firstName} {v.lastName}</option>
        {/each}
      </select>
      <input
        type="text"
        bind:value={permission}
        placeholder="enter permission as action:object"
      />

      <!-- <select bind:value={selected_id}>
        {#each options as option}
          <option value={option.id}>{option.value}</option>
        {/each}
      </select> -->
    </div>
    <pre>
      <p
        onclick={checkPermission}
        aria-hidden={true}
        class="permission-block"
        style={`display:${firstName ? 'block' : 'none'}`}><span
          bind:this={viewSpanButton}
          style="background-color:blue;">view:comments</span
        ><span>create:comments</span><span>update:comments</span><span
          >delete:comments</span
        ></p>
    </pre>
    <div class="json-block">
      {#if selected}
        <pre>
Permissions (click permission button below to check for that permission)
{JSON.stringify(selected, null, 2)}
      </pre>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
  }
  .container {
    @include container(
      'Handling Permissions -- Web Dev Simplified',
      $head-color: skyblue
    );
    height: 22rem;
    margin: 1rem 0 0 0;
    width: 40rem;
  }
  select {
    width: max-content;
    padding: 3px 1.5rem;
    font-weight: bold;
  }
  pre {
    tab-size: 1rem;
    margin-top: 0;
    font-size: 14px;
  }
  p {
    font-size: 16px;
    padding: 5px;
    margin: 0;
  }
  input {
    width: 12rem;
    background-color: #3e3e3e;
  }
  span {
    color: yellow;
  }
  .has-permission {
    color: lightgreen;
  }
  .warning {
    color: pink;
  }
  .json-block {
    margin-top: -5rem;
  }
  .permission-block {
    span {
      height: 1.4rem;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 2px 0.5rem;
      cursor: pointer;
      color: white;
      /* big line-height to cover all area for mouse click to be detected
        as with small values click must be done over the text itself
        not outside text as padding make area bigger
      */
      line-height: 2rem;
      background-color: navy;
      margin-top: -3rem;
    }
  }
  .blue-background {
    background-color: blue;
  }
  .user-permission-line {
    line-height: 2rem;
    span {
      font-size: 1.3rem;
      &:last-child {
        font-size: 1.6rem;
      }
    }
  }
</style>
