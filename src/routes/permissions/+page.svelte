<script lang="ts">
  import { number } from 'zod';
  import { hasPermission } from './permissions';
  /* 
		we usually have value/text pairs for options but we can use 
		objects with more properties, though we still bindle pairs
		of value/text for presenting the options in a select box,
		but then, like here, we can use additional properties to set
		condition for selected option attribute, e.g. ADMIN
	*/
  type TRole = 'VISITOR' | 'USER' | 'ADMIN';
  type Option = {
    id: number;
    year: number;
    role: TRole[];
  };

  let options: Option[] = [
    { id: 31814560165, year: 2018, role: ['ADMIN'] },
    { id: 31814560165, year: 2019, role: ['ADMIN'] },
    { id: 31814560165, year: 2020, role: ['ADMIN'] },
    { id: 63811846353, year: 2018, role: ['VISITOR', 'ADMIN'] },
    { id: 63811846353, year: 2019, role: ['VISITOR', 'ADMIN'] },
    { id: 63811846353, year: 2020, role: ['VISITOR', 'ADMIN'] },
    { id: 65031853491, year: 2023, role: ['VISITOR', 'USER'] },
    { id: 65031853491, year: 2024, role: ['VISITOR', 'USER'] },
    { id: 65031853491, year: 2025, role: ['VISITOR', 'USER'] },
    { id: 301897108, year: 2022, role: ['VISITOR', 'USER', 'ADMIN'] },
    { id: 301897108, year: 2023, role: ['VISITOR', 'USER', 'ADMIN'] },
    { id: 301897108, year: 2024, role: ['VISITOR', 'USER', 'ADMIN'] },
  ];

  let selected_id = $state(2);
  const authorId = 12345678;
  // --------------------------------------------------------------
  let firstName = $state('Filip');
  let permission = $state('view:comments');

  type YearRoles = Record<number, string[]>;
  type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    roles: TRole[];
  };

  // type Users = { name: keyof typeof users; user: TUser };

  const getRoles = (userId: number): TRole[] => {
    const roles = [];
    for (const opt of options) {
      if (opt.id === userId) {
        return opt.role;
      }
    }
    return [];
  };
  const users: Record<string, TUser> = {
    Matia: {
      id: 31814560165,
      firstName: 'Matia',
      lastName: 'Isakovic',
      roles: getRoles(31814560165),
    },
    Filip: {
      id: 63811846353,
      firstName: 'Filip',
      lastName: 'Isakovic',
      roles: getRoles(63811846353),
    },
    Marko: {
      id: 65031853491,
      firstName: 'Marko',
      lastName: 'MIlutinovic',
      roles: getRoles(65031853491),
    },
    Mia: {
      id: 301897108,
      firstName: 'Mia',
      lastName: 'MIlutinovic',
      roles: getRoles(301897108),
    },
  } as const;

  // const yUsers = users.map((user) => {
  //   user.roles = options.map((opt) => {
  //     if (opt.id === user.id) {
  //     }
  //   });
  // });
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
		<span>matia</span>: &lcub;
			id: 31814560165,
			firstName: 'Filip',
			lastName: 'Isakovic',
			role: 'admin'
		&rcub;,
		filip: &lcub;<span>filip</span>: &lcub;
			id: '63811846353',
			firstName: 'Filip',
			lastName: 'Isakovic',
			role: 'user'
		&rcub;,
    <span>Marko</span>: &lcub;
			id: '65031853491',
			firstName: 'Marko',
			lastName: 'Milutinovic',
			role: 'visitor'
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
    <pre><p
        onclick={checkPermission}
        aria-hidden={true}
        class="permission-block"
        style={`display:${firstName ? 'block' : 'none'}`}><span
          bind:this={viewSpanButton}
          style="background-color:blue">view:comments</span
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
    grid-template-columns: 1fr 1fr;
  }
  .container {
    @include container(
      'Handling Permissions -- Web Dev Simplified',
      $head-color: skyblue
    );
    height: 26rem;
    margin: 1rem 0 0 3rem;
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
        font-size: 1.3rem;
      }
    }
  }
</style>
