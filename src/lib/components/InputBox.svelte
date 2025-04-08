<script lang="ts">
  type TExportValueOn = 'keypress' | 'enter' | 'blur';
  import { browser } from '$app/environment';
  import * as utils from '$utils';
  import { onMount } from 'svelte';
  // import { setContext } from 'svelte';

  type PROPS = {
    title: string;
    width?: string;
    height?: string;
    fontsize?: string;
    margin?: string;
    type?: string;
    value?: string;
    entryIsRequiredMsg?: string;
    capitalize?: boolean;
    err?: string[] | undefined;
    onButtonNext?: () => void;
    exportValueOn?: TExportValueOn;
    onInputIsReadyCallback?: () => void; // call parent when onInputIsReadyCallback for 'enter', otherwise on every key
    clearOnInputIsReady?: boolean; // clear input value on onInputIsReadyCallback
  };
  // make capitalizes as capitalize is already defined in $Props()
  const capitalizes = (title: string): string => {
    return utils.capitalize(title);
  };
  let {
    title,
    width = '16rem',
    height = '2.5rem',
    fontsize = '16px',
    margin = '1rem 0',
    type,
    value = $bindable(),
    entryIsRequiredMsg = `${title} is required`,
    err = undefined,
    onButtonNext,
    exportValueOn = 'enter',
    onInputIsReadyCallback = undefined,
    capitalize = false,
    clearOnInputIsReady = false,
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
  let inputValueIsDirty = false;
  const onBlurHandler = (event: FocusEvent) => {
    event.preventDefault();
    if (!inputValue) {
      inputValueIsDirty = true;
      if (entryIsRequiredMsg) {
        // utils.setCSSValue('--INPUT-BOX-LABEL-TOP-POS', '0');
        // inputEl.placeholder = entryIsRequiredMsg;
        // utils.setPlaceholderColor('pink');
      } else {
        // utils.setCSSValue('--INPUT-BOX-LABEL-TOP-POS', topPosition);
      }
    }
  };
  const onKeyUpHandler = (event: KeyboardEvent) => {
    if (exportValueOn === 'enter' && event.key !== 'Enter') {
      if (capitalize) {
        inputValue = utils.capitalize(inputValue);
      }
      return;
    }
    if (!'keypress|enter|blur'.includes(exportValueOn)) {
      return;
    }
    if (inputValue && inputValue[0]) {
      if (capitalize) {
        value = utils.capitalize(inputValue);
        inputValue = value;
      } else {
        value = inputValue;
      }
    }
    if (onInputIsReadyCallback) {
      onInputIsReadyCallback();
      if (clearOnInputIsReady) {
        inputValue = '';
      }
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
  let label: HTMLLabelElement;
  let inputEl: HTMLInputElement;
  const setFocus = () => {
    inputEl.focus();
  };
  // parent call to set input box value
  export const setInputBoxValue = (str: string, blur: boolean = false) => {
    if (blur) {
      setTimeout(() => {
        inputEl.blur();
      }, 1000);
    }
    inputEl.focus();
    inputValue = str;
  };
  // setContext('setInputBoxValue', setInputBoxValue);
  onMount(() => {
    label = document.getElementsByTagName('label')[0] as HTMLLabelElement;
  });
</script>

<div class="input-wrapper" style="margin:{margin}">
  <input
    bind:this={inputEl}
    type={type ? type : 'text'}
    required
    bind:value={inputValue}
    onkeyup={onKeyUpHandler}
    onblur={onBlurHandler}
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
