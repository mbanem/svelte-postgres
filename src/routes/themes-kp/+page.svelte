<script lang="ts">
  import './style.scss';
  // import type { ChangeEvent } from 'svelte/elements'; // from Grok /X Import ChangeEvent type
  import { setCSSValue } from '$lib/utils';
  const setBackgroundColor = (
    event: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) => {
    const el = event?.target as HTMLSelectElement;
    // console.log(el.value);
    if (el.value === '☀️') {
      setCSSValue('--BODY-BACKGROUND-COLOR', '#e3e3e3');
    } else {
      setCSSValue('--BODY-BACKGROUND-COLOR', '#3e3e3e');
    }
  };
</script>

<form class="color-picker">
  <fieldset>
    <select name="theme" id="theme" onchange={setBackgroundColor}>
      <option value="💻">System</option>
      <option value="☀️">Light</option>
      <option value="🌑">Dark</option>
    </select>
  </fieldset>
</form>

<main>
  <div class="wrapper">
    <p style="color:green;">Did not work in Firefox on June 26 2025</p>
    <h1>Color theme's the easy way</h1>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati natus
      error quam suscipit architecto enim nobis vero eaque. Repudiandae quisquam
      impedit fugiat neque delectus doloremque!
    </p>
    <p>
      Rem neque inventore necessitatibus totam incidunt eius reprehenderit quis
      ipsam officia praesentium, quod vero soluta maxime iure nobis dolorum a
      quibusdam officiis ratione debitis? Ipsam.
    </p>
    <h2>Something interesting</h2>
    <div class="auto-grid">
      <div class="card">
        <h3 class="card__title">A medium-length title</h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus,
          atque.
        </p>
      </div>
      <div class="card">
        <h3 class="card__title">A short title</h3>
        <p>
          Voluptatem excepturi tempore quo recusandae sunt ullam earum optio
          cum?
        </p>
      </div>
      <div class="card">
        <h3 class="card__title">A medium-length title</h3>
        <p>
          Nam laudantium voluptas, tenetur repellendus numquam rem incidunt
          deleniti veritatis?
        </p>
      </div>
      <div class="card">
        <h3 class="card__title">A much longer title than the others</h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus,
          atque.
        </p>
      </div>
      <div class="card">
        <h3 class="card__title">A medium-legth title</h3>
        <p>
          Voluptatem excepturi tempore quo recusandae sunt ullam earum optio
          cum?
        </p>
      </div>
      <div class="card">
        <h3 class="card__title">A short title</h3>
        <p>
          Nam laudantium voluptas, tenetur repellendus numquam rem incidunt
          deleniti veritatis?
        </p>
      </div>
    </div>
    <p>
      Rerum, neque! Consequuntur obcaecati beatae dolorum, fuga itaque iusto
      dicta et corporis facere ea necessitatibus odit cum, voluptates harum,
      dolore maiores aliquid distinctio repellendus nesciunt!
    </p>
    <p>
      Unde dolor quod delectus obcaecati labore laboriosam optio sit eligendi.
      Excepturi explicabo quod obcaecati pariatur error, in, accusantium eum
      omnis repellat qui, aliquid magnam odit?
    </p>
  </div>
</main>
