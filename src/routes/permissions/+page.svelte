<script lang="ts">
  import { onMount } from 'svelte';
  import { hasPermission, actionResourceList } from './permissions';
  /* 
		we usually have value/text pairs for options but we can use 
		objects with more properties, though we still bindle pairs
		of value/text for presenting the options in a select box,
		but then, like here, we can use additional properties to set
		condition for selected option attribute, e.g. ADMIN
	*/
  type TRole = 'VISITOR' | 'USER' | 'ADMIN' | 'MODERATOR';
  type TOption = {
    id: number;
    year: number;
    roles: TRole[];
  };
  type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    roles: TRole[];
  };
  const nullUser = {
    id: -1,
    firstName: '',
    lastName: '',
    roles: [],
  };
  type TUsers = Record<string, TUser>;
  let blockDisabled = $state(true);
  let messageEl: HTMLSpanElement;

  let currentYear = $state(0);
  const currentYear_ = (): number => {
    return currentYear ?? 0;
  };
  const getOptionsFirstYear = (userId: number) => {
    return options.filter((opt) => opt.id === userId)[0]?.year as number;
  };
  const getRoles = (userId: number): TRole[] => {
    if (!messageEl) return [];
    const roles = new Set<string>();
    let curYear = currentYear_();
    if (curYear === 0) {
      // curYear = getOptionsFirstYear(userId);
      messageEl.innerHTML =
        "<span id='message' style='color:pink;'>Please select a year</span>";
    } else {
      messageEl.innerHTML =
        "<span id='message'>Permissions are issued per year, please select</span>";
    }
    for (const opt of options) {
      if (opt.id === userId && opt.year === curYear) {
        for (const role of opt.roles) roles.add(role);
      }
    }
    return [...roles] as TRole[];
  };
  let options: TOption[] = [
    // Matia
    { id: 31814560165, year: 2019, roles: ['VISITOR'] },
    { id: 31814560165, year: 2020, roles: ['USER', 'MODERATOR'] },
    { id: 31814560165, year: 2021, roles: ['ADMIN'] },
    { id: 63811846353, year: 2018, roles: ['VISITOR'] },
    // Filip
    { id: 63811846353, year: 2019, roles: ['VISITOR', 'USER'] },
    { id: 63811846353, year: 2020, roles: ['VISITOR', 'ADMIN'] },
    { id: 65031853491, year: 2023, roles: ['VISITOR', 'USER'] },
    // Marko
    { id: 65031853491, year: 2024, roles: ['VISITOR'] },
    { id: 65031853491, year: 2025, roles: ['VISITOR'] },
    // Mia
    { id: 301897108, year: 2022, roles: ['VISITOR'] },
    { id: 301897108, year: 2023, roles: ['VISITOR', 'USER'] },
    { id: 301897108, year: 2024, roles: ['VISITOR', 'USER', 'ADMIN'] },
  ];

  const users = {
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
      lastName: 'Milutinovic',
      roles: getRoles(65031853491),
    },
    Mia: {
      id: 301897108,
      firstName: 'Mia',
      lastName: 'Milutinovic',
      roles: getRoles(301897108),
    },
  } as const satisfies Record<keyof typeof users, TUser>;

  let selected_id = $state(2);
  const authorId = 12345678;
  // --------------------------------------------------------------
  let firstName = $state('');
  let firstNameId = () => {
    let fnId = ['', 0];
    for (const [key, value] of Object.entries(users as TUser[])) {
      if (key === firstName) {
        fnId = [value.firstName, value.id];
      }
    }
    return fnId;
  };
  let currentUser = $derived.by(() => {
    let cUser: TUser = nullUser;
    Object.entries(users as TUser[]).forEach(([_, user]) => {
      if (user.firstName === firstNameId()[0]) {
        cUser = user as TUser;
      }
    });
    const opts = options.filter((option) => option.id === cUser.id);
    cUser.roles = opts[0]?.roles as TRole[];
    return cUser;
  });
  let permission = $state('view:comments');
  let optionYears = $state<number[]>([]);
  let selectYearEl: HTMLSelectElement;

  const currentYearChanged = () => {
    const permissionBlock = document.querySelector(
      '.permission-block',
    ) as HTMLParagraphElement;
    if (permissionBlock) {
      permissionBlock.style.setProperty(
        'opacity',
        currentYear_() === 0 ? '0.4' : '1',
        'important',
      );
    }
  };
  $effect(() => {
    if (firstNameId()[0] === '') {
      return;
    }
    let years = [];
    for (const option of options) {
      if (option.id === firstNameId()[1]) {
        years.push(option.year);
      }
    }
    optionYears = years;
  });
  // type Users = { name: keyof typeof users; user: TUser };

  // const yUsers = users.map((user) => {
  //   user.roles = options.map((opt) => {
  //     if (opt.id === user.id) {
  //     }
  //   });
  // });
  // let selectedUser = $derived(options.find((o) => o.roles === ['ADMIN']));
  let selectedUser = $state<TUser | null>(nullUser);
  $effect(() => {
    if (!firstName) {
      selectedUser = nullUser;
      return;
    }
    const fName = (firstNameId()[0] as string)?.toLowerCase();
    const user = Object.values(users as TUser[]).filter(
      (u) => u.firstName.toLowerCase() === fName,
    )[0] as TUser;
    if (user !== nullUser) {
      user.roles = getRoles(user.id);
    }
    selectedUser = user ?? nullUser;
  });

  let thePermission = $derived(
    firstName
      ? hasPermission(users[firstName] as TUser, permission, authorId)
      : false,
  );
  const checkPermission = (event: MouseEvent) => {
    if (currentYear_() == 0) {
    }
    const target = event.target as HTMLSpanElement;
    const spans = target.parentElement?.children as HTMLCollection;
    // let k = 0;
    Object.entries(spans).forEach((span) => {
      let color = span[1] === target ? 'blue' : 'navy';
      (span[1] as HTMLSpanElement).style.setProperty(
        'background-color',
        color,
        'important',
      );
      // k++;
    });
    permission = (event.target as HTMLSpanElement)?.innerText;
  };
  let viewSpanButton: HTMLSpanElement;

  const clearSelectedPermission = () => {
    let spans = document.querySelector('.permission-block')?.children;

    for (let i = 0; i < spans.length; i++) {
      let color = i === 0 ? 'blue' : 'navy';
      (spans[i] as HTMLSpanElement).style.setProperty(
        'background-color',
        color,
        'important',
      );
      blockDisabled = true;
    }
    spans[0].click();
    // viewSpanButton.click();
  };
  onMount(() => {
    viewSpanButton = document.querySelector(
      '.permission-block',
    ) as HTMLSpanElement;
    let spans = viewSpanButton?.children as HTMLCollection;
    for (let i = 0; i < spans.length; i++) {
      (spans[i] as HTMLSpanElement).style.backgroundColor = 'navy';
    }
    messageEl = document.getElementById('message') as HTMLSpanElement;
    // viewSpanButton.click(); = document.getElementById(
    //   'viewSpanElement',
    // ) as HTMLSpanElement;
  });
