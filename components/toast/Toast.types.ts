import { ToastType } from "./Toast.enums";

export type ToastProps = {
  /** Applied to the container the toasts are stacked in. */
  className?: string;
  /** Ignored. Nothing reads this prop; the container carries no `id`. */
  id?: string;
  /** Applied to that container as inline style. */
  style?: React.CSSProperties;
  /** Ignored. A toast's title is the second argument of `toastr.success` and its siblings. */
  title?: string;
  /** Ignored. A toast's type is the `toastr` method you call. */
  type?: ToastType;
  /** Ignored. A toast's body is the first argument of `toastr.success` and its siblings. */
  data?: React.ReactNode | string;
  /** Ignored. It is the fourth argument of `toastr.success` and its siblings. */
  withCross?: boolean;
  /** Ignored. It is the third argument of `toastr.success` and its siblings. */
  timeout?: number;
  /** Whether the container renders nothing until the first client-side effect, for a server-rendered tree. */
  isSSR?: boolean;
};

/**
 * Shape `toastr.error` unwraps a message from: an axios-style error, a fetch
 * response or a plain `Error`. The first field that is set wins.
 */
export type TData = {
  /** Body of a failed API call; `response.data.error.message` is read first. */
  response?: { data: { error: { message: string } } };
  /** Status text of a response, read when there is no API error message. */
  statusText?: string;
  /** Message of an `Error`, read last. */
  message?: string;
};
