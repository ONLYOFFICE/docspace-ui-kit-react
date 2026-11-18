import { ChangeEvent, KeyboardEvent } from "react";

export type TextareaProps = {
  /** Applied to the scrollbar around the textarea, not to the textarea itself. */
  className?: string;
  /** Applied to the outer wrapper that carries the height and the copy icon. */
  wrapperClassName?: string;
  /** Used as HTML `id` property  */
  id?: string;
  /** Indicates that the field cannot be used */
  isDisabled?: boolean;
  /** Indicates that the field is displaying read-only content */
  isReadOnly?: boolean;
  /** Draws the field in the error colour. Under `isJSONField` it adds to that
   * mode's own error state rather than being replaced by it.
   * @default false */
  hasError?: boolean;
  /** Makes the field 65vh tall instead of the default 89px.
   * @default false */
  heightScale?: boolean;
  /** Maximum number of characters the field accepts. Unlike `TextInput`, which
   * caps at 255, there is no limit unless you set one. */
  maxLength?: number;
  /** Used as HTML `name` property  */
  name?: string;
  /** Sets a callback function that allows handling the component's changing events */
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Sets a callback function that allows handling the component's keyDown events */
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Placeholder for Textarea  */
  placeholder?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Used as HTML `tabindex` property. Left out, the field takes its natural
   * place in the tab order; pass `-1` only for a field the keyboard is meant to
   * skip. */
  tabIndex?: number;
  /** Accessible name of the field, for when no `<label>` points at it. Declared
   * as a prop because this type is closed and accepts no arbitrary DOM
   * attributes; `id` with a `<label for>` names the field just as well. */
  "aria-label"?: string;
  /** `id` of the element that names this field — the usual choice when the
   * caption is already on screen, for instance a `FieldContainer` label given
   * an `id` of its own. */
  "aria-labelledby"?: string;
  /** `id` of the element describing the field, such as a hint or an error line
   * below it. Announced after the name. */
  "aria-describedby"?: string;
  /** HTML `spellcheck` of the field. Pass `false` for text that is no prose,
   * such as a secret phrase: some browsers send checked text to a cloud
   * service. Left out, the browser decides. */
  spellCheck?: boolean;
  /** Safari's `autocorrect` attribute; `"off"` stops a phone keyboard
   * replacing words. Left out, the browser decides. */
  autoCorrect?: "on" | "off";
  /** HTML `autocapitalize` of the field; `"off"` stops a phone keyboard
   * capitalising the first letter. Left out, the browser decides. */
  autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
  /** HTML `autocomplete` of the field; `"off"` asks the browser neither to
   * save what is typed nor to suggest earlier entries. Left out, the browser
   * decides. */
  autoComplete?: string;
  /** The text. The field is controlled, so pair it with `onChange`.
   * @default "" */
  value?: string;
  /** Font size in pixels, applied inline to the textarea and to the line
   * numbers.
   * @default 13 */
  fontSize?: number;
  /** Fixed height, as a number of pixels or a CSS length. It wins over the
   * default height but not over `heightScale` or `isFullHeight`. */
  heightTextArea?: string | number;
  /** Colour of the text, applied inline. */
  color?: string;
  /** Default input property */
  autoFocus?: boolean;
  /** Selects the whole text whenever this flips to true — for a field the user
   * is expected to copy from.
   * @default false */
  areaSelect?: boolean;
  /** Treats the value as JSON: pretty-prints it, and puts the field in the
   * error state whenever it is empty or not a JSON object or array, whatever
   * `hasError` says.
   * @default false */
  isJSONField?: boolean;
  /** Text of the toast shown after a successful copy. Without it the copy is
   * silent. */
  copyInfoText?: string;
  /** Shows a copy button in the corner of the field.
   * @default false */
  enableCopy?: boolean;
  /** Renders line numbers down the left edge and indents the text to make room
   * for them.
   * @default false */
  hasNumeration?: boolean;
  /** Sizes the field to its content instead of scrolling inside a fixed
   * height.
   * @default false */
  isFullHeight?: boolean;
  /** Ignored. The component computes the full height itself and never reads
   * this prop. */
  fullHeight?: number;
  /** Ignored. Nothing in the component or its stylesheet reads this prop. */
  minHeight?: string;

  /** Applied to the copy button, alongside the component's own class. */
  classNameCopyIcon?: string;
  /** Ignored. The indent for the line numbers is computed from the content. */
  paddingLeftProp?: string;

  /** Moves the scrollbar styling from the inner scroller to the outer wrapper,
   * which is what a chat composer needs.
   * @default false */
  isChatMode?: boolean;
  /** Value of `data-testid` on the textarea.
   * @default "textarea" */
  dataTestId?: string;

  /** Called with the copied text after the copy button is used. */
  onCopy?: (text: string) => void;
};
