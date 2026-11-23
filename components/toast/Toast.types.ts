export type ToastProps = {
  /** Applied to the container the toasts are stacked in. */
  className?: string;
  /** Applied to that container as inline style. */
  style?: React.CSSProperties;
  /** Whether the container renders nothing until the first client-side effect, for a server-rendered tree. */
  isSSR?: boolean;
  /** Accessible name of the close button every toast carries. Defaults to the translated `Common:CloseButton` ("Close"). */
  closeButtonLabel?: string;
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
