import type { LoaderTypes } from "./Loader.enums";

export type LoaderProps = {
  /** Reaches the `<svg>` of the `track` type; the other types ignore it. */
  ref?: React.RefObject<SVGSVGElement>;
  /** Any CSS colour, applied as the stroke of the animation and the colour of
   * the `base` type's text. */
  color?: string;
  /** Which animation to render: `oval`, `dualRing`, `rombs` or `track`.
   * Without it the loader is an `oval`. `base` is not an animation: it renders
   * `label` as plain text and nothing else. */
  type?: LoaderTypes;
  /** Size of the animation as a CSS length, applied to both axes. The
   * stylesheet falls back to 40px for most types and 20px for `track`. For the
   * `base` type this is the font size of the text instead. */
  size?: string;
  /** What assistive technology reads: the visually hidden text of the
   * loader's `role="status"` region, under the decorative animation. For the
   * `base` type it is the visible content instead. Defaults to "Loading
   * content, please wait." */
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
