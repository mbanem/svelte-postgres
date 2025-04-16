<script lang="ts">
  import DynamicTable from './DynamicTable.svelte';
  type Fruit = {
    name: string;
    quantity: number;
    price: number;
  };

  type Employee = {
    id: number;
    name: string;
    role: string;
    salary: number;
  };
  type Data = Fruit | Employee;
  /* NOTE:  when we use both border-top and border-bottom for every row
    we get double border between successful rows so we can use only
    one of them, but if we use border-top then the last row has no
    border-bottom and when we set :last-child{border-bottom: 1px solid gray}
    it is ignored
    So work-around is to use border-top and add empty row {} in the list
*/
  let fruits: Fruit[] = [
    { name: 'Apple', quantity: 130, price: 0.5 },
    { name: 'Banana', quantity: 400, price: 0.2 },
    { name: 'Cherry', quantity: 3000, price: 0.7 },
    {},
  ];

  let employees: Employee[] = [
    { id: 1, name: 'John Doe', role: 'Developer', salary: 75000 },
    { id: 2, name: 'Jane Smith', role: 'Designer', salary: 68000 },
    { id: 3, name: 'Marry Lue', role: 'Manager', salary: 85000 },
    {},
  ];
</script>

<div style="top-left"><a href="/prop-class">Back</a></div>
<div class="grid-container">
  <div style="margin-top:1rem;">
    <DynamicTable
      data={fruits as Fruit[]}
      s_url="https://www.biographic.com/who-watches-the-watchers/?utm_source=firefox-newtab-en-us"
    >
      {#snippet header()}
        <p class="fruit-header">Fruit</p>
        <p class="fruit-header">Quantity</p>
        <p class="fruit-header">Price</p>
      {/snippet}

      {#snippet row(data: Data[])}
        {#each data as item}
          <p class="fruit-item">{item.name}</p>
          <p class="fruit-item">{(item as Fruit).quantity}</p>
          <p class="fruit-item">{(item as Fruit).price}</p>
        {/each}
      {/snippet}
    </DynamicTable>
  </div>

  <div>
    <p
      style="margin: 0 0 -2rem 0; padding:0;color:pink;font-size:19px;font-style:italic;"
    >
      We render two dynamic table components: Fruit and Employees
    </p>
    <DynamicTable
      data={employees as Employee[]}
      s_url="https://translate.google.com/#view=home&op=translate&sl=en&tl=sr"
    >
      {#snippet header()}
        <p class="emp-header">id</p>
        <p class="emp-header">name</p>
        <p class="emp-header">role</p>
        <p class="emp-header">salary</p>
      {/snippet}

      {#snippet row(data: Data[])}
        {#each data as emp}
          <p class="emp-item">{(emp as Employee).id}</p>
          <p class="emp-item">{(emp as Employee).name}</p>
          <p class="emp-item">{(emp as Employee).role}</p>
          <p class="emp-item">{(emp as Employee).salary}</p>
        {/each}
      {/snippet}
    </DynamicTable>
  </div>
  <div>
    <pre class="span-two-columns">
NOTE:  when we use both border-top and border-bottom for every row
we get double border between successful rows so we can use only
one of them, but if we use border-top then the last row has no
border-bottom and when we set :last-child &lcub;border-bottom: 1px solid gray&rcub;
it is ignored.
So work-around is to use border-top and add an empty row &lcub;&rcub; in the list

The problem with DynamicTable.svelte component is that it uses the same variables for props, which got
different prop values for different component instances. So, when we render several instances the props 
from the latest one overwrite the values already rendered in the previous components and so all components
ended up with the same props as sent for the latest component.
We managed tables by giving them different names and defined different url variables for $Props() for
different dynamic tables.
</pre>
  </div>
</div>

<style lang="scss">
  .grid-container {
    display: grid;
    grid-template-columns: 35vw 35vw;
    width: 78rem;
    margin: 0 auto;
  }
  .top-left {
    position: absolute;
    top: 3rem;
    left: 0;
  }
  .span-two-columns {
    grid-column: 2 / span 2;
    margin: 0 auto;
  }
  .fruit-item,
  .emp-item {
    color: lightgreen;
    border-top: 1px solid gray;
    height: 1.3rem; /* default turns height:0; */
  }

  .fruit-header,
  .emp-header {
    color: navy;
    font-size: 18px;
    background-color: skyblue;
    padding: 0 5px;
  }
</style>
