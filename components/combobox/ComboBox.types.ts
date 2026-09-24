import type { ShareAccessRights } from "../../enums";

import type { TContextMenuValueTypeOnClick } from "../context-menu/ContextMenu.types";
import type { TColorScheme } from "../../context/ThemeContext";
import type { TDirectionX, TDirectionY } from "../../types";
import type { ComboBoxDisplayType, ComboBoxSize } from "./ComboBox.enums";

export type TCombobox = null | "badge" | "onlyIcon" | "descriptive";

export type TBaseOption = {
  key: string | number;
  icon?: string | React.ElementType | React.ReactElement;
  label?: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  border?: string;
  default?: boolean;
  disabled?: boolean;
  type?: string;
  description?: string;
  quota?: "free" | "paid";
  isSelected?: boolean;
  isBeta?: boolean;
  internal?: boolean;
  access?: ShareAccessRights;
  className?: string;
  title?: string;
  dataTestId?: string;
  action?: unknown;
  onClick?: (opt: TContextMenuValueTypeOnClick) => void;
  pageNumber?: number;
  count?: number;
  tooltip?: string;
  fillIcon?: boolean;
  withExternalLink?: boolean;
  externalLinkPath?: string;
  onExternalLinkClick?: () => void;
};

export type TRegularOption = TBaseOption & {
  label: React.ReactNode;
  isSeparator?: boolean;
};

export type TSeparatorOption = TBaseOption & {
  isSeparator?: true;
};

export type TOption = TRegularOption | TSeparatorOption;

