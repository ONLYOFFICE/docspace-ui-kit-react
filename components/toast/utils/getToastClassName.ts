import { ToastClassName } from "react-toastify";
import { ToastType } from "../Toast.enums";

const CLOSE_ON_CLICK_CLASS = "Toastify__toast--close-on-click";

export const getToastClassName: ToastClassName = (context) => {
  const baseClass = "Toastify__toast";
  const type = context?.type as ToastType;

  // react-toastify marks a toast that closes on click in its default class;
  // the stylesheet reads it to hide the keyboard-only close button.
  const closeOnClick = context?.defaultClassName
    ?.split(" ")
    .includes(CLOSE_ON_CLICK_CLASS)
    ? ` ${CLOSE_ON_CLICK_CLASS}`
    : "";

  if (!type) return `${baseClass}${closeOnClick}`;

  return `${baseClass} ${baseClass}--${type}${closeOnClick}`;
};
