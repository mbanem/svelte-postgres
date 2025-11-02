<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task, PROPS } from './types';

  let { tasks, toggleDone, removeTask }: PROPS = $props();
</script>

<!-- <p>task-list.svelte tasks {JSON.stringify(tasks, null, 2)}</p> -->
<section>
  {#each tasks as task}
    <article class="task" transition:fade>
      <label for="u">
        <input
          id="u"
          checked={task.done}
          onchange={() => toggleDone(task)}
          type="checkbox"
        />
        <span class:done={task.done}>{task.title}</span>
      </label>
      <button onclick={() => removeTask(task.id)} class="outline">Remove</button
      >
    </article>
  {/each}
</section>

<style>
  .done {
    text-decoration: line-through;
  }

  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
