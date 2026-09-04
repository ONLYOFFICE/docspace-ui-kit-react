import { TabsTypes } from "./Tabs.enums";

export type TTabItem = {
  /** Element id. */
  id: string;
  /** Tab text. */
  name: string | React.ReactNode;
  /** Content that is shown when you click on the tab. */
  content: React.ReactNode;
  /** State of tab inclusion. State only works for tabs with a secondary theme. */
  isDisabled?: boolean;
  /** Sets a callback function that is triggered when the tab is selected */
  onClick?: () => void | Promise<void>;
  /** Badge shown after tab. Only for primary tabs type */
  badge?: React.ReactNode;

  value?: number;
  /** Icon name. Only for secondary tabs type */
  iconName?: string;
};

export type TabsProps = {
  /** Child elements. */
  items: TTabItem[];
  /** Selected item of tabs. */
  selectedItemId: number | string;
  /** Theme for displaying tabs. */
  type?: TabsTypes;
  /** Tab indentation for sticky positioning. */
  stickyTop?: string;
  /** Sets a tab class name */
  className?: string;
  /** Sets a callback function that is triggered when the tab is selected. */
  onSelect?: (element: TTabItem) => void;
  /** Disables sticky indent */
  withoutStickyIntend?: boolean;
  /** Accepts css style  */
  style?: React.CSSProperties;
  /** If set, this component will animate changes to its layout. Additionally, when a new element enters the DOM and an element already exists with a matching layoutId, it will animate out from the previous element's size/position. */
  layoutId?: string;
  /** Is loading */
  isLoading?: boolean;
  /** Scales tabs to container width */
  scaled?: boolean;
  /** Unique identifier for hotkey functionality */
  hotkeysId?: string;
  /** Element id */
  id?: string;
  /** Enables animation for tab transitions */
  withAnimation?: boolean;
  /** Content rendered sticky above the tab bar */
  stickyHeader?: React.ReactNode;
};

export type TTabsHotkey = {
  /** Determines whether keyboard hotkeys are enabled for tab navigation */
  enabledHotkeys: boolean;
  /** Sets the active state of hotkeys */
  setHotkeysIsActive: (focusedTabIndex: boolean) => void;
  /** Tab items to be rendered */
  items: TTabItem[];
  /** Index of the currently focused tab */
  focusedTabIndex: number;
  /** Sets the index of the focused tab */
  setFocusedTabIndex: (focusedTabIndex: number) => void;
  /**  Scrolls to bring a specific tab into view */
  scrollToTab: (index: number) => void;
  /** Sets a callback function that is triggered when the tab is selected */
  onSelect?: (element: TTabItem) => void;
  /** Unique identifier for hotkey functionality */
  hotkeysId?: string;
};
