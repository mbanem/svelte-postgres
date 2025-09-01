<script lang="ts">
  import { getContext } from 'svelte';
  import { hasPermission } from './Permissions.svelte';
  import InputBox from '$components/InputBox.svelte';
  // import { onMount } from 'svelte';

  type TExportValueOn = 'keypress' | 'enter';
  /*  
		we usually have value/text pairs for options but we can use 
		objects with more properties, though we still bindle pairs
		of value/text for presenting the options in a select box,
		but then, like here, we can use additional properties to set
		condition for selected option attribute, e.g. ADMIN
	*/
  type TRole = 'VISITOR' | 'USER' | 'ADMIN' | 'MODERATOR';
  type Option = {
    id: number;
    value: string;
    role: TRole[];
  };

  let options: Option[] = [
    { id: 1684849, value: '2019', role: ['USER', 'MODERATOR'] },
    { id: 62877812, value: '2018', role: ['VISITOR'] },
    { id: 65487, value: '2023', role: ['VISITOR', 'USER'] },
    { id: 46565416, value: '2024', role: ['VISITOR', 'USER', 'ADMIN'] },
  ];

  let selected_id = $state('');
  const authorId = 46565416;
  // --------------------------------------------------------------
  let firstName = $state('');
  let permission = $state('view:comments');
  let viewSpanButton: HTMLSpanElement;

  type TUser = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  // type Users = { name: keyof typeof users; user: TUser };

  const users: Record<string, TUser> = {
    Matia: {
      id: '46565416',
      firstName: 'Matia',
      lastName: 'Isakovic',
      role: 'admin',
    },
    Filip: {
      id: '65487',
      firstName: 'Filip',
      lastName: 'Isakovic',
      role: 'user',
    },
    Marko: {
      id: '62877812',
      firstName: 'Marko',
      lastName: 'Milutinovic',
      role: 'visitor',
    },
    Mia: {
      id: '1684849',
      firstName: 'Mia',
      lastName: 'Milutinovic',
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
  let inputFirstName = $state('');
  // const firstNameOnChange = (event: KeyboardEvent) => {
  //   if (event.key !== 'Enter') return;
  //   inputFirstName =
  //     inputFirstName[0]?.toUpperCase() + inputFirstName.slice(1).toLowerCase();
  //   if (users[inputFirstName]) {
  //     firstName = (users[inputFirstName] as TUser).firstName;
  //   }
  // };
  // call InputBox function to set focus and value in <input box element
  let input_box: InputBox;
  let name_box: InputBox;
  // const setInputBoxValue: (_: string) => void = getContext('setInputBoxValue');
  const checkPermission = (event: MouseEvent) => {
    event.preventDefault();
    const span = event.target as HTMLSpanElement;
    const spans = span.parentNode?.childNodes;
    spans?.forEach((span) => {
      (span as HTMLSpanElement).style.backgroundColor = 'navy';
    });
    (span as HTMLSpanElement).style.backgroundColor = 'blue';
    permission = (event.target as HTMLSpanElement)?.innerText;
    // console.log('before setInputBoxValue');
    input_box.setInputBoxValue(permission);
  };

  const clearSelectedPermission = () => {
    // all span elements holding permissions (view:comments, create:comments...)
    // are children of element with class '.permission-block'
    let spans = document.querySelector('.permission-block')?.childNodes;
    spans?.forEach((span) => {
      // reset all spans (as buttons) to navy background
      (span as HTMLSpanElement).style.backgroundColor = 'navy';
    });
    // click on the first span to set it as selected when user name is changed
    viewSpanButton.click();
    name_box.setInputBoxValue(firstName);
  };

  // Ask <InputBox to call this function when input is ready.
  // When TExportValueOn is 'enter' it is called when InputBox
  // detects Enter key, while for 'keypress' it does no every keypress
  const onInputIsReadyCallback = () => {
    // console.log('onInputIsReadyCallback');
    viewSpanButton.click();
    permission = 'view:comments';
    setTimeout(() => {
      input_box.setFocus();
    }, 0);
  };
  // onMount(() => {
  //   // this will trigger <select box to show Marko Milutinovic
  //   firstName = 'Marko';
  // });

  // fired when input box for permission enters e.g. update:comments
  // program should highlight corresponding button which also can
  // select permission to see if user has such permission
  const selectPermissionButton = () => {
    let spans = document.querySelector('.permission-block')?.childNodes;
    spans?.forEach((span) => {
      const found = (span as HTMLSpanElement).innerText === permission;
      (span as HTMLSpanElement).style.backgroundColor = found ? 'blue' : 'navy';
    });
  };
</script>

<!-- <p>{firstName}</p> -->
<div class="wrapper">
  <div>
    <pre class="users-info">
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
  where item is either 'Filip','Matia', 'Marko' or 'Mia' taking care of case-sensitivity
  where item is either 'Filip','Matia', 'Marko' or 'Mia' taking care of case-sensitivity

  const ROLES = &lcub;
    admin: ['view:comments', 'create:comments', 'update:comments', 'delete:comments'],
    moderator: ['view:comments', 'create:comments', 'delete:comments'],
    user: ['view:comments', 'create:comments'],
    visitor: ['view:comments']
  &rcub; as const;
  NOTE: type Users = &lcub; name: keyof typeof users; user: TUser &rcub;
  has big impact on &lt;input type="text" bind:value=&lcub;firstName&rcub; placeholder="enter firstName" /&gt;
  as <i>keyof typeof users</i> is 
  <span>"Filip" | "Marko" | "Matia" | "Mia"</span>
  as <i>keyof typeof users</i> is <span
        >"Filip" | "Marko" | "Matia" | "Mia"</span
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
            {String(thePermission).toUpperCase()}
          </span>
        </p>
      {:else}
        <p class="select-user-info">
          Select a User by entering First Name or via select box Select a User
        </p>
      {/if}
      <div class="select-user-block">
        <InputBox
          bind:this={name_box}
          title="First Name"
          height="2rem"
          width="19rem"
          margin="10px 0 5px 0"
          bind:value={firstName}
          exportValueOn="enter|blur"
          capitalize={true}
          {onInputIsReadyCallback}
        ></InputBox>
        <select bind:value={firstName} onchange={clearSelectedPermission}>
          <option value="" style="color:navy;font-weight:400 !important;"
            >Select a User</option
          >
          {#each Object.entries(users) as [k, v]}
            <option value={k}>{v.firstName} {v.lastName}</option>
          {/each}
        </select>
      </div>
      <div class="select-user-block">
        <InputBox
          bind:this={input_box}
          title="Enter permission as action:comments to test"
          type="text"
          bind:value={permission}
          width="19rem"
          onInputIsReadyCallback={selectPermissionButton}
          exportValueOn="keypress"
        ></InputBox>
        <select bind:value={selected_id} style="margin-top:1.2rem;width:12rem;">
          <option value="" selected={true}>Select Year</option>
          {#each options as option}
            <option value={option.id}>{option.value}</option>
          {/each}
        </select>
      </div>
    </div>
    <pre style="margin:0; padding:0;">
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
    height: 28rem;
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
  // input {
  //   width: 12rem;
  //   background-color: #3e3e3e;
  // }
  span {
    color: yellow;
  }
  .has-permission {
    color: lightgreen;
  }
  .warning {
    color: pink;
    margin: 0;
    padding: 0;
  }
  .select-user-info {
    color: skyblue;
  }
  .json-block {
    margin: -3rem 0 0 -1rem;
    // pre {
    //   margin-left: -1rem;
    // }
  }
  .permission-block {
    margin: -1rem 0 0 -5px;
    span {
      display: inline-block;
      // height: 1.4rem;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 0 5px;
      cursor: pointer;
      color: white;
      /* big line-height to cover all area for mouse click to be detected
        as with small values click must be done over the text itself
        not outside text as padding make area bigger
      */
      line-height: 2rem;
      background-color: navy;
      margin-right: 2px;
    }
  }
  // .blue-background {
  //   background-color: blue;
  // }
  .user-permission-line {
    line-height: 2rem;
    span {
      font-size: 1.3rem;
      &:last-child {
        font-size: 1.6rem;
      }
    }
  }
  .users-info {
    font-size: 12px;
  }
  .select-user-block {
    display: flex;
    gap: 1rem;
    justify-content: baseline;
    align-items: baseline;
    font-weight: 400;
    select {
      height: 2rem;
      margin-top: 1rem;
      font-size: 16px;
      font-weight: 400 !important;
    }
  }
</style>
