"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { cssTransition, ToastContainer } from "react-toastify";
import classNames from "classnames";

import { Portal } from "../portal";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";

import type { ToastProps } from "./Toast.types";
import styles from "./Toast.module.scss";
import { useMobileViewport } from "./hooks/useMobileViewport";
import { getToastClassName } from "./utils/getToastClassName";
import { useIsServer } from "./hooks/useIsServer";
import { CloseButton } from "./sub-components/CloseButton";

const Slide = cssTransition({
  enter: "SlideIn",
  exit: "SlideOut",
});

// react-toastify keys its registry by containerId, and every <Toast /> uses
// the same one. With two mounted, the later takes the earlier's place, and a
// toast still showing in the earlier throws on its next render ("Cannot set
// properties of undefined (setting 'toggle')"). Two is not exotic: a Storybook
// docs page mounts one per story, a plugin can mount one next to the portal's.
// So only the first mounted instance renders the container; when it unmounts,
// the next one takes over.
const instances: symbol[] = [];
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getOwner = () => instances[0];

const setInstances = (update: () => void) => {
  update();
  listeners.forEach((listener) => listener());
};

const Toast = React.memo(
  ({ className, style, isSSR, closeButtonLabel = "Close" }: ToastProps) => {
    const isServer = useIsServer();
    const offset = useMobileViewport();
    const { isRTL } = useInterfaceDirection();

    const [instance] = useState(() => Symbol("Toast"));
    const owner = useSyncExternalStore(subscribe, getOwner, () => undefined);

    // A layout effect, so a lone Toast mounts its container before the first
    // paint rather than one effect pass later.
    useLayoutEffect(() => {
      setInstances(() => instances.push(instance));

      return () =>
        setInstances(() => instances.splice(instances.indexOf(instance), 1));
    }, [instance]);

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

    const renderCloseButton = React.useCallback(
      ({
        closeToast,
      }: {
        closeToast: (e: React.MouseEvent<HTMLElement>) => void;
      }) => <CloseButton closeToast={closeToast} label={closeButtonLabel} />,
      [closeButtonLabel],
    );

    if (isServer && isSSR) return null;
    if (owner !== instance) return null;

    const element = (
      <ToastContainer
        containerId="toast-container"
        className={classNames(className, styles.toast)}
        draggable
        position="top-right"
        toastClassName={getToastClassName}
        rtl={isRTL}
        closeButton={renderCloseButton}
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
  },
);

Toast.displayName = "Toast";

export { Toast };
