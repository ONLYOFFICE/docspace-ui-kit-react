import { RefObject } from "react";
import { ContextMenuModel } from "../context-menu";
import { GuidanceRefKey } from "../../enums";

export type MainButtonProps = {
  /** Text drawn in the button. It is the whole label: the component takes no children. */
  text?: string;
  /** Whether the button is inert: it dims to 60% opacity, the click and the keys are dropped, and `aria-disabled` is set. It stays focusable. */
  isDisabled?: boolean;
  /** Whether clicking opens the menu built from `model`. When `false`, the click calls `onAction` instead. */
  isDropdown?: boolean;
  /** Called with the event when the button is clicked or activated with Enter or Space. Only reached while `isDropdown` is `false`. */
  onAction?: (e: React.MouseEvent) => void;
  /**
   * Ignored. Nothing reads this prop, and it is not passed to the DOM.
   * @deprecated The menu's open state lives inside the component.
   */
  opened?: boolean;
  /** Applied to the button, after the component's own classes. */
  className?: string;
  /** Applied to the button, not to the wrapper around it. */
  id?: string;
  /** Applied to the button as inline style. */
  style?: React.CSSProperties;
  /** Items of the menu. Only read while `isDropdown` is `true`; may be left out otherwise. */
  model?: ContextMenuModel[];
  /** Whether the arrow beside the text is left out. The menu still opens. */
  hideArrow?: boolean;
  /** Registers the button's element (a `<button>`) in the portal's guidance map, for the onboarding tour.
   * @portal */
  setRefMap?: (
    key: GuidanceRefKey,
    ref: RefObject<HTMLDivElement | null>,
  ) => void;
  /**
   * Element the menu is anchored to and sized from. Without it the button's own
   * box is used; pass an outer wrapper when the button sits inside a larger
   * clickable area.
   */
  anchorRef?: RefObject<HTMLElement | null>;
};
