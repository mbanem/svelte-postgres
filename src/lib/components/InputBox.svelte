<!--
@component
-- InputBox.svelte accept the following properties
	type PROPS = {
		title: string
		width: string     - (e.g., '100px', '50%')
		height: string    - (e.g., '100px', '50%')
		fontsize: string  - (e.g., '16px', '1rem')
	}
-->

<script lang="ts">
  import { browser } from '$app/environment';
  import * as utils from '$utils';
  import Error from '$routes/+error.svelte';
  type PROPS = {
    title: string;
    width?: string;
    height?: string;
    fontsize?: string;
    type?: string;
    value?: string;
    err?: string[] | undefined;
    onButtonNext?: () => void;
  };
  const capitalize = (title: string): string => {
    return title[0]?.toUpperCase() + title.slice(1).replace(/([A-Z])/, ' $1');
  };
  let {
    title,
    width = '16rem',
    height = '2.5rem',
    fontsize = '16px',
    type,
    value = $bindable(),
    err = undefined,
    onButtonNext,
  }: PROPS = $props();
  // NOTE: enter non breaking unicode space: type 00A0 and press Alt + X
  // here we held between apostrophes three non breaking spaces
  title = '   ' + capitalize(title);
  const topPosition = `${-1 * Math.floor(parseInt(fontsize) / 3)}px`;

  let inputEl: HTMLInputElement;

  export const setFocus = () => {
    console.log('InputBox setFocus');
    inputEl.focus();
  };
  if (browser) {
    utils.setCSSValue('--INPUT-BOX-LABEL-TOP-POS', topPosition);
    if (width) utils.setCSSValue('--INPUT-COMRUNNER-WIDTH', width as string);
    if (height) utils.setCSSValue('--INPUT-COMRUNNER-HEIGHT', height as string);
    if (fontsize)
      utils.setCSSValue('--INPUT-COMRUNNER-FONT-SIZE', fontsize as string);
    width = utils.getCSSValue('--INPUT-COMRUNNER-WIDTH') as string;
  }
  const inputCompleted = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && onButtonNext) {
      onButtonNext();
    }
    value = utils.capitalize(value as string);
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
  const forward = () => {
    inputEl.focus();
  };
  const focusMe = (event: MouseEvent) => {
    event.preventDefault();
    inputEl.focus();
  };
</script>

<div class="input-wrapper" onclick={focusMe} aria-hidden={true}>
  <input
    bind:this={inputEl}
    type={type ? type : 'text'}
    required
    bind:value
    onkeyup={inputCompleted}
    disabled={false}
    onclick={forward}
  />
  <label for="" aria-hidden={true}>
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
    margin: 1rem 0;
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
