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
  import { onMount } from 'svelte';
  import Error from '$routes/+error.svelte';
  import * as utils from '$utils';
  type PROPS = {
    title: string;
    width?: string;
    height?: string;
    fontsize?: string;
    type?: string;
    value?: string;
    onButtonNext?: () => void;
  };
  let {
    title,
    width = '16rem',
    height = '2.5rem',
    fontsize = '16px',
    type,
    value = $bindable(),
    onButtonNext,
  }: PROPS = $props();

  let inputEl: HTMLInputElement;
  export const setFocus = () => {
    inputEl.focus();
  };
  if (width) utils.setCSSValue('--INPUT-COMRUNNER-WIDTH', width as string);
  if (height) utils.setCSSValue('--INPUT-COMRUNNER-HEIGHT', height as string);
  if (fontsize)
    utils.setCSSValue('--INPUT-COMRUNNER-FONT-SIZE', fontsize as string);

  const inputCompleted = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && onButtonNext) {
      onButtonNext();
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
</script>

<div class="input-wrapper">
  <input
    bind:this={inputEl}
    type={type ? type : 'text'}
    required
    bind:value
    onkeyup={inputCompleted}
  />
  <label for="">{title}</label>
</div>

<style lang="scss">
  .input-wrapper {
    margin: 1rem 0;
    position: relative;
    label {
      position: absolute;
      transform: translateY(-50%);
      top: calc(var(--INPUT-COMRUNNER-HEIGHT) * 0.5);
      left: 15px;
      color: var(--INPUT-COLOR);
      background-color: var(--INPUT-BACKGROUND-COLOR);
      opacity: 0.5;
      transition: 0.5s;
    }
    input {
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
        top: -2px;
        font-size: 14px;
        opacity: 1;
      }
    }
  }
</style>
