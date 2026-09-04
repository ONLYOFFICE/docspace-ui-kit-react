import React from "react";
import DangerToastReactSvg from "../../assets/danger.toast.react.svg";

import { IconSizeType } from "../../utils/common-icons-style";
import styles from "./StatusMessage.module.scss";
import { Text } from "../text";

interface StatusMessageProps {
  message: string | React.ReactNode;
  isWarning?: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  isWarning,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const [isShowComponent, setIsShowComponent] = React.useState(!!message);
  const messageRef = React.useRef<HTMLDivElement>(null);
  const prevMessageRef = React.useRef<string | React.ReactNode | undefined>(
    message,
  );
  const prevIsWarningRef = React.useRef<boolean | undefined>(isWarning);
  const shouldShowAfterAnimationRef = React.useRef(false);

  React.useEffect(() => {
    if (prevMessageRef.current) {
      if (!message || prevMessageRef.current !== message) {
        setIsVisible(false);
        shouldShowAfterAnimationRef.current = true;
        return;
      }

      if (!shouldShowAfterAnimationRef.current) {
        setIsVisible(true);
        prevMessageRef.current = message;
        prevIsWarningRef.current = isWarning;
      }

      return;
    }

    prevMessageRef.current = message;
    prevIsWarningRef.current = isWarning;
    if (!message) return;

    setIsShowComponent(true);
    setIsVisible(true);
  }, [message, isWarning]);

  React.useEffect(() => {
    const element = messageRef.current;
    if (!element) return;

    const handleEnd = () => {
      const resetStates = () => {
        shouldShowAfterAnimationRef.current = false;
        prevMessageRef.current = message;
        prevIsWarningRef.current = isWarning;
      };

      if (!message) {
        setIsShowComponent(false);
        resetStates();
        return;
      }

      if (shouldShowAfterAnimationRef.current && prevMessageRef.current) {
        setIsShowComponent(true);
        setIsVisible(true);
        resetStates();
        return;
      }

      if (!prevMessageRef.current) {
        setIsShowComponent(false);
      }
    };

    element.addEventListener("animationend", handleEnd);
    element.addEventListener("transitionend", handleEnd);

    return () => {
      element.removeEventListener("animationend", handleEnd);
      element.removeEventListener("transitionend", handleEnd);
    };
  }, [message]);

  if (!isShowComponent) return null;

  return (
    <div
      ref={messageRef}
      className={`${styles.body} ${!isVisible ? styles.hide : ""} ${prevIsWarningRef.current ? styles.warning : ""}`}
    >
      <DangerToastReactSvg
        className={styles.dangerToastIcon}
        data-size={IconSizeType.medium}
      />
      <Text>{prevMessageRef.current}</Text>
    </div>
  );
};

export default StatusMessage;