export type TComboboxProps = {
  /**
   * Element whose children replace the list entirely, for a menu that is not a
   * list of options. `options` is then used only for the button.
   */
  advancedOptions?: React.ReactElement<{ children?: React.ReactNode }>;
  /** How many advanced options there are, for deciding the mobile layout. */
  advancedOptionsCount?: number;
  /**
   * Content rendered inside the button, before the label. A click on it is
   * ignored unless `disableIconClick` is false.
   */
  children?: React.ReactNode;
  /** Applied to the element that wraps the button and the list. */
  className?: string;
  /** Applied to the list element. */
  dropDownClassName?: string;
  /** Icon to draw instead of the arrow: a component, an element, or a URL. */
  comboIcon?: string | React.ReactNode;
  /**
   * Whether a click on `children` is swallowed instead of opening the list.
   * @default true
   */
  disableIconClick?: boolean;
  /** Stops the list opening at all, without the disabled styling. */
  disableItemClick?: boolean;
  /** The same, but only for first-level items on a touch device. */
  disableItemClickFirstLevel?: boolean;
  /** Preferred horizontal side of the list; it flips to fit the viewport. */
  directionX?: TDirectionX;
  /** Preferred vertical side of the list; it flips to fit the viewport. */
  directionY?: TDirectionY;
  /**
   * `toggle` renders the button alone and no list at all, for a control that
   * only looks like a combo box.
   * @default ComboBoxDisplayType.default
   */
  displayType?: ComboBoxDisplayType;
  /**
   * Keeps the option that is currently selected usable and highlights it.
   * Without it that option is rendered disabled, so the value cannot be picked
   * again.
   */
  displaySelectedOption?: boolean;
  /** Draws the arrow even when there are no options to open. */
  displayArrow?: boolean;
  /**
   * Height of the list in pixels. It is also what gives the list a scrollbar:
   * without it a long list is rendered in full.
   */
  dropDownMaxHeight?: number;
  /** Value of `data-testid` on the list. */
  dropDownTestId?: string;
  /** Ignored. The list is always told to keep disabled options. */
  showDisabledItems?: boolean;
  /** Recolours the selected option's icon to the text colour. */
  fillIcon?: boolean;
  /** Keeps `directionX` and `directionY` as given instead of flipping them. */
  fixedDirection?: boolean;
  /** Number shown as `+N` after the label, for a multi-select summary. */
  plusBadgeValue?: number;
  /** Stops the outside-click listener being registered. */
  forceCloseClickOutside?: boolean;
  /** Keeps the list anchored to the button on a phone instead of turning it into a bottom sheet. */
  hideMobileView?: boolean;
  /** Applied to the element that wraps the button and the list. */
  id?: string;
  /** Applied to the list element. */
  dropDownId?: string;
  /** Marks the list's backdrop as belonging to a side panel. */
  isAside?: boolean;
  /** Greys the button out and stops it opening. */
  isDisabled?: boolean;
  /** Replaces the arrow with a spinner and stops the button opening. */
  isLoading?: boolean;
  /**
   * Whether the list is rendered in a portal on `document.body`.
   * @default true
   */
  isDefaultMode?: boolean;
  /** Pins the list to the bottom of the screen, full width, in portrait. */
  isMobileView?: boolean;
  /** Renders the options in a plain scrollbar instead of the virtualised list. */
  isNoFixedHeightOptions?: boolean;
  /**
   * Width of the list as a CSS length. It has nothing to do with the button's
   * width — use `scaledOptions` for that.
   * @default "200px"
   */
  manualWidth?: string;
  /** (Non-portal mode) Exact horizontal offset of the list from the button. */
  manualX?: string;
  /** (Non-portal mode) Exact vertical offset of the list from the button. */
  manualY?: number | string;
  /** Compact button with no background until it is open. */
  modernView?: boolean;
  /** Removes the button's border. */
  noBorder?: boolean;
  /** Horizontal offset of the list, in pixels. */
  offsetX?: number;
  /**
   * Opens or closes the list from outside. It seeds the internal state rather
   * than controlling it: the next click on the button wins until this changes.
   */
  opened?: boolean;
  /**
   * The options. Each needs a unique `key`, and a `label` unless it is a
   * separator; `disabled`, `icon`, `description`, `isBeta` and `tooltip` are
   * passed to the row.
   */
  options: TOption[];
  /** Inline style applied to every option. */
  optionStyle?: React.CSSProperties;
  /** Ignored. Nothing reads this prop; there is no search field. */
  searchPlaceholder?: string;
  /**
   * The option to show in the button. The component does not choose it: keep it
   * in your own state and set it from `onSelect`.
   */
  selectedOption: TOption;
  /**
   * Makes the button take the full width of its parent, which overrides `size`.
   * @default true
   */
  scaled?: boolean;
  /** Matches the list's width to the button's instead of `manualWidth`. */
  scaledOptions?: boolean;
  /** Called with the open state whenever it changes, alongside `onToggle`. */
  setIsOpenItemAccess?: (isOpen: boolean) => void;
  /**
   * One of the fixed widths — 173, 300, 350 or 500px, or the content's own. It
   * only applies when `scaled` is false.
   * @default ComboBoxSize.base
   */
  size?: `${ComboBoxSize}`;

  /** Ignored. Nothing reads this prop. */
  role?: string;
  /** Applied to the wrapper and, again, to the list. */
  style?: React.CSSProperties;
  /**
   * Position of the button in the tab order. It is `0` by default, so the
   * control is reachable; pass `-1` to take it off the tab order.
   * @default 0
   */
  tabIndex?: number;
  /** Truncates an option's label with an ellipsis instead of wrapping it. */
  textOverflow?: boolean;
  /** Hover tooltip for the whole control. It needs `RootTooltip` mounted. */
  title?: string;
  /** Space to leave above the list when it opens upwards, in pixels. */
  topSpace?: number;
  /**
   * Shape of the button: `badge` draws the label as a coloured badge,
   * `onlyIcon` drops the label, `descriptive` adds the option's `description`
   * under it.
   */
  type?: TCombobox;
  /** Moves the list's backdrop into the portal, above the page. */
  usePortalBackdrop?: boolean;
  /**
   * Whether the list renders a backdrop to catch the next click.
   * @default true
   */
  withBackdrop?: boolean;
  /** Gives that backdrop its dimming background. */
  withBackground?: boolean;
  /** Ignored. It reaches the list, which does not read it either. */
  withBlur?: boolean;
  /**
   * Whether the selected option is matched by label rather than by key.
   * @default true
   */
  withLabel?: boolean;
  /** Makes that backdrop transparent. */
  withoutBackground?: boolean;
  /** Removes the vertical padding around the button. */
  withoutPadding?: boolean;
  /** Ignored. Nothing reads this prop; there is no search field. */
  withSearch?: boolean;
  /** Called when a click outside closes the list, if `withBackdrop` is on. */
  onBackdropClick?: (e: Event) => void;
  /** Called when the option already selected is clicked again. */
  onClickSelectedItem?: (option: TOption) => void;
  /**
   * Called with the option that was clicked. Nothing changes on its own —
   * `selectedOption` is yours to update.
   */
  onSelect?: (option: TOption) => void;
  /**
   * Called when the button is clicked, with the state being asked for. Passing
   * it without `onBackdropClick` also stops a click outside closing the list.
   */
  onToggle?: (e: React.MouseEvent<HTMLDivElement>, isOpen: boolean) => void;

  /** Renders the backdrop even when another one is already on screen. */
  shouldShowBackdrop?: boolean;
  /** Value of `data-testid` on the wrapper.
   * @default "combobox" */
  dataTestId?: string;
  /**
   * Whether the button's text cannot be selected.
   * @default true
   */
  noSelect?: boolean;
  /** Draws the kit's placeholder image next to the selected option's icon. */
  useImageIcon?: boolean;
  /** Hides the arrow, whatever `displayArrow` and the options say. */
  withoutArrow?: boolean;
};

