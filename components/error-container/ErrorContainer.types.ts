import type { CSSProperties, ReactNode } from "react";

export type ErrorContainerProps = {
  /** Value of `id` on the outer element. It does not rename the fixed ids the component uses inside itself. */
  id?: string;
  /** Added after the component's own classes on the outer element. */
  className?: string;
  /** Inline style of the outer element. */
  style?: CSSProperties;
  /** The line under the heading, 14px and no wider than 560px. */
  bodyText?: string;
  /** The heading, rendered as an `h1` at 23px. */
  headerText?: string;
  /** Label of the action button. The button appears only when `onClickButton` is set as well. */
  buttonText?: string;
  /** Whether the action button is the filled accent one rather than the outlined one.
   * @default true */
  isPrimaryButton?: boolean;
  /** A third line under `bodyText`, 13px and 600-weight, in the muted colour. It takes plain text, not markup. */
  customizedBodyText?: string;
  /** Called when the action button is clicked. The button appears only when `buttonText` is set as well. */
  onClickButton?: VoidFunction;
  /** Takes the container out of the flow — `position: absolute` at full width — for the document editor, which mounts it over a layout of its own.
   * @default false */
  isEditor?: boolean;
  /** Hides the portal logo above the illustration. Set it outside a DocSpace portal, where the logo endpoint does not resolve.
   * @default false */
  hideLogo?: boolean;
  /** Rendered last, below the button: the place for a support link or a details block. */
  children?: ReactNode;
};
