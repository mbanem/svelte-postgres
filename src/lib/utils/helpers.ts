
(globalThis as any).TOOLBAR_HEIGHT=60;
import { browser } from '$app/environment'

import { afterNavigate } from '$app/navigation';
import {getColorHexArray} from '$lib/utils/hex-colors'

export const colors_hex = getColorHexArray();

export function scrollToPosition(top:number, left:number) {
  afterNavigate(() => {
    window.scroll({ top, left, behavior: 'smooth' });
  })
}

export function browserName(){
  console.log('browserName');
  if (!browser) return
  // @ts-ignore
  try {
    if (
      (navigator.userAgent.indexOf('Opera') ||
        navigator.userAgent.indexOf('OPR')) != -1
    ) {
      return 'Opera'
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
      return 'Edge'
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return 'Chrome'
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return 'Safari'
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return 'Firefox'
    } else {
      return 'unknown'
    }
  } catch (e) {
    return 'browser unknown'
  }
}
export type TKey =
  | 'Tab'
  | 'Enter'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0';

export const keyPress = (
  key: TKey,
  el?: HTMLInputElement | HTMLButtonElement,
) => {
  if (!browser) return
  // console.log('el', el);
  let keyEvent: KeyboardEvent
  if (key === 'Tab' || key === 'Enter') {
    const num = key === 'Tab' ? 9 : 13
    keyEvent = new KeyboardEvent('keydown', {
      key: key,
      code: key,
      keyCode: num, // The keyCode for Tab
      which: num,
      bubbles: true, // The event bubbles up through the DOM
      cancelable: true, // The event can be canceled
    })
  } else {
    const num = 48 + parseInt(key)
    keyEvent = new KeyboardEvent('keydown', {
      key: key, // The key value
      keyCode: num, // The keyCode for '5'
      code: `Digit${key}`, // The physical key code for '5'
      which: num, // Legacy key code
      bubbles: true, // Allows the event to bubble up through the DOM
      cancelable: true, // Allows the event to be canceled
    })
  }
  // Dispatch the event on the currently focused element
  // console.log('dispatch', keyEvent);
  if (el !== undefined) {
    el.dispatchEvent(keyEvent)
    // console.log('using el', el);
  } else {
    // console.log('using active element', document.activeElement);
    (
      document.activeElement as HTMLInputElement | HTMLButtonElement
    ).dispatchEvent(keyEvent)
  }
}

export let navBars: TNavBar[] = [];
export const navButtons: TNavButton[] = [];


export const sixHash = () => {
  const a = (Math.random() * 46656) | 0
  const b = (Math.random() * 46656) | 0
  return a.toString(36).slice(-3) + b.toString(36).slice(-3)
};


export const id = () => {
  return (Math.random() * 10 ** 8).toString(36).replace(/\./g, '')
}

// change placeholder color to red on required messages
export const setColor = (color: string) => {
  if (browser) {
    document.documentElement.style.setProperty('--PLACEHOLDER-COLOR', color);
    setTextColor('--MESSAGE-COLOR', color === 'red' ? 'pink' : color);
  }
};
export const setPlaceholderColor = (color: string) => {
  if (browser) {
    document.documentElement.style.setProperty('--PLACEHOLDER-COLOR', color)
    setTextColor('--MESSAGE-COLOR', color === 'red' ? 'pink' : color)
  }
}

export const hideButtonsExceptFirst = (buttons: HTMLButtonElement[]) => {
  resetButtons(buttons);
  if (buttons[0] && buttons[0].classList.contains('hidden')) {
    buttons[0].classList.toggle('hidden')
    buttons[0].hidden = false
  }
}

export const resetButtons = (buttons: HTMLButtonElement[]) => {
  try {
    buttons.forEach((btn) => {
      btn.classList.remove('hidden')
      btn.classList.add('hidden')
      try {
        btn.hidden = true
      } finally {
      }
    })
  } catch { }
}

