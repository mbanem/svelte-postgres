

export interface FadeScaleParams {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  baseScale?: number;
  translateX?: string;
  translateY?: string;
}

export default function fadeScale<IProps extends FadeScaleParams>(
  node: HTMLElement,
  {
    delay = 100,
    duration = 800,
    easing = (x: number) => x,
    baseScale = 0,
    translateX = '1rem',
    translateY = '-160%',
  }: IProps
) {
  const opacity = +getComputedStyle(node).opacity;
  const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
  const scale = m ? Number(m[1]) : 1;
  const is = 1 - baseScale;
  // console.log(translateX, translateY)
  // transform: translate uses matrix's last two entries for translate x and y
  // with scaleX=1 skewX=0 skewY=0  scaleY=1 (1-no scale and 0-no skew) just translate
  // NOTE: transform: translate is defined in the Tooltip.svelte and must specify
  // the same left/top values as the one in this css return value
  return {
    delay,
    duration,
    css: (t: number) => {
      const eased = easing(t);
      return `opacity: ${eased * opacity}; transform: translate(${translateX},${translateY}) scale(${eased * scale * is + baseScale}) `;
    },
  };
}
