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

  let fruits: Fruit[] = [
    { name: 'Apple', quantity: 130, price: 0.5 },
    { name: 'Banana', quantity: 400, price: 0.2 },
    { name: 'Cherry', quantity: 3000, price: 0.7 },
  ];

  let employees: Employee[] = [
    { id: 1, name: 'John Doe', role: 'Developer', salary: 75000 },
    { id: 2, name: 'Jane Smith', role: 'Designer', salary: 68000 },
    { id: 3, name: 'Marry Lue', role: 'Manager', salary: 85000 },
  ];
</script>

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
    {#each data as fruit}
      <p class="fruit-item">{fruit.name}</p>
      <p class="fruit-item">{(fruit as Fruit).quantity}</p>
      <p class="fruit-item">{(fruit as Fruit).price}</p>
    {/each}
  {/snippet}
</DynamicTable>
<p style="margin: 2rem 0 0 0; padding:0;">
  we render two dynamic table components: Fruit and Employees
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
<pre>
Not able to define the type for row(item) &lcub; @render row(item) &rcub; though the item accepts
only Fruit | Employee but no avail... Could no make first grid data row margin-top: 1px solid gray;
buy margin-bottom is OK as the row separator line.
</pre>
<pre>
The problem with DynamicTable.svelte component is that it uses th same variables for props, which have
different values for different component instances. So, when we render several instances the props from
the latest one overwrite the values already rendered in the previous components and so all components
ended up with the same props as sent for the latest component.
We managed tables by giving them different names and defined different url variables for $Props() for
different dynamic tables.
</pre>

<style lang="scss">
  .fruit-item,
  .emp-item {
    color: lightgreen;
    border-bottom: 1px solid gray;
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
