import { TabsTypes } from "./Tabs.enums";

export type TTabItem = {
  /** Identifier of the tab. `selectedItemId` is matched against it, and it prefixes the tab's `data-testid`. */
  id: string;
  /** Text of the tab. */
  name: string | React.ReactNode;
  /** What is rendered under the tab bar while this tab is the selected one. */
  content: React.ReactNode;
  /** Whether the tab is greyed out and cannot be selected, by a click, the keyboard or the segmented arrows. */
  isDisabled?: boolean;
  /** Called before `onSelect` when this tab is clicked. With `withAnimation` it is awaited and the body shows a loader meanwhile. */
  onClick?: () => void | Promise<void>;
  /** Rendered after the tab's text. Primary tabs only. */
  badge?: React.ReactNode;
  /** Ignored. Nothing in the component reads this; it is a slot for the caller's own bookkeeping. */
  value?: number;
  /** URL of an SVG drawn before the text. Secondary tabs only. */
  iconName?: string;
};

export type TabsProps = {
  /** The tabs, in the order they are drawn. Each carries its own content. */
  items: TTabItem[];
  /** `id` of the selected tab. This is a controlled component; set it from `onSelect`. An empty value selects the first tab. */
  selectedItemId: number | string;
  /** Which of the two tab bars is drawn: an underlined row, or a segmented control. */
  type?: TabsTypes;
  /** `top` of the sticky tab bar, as a CSS length. Without it the bar sticks to the top of the scrolling ancestor. */
  stickyTop?: string;
  /** Applied to the outermost element. */
  className?: string;
  /** Called with the whole tab object when a different tab is clicked. Clicking the selected one does nothing. */
  onSelect?: (element: TTabItem) => void;
  /** Whether the spacer under the tab bar is left out. */
  withoutStickyIntend?: boolean;
  /** Applied to the outermost element as inline style. */
  style?: React.CSSProperties;
  /** Shared `layoutId` of the sliding background, and the `id` of the tab list. Secondary tabs only. */
  layoutId?: string;
  /** Holds off the tab-width measurement until the labels are final. It renders no loader of its own. Secondary tabs only. */
  isLoading?: boolean;
  /** Whether the tabs share the container's width equally instead of being measured from the longest label. Secondary tabs only. */
  scaled?: boolean;
  /** Suffix of the class `secondary-tabs-scroll-<hotkeysId>` put on the tab scroller, for a caller that queries it. Keyboard navigation does not need it. Secondary tabs only. */
  hotkeysId?: string;
  /** Applied to the tab list on primary tabs, and to the outermost element on secondary ones. */
  id?: string;
  /** Whether selecting a tab animates the underline and awaits the item's `onClick` behind a loader. Primary tabs only. */
  withAnimation?: boolean;
  /** Rendered in its own sticky strip above the tab bar, which the bar then sticks below. Primary tabs only. */
  stickyHeader?: React.ReactNode;
};

export type TTabsHotkey = {
  /** Tab items to be rendered */
  items: TTabItem[];
  /** Index of the tab that holds the keyboard focus (the roving tab stop) */
  focusedTabIndex: number;
  /** Moves the keyboard focus to a tab and scrolls it into view */
  focusTab: (index: number) => void;
  /** Selects a tab, as a click on it would */
  selectTab: (index: number) => void;
};