export type TComboButtonProps = {
  /** Indicates if the button has no border */
  noBorder?: boolean;
  /** Indicates if the button is disabled */
  isDisabled?: boolean;
  /** Selected option */
  selectedOption: TOption;
  /** Indicates if the button has options */
  withOptions?: boolean;
  /** Length of options */
  optionsLength?: number;
  /** Indicates if the button has advanced options */
  withAdvancedOptions?: boolean;
  /** Inner container content */
  innerContainer?: React.ReactNode;
  /** Inner container class name */
  innerContainerClassName?: string;
  /** Indicates if the dropdown is open */
  isOpen?: boolean;
  /** Size of the button */
  size?: ComboBoxSize;
  /** Indicates if the button is scaled */
  scaled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Icon for the combo button */
  comboIcon?: string | React.ReactNode;
  /** Indicates if the icon should be filled */
  fillIcon?: boolean;
  /** Indicates if modern view should be used */
  modernView?: boolean;
  /** Tab index */
  tabIndex?: number;
  /** Indicates if the button is loading */
  isLoading?: boolean;
  /** Type of the combo box */
  type?: TCombobox;
  /** Value for plus badge */
  plusBadgeValue?: number;
  /** Indicates if arrow should be displayed */
  displayArrow?: boolean;
  /** Disables text selection */
  noSelect?: boolean;
  /** Icon image */
  imageIcon?: string | React.ElementType | React.ReactElement;
  /** Image alt */
  imageAlt?: string;
  /** Hides the arrow completely */
  withoutArrow?: boolean;
};

export interface TComboButtonThemeProps {
  /** Current color scheme */
  $currentColorScheme?: TColorScheme;
  /** Interface direction */
  interfaceDirection?: string;
  /** Number of options */
  containOptions?: number;
  /** Indicates if option is selected */
  isSelected?: boolean;
  /** Class name */
  className?: string;
  /** Indicates if arrow should be displayed */
  displayArrow?: boolean;
  /** Children elements */
  children?: React.ReactNode;
  /** Indicates if dropdown is open */
  isOpen?: boolean;
  /** Indicates if button is disabled */
  isDisabled?: boolean;
  /** Indicates if button has no border */
  noBorder?: boolean;
  /** Indicates if button has advanced options */
  withAdvancedOptions?: boolean;
  /** Indicates if button is scaled */
  scaled?: boolean;
  /** Size of the button */
  size?: ComboBoxSize;
  /** Indicates if modern view should be used */
  modernView?: boolean;
  /** Indicates if button is loading */
  isLoading?: boolean;
  /** Type of the combo box */
  type?: TCombobox;
  /** Selected option */
  selectedOption?: TOption;
  /** Value for plus badge */
  plusBadgeValue?: number;
  /** Click handler */
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  "aria-disabled"?: boolean;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
  "aria-haspopup"?:
    | boolean
    | "dialog"
    | "grid"
    | "listbox"
    | "menu"
    | "tree"
    | "true"
    | "false";
  "data-test-id"?: string;
}
