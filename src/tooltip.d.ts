  type TPoint = {
    x: number;
    y: number;
  };
  type THoveringElement =
    | HTMLElement
    | HTMLButtonElement
    | HTMLDivElement
    | HTMLSelectElement
    | HTMLInputElement
    | HTMLAnchorElement;
  type TTooltipPosition =
    | 'top-left'
    | 'top-middle'
    | 'bottom-left'
    | 'bottom-middle'
    | 'bottom-right'
    | TPoint;