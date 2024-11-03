<script lang="ts">
  import Bindable, { counter } from '$components/Bindable.svelte';
  import SummaryDetails from '$components/SummaryDetails.svelte';
  let count = 12; //$state(22);

  const click = () => {
    count++;
    //console.log('parent click increment count', count)
  };
  // child calls parent's function to update parent's count
  const clickArg = (delta: number, _?: MouseEvent) => {
    //console.log('parent clickArg ', delta)
    count = count + delta;
  };

  // ------------  parent to call child function to update its local childCount -------------

  let childComponent: typeof Bindable;

  // for parent to call child function it has to have reference to the
  // child component by binding this way <Child bind:this={childComponent}...
  // and child component have to export the function like
  //   export const counter = (delta: number) => (childCount += delta);
  // then calling child function 'counter' could be done like this:
  // 					childComponent.counter(value)
  // NOTE: Even if child VARIABLE is defined as 'export let childVar = 0' it cannot
  // be updated from parent via childComponent.childVar += 1
  // so only the exported functions can be used from parent to do that

  const getRandomInt = () => {
    return Math.round(Math.random() * 10000);
  };
  // cal child counter with random integer less then 10,000
  const callChildCounter = () => {
    counter(getRandomInt());
  };
  let details = `
	The Count variable is defined at parent as a let count = 22 with no $state(22) and <i>bound</i> as a prop to child as
	&lt;Bindable bind=&lcub;clickArg&rcub; so that
parent has access to it and could change it via button 'parent click'
It is accepted at child as a $bindable() count prop  as
	let &lcub; count = $bindable() &rcub; = $props()
so child can update parent's count with a button 'child click'
To update the count by arbitrary delta we define parent function clickArg(event:MouseEvent, delta:number)
and sent it to child component "Bindable" as the second prop &lcub;clickArg&rcub;
	&lt;Bindable bind:count  bind=&lcub;clickArg&rcub;
which is accepted at child as clickArg = $bindable() as of type Handler
	type Handler = (event: MouseEvent, delta: number) =&gt; void;
In child we set delta using input of type number and via  button 'update by delta = "delta"'
we call child local function 'updateParentCount' which in turn calls parent's clickArg(event,delta)
with child click event:MouseEvent and value of delta bound in &lt;input type='number' bind:value=&lcub;delta&rcub;
`;
</script>

<svelte:head>
  <title>Bindable</title>
</svelte:head>
<div>
  <p class="label-title">
    This is parent block with count managed by its bindable component.
  </p>

  <button onclick={click}>parent count {count} </button>
  <p style="display:inline-block">
    Parent count <span class="expression-highlighted">{count}</span>
  </p>
</div>

<SummaryDetails summary="How Does it Work" {details}></SummaryDetails>
<br />
<button style="margin-left:2rem;" onclick={callChildCounter}>
  parent call child counter to increment its count
</button>
<!-- NOTE: to use child function we export it from <script lang='ts' module>
	and import it along the component itself like
	import Comp, {func} from './ChildComponent.svelte'
	no more <ChildComponent bind:this={X}> and calling X.func()
-->
<Bindable bind:count {clickArg}></Bindable>

<style>
  button {
    display: inline-block;
  }
  .label-title {
    margin: 6px 0 0 2rem;
  }

  details * {
    margin: 0;
  }
  details {
    background-color: hsl(0 0% 25%);
    width: max-content;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    overflow: hidden;
  }
  details > pre {
    opacity: 0;
    /* margin up and down */
    padding-block: 1rem;
    margin-left: 1rem;
  }
  details[open] pre {
    animation: fadeIn 0.75s linear forwards;
  }
  pre {
    border: 1px solid hsl(0 0% 45%);
    border-radius: 10px;
    padding: 1rem;
    margin: 0.5rem 0 0 3rem !important;
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
    color: hsl(0 0% 85%);
    background-color: hsl(0 0% 35%);
    margin-inline-start: 1rem;
    /* should be instead of margin-left in above details > p */
    list-style-position: outside;
    margin-left: 3rem;
    cursor: pointer;
    width: max-content;
    padding: 2px 3rem;
    /* border: 1px solid lightgray; */
    border-radius: 8px;
  }
  /* color of the triangle marker */
  summary::marker {
    color: hsl(0 0% 60%);
  }
</style>
