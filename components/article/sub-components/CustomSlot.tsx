import React from "react";
import classNames from "classnames";

import styles from "../Article.module.scss";

type CustomSlotProps = {
  children?: React.ReactNode;
  withDevTools?: boolean;
  showBackButton?: boolean;
  showText?: boolean;
};

const CustomSlot = React.memo(
  ({
    children,
    withDevTools = false,
    showBackButton = false,
    showText = false,
  }: CustomSlotProps) => {
    if (!children) return null;

    return (
      <div
        data-with-dev-tools={withDevTools ? "true" : "false"}
        data-with-back-button={showBackButton ? "true" : "false"}
        data-with-show-text={showText ? "true" : "false"}
        className={styles.customSlot}
      >
        {children}
      </div>
    );
  },
);

CustomSlot.displayName = "CustomSlot";

export default CustomSlot;
