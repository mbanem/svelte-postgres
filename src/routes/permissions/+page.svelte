<script lang="ts">
  import { onMount } from 'svelte';
  import { selectRoleResource, hasPermission } from './permissions';

  type TRole = 'VISITOR' | 'USER' | 'MODERATOR' | 'ADMIN';
  type TIdRoles = Record<number, TRole[]>;
  type TIdYearRoles = Record<number, TIdRoles>;
  type TUserNamesIds = Record<string, number>;
  type TUserName = keyof typeof userNamesIds;

  const userNamesIds: TUserNamesIds = {
    'Matia Isakovic': 31814560165,
    'Filip Isakovic': 63811846353,
    'Marko Milutinovic': 65031853491,
    'Mia Milutinovic': 301897108,
  };

  const idYearRoles: TIdYearRoles = {
    // Matia
    31814560165: {
      2019: ['VISITOR'],
      2020: ['USER', 'MODERATOR'],
      2021: ['ADMIN'],
      2018: ['VISITOR'],
    },
    // Filip
    63811846353: {
      2019: ['VISITOR', 'USER'],
      2020: ['VISITOR', 'ADMIN'],
      2023: ['VISITOR', 'USER'],
    },
    // Marko
    65031853491: { 2024: ['VISITOR'], 2025: ['VISITOR'] },
    // Mia
    301897108: {
      2022: ['VISITOR'],
      2023: ['VISITOR', 'USER'],
      2024: ['VISITOR', 'USER', 'ADMIN'],
    },
  };

  // function yearRoles(key: string | number): TIdRoles {
  //   if (typeof key === 'string') {
  //     const id = userNamesIds[key as TUserName]; // ✅ safe
  //     return idYearRoles[id as number] as TIdRoles;
  //   }
  //   return idYearRoles[key] as TIdRoles;
  // }
  function userIdFromName(key: string) {
    return userNamesIds[key] ?? -1;
  }
  function userYearRoles(key: string | number): TIdRoles {
    const id: number =
      typeof key === 'string'
        ? (userNamesIds[key as TUserName] as number)
        : key;
    return idYearRoles[id] as TIdRoles;
  }
  function userFirstYearRoles(key: string | number): TIdRoles {
    return Object.entries(userYearRoles(key))[0] as TIdRoles;
  }
  function userRolesOfYear(key: string | number, year: number): TRole[] {
    return (
      Object.entries(userYearRoles(key)).filter(
        (el) => el[0] === String(year),
      )[0] as TIdRoles
    )[1] as TRole[];
  }
  function getPermissionYears(id: number): number[] {
    const years: number[] = [];
    Object.entries(userIdYearsRoles).forEach((option) => {
      if (Number(option[0]) === id) {
        Object.entries(option[1]).forEach((yr) => years.push(Number(yr[0])));
      }
    });
    return years;
  }
  function setSelectedUser() {
    setTimeout(() => {
      const id = userNamesIds[userName as keyof typeof userNamesIds] as number;
      selectedUser = { id, userName, roles: userRolesOfYear(id, currentYear) };
      clearPermissionButtons(true);
    }, 500);
  }
  const resourcesList = ['comments', 'blogs', 'posts', 'users', 'addresses'];
  let selectResourceEl: HTMLSelectElement;
  let currentResource = 'comments'; //TODO see about this
  let initialResourceCall = true;
  const selectResourceChanged = () => {
    currentResource = selectResourceEl.options[selectResourceEl.selectedIndex]
      ?.value as string;
    selectRoleResource(currentResource);
    setTimeout(() => {
      clearPermissionButtons(true);
    }, 0);
    setSelectedUser();
  };
  type TUser = {
    id: number;
    userName: string;
    roles: TRole[];
  };
  const nullUser = {
    id: -1,
    userName: '',
    roles: [],
  };
  let blockDisabled = $state<boolean>(true);
  let messageEl: HTMLSpanElement;

  let currentYear = $state(0);
  const currentYear_ = (): number => {
    return currentYear ?? 0;
  };
  // TODO
  // const getOptionsFirstYear = (userId: number) => {
  //   return userIdYearsRoles.filter((opt) => opt.id === userId)[0]?.year as number;
  // };
  const getRoles = (userId: number): TRole[] => {
    if (!messageEl) return [];
    const roles = new Set<string>();
    let curYear = currentYear_();
    if (curYear === 0) {
      // curYear = getOptionsFirstYear(userId);
      messageEl.innerHTML =
        "<span id='message' style='color:pink;'>Please select a year</span>";
      // @ts-expect-error
      return [...userFirstYearRoles(userId)][1] as TRole[];
    } else {
      messageEl.innerHTML =
        "<span id='message'>Permissions are issued per year, please select</span>";
      return [...userRolesOfYear(userId, curYear)];
    }
  };

  type TOption = Record<number, Record<number, TRole[]>>;
  const userIdYearsRoles = {
    // Matia
    31814560165: {
      2019: ['VISITOR'],
      2020: ['USER', 'MODERATOR'],
      2021: ['ADMIN'],
      2018: ['VISITOR'],
    },
    // Filip
    63811846353: {
      2019: ['VISITOR', 'USER'],
      2020: ['VISITOR', 'ADMIN'],
      2023: ['VISITOR', 'USER'],
    },
    // Marko
    65031853491: { 2024: ['VISITOR'], 2025: ['VISITOR'] },
    // Mia
    301897108: {
      2022: ['VISITOR'],
      2023: ['VISITOR', 'USER'],
      2024: ['VISITOR', 'USER', 'ADMIN'],
    },
  } satisfies TOption;

  const index = (max: number): number => {
    return Math.ceil(Math.random() * 100) % max;
  };
  const getRandomUserNameId = (): [string, number] => {
    const unIds = Object.entries(userNamesIds);
    return unIds[index(unIds.length)] as [string, number];
  };
  const viewItem = (event: MouseEvent) => {
    (
      (event.target as HTMLParagraphElement).firstChild as HTMLSpanElement
    )?.classList.toggle('hidden');
  };
  const updateItem = (event: MouseEvent | KeyboardEvent) => {
    const style = (event.target as HTMLElement).style;
    style.color = style.color === 'blue' ? 'red' : 'blue';
  };
  const deleteItem = (event: MouseEvent | KeyboardEvent) => {
    (event.target as HTMLElement).remove();
  };
  const handlers = [viewItem, updateItem, deleteItem];
  const hover = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    if (event.type === 'mouseleave') return;

    const nodeList = document.querySelectorAll('.resource') as NodeList;
    Object.entries(nodeList).forEach((node) => {
      console.log(node[1]);
    });

    const child = (event.target as HTMLParagraphElement)
      .firstChild as HTMLSpanElement;
    child.classList;
  };
  // --------------------------------------------------------------
  let randomAuthorName = '';
  const getHandlersAndRandomAuthorId = () => {
    const userNameId = getRandomUserNameId();
    console.log(userNameId);
    randomAuthorName = `${userNameId[0]}`;
    return [...handlers, userNameId[1]];
  };

  const authorId = 12345678;
  // --------------------------------------------------------------
  let userName = $state('');
  const userName_ = () => {
    return userName;
  };
  // let idOfUserName = (name: string): number => {
  //   try {
  //     return userNamesIds[name as TUserName] as number;
  //   } catch (err) {
  //     return -1;
  //   }
  // };

  // let currentUser = $derived.by(() => {
  //   if (!userName_()) {
  //     return;
  //   }
  //   console.log('currentUser entry point');
  //   const id = userNamesIds[userName_() as TUserName] as number;
  //   console.log('id', id);

  //   const yearRoles = idYearRoles[id] as TIdRoles;
  //   console.log('yearRoles', yearRoles);

  //   return {
  //     id,
  //     userName: userName_(),
  //     roles: yearRoles[currentYear_()],
  //   } as TUser;
  //   // return {
  //   //   id: 31814560165,
  //   //   userName: 'Matia Isakovic',
  //   //   roles: ['USER', 'MODERATOR'],
  //   // } as TUser;
  // });
  let permission = $state('view:comments');
  let optionYears = $state<number[]>([]);
  let selectYearEl: HTMLSelectElement;

  const clearPermissionButtons = (selectTheFirst: boolean = false) => {
    const target = document.querySelector(
      '.permission-block',
    ) as HTMLSpanElement;
    const spans = target.children as HTMLCollection;
    for (let i = 0; i < spans.length; i++) {
      let color = selectTheFirst ? (i === 0 ? 'blue' : 'navy') : 'navy';
      (spans[i] as HTMLSpanElement).style.setProperty(
        'background-color',
        color,
        'important',
      );
    }
    if (selectTheFirst && spans[0]) {
      (spans[0] as HTMLSpanElement).click();
    }
  };
  const selectYearChanged = () => {
    const permissionBlock = document.querySelector(
      '.permission-block',
    ) as HTMLParagraphElement;
    if (permissionBlock) {
      // clearPermissionButtons(true); // select the first
      permissionBlock.style.setProperty(
        'opacity',
        currentYear_() === 0 ? '0.4' : '1',
        'important',
      );
    }
    setSelectedUser();
  };
  $effect(() => {
    if (!userName) return;
    const id = userIdFromName(userName);
    if (id === -1) {
      return;
    }
    optionYears = getPermissionYears(id);
  });

  let selectedUser = $state<TUser | null>(nullUser);
  let thePermission = $derived(
    userName
      ? hasPermission(selectedUser as TUser, permission, authorId)
      : false,
  );
  const checkPermission = (event: MouseEvent) => {
    event.preventDefault();
    if (currentYear_() == 0) {
    }
    clearPermissionButtons();
    const el = event.target as HTMLSpanElement;
    el.style.setProperty('background-color', 'blue', 'important');
    permission = el?.innerText;
  };
  let viewSpanButton: HTMLSpanElement;

  // ------------------------------------------------------
  const selectUserChanged = () => {
    blockDisabled = true;
    console.log('selectUserChanged', userName);
    setTimeout(() => {
      // select box
      if (selectYearEl && selectYearEl.options) {
        selectYearEl.selectedIndex = 1;
        currentYear = Number(
          selectYearEl.options[selectYearEl.selectedIndex]?.value,
        );
      }
    }, 0);
    if (!selectResourceEl || !selectResourceEl.options) return;
    if (initialResourceCall) {
      initialResourceCall = false;
      selectRoleResource('comments');
    }
    // currentResource = 'comments';
    setTimeout(() => {
      selectResourceEl.selectedIndex = 1;
      currentResource = selectResourceEl.options[selectResourceEl.selectedIndex]
        ?.value as string;
    }, 200);

    setTimeout(() => {
      let spans = document.querySelector('.permission-block')
        ?.children as HTMLCollection;
      // clearPermissionButtons();
      (spans[0] as HTMLSpanElement).click();
    }, 300);

    setSelectedUser();
    // viewSpanButton.click();
  };
  const resourceOnHover = (event: MouseEvent) => {
    event.preventDefault();
    const el = event.target;
    console.log('hovered', el);
  };
  onMount(() => {
    selectYearEl = document.querySelector('.select-year') as HTMLSelectElement;
    selectResourceEl = document.querySelector(
      '.select-resource',
    ) as HTMLSelectElement;
    viewSpanButton = document.querySelector(
      '.permission-block',
    ) as HTMLSpanElement;
    let spans = viewSpanButton?.children as HTMLCollection;
    for (let i = 0; i < spans.length; i++) {
      (spans[i] as HTMLSpanElement).style.backgroundColor = 'navy';
    }
    let vudIn: any[] = [];
    messageEl = document.getElementById('message') as HTMLSpanElement;
    // viewSpanButton.click(); = document.getElementById(
    //   'viewSpanElement',
    // ) as HTMLSpanElement;
  });
