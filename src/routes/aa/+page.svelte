<script>
  function details(event) {
    function capF(s) {
      return s[0].toUpperCase() + s.slice(1);
    }
    const details = event.target.closest('details');
    if (details) {
      if (details.open) return;
      const children = details.children[1]?.children;
      for (let i = 0; i < children.length; i++) {
        const fieldName = children[i]?.innerHTML.replace(/DateTime/, 'Date');
        const match = children[i + 1]?.innerHTML.match(
          /\s*?type:([a-zA-Z0-9_\[\]]+)(.*)$/,
        );
        console.log(match);
        const type = match[1].trim().replace(/DateTime/, 'Date');
        if (type === null) continue;
        const prismaAttrs = match[2];
        let exclude = false;
        if (prismaAttrs) {
          const at = prismaAttrs.match(/@default|@unique|@createdAt/) !== null;
          const notRole = type !== 'Role';
          const yesBrackets = type.includes('[]');
          const notTwoAt = !fieldName.includes('@@');
          const notId = !prismaAttrs.includes('@id');
          exclude = (at && notRole && notTwoAt && notId) || yesBrackets;
          // console.log(fieldName, type, prismaAttrs, exclude);
        }
        if (!exclude) {
          // console.log(fieldName, type, prismaAttrs, exclude)
          // console.log(fieldName +': '+ type)
          // fieldNameEl.value = fName1 +' '+ m[2];
          // fieldNameEl.dispatchEvent(enterKeyEvent)
        }
        i += 1;
      }
    } else {
      console.log('could not get details element');
    }
    P;
  }
</script>

`Array(3) [ "type:article[]&gt;<span></span>", "article[]", "&gt;<span></span>"
]`
<details id="det">
  <summary class="model-name" onclick={(event) => details(event)}>User</summary>
  <div class="fields-column">
    <p>todo</p>
    <p>type:Todo[]</p>
    <p>article</p>
    <p>type:Article[]</p>
    <p>firstName</p>
    <p>type:String <span></span></p>
    <p>lastName</p>
    <p>type:String <span></span></p>
    <p>role</p>
    <p>type:Role <span>@default('VISITOR')</span></p>
    <p>age</p>
    <p>type:Number <span></span></p>
    <p>salary</p>
    <p>type:Number <span>@unique</span></p>
    <p>createdAt</p>
    <p>type:DateTime <span>@default(now())</span></p>
    <p>updatedAt</p>
    <p>type:DateTime <span></span></p>
  </div>
</details>

<style lang="scss">
  div {
    margin: 2px 0 6px 1rem;
    color: navy;
  }
  button {
    padding: 8px 1rem;
    margin-top: 1rem;
  }
  .model-name {
    font-size: 18px;
    color: skyblue;
    cursor: pointer;
  }
  :global(p) {
    color: lightgreen;
  }
</style>
