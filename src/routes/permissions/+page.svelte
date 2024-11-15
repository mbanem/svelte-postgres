<script lang="ts">
  import { hasPermission } from './Permissions.svelte';
  /* 
		we usually have value/text pairs for options but we can use 
		objects with more properties, though we still bindle pairs
		of value/text for presenting the options in a select box,
		but then, like here, we can use additional properties to set
		condition for selected option attribute, e.g. ADMIN
	*/
  type Option = {
    id: number;
    value: string;
    role: string;
  };

  let options: Option[] = [
    { id: 4, value: '2019', role: 'USER' },
    { id: 3, value: '2018', role: 'USER' },
    { id: 2, value: '2023', role: 'USER' },
    { id: 1, value: '2016', role: 'ADMIN' },
  ];

  let selected_id = $state(2);
  let selected = $derived(options.find((o) => o.role === 'ADMIN'));

  // --------------------------------------------------------------
  let firstName = $state('filip');
  let permission = $state('view:comments');

  type TUser = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  type Users = { name: keyof typeof users; user: TUser };
  const users = {
    matia: {
      id: '12345678',
      firstName: 'Filip',
      lastName: 'Isakovic',
      role: 'admin',
    },
    filip: {
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
  } as const;
  type TUsers = typeof users;
</script>

<div class="wrapper">
  <div>
    <pre>
  Users are defined as:
  const users = &lcub;
		<span>matia</span>: &lcub;
			id: '12345678',
			firstName: 'Filip',
			lastName: 'Isakovic',
			role: 'admin'
		&rcub;,
		filip: &lcub;<span>filip</span>: &lcub;
			id: '12345678',
			firstName: 'Filip',
			lastName: 'Isakovic',
			role: 'user'
		&rcub;,
    <span>Marko</span>: &lcub;
			id: '12345678',
			firstName: 'Marko',
			lastName: 'Milutinovic',
			role: 'visitor'
		&rcub;,
	} as const;
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
    <p>
      Does <span>{firstName}</span> has {permission}? {hasPermission(
        users[firstName as keyof typeof users],
        permission,
      )}
    </p>
    <p><span>{firstName}</span></p>
    <input type="text" bind:value={firstName} placeholder="enter firstName" />
    <input
      type="text"
      bind:value={permission}
      placeholder="enter permission as action:object"
    />

    <select bind:value={selected_id}>
      {#each options as option}
        <option value={option.id}>{option.value}</option>
      {/each}
    </select>
    <p>
      Selected {JSON.stringify(selected)}
    </p>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .container {
    @include container(
      'Handling Permissions -- Web Dev Simplified',
      $head-color: lightgreen
    );
    height: 10rem;
    margin: 4rem 0 0 3rem;
    padding: 1rem;
  }
  select {
    width: max-content;
    padding: 3px 1.5rem;
    font-weight: bold;
  }
  pre {
    tab-size: 1rem;
    margin-top: 0;
  }
  p {
    font-size: 16px;
    // color: lightgreen;
    padding: 5px;
    margin: 0;
  }
  input {
    width: 7rem;
  }
  span {
    color: yellow;
  }
</style>
