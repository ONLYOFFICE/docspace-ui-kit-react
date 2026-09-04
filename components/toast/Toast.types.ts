import { ToastType } from "./Toast.enums";

export type ToastProps = {
  /** Accepts class  */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style  */
  style?: React.CSSProperties;
  /** Title inside a toast */
  title?: string;
  /** Sets the color and icon of the toast */
  type?: ToastType;
  /** Any components or data inside a toast */
  data?: React.ReactNode | string;
  /** If false: toast disappeared after clicking on any area of toast. If true: toast disappeared after clicking on close button */
  withCross?: boolean;
  /** Time (in milliseconds) for showing your toast. Setting in 0 let you to show toast constantly until clicking on it */
  timeout?: number;

  isSSR?: boolean;
};

export type TData = {
  response?: { data: { error: { message: string } } };
  statusText?: string;
  message?: string;
};