let fn: string = '';
let ln: string = '';
export const isNameChanged = (firstName: string, lastName: string) => {
  const result = fn === firstName && ln === lastName ? false : true
  if (result) {
    fn = firstName
    ln = lastName
  }
  return result
}

export const arrStringToNumArr = (arr: string[]): Number[] => {
  return arr.map((el) => Number(el))
}

export const csvToNumArr = (s: string): number[] => {
  return s.split(',').map((el) => Number(el))
}

/*
export const getCSSValue = (varName: string): string | undefined => {
  if (browser) {
    try{
    const declaration = ((document.styleSheets[0]?.cssRules as CSSRuleList)[0] as CSSStyleRule).style
    return declaration.getPropertyValue(varName) as string
    }catch(err: Error){
      console.log('getCSSValue', err.message)
    }
  }
}
*/
export const getCSSValue = (varName: string): string | undefined => {
  if (!browser) return;

  try {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(varName).trim();
    return value || undefined;
  } catch (err) {
    console.log('getCSSValue error:', (err as Error).message);
  }
};
export const setCSSValue = (varName: string, value: string) => {
  try {
    if (browser) {
      const root = document.querySelector(':root') as Node
      if (root) {
        // @ts-expect-error
        root.style.setProperty(varName, value)
        // console.log('cssValue',root.style.getPropertyValue(varName))
      }
    }
  } catch (err: any) {
    console.log('setCSSValue', err)
  }
}
export const setTextColor = (varName: string, color: string) => {
  try {
    if (browser) {
      const root = document.querySelector(':root')
      if (root) {
        // @ts-expect-error
        root.style.setProperty(varName, color)
      }
    }
  } catch (err) {
    console.log('setTextColor', err)
  }
}

Number.prototype[Symbol.iterator] = function* () {
  // @ts-expect-error
  for (let i = 0; i < this; i++) {
    yield i
  }
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // ms here is a dummy but required by
      // resolve to send out some value
      resolve(ms)
    }, ms)
  })
}

export const capitalize = (str: string) => {
  const spaceUpper = (su: string) => {
    // getting _string so return ' String' with a leading space
    return ` ${su[1]?.toUpperCase()}`
  }
  let s = str[0]?.toUpperCase() + str.slice(1)
  return s
    .replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase())
    // snake_string_format replace _ with space
    .replace(/(_\w)/, spaceUpper)
}

// @ts-expect-error
String.prototype.capitalize = function () {
  return capitalize(this as string)
}

export const snakeToCamel = (s:string) => {
  return s.replace(/_([a-z])/g, (_, c:string) => c.toUpperCase());
}
String.prototype.snakeToCamel = function () {
  return snakeToCamel(this as string)
}

export const isKeyOf = <T extends Object>(
  key: keyof T,
  obj: T,
): key is keyof T => {
  return key in obj
}

const _shallowCopy = <S extends Object, T extends S>(
  source: S,
  target: T,
): T => {
  for (const k of Object.keys(target)) {
    if (isKeyOf<S>(k as keyof S, target)) {
      target[k] = source[k as keyof T]
    }
  }
  return target
}
export const shallowCopy = (source: Object, target: Object): Object => {
  return _shallowCopy(source, target)
  //  Test Items
  // let source: T[] = [
  // 	{ id: '14', name: 'Matia', age: '21' },
  // 	{ id: '22', name: 'Filip', age: '18', city: 'San Diego' }
  // ];
}

type T = Record<string | number, unknown>
export const selectRecordItems = <T extends unknown>(
  // NOTE: filter returns array
  // based on the keyName we select property value arr[keyName] and compare to a given key
  // so functions needs keyName, keyValue and the array itself
  keyName: keyof T,
  key: string,
  arr: T[],
): T => {
  const item = arr.filter((el) => el[keyName] === key) as T
  return item
}


export const copyPairingAttributes = <S, T extends Object>(
  source: S,
  target: T,
  pairs: Object,
): T => {
  for (const [k, v] of Object.entries(pairs)) {
    // if (isKeyOf<T>(k as keyof T, target)) {
    // @ts-expect-error
    target[v] = source[k as keyof T] as string | number
    // }
  }
  return target
}

