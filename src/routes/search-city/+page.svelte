<script>
  import InputBox from '$lib/components/InputBox.svelte';
  import * as utils from '$lib/utils';
  let search = $state('');
  // when the search is a capital city name
  let urlCC = $derived(`https://restcountries.com/v3.1/capital/${search}`);
  // when a search is a state name
  let urlSN = $derived(`https://restcountries.com/v3.1/name/${search}`);

  const resultsCC = $derived.by(async () => {
    if (search === '') return;
    const res = await fetch(urlCC);
    const city = await res.json();
    return city;
    // return city.length === 1 ? city : [];
  });
  const resultsSN = $derived.by(async () => {
    if (search === '') return;
    const res = await fetch(urlSN);
    const state = res.json();
    return state;
    // return state.length === 1 ? state : [];
  });
  // const cc_ = () => {
  //   return resultsCC;
  // };
  // const sn_ = () => {
  //   return resultsSN;
  // };
  // console.log(sn_());
</script>

<!-- <p>{urlSN}</p> -->
<div class="wrapper">
  <div>
    <svelte:boundary>
      {#snippet pending()}
        <p>loading...</p>
      {/snippet}
      <!-- <input bind:value={search} /> -->
      <p>Enter city or state name</p>
      <InputBox
        title="City or State Name"
        bind:value={search}
        capitalize={true}
        exportValueOn="keypress|blur"
        margin="0"
      ></InputBox>
      <ul>
        {#await resultsCC}
          <!-- <p>fetching...</p> -->
        {:then resultsCC}
          {#if resultsCC.length === 1}
            {#each resultsCC as result}
              {@const eq =
                result.capital[0].toLowerCase() === search.toLowerCase()}
              {@const city = eq
                ? `<span style='font-size: 20px;color: pink;'>${result.capital[0]}</span>`
                : ''}
              {#if eq}
                <p class="title">
                  {result.flag} &nbsp; {@html city}
                  {result.name.common}
                </p>
                <ul>
                  <li>
                    <a href={result.maps.googleMaps} target="blank_"
                      >Google {result.name.common} Maps</a
                    >
                  </li>
                  <li>
                    <a href={result.maps.openStreetMaps} target="blank_"
                      >Open {result.name.common} Street Maps
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://www.google.com/maps/place/${search}`}
                      target="blank_">{search} Streets Map</a
                    >
                  </li>
                </ul>
              {/if}
            {/each}
          {/if}
        {:catch err}
          <p>error {err.message}</p>
        {/await}

        {#await resultsSN}
          <!-- <p>fetching...</p> -->
        {:then resultsSN}
          {#if resultsSN.length === 1}
            {#each resultsSN as result}
              {@const eq =
                result.name.common.toLowerCase() === search.toLowerCase()}
              {#if eq}
                <p class="title">
                  {result.flag}
                  {result.name.common}
                </p>
                <p class="capital-city">
                  Capital city
                  <span class="city-name">
                    {result.capital[0]}
                  </span>
                </p>
                <ul>
                  <li>
                    <a href={result.maps.googleMaps} target="blank_"
                      >Google {result.name.common} Maps</a
                    >
                  </li>
                  <li>
                    <a href={result.maps.openStreetMaps} target="blank_"
                      >Open {result.name.common} Street Maps
                    </a>
                  </li>
                </ul>
              {/if}
            {/each}
          {/if}
        {:catch err}
          <p>error {err.message}</p>
        {/await}
      </ul>
    </svelte:boundary>
  </div>
  <div>
    <pre>
The script should be organized better by merging City and state
searches using mostly one snippet. The problem is that searches
for /name and /capital return the same structure when the specified 
state or capital refer to the same state so we cannot distinguish
what user is searching for just based on the input name.
  </pre>
  </div>
</div>

<style lang="scss">
  .wrapper {
    // margin-left: 10rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 80vw;
    margin-right: auto;
  }
  .title {
    color: skyblue;
    font-size: 20px;
  }
  .capital-city {
    margin-left: 1rem;
    color: #e3e3e3;
    display: inline-block;
    font-style: italic;
  }
  .city-name {
    font-size: 20px;
    color: pink;
    display: inline-block;
  }
</style>
