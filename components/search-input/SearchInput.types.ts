import React from "react";

import { InputSize } from "../text-input";
import type { MainButtonProps } from "../main-button/MainButton.types";

export type SearchInputProps = {
  /** Used as HTML `id` property */
  id?: string;
  /** Forwarded ref */
  forwardedRef?: React.Ref<HTMLInputElement>;
  /** Sets the unique element name */
  name?: string;
  /** Accepts class */
  className?: string;
  /** Supported size of the input fields. */
  size: InputSize;
  /** The search term. The field keeps its own copy while the user types and
   * re-seeds it from this prop whenever the prop changes. */
  value: string;
  /** Makes the field fill the width of its container.
   * @default false */
  scale?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Called with the **string** the user typed, not with the change event —
   * unlike every other input in this kit. It is debounced by `refreshTimeout`,
   * and it is not called at all when `autoRefresh` is false or when the field
   * is cleared through the clear button. */
  onChange?: (value: string) => void;
  /** Called when the clear button is used. `onChange` is deliberately skipped
   * for that transition, so this is the only signal that the search term is now
   * empty. */
  onClearSearch?: () => void;
  /** Called when the field is clicked. */
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  /** Disables the field and greys it.
   * @default false */
  isDisabled?: boolean;
  /** Shows the cross that clears the field. Without it the user has to select
   * and delete the text.
   * @default false */
  showClearButton?: boolean;
  /** Milliseconds of quiet typing before `onChange` fires.
   * @default 1000 */
  refreshTimeout?: number;
  /** Whether typing triggers the debounced `onChange` at all. Setting it to
   * false does not make the callback immediate — it stops the component
   * calling it entirely.
   * @default true */
  autoRefresh?: boolean;
  /** Rendered inside the `MainButton`'s dropdown; ignored unless
   * `showMainButton` is set. */
  children?: React.ReactNode;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** The callback function that is called when the field is focused  */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Value of `data-testid` on the outer element.
   * @default "search-input" */
  dataTestId?: string;
  /** HTML tabindex property */
  tabIndex?: number;
  /** Renders a `MainButton` to the left of the field, for the "create new"
   * action a search bar often sits beside.
   * @default false */
  showMainButton?: boolean;
  /** Props for the MainButton displayed to the left of the search field */
  mainButtonProps?: MainButtonProps;
  /** Icon node rendered inside the MainButton (12x12) */
  mainButtonIcon?: React.ReactNode;
  /** data-testid for the main button wrapper element */
  mainButtonDataTestId?: string;
};
