"use client";

import React from "react";
import classNames from "classnames";

import CrossIconReactSvg from "../../../assets/icons/12/cross.react.svg";

import styles from "../Toast.module.scss";

export const DEFAULT_CLOSE_BUTTON_LABEL = "Close";

type CloseButtonProps = {
  /** Supplied by react-toastify when it renders the button into a toast. */
  closeToast?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Accessible name of the button. */
  label?: string;
};

// A real button, so it is focusable and answers Enter and Space. On a toast
// opened without `withCross` it is visually hidden until it takes keyboard
// focus (see `.closeButton` in Toast.module.scss): the mouse closes such a
// toast by clicking it, the keyboard through this button.
export const CloseButton = ({
  closeToast,
  label = DEFAULT_CLOSE_BUTTON_LABEL,
}: CloseButtonProps) => (
  <button
    type="button"
    className={classNames(styles.iconButton, "closeButton")}
    aria-label={label}
    data-testid="toast-close-button"
    onClick={(e) => {
      // The toast and the container have click handlers of their own.
      e.stopPropagation();
      closeToast?.(e);
    }}
  >
    <CrossIconReactSvg aria-hidden="true" />
  </button>
);
