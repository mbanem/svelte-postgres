<script lang="ts">
  type TExportValueOn = 'keypress' | 'enter';
  import { browser } from '$app/environment';
  import * as utils from '$utils';
  // import { setContext } from 'svelte';

  type PROPS = {
    title: string;
    width?: string;
    height?: string;
    fontsize?: string;
    margin?: string;
    type?: string;
    value?: string;
    defaultValue?: string;
    capitalize?: boolean;
    err?: string[] | undefined;
    onButtonNext?: () => void;
    exportValueOn?: TExportValueOn;
    inputIsReady?: () => void; // call parent when inputIsReady for 'enter', otherwise on every key
  };
  // make capitalizes as capital is already defined in $Props()
  const capitalizes = (title: string): string => {
    return title[0]?.toUpperCase() + title.slice(1).replace(/([A-Z])/, ' $1');
  };
  let {
    title,
    width = '16rem',
    height = '2.5rem',
    fontsize = '16px',
    margin = '1rem 0',
    type,
    value = $bindable(),
    defaultValue,
    err = undefined,
    onButtonNext,
    exportValueOn = 'keypress',
    inputIsReady = undefined,
    capitalize = false,
  }: PROPS = $props();
  // NOTE: enter non breaking unicode space: type 00A0 and press Alt + X
  // here we held between apostrophes three non breaking spaces
  title = '   ' + capitalizes(title);
  const topPosition = `${-1 * Math.floor(parseInt(fontsize) / 3)}px`;

  let inputValue = $state('');

  if (browser) {
    utils.setCSSValue('--INPUT-BOX-LABEL-TOP-POS', topPosition);
    if (width) utils.setCSSValue('--INPUT-COMRUNNER-WIDTH', width as string);
    if (height) utils.setCSSValue('--INPUT-COMRUNNER-HEIGHT', height as string);
    if (fontsize)
      utils.setCSSValue('--INPUT-COMRUNNER-FONT-SIZE', fontsize as string);
    width = utils.getCSSValue('--INPUT-COMRUNNER-WIDTH') as string;
  }
  const onKeyUpHandler = (event: KeyboardEvent) => {
    if (exportValueOn === 'enter' && event.key !== 'Enter') return;
    if (!'keypress|enter'.includes(exportValueOn)) {
      console.log("exportValueOn should be 'keypress' | 'enter'");
      return;
    }
    if (inputValue && inputValue[0]) {
      if (capitalize) {
        value = inputValue[0].toUpperCase() + inputValue.slice(1).toLowerCase();
        inputValue = value;
      } else {
        value = inputValue;
      }
    }
    if (inputIsReady) {
      inputIsReady();
    }
  };

  // const test = async () => {
  // 	const [error, user] = await utils.catchError(getUser(1))
  // 	if (error) {
  // 		console.log('Error', error.message)
  // 	} else {
  // 		console.log(user)
  // 	}
  // }
  // test()

  // input box has a label text instead of a placeholder in order to
  // move it up on focus, but the text does not set focus on input
  // element on click -- so we have to set the focus when the label
  // text is selected
  let inputEl: HTMLInputElement;
  const setFocus = () => {
    inputEl.focus();
    if (defaultValue) {
      inputValue = defaultValue;
    } else {
      inputValue = value as string;
    }
  };
  // parent call to set input box value
  export const setInputBoxValue = (str: string) => {
    console.log('inside setInputBoxValue');
    inputEl.focus();
    inputValue = str;
  };
  // setContext('setInputBoxValue', setInputBoxValue);
</script>

<div class="input-wrapper" style="margin:{margin}">
  <input
    bind:this={inputEl}
    type={type ? type : 'text'}
    required
    bind:value={inputValue}
    onkeyup={onKeyUpHandler}
    disabled={false}
  />
  <label for="" onclick={setFocus} aria-hidden={true}>
    {title}
    <span class="err">
      {err ? ` - ${err}` : ''}
    </span>
  </label>
</div>

<style lang="scss">
  :root {
    --INPUT-COMRUNNER-WIDTH: 16rem;
  }
  .input-wrapper {
    position: relative;
    width: max-content;
    label {
      position: absolute;
      transform: translateY(-50%);
      top: calc(var(--INPUT-COMRUNNER-HEIGHT) * 0.5);
      left: 15px;
      font-size: var(--INPUT-COMRUNNER-FONT-SIZE);
      color: var(--INPUT-COLOR);
      background-color: var(--INPUT-BACKGROUND-COLOR);
      opacity: 0.5;
      transition: 0.5s;
    }
    input {
      display: inline-block;
      width: var(--INPUT-COMRUNNER-WIDTH);
      height: var(--INPUT-COMRUNNER-HEIGHT);
      font-size: var(--INPUT-COMRUNNER-FONT-SIZE);
      padding: 0 10px;
      color: var(--TEXT-COLOR);
      &:focus {
        color: var(--INPUT-FOCUS-COLOR);
      }
      &:focus ~ label,
      &:valid ~ label {
        top: var(--INPUT-BOX-LABEL-TOP-POS);
        font-size: var(--INPUT-COMRUNNER-FONT-SIZE);
        opacity: 1;
      }
    }
  }
  .err {
    color: pink;
    // border: 1px solid #808080;
    // border-radius: 3px;
    padding: 1px 0.5rem;
  }
</style>
