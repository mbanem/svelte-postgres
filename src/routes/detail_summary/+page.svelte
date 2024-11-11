<!--
@component
-->

<script lang="ts">
</script>

<main class="main">
  <section>
    <div>
      <details>
        <summary> Lorem ipsum dolor sit amet. </summary>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam,
          odio?
        </p>
      </details>
      <details>
        <summary> Soluta minima asperiores enim quam tempore ab! </summary>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam est
          pariatur maxime sit voluptatibus a.
        </p>
      </details>
    </div>
  </section>
</main>

<style lang="scss">
  .main {
    margin: 3rem 0 0 1rem;
    border: 1px solid gray;
    border-radius: 10px;
    width: 60vw;
    margin: 5rem auto;
  }
  details * {
    margin: 0;
  }
  /* despite working in youtube demo https://www.youtube.com/watch?v=Vzj3jSUbMtI&t=36s
    it does not work 
  */
  details::details-content {
    // font-size: 2rem;
    background: skyblue;
  }
  details {
    background-color: hsl(0 0% 25%);
    border: 1px solid hsl(0 0% 30%);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    overflow: hidden;
  }
  details > p {
    opacity: 0;
    /* margin up and down */
    padding-block: 1rem;
    margin-left: 1rem;
  }
  details[open] p {
    animation: fadeIn 0.75s linear forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  summary {
    font-size: 1.5rem;
    color: hsl(0 0% 98%);
    margin-inline-start: 1rem;
    /* should be instead of margin-left in above details > p */
    list-style-position: outside;
  }
  /* color of the triangle marker */
  summary::marker {
    color: hsl(0 0% 60%);
  }
</style>
