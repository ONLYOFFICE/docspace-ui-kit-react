import type { Mask } from "react-text-mask";
import type { InputSize, InputType } from "./TextInput.enums";

type HTMLInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "size"
  | "type"
  | "value"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "onKeyDown"
  | "onClick"
  | "onContextMenu"
  | "disabled"
  | "readOnly"
  | "className"
  | "style"
  | "dir"
  | "ref"
>;

export type TextInputProps = HTMLInputProps & {
  /** Id of the `<input>`. */
  id?: string;
  /** Ref to the `<input>`. Dropped when `mask` is set, which renders the masked
   * input instead. */
  forwardedRef?: React.Ref<HTMLInputElement>;
  /** Name under which the value is submitted with a form. */
  name?: string;
  /** Kind of value the field takes. It sets the input's `type`, and with it the
   * mobile keyboard and the browser's own validation. */
  type: InputType;
  /** Text the field shows. The field is controlled: it shows only what you
   * pass, so update it from `onChange`. */
  value: string;
  /** Most characters the field accepts; typing past it is dropped silently.
   * @default 255 */
  maxLength?: number;
  /** Placeholder text. The default is a single space, not an empty string, so
   * `:placeholder-shown` matches even when no placeholder was asked for.
   * @default " " */
  placeholder?: string;
  /** Place of the field in the tab order. Left out, the field takes its natural
   * place; pass `-1` only for a field the keyboard should skip. */
  tabIndex?: number;
  /** Pattern the typed text is fitted to: an array of literal characters and
   * RegExps, or a function of the value that returns one. */
  mask?: Mask | ((value: string) => Mask);
  /** Keeps every character in its slot: typing into a filled slot is refused,
   * and a deletion leaves the slot empty instead of shifting the rest. Read
   * only with `mask`. */
  keepCharPositions?: boolean;
  /** Shows the mask's placeholder and literal characters before they are typed.
   * Without it they appear as the text reaches them. */
  guide?: boolean;
  /** Width and type size of the field, from 173px to 550px wide. */
  size?: InputSize;
  /** Stretches the field to the width of its container instead of the fixed
   * `size` width. */
  scale?: boolean;
  /** Called with the change event on every edit. Pass it unless the field is
   * read-only, since the field shows `value` and nothing else. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Called when the field loses focus. */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when the field receives focus. */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called on every key press while the field has focus. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called with the mouse event when the pointer clicks the field. */
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  /** Called when the browser's context menu is opened on the field. */
  onContextMenu?: (e: React.MouseEvent<HTMLInputElement>) => void;
  /** Puts the caret in the field on its first render. */
  isAutoFocussed?: boolean;
  /** Greys the field and stops editing. A disabled field is skipped by the tab
   * order and left out of a submitted form. */
  isDisabled?: boolean;
  /** Keeps the value legible and selectable but stops editing. The field stays
   * in the tab order. */
  isReadOnly?: boolean;
  /** Draws the border in the error colour. It sets no `aria-invalid`. */
  hasError?: boolean;
  /** Draws the border in the warning colour, which wins over `hasError`. */
  hasWarning?: boolean;
  /** What the browser may autofill here, as an HTML `autocomplete` token such
   * as `email` or `new-password`.
   * @default "off" */
  autoComplete?: string;
  /** Turns the browser's spelling check on or off; unset, the browser decides. */
  spellCheck?: boolean;
  /** Class added to the `<input>`. */
  className?: string;
  /** Inline style of the `<input>`, the only place its own CSS variables can be
   * overridden. */
  style?: React.CSSProperties;
  /** Weight of the typed text, as a CSS `font-weight`. `isBold` wins over it. */
  fontWeight?: number | string;
  /** Sets the typed text's weight to 600, over `fontWeight`. */
  isBold?: boolean;
  /** Draws the border. Without it the field shows no hover, focus, error or
   * warning colour, since all of them are border colours. */
  withBorder?: boolean;
  /** Text direction of the field. `auto` lets each value pick its own, so
   * mixed-script text reads correctly.
   * @default "auto" */
  dir?: string;
  /** Which virtual keyboard a touch device shows, independent of `type`. */
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  /** Value of `data-testid` on the `<input>`. */
  testId?: string;
};
