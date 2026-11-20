import React from "react";

import { InputSize } from "../text-input";
import type { MainButtonProps } from "../main-button/MainButton.types";

export type SearchInputProps = React.AriaAttributes & {
  /** Id set on both the outer element and the `<input>`. */
  id?: string;
  /** Ref to the `<input>`. */
  forwardedRef?: React.Ref<HTMLInputElement>;
  /** Name under which the term is submitted with a form. */
  name?: string;
  /** Class added to the outer element. */
  className?: string;
  /** Height and type size of the field. */
  size: InputSize;
  /** The search term. The field keeps its own copy while the user types and
   * re-seeds it from this prop whenever the prop changes. */
  value: string;
  /** Makes the field fill the width of its container.
   * @default false */
  scale?: boolean;
  /** Text shown while the field is empty. */
  placeholder?: string;
  /** Called with the **string** typed, not the change event, unlike every
   * other input in this kit. It waits for `refreshTimeout` of quiet typing. It
   * is not called when `autoRefresh` is false, or when the clear button empties
   * the field. */
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
  /** Rendered before the input, inside the same border: `InputBlock`'s prefix. */
  children?: React.ReactNode;
  /** Inline style of the outer element. */
  style?: React.CSSProperties;
  /** Called when the field receives focus. */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Value of `data-testid` on the outer element.
   * @default "search-input" */
  dataTestId?: string;
  /** Place of the field in the tab order; left out, the natural one. */
  tabIndex?: number;
  /** Renders a `MainButton` to the left of the field, for the "create new"
   * action a search bar often sits beside.
   * @default false */
  showMainButton?: boolean;
  /** Props of the `MainButton` drawn before the field. `showMainButton` is
   * needed too. */
  mainButtonProps?: MainButtonProps;
  /** Icon inside the main button, 12×12; a plus when left out. */
  mainButtonIcon?: React.ReactNode;
  /** Value of `data-testid` on the main button's wrapper. */
  mainButtonDataTestId?: string;
  /** Leaves the field out, so only the main button is drawn. The block still
   * takes its width, so whatever follows it stays where it was. */
  hideField?: boolean;
};
