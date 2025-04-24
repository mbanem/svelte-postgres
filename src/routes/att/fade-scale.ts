  export function fadeScale(
    node: HTMLElement,
    { delay = 0, duration = 200, easing = (x) => x, baseScale = 0 },
  ) {
    const o = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = m ? Number(m[1]) : 1;
    const is = 1 - baseScale;

    // NOTE: transform:translate is defined in the Tooltip.svelte and must specify
    // the same left/top values as the one in this css return value
    return {
      delay,
      duration,
      css: (t) => {
        const eased = easing(t);
        return `opacity: ${eased * o}; transform: translate(-2rem,-120%) scale(${eased * s * is + baseScale}) `;
      },
    };
  }