</script>

<!-- <p>blockDisabled {blockDisabled}</p> -->
<p>selectedUser {JSON.stringify(selectedUser)} userName {userName}</p>
<div class="wrapper">
  <div>
    <pre>
  Users are defined as:
  const users = &lcub;
		<span>matia</span>: &lcub;
			id: 31814560165,
			userName: 'Matia Isakovic',
			roles: ['admin']
		&rcub;,
		filip: &lcub;<span>filip</span>: &lcub;
			id: '63811846353',
			userName: 'Filip Isakovic',
			roles: ['user']
		&rcub;,
    <span>Marko</span>: &lcub;
			id: '65031853491',
			userName: 'Marko Milutinovic',
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
  has big impact on &lt;input type="text" bind:value=&lcub;userName&rcub; placeholder="enter userName" /&gt;
  as <i>keyof typeof users</i> is <span>"filip" | "Marko" | "matia"</span
      > and only those strings are acceptable 
  no matter what string we enter in the input box 
    </pre>
  </div>
  <div class="container">
    <div>
      <!-- {#if Object.keys(users).includes(userName)} -->
      <p class="user-permission-line">
        Does <span>{userName}</span> has permission for
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
      <select
        bind:value={userName}
        onchange={selectUserChanged}
        class="select-user"
      >
        <option value="">Select a User</option>
        {#each Object.entries(userNamesIds) as [k, _]}
          <option value={k}>{k}</option>
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
        bind:value={currentYear}
        onchange={selectYearChanged}
      >
        <option value={0} selected>Select a Year</option>
        {#each optionYears as year}
          <option value={year}>{year}</option>
        {/each}
      </select><span id="message">
        Permissions are issued per year, please select
      </span>
      <br /><br />
      <select
        class="select-resource"
        bind:this={selectResourceEl}
        bind:value={currentResource}
        onchange={selectResourceChanged}
      >
        <option value="0" selected>Protected Resources</option>
        {#each resourcesList as resource}
          <option value={resource}>{resource.toUpperCase()}</option>
        {/each}
      </select><span id="message-resource">
        Permissions are issued per resource, please select
      </span>
    </div>
    <p onclick={checkPermission} aria-hidden={true} class="permission-block">
      <span class:disabled={blockDisabled} bind:this={viewSpanButton}>
        view:{currentResource}
      </span>
      <span class:disabled={blockDisabled}> create:{currentResource} </span>
      <span class:disabled={blockDisabled}> update:{currentResource} </span>
      <span class:disabled={blockDisabled}> delete:{currentResource} </span>
    </p>
    <div style="margin-top:-2rem;">
      {#if selectedUser}
        <pre>
    
Permissions (click permission button below to check for that permission)
{JSON.stringify(selectedUser, null, 2)}
      </pre>
      {/if}
    </div>
    <div class="resources-container" class:hidden={blockDisabled}>
      {#each [...Array(5).keys()] as num}
        <div
          class="resource"
          data-author-id={getHandlersAndRandomAuthorId()[3]}
          onmouseenter={hover}
          onmouseleave={hover}
          aria-hidden={true}
        >
          This is a protected resource
          <button onclick={viewItem}>view</button>
          <button onclick={updateItem}>update</button>
          <button onclick={deleteItem}>delete</button>
          <p class="hidden">
            Resource belongs to {randomAuthorName}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- {#if hasPermission(selectedUser, 'view:comments')}<button>view</button>{/if}
{#if hasPermission(selectedUser, 'create:comments')}<button>create</button>{/if}
{#if hasPermission(selectedUser, 'update:comments')}<button>update</button>{/if}
{#if hasPermission(selectedUser, 'delete:comments')}<button>delete</button>{/if} -->

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
    height: 32rem;
    margin: 1rem 0 0 3rem;
  }
  .resources-container {
    /* cuts the caption
    @include container(
      'Resources Protected by Author id',
      $head-color: skyblue
    );
    */
    height: 10rem;
    width: max-content;
    margin: 1em 0 0 1rem !important;
    padding: 1rem;
    border: 1px solid gray;
    border-radius: 8px;
    overflow-y: auto;
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
    gap: 0.3rem;
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
      width: 7.5rem;
      text-align: center;
    }
    span:hover:not(disabled) {
      color: yellow;
      font-weight: 700;
      cursor: pointer;
    }
  }
  .permission-block span {
    flex: 1; // spans fill the available width
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
  .select-user,
  .select-year,
  .select-resource {
    display: inline-block;
    margin-right: 2rem !important;
    width: 16rem;
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .hidden {
    display: none;
  }
  .resource {
    padding: 5px 0;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 3px 0.5rem;
    width: 20rem;
    &:hover {
      color: yellow;
      border-color: gray;
    }
    button {
      width: 2.7rem;
      padding: 1px;
      margin-right: 2px;
      text-align: center;
      display: none;
    }
  }
</style>
