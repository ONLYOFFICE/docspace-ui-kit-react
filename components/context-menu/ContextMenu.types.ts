import type { TLogo } from "../../types";

export type ContextMenuRefType = {
  show: (e: React.MouseEvent | MouseEvent) => void;
  hide: (
    e:
      | React.MouseEvent
      | MouseEvent
      | Event
      | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  toggle: (
    e:
      | React.MouseEvent
      | MouseEvent
      | Event
      | React.ChangeEvent<HTMLInputElement>,
  ) => boolean | undefined;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

export type TContextMenuValueTypeOnClick =
  | {
      originalEvent: React.MouseEvent | React.ChangeEvent<HTMLInputElement>;
      action?: string | boolean;
      item?: ContextMenuType;
    }
  | React.MouseEvent
  | React.ChangeEvent<HTMLInputElement>;

export type ContextMenuTypeOnClick = (
  value: TContextMenuValueTypeOnClick,

  item?: ContextMenuType,
) => void;

export type ContextMenuType = {
  /** Applied to the item element. */
  id?: string;
  /** Identifier of the item, used as its React key. */
  key: string | number;
  /** What the item reads. A string also becomes its hover tooltip. */
  label: string | React.ReactNode;
  /** URL of the item's icon, fetched at runtime. `iconNode` is the alternative. */
  icon?: string;
  /** Greys the item out and stops its `onClick`. */
  disabled?: boolean;
  /** Called when the item is chosen, with the event and the item itself. */
  onClick?: ContextMenuTypeOnClick;
  /** Absent on a normal item; it is what tells the two shapes apart. */
  isSeparator?: undefined;
  /** Makes the item a link to this address rather than a button. */
  url?: string;
  /** Items of a submenu, which an arrow then opens to the side. */
  items?: ContextMenuModel[];
  /** Arbitrary name handed back to `onClick` as its `action`. */
  action?: string;
  /** Applied to the item element. */
  className?: string;
  /** Colour of the item's text while it is disabled. */
  disableColor?: string;
  /** Applied to the item element. */
  style?: React.CSSProperties;
  /** `target` of the link, for an item with a `url`. */
  target?: string;
  /** Renders a skeleton in place of the item. */
  isLoader?: boolean;
  /** Renders the item as a heading rather than a choice. */
  isHeader?: boolean;
  /** Loads the submenu's items when the item is opened. */
  onLoad?: () => Promise<ContextMenuModel[]>;
  /** Ignored by this component. */
  template?: unknown;
  /** Marks a `url` as leaving the application, which draws the external-link icon. */
  isOutsideLink?: boolean;
  /** Renders a toggle at the end of the item instead of an action. */
  withToggle?: boolean;
  /** Whether that toggle is on. */
  checked?: boolean;
  /** Text of the paid badge. */
  badgeLabel?: string;
  /** Renders that badge. */
  isPaidBadge?: boolean;
  /** Stops a `url` opening in a new tab. */
  preventNewTab?: boolean;
  /** Value of `data-testid` on the item. */
  dataTestId?: string;
  /** Which part of the item the tooltip is anchored to. */
  tooltipTarget?: "item" | "toggle";
  /** Builds the tooltip's content. */
  getTooltipContent?: () => React.ReactNode;
  /** Secondary line rendered under the item label and always visible - what
   * choosing this item means. The item grows to fit it. */
  description?: React.ReactNode;
  /** Draws the MCP icon after the label. */
  withMCPIcon?: boolean;
  /** The icon as JSX, rendered inline instead of fetching `icon`. */
  iconNode?: React.ReactNode;
  /** Which disabled styling to use — the toggle variant keeps the label readable. */
  disabledStylesType?: "default" | "toggle";
};

export type SeparatorType = {
  /** Applied to the separator element. */
  id?: string;
  /** Identifier of the separator, used as its React key. */
  key: string | number;
  /** Always true. It is what marks this entry as a rule rather than an item. */
  isSeparator: boolean;
  /** Greys the rule out. */
  disabled?: boolean;
  /** Applied to the separator element. */
  className?: string;
  /** Colour of the rule while it is disabled. */
  disableColor?: string;
  /** Renders a skeleton in its place. */
  isLoader?: boolean;
  /** Applied to the separator element. */
  style?: React.CSSProperties;
  /** Value of `data-testid` on the separator. */
  dataTestId?: string;
};

export type HeaderType =
  | (TLogo & {
      title: string;
      avatar?: string;
      logo?: string;
      icon?: string;
      badgeUrl?: string;
      badgeIconColor?: string;
    })
  | { title: string; icon: string; badgeUrl?: string; badgeIconColor?: string };

export type ContextMenuModel = ContextMenuType | SeparatorType;

export type TMobileMenuStackItem = {
  items: ContextMenuModel[];
  header: string;
};

export type TOnMobileItemClick = (
  e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  label: string,
  items?: ContextMenuModel[],
  loadFunc?: () => Promise<ContextMenuModel[]>,
) => void;

export type TGetContextMenuModel = () => ContextMenuModel[];

export interface ContextMenuProps {
  /** Applied to the menu element. */
  id?: string;
  /**
   * The items. It is read only while the menu opens, and `getContextModel`
   * replaces it entirely when that is given.
   */
  model: ContextMenuModel[];
  /** Title, icon and badge of the bar above the items, on the mobile sheet. */
  header?: HeaderType;
  /** Applied to the menu element. */
  style?: React.CSSProperties;
  /** Applied to the menu element. */
  className?: string;
  /** Ignored. Nothing reads this prop. */
  global?: boolean;
  /**
   * Whether a backdrop is rendered behind the menu. It is only visible when the
   * menu is in its mobile sheet form, so on a desktop it shows nothing.
   */
  withBackdrop?: boolean;
  /** Forces that mobile sheet form, and with it the backdrop, at any width. */
  ignoreChangeView?: boolean;
  /** Ignored. Nothing reads this prop.
   * @default true */
  autoZIndex?: boolean;
  /** Stacking order of the backdrop. */
  baseZIndex?: number;
  /** Element the menu is rendered into, instead of `document.body`. */
  appendTo?: HTMLElement;
  /** Specifies a callback function that is invoked when a popup menu is shown */
  onShow?: (
    e:
      | React.MouseEvent
      | MouseEvent
      | Event
      | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Specifies a callback function that is invoked when a popup menu is hidden */
  onHide?: (
    e?:
      | React.MouseEvent
      | MouseEvent
      | Event
      | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /**
   * Element to position the menu against instead of the pointer. With it the
   * menu opens at that element's top-left corner rather than where the user
   * clicked.
   */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** Matches the menu's width to that container's. */
  scaled?: boolean;
  /** Recolours the items' icons to the text colour.
   * @default true */
  fillIcon?: boolean;
  /**
   * Builds the items each time the menu opens, replacing `model`. This is the
   * one to use for a menu whose entries depend on the current selection.
   */
  getContextModel?: TGetContextMenuModel;
  /** Shifts the menu left by this many pixels, when positioned against a container. */
  leftOffset?: number;
  /** Shifts it further left again; both offsets are subtracted. */
  rightOffset?: number;
  /** Renders the header in its room form, with a logo and a cover. */
  isRoom?: boolean;
  /** Renders that header in its archived form. */
  isArchive?: boolean;
  /**
   * Handle the menu is opened through: `show(event)`, `hide(event)` and
   * `toggle(event)`. There is no visibility prop — this is the only way.
   */
  ref?: React.RefObject<ContextMenuRefType | null>;
  /** URL of the badge image in the header. */
  badgeUrl?: string;
  /** Colour of that badge. */
  badgeIconColor?: string;
  /** Renders the header only in the mobile sheet form.
   * @default false */
  headerOnlyMobile?: boolean;
  /** Value of `data-testid` on the menu. */
  dataTestId?: string;
  /** Height cap of a second-level submenu, in pixels. */
  maxHeightLowerSubmenu?: number;
  /** Keeps disabled items in the menu instead of dropping them. */
  showDisabledItems?: boolean;
  /**
   * Whether the arrow keys, Enter and Escape work while the menu is open. This
   * is the one menu in the kit that can be used from the keyboard.
   * @default true
   */
  withHotkeys?: boolean;
  /** Removes the back arrow from a submenu's header on the mobile sheet. */
  withoutBackHeaderButton?: boolean;
  /** Maximum height for the context menu content area */
  maxHeight?: number;
}

export type TContextMenuRef = {
  show: (e: React.MouseEvent) => void;
  hide: (e: React.MouseEvent) => object | void;
};
