import { ContextMenuModel } from "../context-menu";
import { type TDirectionX, TDirectionY } from "../../types";

export type TDropdownType = "alwaysDashed" | "appearDashedAfterHover";

export type SimpleLinkWithDropdownProps = {
  /** Sets font weight to bold */
  isBold?: boolean;
  /** Link font size */
  fontSize?: string;
  /** Link font weight */
  fontWeight?: number;
  /** Activates text-overflow with ellipsis */
  isTextOverflow?: boolean;
  /** Indicates if the link is in hover state */
  isHovered?: boolean;
  /** Sets opacity to 0.5 for pending status */
  isSemitransparent?: boolean;
  /** Link color */
  color?: string;
  /** Link title attribute */
  title?: string;
  /** Disables the link */
  isDisabled?: boolean;
  /** Dropdown display type */
  dropdownType?: TDropdownType;
  /** Dropdown menu items */
  data?: ContextMenuModel[];
  /** Link content */
  children?: React.ReactNode;
};

export type LinkWithDropDownProps = SimpleLinkWithDropdownProps & {
  /** Displays the expander icon */
  withExpander?: boolean;
  /** Controls dropdown visibility */
  isOpen?: boolean;
  /** Additional CSS class for the link */
  className?: string;
  /** Additional CSS class for the dropdown */
  dropDownClassName?: string;
  /** HTML id attribute */
  id?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Sets the dropdown opening horizontal direction */
  directionX?: TDirectionX;
  /** Sets the dropdown opening vertical direction */
  directionY?: TDirectionY;
  /** Enables scrollbar in dropdown */
  hasScroll?: boolean;
  /** Manual width for the dropdown */
  manualWidth?: string;
  /** Is aside */
  isAside?: boolean;
  /** Without blur background */
  withoutBackground?: boolean;
  /** Fix dropdown direction regardless of available space */
  fixedDirection?: boolean;
  /** Use default mode for dropdown positioning */
  isDefaultMode?: boolean;
  /** Minimum space from top of viewport */
  topSpace?: number;
  /** Minimum space from bottom of viewport */
  bottomSpace?: number;
  /** Enables dynamic height calculation and project Scrollbar for the dropdown list */
  withDynamicScrollbar?: boolean;
};
