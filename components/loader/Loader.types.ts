import type { LoaderTypes } from "./Loader.enums";

export type LoaderProps = {
  /** Ignored. It is neither destructured nor forwarded to the SVG. */
  ref?: React.RefObject<SVGSVGElement>;
  /** Any CSS colour, applied as the stroke of the animation and the colour of
   * the `base` type's text. */
  color?: string;
  /** Which animation to render. There is **no default**, and `base` is not an
   * animation: both it and an absent `type` fall through to a branch that
   * renders `label` as plain text and nothing else. Pass `oval`, `dualRing`,
   * `rombs` or `track` for something that spins. */
  type?: LoaderTypes;
  /** Size of the animation as a CSS length, applied to both axes. The
   * stylesheet falls back to 40px for most types and 20px for `track`. For the
   * `base` type this is the font size of the text instead. */
  size?: string;
  /** Accessible name of the animation, set as its `aria-label`. For the `base`
   * type it is not a label at all but the entire rendered content. */
  label?: string;
  /** Applied to the wrapper around the animation, not to the animation. */
  className?: string;
  /** Applied to the wrapper. */
  id?: string;
  /** Applied to the wrapper, and again to the inner span of the `base` type. */
  style?: React.CSSProperties;
  /** Uses the primary button's track colour, for a loader drawn on top of a
   * primary button. Read by the `track` type only. */
  primary?: boolean;
  /** Dims the animation to the disabled opacity. Read by the `track` type
   * only. */
  isDisabled?: boolean;
};

export type LoaderThemeProps = LoaderProps & {
  ref: SVGSVGElement;
  viewBox?: string;
  xmlns?: string;
};
