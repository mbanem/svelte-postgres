<!--
@component
-->

<script lang="ts">
</script>

<svelte:head>
  <title>Detail Summary</title>
</svelte:head>
<main class="main">
  <pre>
  Detail-Summary
    Is convenient space conservation element that show a short summary header of
    the bigger article expanded and displayed when clicking on the summary header
  </pre>
  <section>
    <div>
      <details>
        <summary> Lorem ipsum dolor sit amet. </summary>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et vel
          itaque tenetur asperiores incidunt nisi. Rerum ratione tempore numquam
          consequatur quis maxime adipisci consequuntur commodi repellendus
          dolorum accusamus ipsam esse ea suscipit quo, molestias iusto in
          corporis ducimus magnam ullam tempora? Excepturi beatae et ullam neque
          eveniet modi eos provident ipsum, assumenda consectetur quos
          praesentium minima aut architecto fugiat id delectus voluptatum
          veritatis molestiae quasi ab vero exercitationem dolores maxime.
          Aspernatur, optio! Repellat consectetur voluptatum voluptatem
          exercitationem odit eveniet accusantium, perferendis doloremque
          reprehenderit libero odio, autem atque molestias a et necessitatibus
          quam esse obcaecati ad aliquam? Fuga veniam totam ab!
        </p>
      </details>
      <details>
        <summary> Soluta minima asperiores enim quam tempore ab! </summary>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit ex
          aperiam reiciendis eaque sunt modi repellat quisquam accusantium
          reprehenderit numquam voluptate id perspiciatis a cumque hic nihil
          consectetur amet rerum magni voluptatem commodi provident, autem
          ratione soluta. Tenetur beatae itaque consectetur est error tempora
          repellendus, nobis excepturi consequuntur facilis dolorum quasi labore
          voluptates dolores quos eaque accusamus quae perspiciatis laborum.
          Debitis qui officia nam, iure soluta accusantium itaque sequi
          repudiandae commodi nemo voluptatum ullam repellat architecto, porro
          omnis. Libero commodi numquam eaque consequuntur. Quisquam, aut nobis,
          ea labore quo aliquam vitae assumenda nostrum sed vel animi aperiam
          ducimus laborum! Numquam aliquam repellat possimus, suscipit nihil
          culpa. Ex doloribus laboriosam sit similique provident in explicabo!
          Doloremque perspiciatis distinctio omnis reiciendis quidem quisquam
          temporibus eos, doloribus quam perferendis reprehenderit, labore nemo
          velit at delectus ducimus ullam consequuntur debitis a libero amet
          fuga. Tempore, laboriosam totam fuga magnam eos nulla aut ab quibusdam
          ipsa, eligendi magni consequatur rem dignissimos pariatur quasi autem
          qui voluptatum distinctio, recusandae modi incidunt. Animi recusandae
          expedita enim deserunt magni officiis impedit commodi labore? Animi,
          porro provident quam odit dolorem quos esse enim at temporibus
          quisquam id doloremque dicta repellendus illo natus fugiat, voluptates
          adipisci voluptatum tenetur eius! Eaque aliquam ducimus, et
          exercitationem dignissimos temporibus asperiores facere, eligendi
          dolor qui quam accusantium, vel pariatur sequi! Rem corporis id magni
          ad commodi cum amet, deleniti esse error dolores debitis ducimus
          omnis? Aperiam quis ab sit sed, adipisci autem deserunt consequuntur
          voluptates voluptatum similique corrupti nam inventore facere earum
          quia, culpa soluta ut suscipit beatae cumque! Voluptas obcaecati
          pariatur laborum aspernatur iste eaque distinctio? Assumenda, dolor
          totam voluptatum, adipisci in at aliquam necessitatibus unde eveniet
          modi cupiditate? Fugit suscipit dolor aut ratione commodi laborum
          porro repellat. Voluptatum itaque eaque, quae aspernatur,
          necessitatibus repellat minima dicta quaerat, alias tenetur maiores
          libero consequuntur?
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
    cursor: pointer;
  }
  /* despite working in youtube demo https://www.youtube.com/watch?v=Vzj3jSUbMtI&t=36s
  it does not work 
  */
  details::details-content {
    // font-size: 2rem;
    background: skyblue;
    cursor: pointer;
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
