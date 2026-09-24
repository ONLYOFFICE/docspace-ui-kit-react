import type { TComboboxProps } from "../combobox";

type PropsFromCombobox = Pick<
  TComboboxProps,
  | "className"
  | "selectedOption"
  | "advancedOptions"
  | "scaled"
  | "scaledOptions"
  | "size"
  | "manualWidth"
  | "onSelect"
  | "directionX"
  | "directionY"
  | "fixedDirection"
  | "isAside"
  | "manualY"
  | "withoutBackground"
  | "withBackground"
  | "withBlur"
  | "type"
  | "noBorder"
  | "isDisabled"
  | "isMobileView"
  | "shouldShowBackdrop"
  | "dataTestId"
  | "noSelect"
  | "isLoading"
  | "showDisabledItems"
  | "withBackdrop"
  | "title"
  | "displaySelectedOption"
>;

export type AccessRightSelectProps = PropsFromCombobox & {
  /**
   * The access levels to choose from. Each is rendered as a row with its icon,
   * label, description and quota badge; an entry with `isSeparator` becomes a
   * divider. Ignored when `advancedOptions` is given.
   */
  accessOptions: TComboboxProps["options"];
  /**
   * Whether picking a level other than the current one is refused. What is
   * still allowed is `availableAccess`; everything else raises a toast.
   */
  isSelectionDisabled?: boolean;
  /** The toast shown when a refused level is picked. */
  selectionErrorText?: React.ReactNode;
  /**
   * The `access` values that may still be chosen while `isSelectionDisabled` is
   * set. Without it only the current level is allowed.
   */
  availableAccess?: number[];
  /** Passed straight to `ComboBox`: space above the drop-down, in pixels. */
  topSpace?: number;
  /** Passed straight to `ComboBox`: its compact presentation. */
  modernView?: boolean;
  /** Passed straight to `ComboBox`: whether the arrow icon is recoloured. */
  fillIcon?: boolean;
  /** Passed straight to `ComboBox`: whether the drop-down renders in place rather than in a portal. */
  isDefaultMode?: boolean;
  /** Passed straight to `ComboBox`: URL of an icon to show instead of the arrow. */
  comboIcon?: string;
  /** Passed straight to `ComboBox`: whether the backdrop is rendered in a portal. */
  usePortalBackdrop?: boolean;
  /** Which side of the button the drop-down opens towards. */
  directionX?: string;
  /** Whether the drop-down opens above or below the button. */
  directionY?: string;
  /** `data-testid` of the combo button. */
  dataTestId?: string;
  /** Passed straight to `ComboBox`: told when the drop-down opens and closes. */
  setIsOpenItemAccess?: React.Dispatch<React.SetStateAction<boolean>>;
};
