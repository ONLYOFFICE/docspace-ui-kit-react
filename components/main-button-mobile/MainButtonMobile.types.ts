export type ButtonOption = {
  /** Unique identifier for the button option */
  key: string;
  /** Display text for the button */
  label: string;
  /** Icon URL or component for the button */
  icon?: string;
  /** Click handler for the button */
  onClick?: () => void;
  /** Indicates if the button is in error state */
  error?: boolean;
  /** Optional HTML id attribute */
  id?: string;
  /** If true, renders as a separator instead of a button */
  isSeparator?: boolean;
  /** Nested button options for submenu */
  items?: ButtonOption[];
};

export type ActionOption = {
  /** Action identifier */
  action?: string;
  /** Unique identifier for the action */
  key: string;
  /** Display text for the action */
  label: string;
  /** Additional CSS classes */
  className?: string;
  /** If true, renders as a separator */
  isSeparator?: boolean;
  /** Icon URL or component */
  icon?: string;
  /** Optional HTML id attribute */
  id?: string;
  /** Click handler for the action */
  onClick?: ({ action }: { action?: string }) => void;
  /** Nested action options for submenu */
  items?: ActionOption[];
  /** If true, hides the icon */
  withoutIcon?: boolean;
  /** If true, submenu is open by default */
  openByDefault?: boolean;
  /** Secondary line rendered under the item label */
  description?: React.ReactNode;
};

export type MainButtonMobileProps = React.AriaAttributes & {
  /** Handle exposing `contains` and `getButtonElement`, for deciding whether a click landed on the button. */
  ref?: React.RefObject<MainButtonMobileRef>;
  /** Merged into the wrapper's inline style, after the z-index the component sets itself. */
  style?: React.CSSProperties;
  /** Items of the upper group of the menu. An item with `items` becomes a submenu. */
  actionOptions?: ActionOption[];
  /** Items of the lower group, drawn on a background of its own. An item with `items` becomes a submenu. */
  buttonOptions?: ButtonOption[];
  /** Width of the menu, as a CSS length. */
  manualWidth?: string;
  /** Applied to the wrapper that carries the button and the menu. */
  className?: string;
  /** Whether the menu is open, copied into state whenever it changes. The button, the backdrop, an item, Escape and Back change that state too, reported through `onOpen` and `onClose`. */
  opened?: boolean;
  /** Called when the button opens the menu. Handle it with `onClose` to keep `opened` in step. */
  onOpen?: () => void;
  /** Called when the menu closes: from the button, the backdrop, a chosen item, Escape or the browser's Back. Not called on opening. */
  onClose?: () => void;
  /** Called when the alert badge is clicked or pressed, and only while `withAlertClick` is set. */
  onAlertClick?: () => void;
  /** Whether the alert badge is a button (named "Alert") that calls `onAlertClick`. Without it the badge is an image. */
  withAlertClick?: boolean;
  /** Whether the button opens the menu. When `false` it calls `onClick` and the menu never opens. */
  withMenu?: boolean;
  /** Whether the lower group takes the plain wrapper background instead of the accent one. */
  withoutButton?: boolean;
  /** Whether the alert badge is drawn over the button. It is hidden while the menu is open. */
  alert?: boolean;
  /** Called with the event when the button is clicked or pressed with Enter or Space, and only while `withMenu` is `false`. */
  onClick?: (e: React.MouseEvent) => void;
  /** Merged into the menu's inline style. The measured height is applied after it and wins. */
  dropdownStyle?: React.CSSProperties;
};

export type SubmenuItemProps = {
  /** Action option configuration */
  option: ActionOption;
  /** Function to toggle submenu visibility */
  toggle: (value: boolean) => void;
  /** Disables hover effects if true */
  noHover: boolean;
  /** Function to recalculate submenu height */
  recalculateHeight: () => void;
  /** Key of the currently opened submenu */
  openedSubmenuKey: string;
  /** Function to set the opened submenu key */
  setOpenedSubmenuKey: (value: string) => void;
  /** If true, submenu is open by default */
  openByDefault: boolean;
};

export interface MainButtonMobileRef {
  /** Checks if the given target element is contained within the main button component */
  contains: (target: HTMLElement) => boolean;
  /** Returns the ref object pointing to the main button DOM element */
  getButtonElement: () => React.RefObject<HTMLDivElement | null>;
}
