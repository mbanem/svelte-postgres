<script lang="ts">
  // import { A } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import * as utils from '$lib/utils';
  import SummaryDetails from '$components/SummaryDetails.svelte';
  let message: HTMLDivElement;
  let inputEl: HTMLInputElement;
  // NOTE: Inserting letter with bigger font size in message div block moves it bellow
  // for font size increment, so we put leading hidden large font char to keep div ready
  // to accept chars of bigger size with not jerking the message div block down
  const BL = '<span style="font-size:30px;visibility:hidden">&nbsp;</span>'; // big letter
  const NV = `<span style="font-size:30px;color:yellow">`;
  let msg = `${BL}Message displayed here`;
  // if (inputEl) {
  // inputEl.addEventListener('beforeinput', function (e: InputEvent) {
  // 	const el = e.target as HTMLInputElement
  // 	const nextVal =
  // 		el.value.substring(0, Number(el.selectionStart)) +
  // 		e.data +
  // 		el.value.substring(Number(el.selectionEnd))
  // 	if (!/^(\d{0,10}|\d{8}\.?\d{0,2}|)$/.test(nextVal)) {
  // 		e.preventDefault()
  // 		message.innerHTML = `${BL}Character ${NV}${nextVal}</span> is not allowed`
  // 		return
  // 	}
  // 	message.innerHTML = msg
  // 	return
  // })
  // }

  onMount(() => {
    message.innerHTML = msg;
    inputEl.addEventListener('beforeinput', function (e: InputEvent) {
      if ('deleteContentForward|deleteContentBackward'.includes(e.inputType))
        return;
      const el = e.target as HTMLInputElement;
      const nextVal =
        el.value.substring(0, Number(el.selectionStart)) +
        e.data +
        el.value.substring(Number(el.selectionEnd));
      if (
        !/^-?(\d{0,10}|\d{0,8}\.?\d{0,2}|\d{0,9}\.?\d{0,1}|)$/.test(nextVal)
      ) {
        e.preventDefault();
        const dot = inputEl.value.indexOf('.') >= 0;
        const max = dot ? 11 : 10;

        message.innerHTML =
          inputEl.value.length >= max
            ? e.data === '.'
              ? `${BL}decimal delimiter is for up to 2 decimal places`
              : `${BL}No more tan 10 digits are allowed`
            : typeof e.data !== 'number'
              ? `${BL}Only digits with up to 2 decimals`
              : `${BL}No additional char is allowed`;
        return;
      }
      message.innerHTML = msg;
      return;
    });
  });
</script>

<svelte:head>
  <title>Before Input</title>
</svelte:head>
<div class="container">
  <pre>
Input box keystrokes are monitored by 'beforeinput' event handler
  preventing non-numeric keystrokes while allowing numbers with 
  up to 10 digits including up to two decimals.
  The 'beforeinput' event handler verifies intended input as a whole
  getting it via 
    inputbox.selectionStart + inputbox.data + inputbox.selectionEnd
  and testing intended entry via the following regex
    !/^-?(\d&lcub;0,10}|\d&lcub;0,8}\.?\d&lcub;0,2}|\d&lcub;0,9}\.?\d&lcub;0,1}|)$/
  </pre>

  <br />
  <label for="inbox">
    Expected up to 10 digits with optional up to 2 decimal places
    <input
      type="text"
      bind:this={inputEl}
      id="inbox"
      class="controlled-input"
      placeholder="Up to 10 digits with 2 decimals"
    />
  </label>
  <br />
  <div bind:this={message} class="message">%nbsp;</div>
  <br />
  <pre>
  input box type='number' with additional attribute inputmode='numeric'
  allows only numeric types to be accepted (at Oct 23<sup>rt</sup
    > Firefox excluded)
	{#if utils.browserName() === 'Firefox'}
      <span style="color:pink;"
        >Does not work in this browser -- it is Firefox.</span
      >
    {/if}
</pre>
  <br />
  <input
    type="number"
    class="inputmode-numeric"
    inputmode="numeric"
    pattern="[0-9]*"
    value="1234"
  />
</div>

<style lang="scss">
  label {
    margin-left: 4rem;
  }
  .controlled-input {
    display: block;
    font-size: 18px;
    padding: 3px 0 0 1rem;
    margin: 1rem 0 0 5rem;
    &::placeholder {
      color: var(--PLACEHOLDER-COLOR);
      // opacity: 0.6;
    }
  }
  .message {
    display: inline-block;
    width: max-content;
    padding: 4px 0 0 1rem;
    margin: 0.5rem 0 0 4rem;
  }

  .inputmode-numeric {
    width: 5rem;
    margin-left: 4rem;
  }
  .container {
    @include container('How does this work', $head-color: lightgreen);
    margin: 5rem auto;
  }
</style>
