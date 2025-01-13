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
    <div class="grid-wrapper">
      {#each [...9] as _, ix}
        <div class="flex-col" style={`background-color:${colors[ix]}`}>
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
The 3x6 grid arranges 9 cells in 3-row blocks with different adjustment style
- Every cell in the first 3-row block contain &lt;NUMBER&gt; item with content 
  ONE or TWO,... or NINE followed with two cells A and B: &lt;NUMBER&gt; A B.
- The last 3-row block replaces A and B with fa-lightbulb and fa-car icons

The cells' css classes cell1...cell9 all using flex, gap of 4px, and gray border 
with radius 1rem
- call1: flex direction: column, align-items: flex-start, .item:first-child

cell1: flex, direction: column, ONE & A align-self flex-end, B align-self center 
cell2: position: grid-row: 2/3, grid-column:1/2 green background
cell5: position: grid-row: 1/2; grid-column: 2/3 skyblue background
cell2 remove  cell4 to the next position (position5)
cell5 took cell3 position, so FIVE, TWO and FOUR are displaced from default flow

cell7 align-items: baseline, justify-content: flex-start
cell8 align-items: center, justify-content: flex-end, last item font-size: 30px
cell9 align-items: flex-end, justify-content: flex-start

last 3-row block 
    1st column: align-items: flex-start, justify-content: flex-start;
    2nd column: align-items: center, justify-content: flex-end;
    3rd column: align-items: flex-end, justify-content: center;
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
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-start;
    // grid-row: auto;
    border: 1px solid gray;
    border-radius: 1rem;
    width: 50vw;
    margin: 0 auto;
  }
  .cell {
    display: flex;
    gap: 4px;
    border: 1px solid gray;
    border-radius: 1rem;
  }
  @for $i from 1 through 9 {
    .cell#{$i} {
      @extend .cell;
    }
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
    height: 7rem;
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
    background-color: skyblue;
    height: 7rem;
  }
  .cell6 {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    height: 7rem;
  }
  .cell7 {
    flex-direction: row;
    justify-content: space-around;
    align-items: baseline;
    height: 6rem;
    .item1 {
      flex-grow: 1;
      font-size: 16px;
    }
  }
  .cell8 {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
    .item2 {
      font-size: 30px !important;
    }
  }
  .cell9 {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-end;
    height: 6rem;
  }
  .item {
    @include rectangle($width: 50px, $height: 30px, $font-size: 14px);
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    height: 9rem;
    &:nth-child(3n + 2) {
      align-items: center;
      justify-content: flex-end;
    }
    &:nth-child(3n + 3) {
      align-items: flex-end;
      justify-content: center;
    }
  }
</style>
