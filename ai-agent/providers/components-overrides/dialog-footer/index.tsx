import React from "react";
import classNames from "classnames";

import type { DialogFooterProps } from "@onlyoffice/ai-chat";

import { Button, ButtonSize } from "../../../../components/button";

import styles from "./DialogFooter.module.scss";

const DialogFooterOverride: React.FC<DialogFooterProps> = ({
  cancelLabel,
  onCancel,
  cancelType = "button",
  cancelDisabled,
  submitLabel,
  onSubmit,
  submitType = "button",
  submitDisabled,
  submitLoading,
  className,
  buttonClassName,
}) => {
  // Rendered as a <footer> (not a <div>) on purpose: the DocSpace
  // `DialogContent` override styles legacy inline footers via a
  // `.body div:has(> button)` rule. Using a non-div element keeps this
  // override's layout self-contained instead of being reset by that rule.
  return (
    <footer className={classNames(styles.footer, className)}>
      <Button
        primary
        scale
        type={submitType}
        label={submitLabel}
        size={ButtonSize.normal}
        isDisabled={submitDisabled}
        isLoading={submitLoading}
        onClick={onSubmit}
        className={buttonClassName}
      />
      <Button
        scale
        type={cancelType}
        label={cancelLabel}
        size={ButtonSize.normal}
        isDisabled={cancelDisabled}
        onClick={onCancel}
        className={buttonClassName}
      />
    </footer>
  );
};

DialogFooterOverride.displayName = "DialogFooterOverride";

export { DialogFooterOverride };

