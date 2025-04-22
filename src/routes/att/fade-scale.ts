  export function fadeScale(
    node: HTMLElement,
    { delay = 0, duration = 200, easing = (x) => x, baseScale = 0 },
  ) {
    const o = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = m ? Number(m[1]) : 1;
    const is = 1 - baseScale;

    return {
      delay,
      duration,
      css: (t) => {
        const eased = easing(t);
        return `opacity: ${eased * o}; transform: translate(-1.2rem,-110%) scale(${eased * s * is + baseScale}) `;
      },
    };
  }
