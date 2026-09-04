"use client";

import React, { useEffect } from "react";
import { cssTransition, ToastContainer } from "react-toastify";
import classNames from "classnames";

import { Portal } from "../portal";

import type { ToastProps } from "./Toast.types";
import styles from "./Toast.module.scss";
import { useMobileViewport } from "./hooks/useMobileViewport";
import { getToastClassName } from "./utils/getToastClassName";
import { useIsServer } from "./hooks/useIsServer";

const Slide = cssTransition({
  enter: "SlideIn",
  exit: "SlideOut",
});

const Toast = React.memo(({ className, style, isSSR }: ToastProps) => {
  const isServer = useIsServer();
  const offset = useMobileViewport();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--toast-top-offset", `${offset}px`);
  }, [offset]);

  const handleToastClick = React.useCallback(() => {
    const toasts = document.getElementsByClassName("Toastify__toast");
    Array.from(toasts).forEach((toast) => {
      (toast as HTMLElement).style.setProperty("position", "static");
    });
  }, []);

  if (isServer && isSSR) return null;

  const element = (
    <ToastContainer
      containerId="toast-container"
      className={classNames(className, styles.toast)}
      draggable
      position="top-right"
      toastClassName={getToastClassName}
      rtl
      hideProgressBar
      newestOnTop
      pauseOnFocusLoss={false}
      style={style}
      icon={false}
      transition={Slide}
      onClick={handleToastClick}
      data-testid="toast"
    />
  );

  const rootElement = document?.getElementById("root");

  return (
    <Portal element={element} appendTo={rootElement || undefined} visible />
  );
});

Toast.displayName = "Toast";

export { Toast };
