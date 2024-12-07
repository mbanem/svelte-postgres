<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Header from './Header.svelte';
  import InputBox from '$lib/components/InputBox.svelte';
  import Tree from './recursive-snippet-tree.svelte';
  import SnippetTable from './snippet/snippet-table.svelte';

  let elInputBox: any;
  const Ids = ['firstName', 'lastName', 'birthday', 'color', 'end'] as const; // read-only array
  type TId = (typeof Ids)[number]; // literal type "color" | "firstName" | "lastName" | "birthday"

  type TQuestion = {
    id: string;
    question: string;
    type: string;
  };
  type TRecord = Record<TId, string>;
  type TState = {
    answers: TRecord;
    step: number;
    error: string;
  };
  let formState = $state<TState>({
    answers: {}, // NOTE: how to put initial value form Record<TId, string>
    step: 0,
    error: '',
  });

  let serFocus: () => void;
  // $inspect(formState.step);

  const QUESTIONS = [
    {
      id: 'firstName',
      question: 'First Name?',
      type: 'text',
    },
    {
      id: 'lastName',
      question: 'Last Name?',
      type: 'text',
    },
    {
      id: 'birthday',
      question: 'Birthday',
      type: 'date',
    },
    {
      id: 'color',
      question: 'Favorite color',
      type: 'color',
    },
    {
      id: 'end',
      question: '',
      type: '',
    },
  ];

  const nextStep = (id: TId) => {
    if (id === 'end') {
      userDetailsContainer.innerHTML = '';
      formState.answers = {};
      formState.step = 0;
    }
    if (formState.answers[id as TId]) {
      formState.step += 1;
      formState.error = '';
    } else {
      formState.error = 'Please fill out the form input';
    }
  };
  const setActive = () => {
    if (formState.step < 2) {
      elInputBox.setFocus();
    } else if (formState.step) {
      try {
        elInputBox.setFocus();
        elInputBox.click();
      } finally {
      }
    }
  };
  let userDetailsContainer: HTMLDivElement;
  let buttonNext: HTMLButtonElement;
  const onButtonNext = () => {
    buttonNext.click();
  };
  onMount(() => {
    userDetailsContainer = document.querySelector(
      '.form-answers-container',
    ) as HTMLDivElement;
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
        break;
    }
  });
</script>

{#snippet formStep({
  id,
  type,
}: {
  type: string;
  id: string;
  question: string;
})}
  <article>
    <div>
      <label for={id}></label>
      {#if type == 'text'}
        <div class="inputbox-wrapper">
          <InputBox
            title={id}
            bind:this={elInputBox}
            bind:value={formState.answers[id as TId]}
            {onButtonNext}
          ></InputBox>
        </div>
      {:else}
        <input
          {type}
          {id}
          bind:this={elInputBox}
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
      {#if formState.step >= QUESTIONS.length}
        <p>Form is completed</p>
      {/if}
    </div>
    {#each QUESTIONS as question, index (question.id)}
      {#if formState.step === index}
        <div
          class="item"
          in:fly={{ x: 200, y: 0, duration: 1000, opacity: 0, delay: 300 }}
          out:fly={{ x: -500, y: 0, duration: 800, opacity: 0 }}
          onoutroend={setActive}
        >
          {@render formStep(question)}
        </div>
      {/if}
    {/each}

    <div>
      <button
        bind:this={buttonNext}
        class="button-next"
        onclick={() =>
          nextStep((QUESTIONS[formState.step] as TQuestion).id as TId)}
        >Next</button
      >
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
      height: 21.5rem;
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
