<script lang="ts">
  const item = [
    'ONE',
    'TWO',
    'THREE',
    'FOUR',
    'FIVE',
    'SIX',
    'SEVEN',
    'EIGHT',
    'NINE',
  ];
  const colors = [
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'lightgreen',
    'Teal',
    'Thistle',
    'Violet',
    'SkyBlue',
  ];
</script>

<svelte:head>
  <title>Flex & Greed</title>
</svelte:head>
<div class="main">
  <div class="left-side">
    <div class="grid-wrapper">
      {#each [...9] as _, ix}
        <div class={`cell${ix + 1}`}>
          <div class="item">{item[ix]}</div>
          <div class="item item1">A</div>
          <div class="item item2">B</div>
        </div>
      {/each}
    </div>
    <div class="grid-wrapper2">
      {#each [...9] as _, ix}
        <div style={`background-color:${colors[ix]}`}>
          <div class="item x">{item[ix]}</div>
          <div class="x">
            <i
              class="fa fa-regular fa-lightbulb-o"
              style="font-size:30px;color:red"
            ></i>
          </div>
          <div class="x">
            <i class="fa fa-car" style="font-size:20px;color:goldenrod"></i>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="right-side">
    <pre>
The grid arranges every cell with different styling
- The cells in the first three rows generate three &lt;items&gt; of which the 
  first one having content ONE,TWO,...,NINE followed with cells of content A and B.
  The cells  css classes .item, .item&lt;N&gt; with A and B having classes item1,item2
- The last three rows replace A and B with fa-lightbulb and fa-car icons

The cells' css classes cell1...cell9 all using flex, gap of 4px, and gray border 
with radius 1rem
 - call1: flex direction: column, align-items: flex-start, .item:first-child
	</pre>
  </div>
</div>

<style lang="scss">
  .main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 90vw;
    margin: 4rem auto;
    .left-side,
    .right-side {
      border: 1px solid yellow;
      border-radius: 1rem;
      padding: 1rem;
    }
  }
  .item.x {
    background-color: navy;
  }
  .x {
    font-size: 18px;
    font-weight: 300;
    color: black;
  }
  .grid-wrapper,
  .grid-wrapper2 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-start;
    // grid-row: auto;
    border: 1px solid gray;
    border-radius: 1rem;
    width: 50vw;
    margin: 0 auto;
  }
  .grid-wrapper {
    // grid-template-rows: auto auto auto;
  }
  .grid-wrapper2 {
    border: 1px solid yellow;
  }
  .cell1,
  .cell2,
  .cell3,
  .cell4,
  .cell5,
  .cell6,
  .cell7,
  .cell8,
  .cell9 {
    display: flex;
    gap: 4px;
    border: 1px solid gray;
    border-radius: 1rem;
  }

  .cell1 {
    flex-direction: column;
    align-items: flex-start;
    background-color: cornsilk;
    .item:first-child {
      align-self: flex-end;
    }
    .item1 {
      align-self: flex-end;
    }
    .item2 {
      align-self: center;
    }
  }
  .cell2 {
    grid-row: 2/3;
    grid-column: 1/2;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    place-items: center;
    background-color: SeaGreen;
  }
  .cell3 {
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .cell4 {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    background-color: red;
    .item2 {
      flex-grow: 1;
    }
  }
  .cell5 {
    grid-row: 1/2;
    grid-column: 2/3;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: burlywood;
  }
  .cell6 {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .cell7 {
    flex-direction: row;
    justify-content: space-around;
    align-items: baseline;
    .item1 {
      flex-grow: 1;
      font-size: 16px;
    }
  }
  .cell8 {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    .item2 {
      font-size: 16px;
    }
  }
  .cell9 {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
  }
  .item {
    @include rectangle($width: 50px, $height: 30px, $font-size: 14px);
  }
</style>
