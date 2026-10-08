import React from "react";
import classNames from "classnames";

import DangerToastReactSvg from "../../assets/danger.toast.react.svg";

import { IconSizeType } from "../../utils/common-icons-style";
import styles from "./StatusMessage.module.scss";
import { Text } from "../text";

import type { StatusMessageProps } from "./StatusMessage.types";

type Shown = {
  message: string | React.ReactNode;
  isWarning: boolean;
};

// The fade is 0.3s. If its transitionend never arrives (the change came
// before the browser started the transition, an ancestor is display: none,
// animations are off) the swap happens on this timer instead.
const FADE_FALLBACK_MS = 400;

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  isWarning,
}) => {
  const initial: Shown | null = message
    ? { message, isWarning: !!isWarning }
    : null;

  // What is on screen. The ref mirrors the state for the effects below.
  const [shown, setShown] = React.useState<Shown | null>(initial);
  const shownRef = React.useRef<Shown | null>(initial);
  const [isVisible, setIsVisible] = React.useState(true);

  // What replaces it once the fade-out ends; undefined while nothing is
  // waiting, null when the bar is to be removed.
  const pendingRef = React.useRef<Shown | null | undefined>(undefined);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const messageRef = React.useRef<HTMLDivElement>(null);

  const commit = React.useCallback((next: Shown | null) => {
    shownRef.current = next;
    setShown(next);
  }, []);

  const finishFade = React.useCallback(() => {
    if (pendingRef.current === undefined) return;

    const next = pendingRef.current;
    pendingRef.current = undefined;
    clearTimeout(timerRef.current);
    timerRef.current = undefined;

    commit(next);
    setIsVisible(true);
  }, [commit]);

  React.useEffect(() => {
    const current = shownRef.current;
    const next: Shown | null = message
      ? { message, isWarning: !!isWarning }
      : null;

    // Nothing on screen, or the same text as on screen: no fade is needed,
    // and a fade in flight is called off. A change of isWarning alone lands
    // here and repaints at once.
    if (!current || (next && next.message === current.message)) {
      pendingRef.current = undefined;
      clearTimeout(timerRef.current);
      timerRef.current = undefined;

      if (next) {
        commit(next);
        setIsVisible(true);
      } else if (current) {
        commit(null);
      }
      return;
    }

    // A different text, or none: fade the current one out first. Further
    // changes during the fade only replace what comes after it.
    pendingRef.current = next;
    setIsVisible(false);

    if (timerRef.current === undefined) {
      timerRef.current = setTimeout(finishFade, FADE_FALLBACK_MS);
    }
  }, [message, isWarning, commit, finishFade]);

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  const isMounted = shown !== null;

  React.useEffect(() => {
    const element = messageRef.current;
    if (!element) return;

    element.addEventListener("animationend", finishFade);
    element.addEventListener("transitionend", finishFade);

    return () => {
      element.removeEventListener("animationend", finishFade);
      element.removeEventListener("transitionend", finishFade);
    };
  }, [isMounted, finishFade]);

  if (!shown) return null;

  return (
    <div
      ref={messageRef}
      // An error interrupts; a warning waits for a pause.
      role={shown.isWarning ? "status" : "alert"}
      aria-atomic="true"
      className={classNames(styles.body, {
        [styles.hide]: !isVisible,
        [styles.warning]: shown.isWarning,
      })}
      data-testid="status-message"
    >
      <DangerToastReactSvg
        className={styles.dangerToastIcon}
        data-size={IconSizeType.medium}
        aria-hidden="true"
      />
      <Text>{shown.message}</Text>
    </div>
  );
};

export { StatusMessage };
export type { StatusMessageProps };
export default StatusMessage;
