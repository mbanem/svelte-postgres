<script lang="ts">
  type ChildObject = {
    readonly text: string;
  };
  type FamilyObject = {
    readonly id: number;
    readonly text: string;
    readonly childObjects: ChildObject[];
    // inside the object _childObjects are read only so we need addChildToFamily method
    addChildToFamily: (_: ChildObject) => void;
    isChildObjectInTheList: (childObject: ChildObject) => boolean;
    childrenSelBox: HTMLSelectElement;
    selectedChildId: string;
  };
  // does not work correctly when attempting to cross family borders
  type PROPS = {
    actionUp: (familyObject: FamilyObject, shift: number) => void;
    actionDown: (familyObject: FamilyObject, shift: number) => void;
    first: boolean;
    last: boolean;
  };
  let { actionUp, actionDown, first, last }: PROPS = $props();
  //console.log(first, last)
</script>

<div class="up-down">
  <button onclick={() => actionUp} disabled={first}> ↑ </button>
  <button onclick={() => actionDown} disabled={last}> ↓ </button>
</div>

<style>
  .up-down {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid;
    padding: 0.5rem 0.5rem;
    margin: -1rem 0 -1rem -1rem;
    gap: 0.5rem;
  }
  button:disabled {
    background-color: darkgray !important;
    cursor: not-allowed;
  }
</style>