export const rgbToHex = (rgb: string) => {
  const match = rgb.match(/.*((\d+),\s*(\d+),\s*(\d+))/) as RegExpMatchArray
  return String(match[1])
    .split(',')
    .reduce((acc, val) => acc + Number(val).toString(16).slice(-2), '#')
}

export const rgbToOppositeHex = (rgb: string) => {
  const match = rgb.match(/.*((\d+),\s*(\d+),\s*(\d+))/) as RegExpMatchArray
  return String(match[1])
    .split(',')
    .reduce(
      (acc, val) => acc + (255 - Number(val)).toString(16).slice(-2),
      '#',
    )
}

export const rgbFromName = (colorName: string) => {
  if (!browser) return
  const h = document.createElement('div')
  h.style.color = colorName
  return window.getComputedStyle(h).color
}

export const hexCodeFromName = (colorName: string) => {
  return rgbToHex(rgbFromName(colorName) as string)
}
export const oppositeOfElementBackground = (el: HTMLElement) => {
  const rgb = window.getComputedStyle(el).backgroundColor
  return rgbToOppositeHex(rgb)
}
export const colorNameToHex = (colorName: string) => {
  return rgbToHex(rgbFromName(colorName) as string)
}

export const oppositeColorNameToHex = (colorName: string) => {
  const match = (rgbFromName(colorName) as string).match(
    /^rgb\((\d+),\s*(\d+),\s*(\d+)$/,
  ) as RegExpMatchArray
  return match.reduce(
    (_, val) => (255 - Number(val)).toString(16).slice(-2),
    '#',
  )
}

const hex = '0123456789abcdef';
export const hexCodeToOpposite = (hex_code: string) => {
  if (hex_code[0] === '#') {
    hex_code = hex_code.slice(1)
  }
  let val = '#'
  const twoHexDigits = (ix: number, _?: number) => {
    const d =
      255 -
      hex.indexOf(hex_code[ix] as string) * 16 -
      hex.indexOf(hex_code[ix + 1] as string)
    const x = d.toString(16)
    return x === '0' ? '00' : x
  }
  val += ('0' + twoHexDigits(0, 1)).slice(-2)
  val += ('0' + twoHexDigits(2, 3)).slice(-2)
  val += ('0' + twoHexDigits(4, 5)).slice(-2)
  return val
}
const colorCount = colors_hex.length
const randomBackColor = (): string => {
  return colors_hex[Math.floor((Math.random() * 1000) % colorCount)] as string
}

const rgbToHsl = (r: number, g: number, b: number) => {
  // https://gist.github.com/mjackson/5311256
  (r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    if (h !== undefined) {
      h = h / 6
    }
  }

  return [h, s, l]
}
export const rgb2hsl = (clr: string) => {
  let rgb = clr
    .substring(4, clr.length - 1)
    .replace(/ /g, '')
    .split(',')
  return rgbToHsl(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
}
export const niceColor = (clr: string) => {
  let hsl = rgb2hsl(clr) as number[]
  hsl[0] = (hsl[0] ?? 0 + 0.5) % 1
  hsl[1] = (hsl[1] ?? 0 + 0.5) % 1
  hsl[2] = (hsl[2] ?? 0 + 0.5) % 1
  return (
    'hsl(' + hsl[0] * 360 + ',' + hsl[1] * 100 + '%,' + hsl[2] * 100 + '%)'
  )
}

export const leadingZero = (s: string) => {
  return `0${s}`.slice(-2)
}
const balance = (x: number) => {
  return x < 160 && x > 90 ? '00' : `0${(255 - x).toString(16)}`.slice(-2)
}
export const invertColor = (hex: string, bw?: boolean) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex[0] && hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16)
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#3a3a3a' : '#e0e0e0'
  }
  return '#' + balance(r) + balance(g) + balance(b)
}
export const setCaterpillarColors = (parent: HTMLElement) => {
  const children = parent.children
  for (let i = 0; i < children.length; i++) {
    const back = randomBackColor();
    (children[i] as HTMLElement).style.backgroundColor = back;
    (children[i] as HTMLElement).style.color = invertColor(back)
    // const rgb = (children[i] as HTMLElement).style.backgroundColor;
    // const match = rgb.match(/.*((\d+),\s*(\d+),\s*(\d+))/) as RegExpMatchArray;
    // // const fore = (Math.max(Number(match[1])) + Math.min(Number(match[1]))) / 2;
    // const hsl = niceColor((children[i] as HTMLElement).style.backgroundColor);
    // console.log(hsl);
    // (children[i] as HTMLElement).style.color = Number(l) > 0.5 ? '#000000' : '#ffffff';
    // (children[i] as HTMLElement).style.color = niceColor(
    // 	(children[i] as HTMLElement).style.backgroundColor
    // );
  }
}

