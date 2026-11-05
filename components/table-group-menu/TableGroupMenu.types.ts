import type React from "react";

import type { ContextMenuModel } from "../context-menu";

/** One button of the group menu. */
export type TGroupMenuItem = {
  /** Text of the button. */
  label: string;
  /** Greys the button out. */
  disabled: boolean;
  /** Called when the button is clicked. */
  onClick: (e: React.MouseEvent) => void;
  /** URL of the button's icon, fetched at runtime. */
  iconUrl: string;
  /** Hover tooltip of the button. */
  title: string;
  /** Whether the button opens `options` as a menu. */
  withDropDown?: boolean;
  /** Items of that menu. */
  options?: ContextMenuModel[];
  /** Identifier, used as the React key and in the test id. */
  id: string;
  /** Lays the button out for a phone. */
  isMobileView?: boolean;
  /** When true, applies fixed width (161px) and responsive height for the dropdown */
  fixedDropdownStyles?: boolean;
};

interface TableGroupMenuBased {
  /** Whether the select-all checkbox is ticked. */
  isChecked: boolean;
  /** Whether it is drawn as partly ticked. */
  isIndeterminate: boolean;
  /** The buttons of the menu, in order. */
  headerMenu: TGroupMenuItem[];
  /** Element whose children become the options of the selection combo box. */
  checkboxOptions?: React.ReactElement<{ children?: React.ReactNode }>;
  /** Called on a click anywhere in the menu. */
  onClick?: () => void;
  /** Called with the new state when the select-all checkbox changes. */
  onChange: (isChecked: boolean) => void;
  /** Margin around that checkbox, as a CSS length. */
  checkboxMargin?: string;
  /** Whether the info-panel button at the end is left out. */
  withoutInfoPanelToggler: boolean;
  /** Colours that button as active. */
  isInfoPanelVisible?: boolean;
  /** Lays the buttons out for a phone. */
  isMobileView?: boolean;
  /** Greys every button out. */
  isBlocked?: boolean;
  /** Called when the info-panel button is clicked. */
  toggleInfoPanel?: () => void;
  /** Whether the selection combo box is rendered next to the checkbox.
   * @default true */
  withComboBox?: boolean;
  /** Text shown instead of the select-all checkbox. */
  headerLabel?: string;
}

export type TGroupMenuProps = Pick<
  TableGroupMenuBased,
  "headerMenu" | "isBlocked" | "isMobileView"
>;

export type TableGroupMenuProps =
  | (TableGroupMenuBased & {
      /** Whether a close cross is rendered. It comes with `onCloseClick` or not at all. */
      isCloseable?: undefined;
      /** Called by that cross. */
      onCloseClick?: undefined;
    })
  | (TableGroupMenuBased & {
      /** Whether a close cross is rendered. It comes with `onCloseClick` or not at all. */
      isCloseable: boolean;
      /** Called by that cross. */
      onCloseClick: () => void;
    });
