export {};
import { browser } from '$app/environment'

import { afterNavigate } from '$app/navigation';

export function scrollToPosition(top:number, left:number) {
  afterNavigate(() => {
    window.scroll({ top, left, behavior: 'smooth' });
  })
}

const colors_hex: string[] = [
  '#f0f8ff', //AliceBlue
  '#faebd7', //AntiqueWhite
  '#00ffff', //Aqua
  '#7fffd4', //Aquamarine
  '#f0ffff', //Azure
  '#f5f5dc', //Beige
  '#ffe4c4', //Bisque
  '#000000', //Black
  '#ffebcd', //BlanchedAlmond
  '#0000ff', //Blue
  '#8a2be2', //BlueViolet
  '#a52a2a', //Brown
  '#deb887', //BurlyWood
  '#5f9ea0', //CadetBlue
  '#7fff00', //Chartreuse
  '#d2691e', //Chocolate
  '#ff7f50', //Coral
  '#6495ed', //CornflowerBlue
  '#fff8dc', //Cornsilk
  '#dc143c', //Crimson
  '#00ffff', //Cyan
  '#00008b', //DarkBlue
  '#008b8b', //DarkCyan
  '#b8860b', //DarkGoldenRod
  '#a9a9a9', //DarkGray
  '#a9a9a9', //DarkGrey
  '#006400', //DarkGreen
  '#bdb76b', //DarkKhaki
  '#8b008b', //DarkMagenta
  '#556b2f', //DarkOliveGreen
  '#ff8c00', //DarkOrange
  '#9932cc', //DarkOrchid
  '#8b0000', //' #ad1414'
  '#e9967a', //DarkSalmon
  '#8fbc8f', //DarkSeaGreen
  '#483d8b', //DarkSlateBlue
  '#2f4f4f', //DarkSlateGray
  '#2f4f4f', //DarkSlateGrey
  '#00ced1', //DarkTurquoise
  '#9400d3', //DarkViolet
  '#ff1493', //DeepPink
  '#00bfff', //DeepSkyBlue
  '#696969', //DimGray
  '#696969', //DimGrey
  '#1e90ff', //DodgerBlue
  '#b22222', //FireBrick
  '#fffaf0', //FloralWhite
  '#228b22', //ForestGreen
  '#ff00ff', //Fuchsia
  '#dcdcdc', //Gainsboro
  '#f8f8ff', //GhostWhite
  '#ffd700', //Gold
  '#daa520', //GoldenRod
  '#808080', //Gray
  '#808080', //Grey
  '#008000', //Green
  '#adff2f', //GreenYellow
  '#f0fff0', //HoneyDew
  '#ff69b4', //HotPink
  '#cd5c5c', //IndianRed
  '#4b0082', //Indigo
  '#fffff0', //Ivory
  '#f0e68c', //Khaki
  '#e6e6fa', //Lavender
  '#fff0f5', //LavenderBlush
  '#7cfc00', //LawnGreen
  '#fffacd', //LemonChiffon
  '#add8e6', //LightBlue
  '#f08080', //LightCoral
  '#e0ffff', //LightCyan
  '#fafad2', //LightGoldenRodYellow
  '#d3d3d3', //LightGray
  '#d3d3d3', //LightGrey
  '#90ee90', //LightGreen
  '#ffb6c1', //LightPink
  '#ffa07a', //LightSalmon
  '#20b2aa', //LightSeaGreen
  '#87cefa', //LightSkyBlue
  '#778899', //LightSlateGray
  '#778899', //LightSlateGrey
  '#b0c4de', //LightSteelBlue
  '#ffffe0', //LightYellow
  '#00ff00', //Lime
  '#32cd32', //LimeGreen
  '#faf0e6', //Linen
  '#ff00ff', //Magenta
  '#800000', //Maroon
  '#66cdaa', //MediumAquaMarine
  '#0000cd', //MediumBlue
  '#ba55d3', //MediumOrchid
  '#9370db', //MediumPurple
  '#3cb371', //MediumSeaGreen
  '#7b68ee', //MediumSlateBlue
  '#00fa9a', //MediumSpringGreen
  '#48d1cc', //MediumTurquoise
  '#c71585', //MediumVioletRed
  '#191970', //MidnightBlue
  '#f5fffa', //MintCream
  '#ffe4e1', //MistyRose
  '#ffe4b5', //Moccasin
  '#ffdead', //NavajoWhite
  '#000080', //Navy
  '#fdf5e6', //OldLace
  '#808000', //Olive
  '#6b8e23', //OliveDrab
  '#ffa500', //Orange
  '#ff4500', //OrangeRed
  '#da70d6', //Orchid
  '#eee8aa', //PaleGoldenRod
  '#98fb98', //PaleGreen
  '#afeeee', //PaleTurquoise
  '#db7093', //PaleVioletRed
  '#ffefd5', //PapayaWhip
  '#ffdab9', //PeachPuff
  '#cd853f', //Peru
  '#ffc0cb', //Pink
  '#dda0dd', //Plum
  '#b0e0e6', //PowderBlue
  '#800080', //Purple
  '#663399', //RebeccaPurple
  '#ff0000', //Red
  '#bc8f8f', //RosyBrown
  '#4169e1', //RoyalBlue
  '#8b4513', //SaddleBrown
  '#fa8072', //Salmon
  '#f4a460', //SandyBrown
  '#2e8b57', //SeaGreen
  '#fff5ee', //SeaShell
  '#a0522d', //Sienna
  '#c0c0c0', //Silver
  '#87ceeb', //SkyBlue
  '#6a5acd', //SlateBlue
  '#708090', //SlateGray
  '#708090', //SlateGrey
  '#fffafa', //Snow
  '#00ff7f', //SpringGreen
  '#4682b4', //SteelBlue
  '#d2b48c', //Tan
  '#008080', //Teal
  '#d8bfd8', //Thistle
  '#ff6347', //Tomato
  '#40e0d0', //Turquoise
  '#ee82ee', //Violet
  '#f5deb3', //Wheat
  '#ffffff', //White
  '#f5f5f5', //WhiteSmoke
  '#ffff00', //Yellow
  '#9acd32', //YellowGreen
];



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

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // ms here is a dummy value but required by
      // resolve to send out some value
      resolve(ms)
    }, ms)
  })
}

