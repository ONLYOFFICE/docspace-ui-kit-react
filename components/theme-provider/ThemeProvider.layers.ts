// What the mounted providers write on <html> and <body>. The page shows the
// layer added last; removing one shows the one below, and removing the last
// puts back what was there before any provider wrote. A stack rather than
// "restore what I found": a nested provider mounting in the same commit as
// its parent runs its effect first, and would put back an empty page under
// the parent when it went.
export const createPageLayers = <T>(
  apply: (value: T) => void,
  read: () => T,
) => {
  const layers: { value: T }[] = [];
  let baseline: { value: T } | null = null;

  const show = () => {
    const top = layers[layers.length - 1];
    if (top) {
      apply(top.value);
    } else if (baseline) {
      apply(baseline.value);
      baseline = null;
    }
  };

  return {
    add(value: T) {
      if (!layers.length) baseline = { value: read() };
      const layer = { value };
      layers.push(layer);
      show();
      return layer;
    },
    remove(layer: { value: T }) {
      const index = layers.indexOf(layer);
      if (index === -1) return;
      layers.splice(index, 1);
      show();
    },
  };
};

// Writes a value, or takes the property off for an empty one.
export const writeProperty = (
  style: CSSStyleDeclaration,
  name: string,
  value: string | null,
) => (value ? style.setProperty(name, value) : style.removeProperty(name));

export const writeAttribute = (
  element: HTMLElement,
  name: string,
  value: string | null,
) =>
  value === null
    ? element.removeAttribute(name)
    : element.setAttribute(name, value);
