<script lang="ts">
  import InputBox from '$components/InputBox.svelte';
  let newTaskTitle = $state<string>('');
  let {
    addTask,
  }: {
    addTask: (newTaskTitle: string) => void;
  } = $props();

  function formSubmitted(e: SubmitEvent) {
    e.preventDefault();
    addTask(newTaskTitle);
    newTaskTitle = '';
  }
  const inputBoxProps = {
    title: 'New Task',
    width: '48.5rem',
    height: '2.5rem',
    fontsize: '16px',
  };
</script>

<form onsubmit={formSubmitted}>
  <label>
    <InputBox
      id="s1"
      {...inputBoxProps}
      bind:value={newTaskTitle}
      capitalize={true}
      exportValueOn="keypress"
    ></InputBox>
  </label>
  <div class="button-container">
    <button>Add</button>
  </div>
</form>

<style>
  form {
    margin-bottom: 1rem;
  }
  .button-container {
    display: flex;
    justify-content: end;
    margin-top: 6px;
  }
  /* input {
    width: 46.3rem;
    margin-left: 1rem;
    height: 1.5rem;
    line-height: 1.5rem;
    color: black;
    font-size: 18px;
    padding-left: 1rem;
  } */
</style>
