export interface SelectedItemProps {
  /** Text of the chip. A falsy label renders nothing at all. */
  label: React.ReactNode;
  /** Whether the chip shrinks to its content. Without it the chip fills the width of its container. */
  isInline?: boolean;
  /** Called when the cross is clicked, with `propKey`, `label`, `group` (`""` when it was not set) and the event. */
  onClose: (
    propKey: string | number,
    label: React.ReactNode,
    group?: string,
    e?: React.MouseEvent,
  ) => void;
  /** Called when anywhere but the cross is clicked, with `propKey`, `label`, `group` and the event. */
  onClick?: (
    propKey: string | number,
    label: React.ReactNode,
    group?: string,
    e?: React.MouseEvent<HTMLElement>,
  ) => void;
  /** Whether the chip is inert. Both handlers stop firing and the label and the cross grey out. */
  isDisabled?: boolean;
  /** Applied to the outermost element. */
  className?: string;
  /** Applied to the outermost element. */
  id?: string;
  /** Ignored. Nothing reads this prop; style the chip through `className` or the custom properties. */
  style?: React.CSSProperties;
  /** Identifier handed back to `onClose` and `onClick`. It is not used for anything else. */
  propKey: string | number;
  /** Second identifier handed back to both handlers, for chips that belong to several filters. */
  group?: string;
  /** Ref to the outermost element. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Applied to the cross button, in addition to the class the component needs there itself. */
  classNameCloseButton?: string;
  /** Whether the cross is left out. `onClose` then has nothing to fire it. */
  hideCross?: boolean;
  /** `title` attribute of the outermost element — the browser's own tooltip for a truncated label. */
  title?: string;
  /** `data-testid` of the outermost element. */
  dataTestId?: string;
  /** Glyph before the label: an SVG URL, or a component rendered with no props. */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Ignored. Nothing reads this prop; passing `onClick` is what makes the chip clickable. */
  clickable?: boolean;
  /** Whether the chip is drawn in its selected colours. */
  isActive?: boolean;
}
