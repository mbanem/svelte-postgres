<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Header from './Header.svelte';
  import InputBox from '$lib/components/InputBox.svelte';
  import Tree from './recursive-snippet-tree.svelte';
  import SnippetTable from './snippet/snippet-table.svelte';
  import * as utils from '$utils';

  // cannot define the type of inputEl
  let inputEl: any;
  const Ids = ['firstName', 'lastName', 'birthday', 'color'] as const; // read-only array
  type TId = (typeof Ids)[number]; // literal type "color" | "firstName" | "lastName" | "birthday"

  type Labels = {
    id: string;
    label: string;
    type: string;
  };
  type TRecord = Record<TId, string>;
  type TState = {
    answers: TRecord;
    step: number;
    error: string;
  };

  let formState = $state<TState>({
    answers: {} as TRecord,
    step: 0,
    error: '',
  });

  let serFocus: () => void;
  // $inspect(formState.step);

  const Fields = [
    {
      id: 'firstName',
      label: 'First Name?',
      type: 'text',
    },
    {
      id: 'lastName',
      label: 'Last Name?',
      type: 'text',
    },
    {
      id: 'birthday',
      label: 'Birthday',
      type: 'date',
    },
    {
      id: 'color',
      label: 'Favorite color',
      type: 'color',
    },
  ];

  const nextStep = (q?: Labels) => {
    if (buttonNext.innerText === 'reset') {
      buttonNext.innerText = 'Next';
    }
    if (!q) {
      formCompleted();
      return;
    }
    if (formState.answers[q?.id as TId]) {
      formState.step += 1;
      formState.error = '';
    } else {
      formState.error = 'Please fill out the form input';
    }
  };

  const formCompleted = () => {
    formState.step = 0;
    userDetailsContainer.innerHTML = '';
    formState.answers = {} as TRecord;
  };

  const setActive = () => {
    switch (formState.step) {
      case 0:
        console.log('step-0');
        inputEl.setFocus();
        break;
      case 1:
        console.log('step-1');
        inputEl.setFocus();
        break;
      case 2:
        console.log('step-2');
        inputEl.focus();
        inputEl.value = '2005-03-03';
        // setTimeout(() => {
        //   utils.keyPress('Enter', inputEl);
        // }, 2000);
        setTimeout(() => {
          utils.keyPress('Tab', inputEl);
          // utils.keyPress('Enter', inputEl);
        }, 1000);
        break;
      case 3:
        console.log('step-3');
        // cannot make it
        inputEl.value = utils.randomColor();
        inputEl.showPicker();
        setTimeout(() => {
          utils.keyPress('Tab');
          utils.keyPress('Tab');
          utils.keyPress('Enter');
          inputEl.blur();
        }, 200);
        setTimeout(() => {
          inputEl.click();
        }, 2000);
        break;
      default:
        buttonNext.innerText = 'reset';
        setTimeout(() => {
          if (inputEl) {
            inputEl.setFocus();
          }
        }, 4000);
    }
  };

  let userDetailsContainer: HTMLDivElement;
  let buttonNext: HTMLButtonElement;
  const onButtonNext = () => {
    console.log(formState.step);
    buttonNext.click();
  };
  onMount(() => {
    userDetailsContainer = document.querySelector(
      '.form-answers-container',
    ) as HTMLDivElement;
    setTimeout(() => {
      inputEl.setFocus();
    }, 1000);
  });
  $effect(() => {
    switch (formState.step) {
      case 1:
        userDetailsContainer.innerHTML = `<p>First Name: ${formState.answers['firstName']}</p>`;
        break;
      case 2:
        userDetailsContainer.innerHTML += `<p>Last Name: ${formState.answers['lastName']}</p>`;
        break;
      case 3:
        userDetailsContainer.innerHTML += `<p>Birthday:  &nbsp;${formState.answers['birthday']}</p>`;
        break;
      case 4:
        const color = formState.answers['color'];
        userDetailsContainer.innerHTML += `<p style='color:${color}'>Favorite Color: ${color}</p>`;
        break;
      default:
        formCompleted();
        break;
    }
  });
  const closed = () => {
    buttonNext.click();
  };
  let btnOpen: HTMLButtonElement;
</script>

{#snippet formStep({ id, type }: { type: string; id: string; label: string })}
  <article>
    <div>
      <label for={id}></label>
      {#if type == 'text'}
        <div class="inputbox-wrapper">
          <InputBox
            title={id}
            bind:this={inputEl}
            bind:value={formState.answers[id as TId]}
            {onButtonNext}
          ></InputBox>
        </div>
      {:else}
        <input
          {type}
          {id}
          onchange={closed}
          bind:this={inputEl}
          bind:value={formState.answers[id as TId]}
        />
      {/if}
    </div>
  </article>
{/snippet}

<main>
  <div class="left-column">
    <div class="form-answers-container"></div>
    <div>
      {#if formState.step >= Fields.length}
        <p>Form is completed</p>
      {/if}
    </div>
    {#each Fields as label, index (label.id)}
      {#if formState.step === index}
        <div
          class="item"
          in:fly={{ x: 200, y: 0, duration: 1000, opacity: 0, delay: 300 }}
          out:fly={{ x: -500, y: 0, duration: 800, opacity: 0 }}
          onoutroend={setActive}
        >
          {@render formStep(label)}
        </div>
      {/if}
    {/each}

    <div>
      <button
        bind:this={buttonNext}
        class="button-next"
        onclick={() => nextStep(Fields[formState.step] as Labels)}
      >
        Next
      </button>
    </div>
    <div>
      {#if formState.error}
        <p class="error">{formState.error}</p>
      {/if}
    </div>
  </div>
  <div class="middle-column">
    <Header
      firstName={formState.answers.firstName}
      lastName={formState.answers.lastName}
      step={formState.step}
    ></Header>
  </div>
  <div class="right-column">
    <Tree></Tree>
  </div>
  <div>
    <SnippetTable></SnippetTable>
  </div>
</main>

<style lang="scss">
  .error {
    color: red;
  }
  main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1.5fr;
    width: 70vw;
    // margin-left: 15vw;
  }

  .item {
    position: absolute;
    top: 30px;
    left: 0;
    height: 2rem;
    margin: 8px 0 !important;
  }
  .left-column,
  .middle-column {
    width: 100%;
    padding: 1rem 2rem;
  }
  .left-column {
    position: relative;
    .form-answers-container {
      @include container(
        $head: 'User Details',
        $head-color: lightgreen,
        $border-radius: 5px
      );
      margin-bottom: 1rem;
      width: 19rem;
      height: 23.5rem;
    }
    .button-next {
      position: absolute;
      top: 20rem;
      left: 3rem;
    }
  }
  .inputbox-wrapper {
    position: absolute;
    top: 13rem;
    margin-left: 3rem;
  }
</style>