</script>

<p>optionYears {optionYears} current user {currentUser?.firstName}</p>
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
			roles: ['admin']
		&rcub;,
		filip: &lcub;<span>filip</span>: &lcub;
			id: '63811846353',
			firstName: 'Filip',
			lastName: 'Isakovic',
			roles: ['user']
		&rcub;,
    <span>Marko</span>: &lcub;
			id: '65031853491',
			firstName: 'Marko',
			lastName: 'Milutinovic',
			roles: ['visitor']
		&rcub;,
	&rcub; as const;
  So to access roles of the first user we use:
    users[item as keyof typeof users].roles
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
      <!-- {#if Object.keys(users).includes(firstName)} -->
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
      <!-- {:else}
        <p class="warning">Please select a User</p>
      {/if} -->
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
      <br />
      <select
        class="select-year"
        bind:this={selectYearEl}
        bind:value={currentYear}
        onchange={currentYearChanged}
      >
        <option value={0} selected>Select a Year</option>
        {#each optionYears as year}
          <option value={year}>{year}</option>
        {/each}
      </select><span id="message">
        Permissions are issued per year, please select
      </span>
    </div>
    <!-- <pre> -->
    <p
      onclick={checkPermission}
      aria-hidden={true}
      class="permission-block"
      svelte:style={{
        opacity: blockDisabled ? '0.4' : '1',
        cursor: blockDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span bind:this={viewSpanButton}> view:comments </span>
      <span> create:comments </span>
      <span> update:comments </span>
      <span> delete:comments </span>
    </p>
    <!-- </pre> -->
    <div style="margin-top:-2rem;">
      {#if selectedUser}
        <pre>
    
Permissions (click permission button below to check for that permission)
{JSON.stringify(selectedUser, null, 2)}
      </pre>
      {/if}
    </div>
  </div>
</div>
{#if hasPermission(currentUser, 'view:comments')}<button>view</button>{/if}
{#if hasPermission(currentUser, 'create:comments')}<button>create</button>{/if}
{#if hasPermission(currentUser, 'update:comments')}<button>update</button>{/if}
{#if hasPermission(currentUser, 'delete:comments')}<button>delete</button>{/if}

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
    margin: 1rem 0;
    display: flex;
    gap: 0;
    span {
      display: block !important;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 2px 0.5rem;
      cursor: pointer;
      color: white;
      /* big line-height to cover all area for mouse click to be detected
      as with small values click must be done over the text itself
      not outside text as padding make area bigger
    */
      height: 1.5rem !important;
      line-height: 1.35rem !important;
      background-color: navy !important;
      margin-top: 0;
      width: 7rem;
      test-align: center;
    }
    span:hover {
      color: yellow;
      font-weight: 700;
      cursor: pointer;
    }
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
  .select-year {
    display: inline-block;
    margin-right: 2rem;
  }
</style>
