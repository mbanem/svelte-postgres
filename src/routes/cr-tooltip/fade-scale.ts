  export default function fadeScale(
    node: HTMLElement,
    { delay = 0, duration = 200, easing = (x) => x, baseScale = 0, translateX='5rem', translateY='-160%'},
  ) {
    const opacity = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = m ? Number(m[1]) : 1;
    const is = 1 - baseScale;
    // transform:translate uses matrix's last two entries for translate x and y
    // with scaleX=1 skewX=0 skewY=0  scaleY=1 (1-no scale and 0-no skew) just translate
    // NOTE: transform:translate is defined in the Tooltip.svelte and must specify
    // the same left/top values as the one in this css return value
    return {
      delay,
      duration,
      css: (t) => {
        const eased = easing(t);
        return `opacity: ${eased * opacity}; transform: translate(${translateX},${translateY}) scale(${eased * s * is + baseScale}) `;
      },
    };
  }