const support = (() => {
  // if (!window.DOMParser) return false;
  try {
    const parser = new DOMParser()
    parser.parseFromString('x', 'text/html')
  } catch (err) {
    return false
  }
  return true
})()

export const parseToHTML = (str: string) => {
  if (!browser) return
  // If DOMParser is supported
  if (support) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')
    // as it is a whole document, return its body
    return doc.body
  }

  // fallback
  const dom = document.createElement('div')
  dom.innerHTML = str
  return dom
}

export const array_move = (arr: Array<any>, fromIx: number, toIx: number) => {
  // the next call removes element from toIx position without deleting any
  // returns removed if any, in this case an empty array
  // as we do not remove any elements but just move one
  arr.splice(toIx, 0, arr.splice(fromIx, 1)[0])
  // now array is mutated and we return the resulting one
  return arr
}

export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const pxStringLength = (str: string): string => {
  // string length in px
  if (!browser) return ''
  const div = document.createElement('div')
  div.innerHTML = `<span id='ComRUNNER' style='padding:4px 1rem;margin:6px 1rem;'>${str}</span>`
  document.body.appendChild(div)
  const el = document.getElementById('ComRUNNER')
  const width = `${el?.offsetWidth}px`
  el?.remove()
  return width
}
export const pxElementHeight = (el: HTMLElement): number => {
  if (!browser) return ''
  return el.getBoundingClientRect().height ?? 24
}

export const rangeArray = (start: number, end: number) => Array.from({ length: (end - start) }, (_, k) => k + start)
/* how to use
  import { rangeArray } from '$utils
  rangeArray(3,10).forEach(x=> console.log(x))
  or
  {#each utils.rangeArray(3,10) as number, ix}
    {ix}: {number}
  {/each}

*/

export const fadeScale = (
  node:any, { delay = 100, duration = 500, easing = (x:any) => x, baseScale = 0 }
) => {

  const opacity = +getComputedStyle(node).opacity
  const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/)
  const scale = m ? m[1] : 1
  const is = 1 - baseScale

  return {
    delay,
    duration,
    css: (t:any) => {
      const eased = easing(t)
      return `opacity: ${eased * opacity}; transform: scale(${(eased * scale * is) + baseScale})`
    }
  }
}


// compare $state(object) with object
export function sameDeep(v1: any, v2: any): boolean {
  if (v1 === v2) return true;

  if (v1 instanceof Date && v2 instanceof Date)
    return v1.getTime() === v2.getTime();

  if (typeof v1 !== 'object' || typeof v2 !== 'object' || v1 == null || v2 == null)
    return false;

  const keys1 = Object.keys(v1);
  const keys2 = Object.keys(v2);
  if (keys1.length !== keys2.length) return false;

  for (const k of keys1) {
    if (!same(v1[k], v2[k])) return false;
  }

  return true;
}

export function same<T extends Record<string, any>>(v1: T, v2: T): boolean {
  if (v1 === v2) return true;

  const keys = Object.keys(v1);
  if (keys.length !== Object.keys(v2).length) return false;

  for (const k of keys) {
    if (v1[k] !== v2[k]) return false;
  }
  return true;
}