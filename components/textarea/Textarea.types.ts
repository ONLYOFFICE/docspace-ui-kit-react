import { ChangeEvent, KeyboardEvent } from "react";

export type TextareaProps = Omit<
  React.AriaAttributes,
  "aria-label" | "aria-labelledby" | "aria-describedby"
> & {
  /** Applied to the scrollbar around the textarea, not to the textarea itself. */
  className?: string;
  /** Applied to the outer wrapper that carries the height and the copy icon. */
  wrapperClassName?: string;
  /** Id of the `<textarea>`, for a `<label for>` to point at. */
  id?: string;
  /** Greys the field and stops editing. A disabled field leaves the tab order
   * and the submitted form. */
  isDisabled?: boolean;
  /** Keeps the text legible and selectable but stops editing. */
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
  /** Name under which the text is submitted with a form. */
  name?: string;
  /** Called with the change event on every edit. The field shows `value` only,
   * so update it from here. */
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Called on every key press while the field has focus. */
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Text shown while the field is empty. The default is a single space, so
   * `:placeholder-shown` matches even when no placeholder was asked for. */
  placeholder?: string;
  /** Inline style of the scrollbar around the textarea, not of the textarea
   * itself. */
  style?: React.CSSProperties;
  /** Place of the field in the tab order. Left out, the field takes its natural
   * place; pass `-1` only for a field the keyboard should skip. */
  tabIndex?: number;
  /** Accessible name of the field, for when no `<label>` points at it. `id`
   * with a `<label for>` names the field just as well. */
  "aria-label"?: string;
  /** `id` of the element that names this field, the usual choice when the
   * caption is already on screen. */
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
  /** Puts the caret in the field on its first render. */
  autoFocus?: boolean;
  /** Selects the whole text whenever this flips to true — for a field the user
   * is expected to copy from.
   * @default false */
  areaSelect?: boolean;
  /** Treats the value as JSON and pretty-prints it. The field shows its error
   * state whenever the value is empty or not a JSON object or array.
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
