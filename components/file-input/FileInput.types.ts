import React from "react";

import { InputSize } from "../text-input";

export type FileInputProps = {
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
  /** Whether choosing and dropping are both switched off and the field greyed. */
  isDisabled?: boolean;
  /**
   * Whether a spinner replaces the icon. It also disables the field, and it is
   * ignored when `buttonLabel` is set, since the button has no loading form.
   */
  isLoading?: boolean;
  /** Ignored. Nothing reads this prop. */
  name?: string;
  /**
   * Called with the chosen files: a single `File` when one was picked, an array
   * when several were. Check for an array before reading `.name`.
   */
  onInput?: (file: File | File[]) => void;
  /**
   * Which files the browser offers. It is handed straight to `react-dropzone`,
   * which expects a map of MIME type to extensions — `{ "image/*": [".png"] }`
   * — despite the array type here.
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
  /** Applied to the outermost element. */
  idButton?: string;
  /** Text shown in the field instead of the chosen file names, with `fromStorage`. */
  path?: string;
  /**
   * Turns the control into a button that picks from somewhere else: the hidden
   * file input is not rendered, `path` is displayed, and clicks go to `onClick`.
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
  /**
   * `data-testid` of the outermost element.
   * @default "file-input"
   */
  "data-test-id"?: string;
};
