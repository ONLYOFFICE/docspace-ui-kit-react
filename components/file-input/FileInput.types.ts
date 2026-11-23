import React from "react";

import { InputSize } from "../text-input";

export type FileInputProps = Omit<
  React.AriaAttributes,
  "aria-label" | "aria-description" | "aria-disabled"
> & {
  /** Applied to the outermost element. */
  style?: React.CSSProperties;
  /** Placeholder of the read-only field, shown until a file is chosen. */
  placeholder?: string;
  /**
   * Height of the field, which also picks the icon and button sizes: base and
   * middle take a 15px icon, large a 16px one.
   */
  size: InputSize;
  /** Whether the field stretches to fill its container. */
  scale?: boolean;
  /** Applied to the outermost element. */
  className?: string;
  /** Whether the field is drawn in its error colours. */
  hasError?: boolean;
  /** Whether the field is drawn in its warning colours. */
  hasWarning?: boolean;
  /** Applied to the hidden `<input type="file">`, not to the wrapper. */
  id?: string;
  /**
   * Whether the field is greyed and inert: a click, a drop, Enter and Space all
   * do nothing, and the control leaves the tab order.
   */
  isDisabled?: boolean;
  /**
   * Whether a spinner replaces the icon. It also makes the control inert, as
   * `isDisabled` does; the spinner is not shown when `buttonLabel` is set, since
   * the button has no loading form.
   */
  isLoading?: boolean;
  /** Name of the hidden file field. */
  name?: string;
  /**
   * Called with the files `accept` turned away. While it is set the component
   * shows no toast of its own for a refused pick or drop.
   */
  onReject?: (files: File[]) => void;
  /**
   * Called with the chosen files: a single `File` when one was picked, an array
   * when several were. Check for an array before reading `.name`.
   */
  onInput?: (file: File | File[]) => void;
  /**
   * Extensions and MIME types the dialog offers and a drop accepts, such as
   * `[".pdf", "image/*"]`. Left out, empty, or `[""]`, any file is accepted.
   */
  accept?: string[];
  /** Renders a button with this label in place of the icon. */
  buttonLabel?: string;
  /** Whether the icon is a document rather than a folder. */
  isDocumentIcon?: boolean;
  /**
   * Called when the field or the icon is clicked — but only while `fromStorage`
   * is set. Without it the click opens the file dialog and this never fires.
   */
  onClick?: (e: React.MouseEvent) => void;
  /** Id of the outer element, the one a `<label for>` should point at. */
  idButton?: string;
  /** Text shown in the field instead of the chosen file names, with `fromStorage`. */
  path?: string;
  /**
   * Turns the control into a button that picks from somewhere else. The hidden
   * file input is left out, `path` is shown, and clicks go to `onClick`.
   */
  fromStorage?: boolean;
  /**
   * Whether several files may be chosen at once.
   * @default true
   */
  isMultiple?: boolean;
  /** Accessible name of the control. There is none without it. */
  "aria-label"?: string;
  /** Accessible description of the control. */
  "aria-description"?: string;
  /** Marks the control disabled to assistive technology while it still takes
   * clicks and drops. `isDisabled` and `isLoading` set it to `true` over this
   * value. */
  "aria-disabled"?: React.AriaAttributes["aria-disabled"];
  /**
   * Sets the outer element's `data-testid`, despite the hyphenated name.
   * @default "file-input"
   */
  "data-test-id"?: string;
};
