import type { JSX } from "react";
import type { TDirectionX, TDirectionY } from "../../types";

export interface DropDownProps {
  /** Children elements */
  children?: React.ReactNode;
  /** Accepts class */
  className?: string;
  /** Required for determining a click outside DropDown with the withBackdrop parameter */
  clickOutsideAction?: (e: Event, open: boolean) => void;
  disableOnClickOutside?: boolean;
  enableOnClickOutside?: () => void;
  /** Sets the opening direction relative to the parent */
  directionX?: TDirectionX;
  /** Sets the opening direction relative to the parent */
  directionY?: TDirectionY;
  /** Accepts id */
  id?: string;
  /** Required for specifying the exact width of the component; for example; 100% */
  manualWidth?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualX?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualY?: string;
  /** Required if the scrollbar is displayed */
  maxHeight?: number;
  /** Sets the dropdown to be opened */
  open?: boolean;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Used to display backdrop */
  withBackdrop?: boolean;
  /** Count of columns */
  columnCount?: number;
  /** Sets the disabled items to display */
  showDisabledItems?: boolean;
  forwardedRef?: React.RefObject<HTMLElement | null>;
  /** Sets the operation mode of the component. The default option is set to portal mode */
  isDefaultMode?: boolean;
  /** Disables check position. Used to set the direction explicitly */
  fixedDirection?: boolean;
  /** Enables blur for backdrop */
  withBlur?: boolean;
  /** (Portal only) Specifies the horizontal offset */
  offsetX?: number;
  /** Test id */
  dataTestId?: string;

  isMobileView?: boolean;
  isNoFixedHeightOptions?: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar (allows shrinking when fewer items) */
  useFlexibleHeight?: boolean;
  enableKeyboardEvents?: boolean;
  appendTo?: HTMLElement;
  isAside?: boolean;
  withBackground?: boolean;
  eventTypes?: string[] | string;
  forceCloseClickOutside?: boolean;
  withoutBackground?: boolean;
  zIndex?: number;
  topSpace?: number;
  bottomSpace?: number;
  withDynamicScrollbar?: boolean;
  usePortalBackdrop?: boolean;
  backDrop?: JSX.Element | null;
  shouldShowBackdrop?: boolean;
}

export interface VirtualListProps {
  /** Width of the list */
  width: number;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Number of items in the list */
  itemCount: number;
  /** Maximum height of the list */
  maxHeight?: number;
  /** Calculated height based on items and maxHeight */
  calculatedHeight: number;
  /** Whether to use fixed height options */
  isNoFixedHeightOptions: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar */
  useFlexibleHeight?: boolean;
  /** Clean children elements */
  cleanChildren?: React.ReactNode;
  /** Children elements */
  children: React.ReactElement | React.ReactNode;
  /** Row component */
  Row: React.MemoExoticComponent<
    ({ data, index, style }: RowProps) => JSX.Element
  >;
  /** Whether to enable keyboard events */
  enableKeyboardEvents: boolean;
  /** Function to get item size */
  getItemSize: (index: number) => number;
}

export interface RowProps {
  /** Row data */
  data: {
    /** Children elements */
    children?: React.ReactNode;
    /** Currently active index */
    activeIndex?: number;
    /** Currently selected index */
    activedescendant?: number;
    /** Mouse move handler */
    handleMouseMove?: (index: number) => void;
  };
  /** Row index */
  index: number;
  /** Row style */
  style: React.CSSProperties;
}
