<script lang="ts">
  import { onMount } from 'svelte'
  function details(event: MouseEvent) {
    function capF(s) {
      return s[0].toUpperCase() + s.slice(1);
    }
    const details = (event.target as HTMLElement).closest(
      'details'
    ) as HTMLDetailsElement;
    if (details) {
      if (details.open) return;
      const children = details.children[1]?.children as HTMLCollection;
      for (let i = 0; i < children.length; i++) {
          const fName1 = children[i]?.innerHTML.replace(/DateTime/,'Date')
          const m = children[i+1]?.innerHTML.match(/\s*?type:([a-zA-Z0-9_\[\]]+)(.*)$/)
          let exclude = false
          if (m?[2]){
            exclude = '|@default|@unique|@updatedAt|'.includes(m[2]?.match(/@default|@unique|@updatedAt/)) && m[2] !== 'Role' && !m[2].includes('@id') && !m[1].includes('[]')
          }
          if (!exclude && m[2]){
            console.log(fName1 +' '+ m[2])
            // fieldNameEl.value = fName1 +' '+ m[2];
            // fieldNameEl.dispatchEvent(enterKeyEvent)
          }
          i += 1
        }
    } else {
      console.log('could not get details element');
    }

  }
  
  const m =
    '<p>fieldName1</p><p>type:type1 <span></span></p><p>fieldName2</p><p>type:type2 <span>prismaSetting2<span></p><p>fieldName3</p><p>type:type3</p>';

let schemaContainerEl:HTMLDivElement
onMount(()=>{

})
if (schemaContainerEl){
  schemaContainerEl.addEventListener('click', (event) => {
    // event.preventDefault()
    if (event.target.tagName === 'SUMMARY') {
      routeNameEl.value = event.target.innerText.toLowerCase()
      routeNameEl.focus()
      routeNameEl.click()
      const details = event.target.closest('details');
      if (details.open) {
        return;
      }
      changeLabelText('routeNameId', 'pink', 'Change Route Name if necessary', 4000)
      //----------------
      const msgEl = document.getElementById('messages');
      const children = details.children[1].children;
      const savedEntry = fieldNameEl.value;
      msgEl.innerHTML = 'children# '+ children.length;
      for (let i = 0; i < children.length; i++) {
        const fieldName = children[i].innerHTML.replace(/DateTime/, 'Date').replace(/.*?(password).*/, 'password');
        msgEl.innerHTML += '<br/>fieldName: '+ fieldName +' children[i+1]: '+ children[i+1].innerHTML;
        try{
          msgEl.innerHTML += '<br/>before children[i+1] match';
          let match = children[i+1].innerHTML.match(/\s*?type:([a-zA-Z0-9_]+)(.*)$/);
          msgEl.innerHTML += 'fieldName: '+ fieldName +' match[1]: '+ match[1] +', match[2]: '+ match[2];
          const type = match[1].replace(/DateTime/, 'Date');
          msgEl.innerHTML += 'fieldName: '+ fieldName +' type: '+ type +' match[1]: '+ match[1] +', match[2]: '+ match[2];

          if (type === null) continue;
          const prismaAttrs = match[2];
          let exclude = false;
          msgEl.innerHTML += '<br/>prismaAttrs: '+ prismaAttrs;
          if (prismaAttrs) {
            const hasRole = type === 'Role';
            msgEl.innerHTML += '<br/> hasRole: '+ hasRole;
            // if brackets with space 'Article[  ]' tighten the brackets temporarily
            const hasBrackets = match[2].includes('[]');
            msgEl.innerHTML += '<br/> hasBrackets: '+ hasBrackets;

            // for brackets with space Article[  ] js cannot handle regex test
            // const hasBrackets = /.*?\[\s*?\]/.test(match[2])

            const hasTwoAt = fieldName.includes('@@');
            msgEl.innerHTML += '<br/> hasTwoAt: '+ hasTwoAt;
            const hasId = prismaAttrs.includes('@id');
            msgEl.innerHTML += '<br/> hasId: '+ hasId;
            const attrsHasAt = prismaAttrs.match(/@default|@unique|@createdAt/) !== null;
            msgEl.innerHTML += '<br/> attrsHasAt: '+ attrsHasAt;
            exclude = (attrsHasAt && !hasRole && hasTwoAt && !hasId) || hasBrackets;
            msgEl.innerHTML += '<br/> exclude: '+ exclude;

          }
          //   msgEl.innerHTML += '<br/> @attributes: '+ attrsHasAt +' hasRole: '+ hasRole +' hasTwoAt: '+ hasTwoAt +' hasId: '+ hasId +' hasBrackets: '+ hasBrackets +'<br/>';
          if (!exclude){
            msgEl.innerHTML += '<br/> dispatch fieldName'
            fieldNameEl.value = fieldName +': '+ type;
            fieldNameEl.dispatchEvent(enterKeyEvent)
          }else{
            msgEl.innerHTML += '<br/> nothing to dispatch'
          }
        }finally{
          msgEl.innerHTML += '<br/>finally<br/><br/>'
        }

        i += 1
      }
      fieldNameEl.value = savedEntry
      return
    }
    const el = event.target
    const fieldName = el.innerText
    let type = dateTimeToDate(el.nextSibling.innerText.match(/type:(\\S+)/)?.[1])
    if (!'String|Number|Boolean'.includes(type)) {
      return
    }

    // the click is not on a SUMMARY, so a field name is clicked
    // the standard procedure for entering a new fieldname is via input box + Enter
    if (el.tagName === 'P' && el.nextSibling.tagName === 'P' && !fields.includes(fieldName)) {
      // we need input box so preserve its entry if any and restore after
      const savedEntry = fieldNameEl.value
      fieldNameEl.value = \`\${fieldName}: \${type}\`
      fieldNameEl.dispatchEvent(enterKeyEvent)
      fieldNameEl.value = savedEntry
  })
}






</script>

<div bind:this={schemaContainerEl}></div>
<details id="det">
  <summary class="model-name" onclick={(event: MouseEvent) => details(event)}
    >User</summary
  >
  <div class="fields-column">
    <p>firstName</p>
    <p>type:String <span></span></p>
    <p>role</p>
    <p>type:Role <span>@default('VISITOR')</span></p>
    <p>age</p>
    <p>type:Number <span></span></p>
    <p>todo</p>
    <p>type:Todo[] <span></span></p>
    <p>createdAt</p>
    <p>type:DateTime <span>@default(now())</span></p>
    <p>@@map</p>
    <p>type:DateTime <span>@default(now())</span></p>
  </div>
</details>
<button onclick={details}>details</button>

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
