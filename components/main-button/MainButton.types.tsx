import { RefObject } from "react";
import { ContextMenuModel } from "../context-menu";
import { GuidanceRefKey } from "../../enums";


export type MainButtonProps = {
  /** Button text */
  text?: string;
  /** Sets the button to present a disabled state */
  isDisabled?: boolean;
  /** Activates a drop-down list for MainButton */
  isDropdown?: boolean;
  /** Sets a callback function that is triggered when the button is clicked */
  onAction?: (e: React.MouseEvent) => void;
  /** Opens DropDown */
  opened?: boolean; // TODO: Make us whole
  /** Accepts class */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Data model menu */
  model: ContextMenuModel[];
  /** Hide the dropdown arrow while keeping dropdown functionality */
  hideArrow?: boolean;
  /** Function to set reference map */
  setRefMap?: (
    key: GuidanceRefKey,
    ref: RefObject<HTMLDivElement | null>,
  ) => void;
  /**
   * Element used to anchor and size the dropdown. Defaults to the button's
   * own rect; pass an outer wrapper when the button is visually nested
   * inside a larger clickable area (e.g. inside SearchInput).
   */
  anchorRef?: RefObject<HTMLElement | null>;
};