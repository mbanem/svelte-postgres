/**
 * A function that converts rgb/rgba into #RRGGBB or #RRGGBBAA format
 *
 * @param rgb/rgba string with comma or space separators including / for alpha channel
 * @returns #RRGGBB or #RRGGBBAA
 *
 * @example
 * ```ts
 * const hex = rgba2hex('rgba(255, 0, 0, 0.5)');
 * ```
 */
export const rgba2hex = (rgb: string) => {
  return (
    '#' +
    (rgb.replace(/(\s*\/\s*)|[, ]/g, ',').match(/(\d+)/g) as string[])
      .map((n) => Number(n).toString(16))
      .join('')
  );
};

export type NumberArray = [number, number, number, number?];
export const hsla2hex = (hsla: string) => {
  const sep = hsla.includes(',') ? ',' : ' ';

  // if alpha channel is separated by /
  hsla = hsla.replace('/', sep);

  // convert hsla entries into numbers
  let [h, s, l, a] = hsla
    .replace(/hsla\(|\)|%/g, '')
    .replace(/\s*,\s*|\//g, ' ')
    .split(' ')
    .map((s) => {
      let x = parseFloat(s);
      return x < 1 ? x * 100 : x;
    }) as NumberArray; // this exclude ability to be undefined
  // .split(hsla.includes(',') ? ',' : ' ')
  // .map((n) => parseFloat(n));
  if (a === undefined) {
    a = 0;
  }
  // no negative numbers should be allowed
  if (h * s * l < 0 || a < 0) return;

  // as members of NumberArray are not undefined so this is unambiguous
  s /= 100;
  l /= 100;

  // initialization
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2;
  const ix = Math.floor(h / 60);
  // values for x and c depend on h position in 60 parts intervals 9--360
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  let [r, g, b] = rgb[ix] as NumberArray;

  // NOTE: could not use if (n===0) return '' as join('') looses some valid entry
  const hex = (n: number, _m: number) => {
    return ('0' + Math.round((n + _m) * 255).toString(16)).slice(-2);
  };

  return (
    (('#' + [hex(r, m), hex(g, m), hex(b, m)].join('')) as string) +
    (hex(a, 0) === '00' ? '' : hex(a, 0))
  );
};

export const convertToHexColor = (color: string) => {
  if (color.startsWith('#')) {
    return color;
  } else if (color.startsWith('rgba')) {
    return rgba2hex(color);
  } else if (color.startsWith('hsla')) {
    return hsla2hex(color);
  } else {
    return color;
  }
};