export const arrStringToNumArr = (arr: string[]): Number[] => {
  return arr.map((el) => Number(el))
}

export const csvToNumArr = (s: string): number[] => {
  return s.split(',').map((el) => Number(el))
}

export const getCSSValue = (varName: string): string | undefined => {
  if (browser) {
    try{
    const declaration = ((document.styleSheets[0]?.cssRules as CSSRuleList)[0] as CSSStyleRule).style
    return declaration.getPropertyValue(varName) as string
    }catch(err){
      console.log('getCSSValue', err.message)
    }
  }
}
export const setCSSValue = (varName: string, value: string) => {
  try {
    if (browser) {
      const root = document.querySelector(':root') as Node
      if (root) {
        // @ts-expect-error
        root.style.setProperty(varName, value)
        console.log('cssValue',root.style.getPropertyValue(varName))
      }
    }
  } catch (err: Error) {
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

export const capitalize = (str: string) => {
  const spaceUpper = (su: string) => {
    return ` ${su[1]?.toUpperCase()}`
  }
  str = str[0]?.toUpperCase() + str.slice(1)
  // /Filip(?=XX) check patterns as a positive lookahead, i.e, whether Filip in followed by XX
  // Positive lookahead
  // here TaylorSwift got a space between first and last name
  // 'TaylorSwift the singer'.replace(/\b(Taylor)(?=Swift)\b/g, '$1 ')
  // replacing Taylor by cached name $1 followed by a space '$1 '
  // after regex replace we have: Taylor Swift the singer
  return str
    .replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase())
    .replace(/(_\w)/, spaceUpper)
}

String.prototype.capitalize = function () {
  return capitalize(this as string)
}

export const capitalizeCamelCase = (str: string) => {
  // /Filip(?=XX) check patterns as a positive lookahead, i.e, whether Filip in followed by XX
  // Positive lookahead
  // here TaylorSwift got a space between first and last name
  // 'TaylorSwift the singer'.replace(/\b(Taylor)(?=Swift)\b/g, '$1 ')
  // replacing Taylor by cached name $1 followed by a space '$1 '
  // after regex replace we have: Taylor Swift the singer
  return str
    .replace(/^\w/, c => c.toUpperCase())
    .replace(/([a-z])(?=[A-Z])/g, '$1 ')
}

String.prototype.capCamelCase = function () {
  // NOTE: cannot use capitalizeCamelCase for prototype name as
  // code will complain that it is a constant (referring to the above function)
  // so we use another name
  // @ts-expect-error  -- capCamelCase does not exist on a String type
  return capitalize(capitalizeCamelCase(this as string))
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
export const pxElementHeight = (el: HTMLElement): string => {
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
  node, { delay = 100, duration = 500, easing = x => x, baseScale = 0 }
) => {

  const opacity = +getComputedStyle(node).opacity
  const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/)
  const scale = m ? m[1] : 1
  const is = 1 - baseScale

  return {
    delay,
    duration,
    css: t => {
      const eased = easing(t)
      return `opacity: ${eased * opacity}; transform: scale(${(eased * scale * is) + baseScale})`
    }
  }
}

