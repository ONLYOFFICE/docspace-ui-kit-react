import React from "react";
import classNames from "classnames";

import { Button, ButtonSize } from "../button";
import { ModalDialog } from "../modal-dialog";
import { Text } from "../text";

import type { TwoStateToggleProps } from "./TwoStateToggle.types";
import styles from "./TwoStateToggle.module.scss";

const LS_KEY = "useDocSpace";

const TwoStateToggle = ({
  title = "DocSpace design",
  labelOld = "OLD",
  labelNew = "NEW",
  confirmTitle = "Switch to Old Design",
  confirmBody = "You are about to leave the new Dashboard and return to the classic DocSpace view.",
  confirmHint = "You can return to the new Dashboard at any time by navigating to /dashboard.",
  confirmOk = "Switch",
  confirmCancel = "Cancel",
  onNavigate,
  className,
}: TwoStateToggleProps) => {
  // isNew === true  → new Dashboard  (useDocSpace = "new")
  // isNew === false → classic DocSpace (useDocSpace = "old")
  const [isNew, setIsNew] = React.useState(
    () => localStorage.getItem(LS_KEY) !== "old",
  );
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const go = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.location.href = url;
    }
  };

  const handleToggleClick = () => {
    if (isNew) {
      // NEW → OLD: show confirmation modal
      setConfirmOpen(true);
    } else {
      // OLD → NEW: update localStorage and navigate without full reload if possible
      localStorage.setItem(LS_KEY, "new");
      setIsNew(true);
      go("/dashboard");
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    localStorage.setItem(LS_KEY, "old");
    setIsNew(false);
    go("/");
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <div className={classNames(styles.wrapper, className)}>
        {title ? <span className={styles.title}>{title}</span> : null}
        <button
          type="button"
          role="switch"
          aria-checked={isNew}
          aria-label="Switch DocSpace design"
          onClick={handleToggleClick}
          className={styles.pill}
        >
          {/* Sliding white thumb */}
          <span
            aria-hidden="true"
            className={classNames(styles.thumb, { [styles.thumbNew]: isNew })}
          />

          {/* OLD / NEW labels */}
          <span aria-hidden="true" className={styles.labels}>
            <span
              className={classNames(styles.label, { [styles.onThumb]: !isNew })}
            >
              {labelOld}
            </span>
            <span
              className={classNames(styles.label, { [styles.onThumb]: isNew })}
            >
              {labelNew}
            </span>
          </span>
        </button>
      </div>

      <ModalDialog visible={confirmOpen} onClose={handleCancel}>
        <ModalDialog.Header>{confirmTitle}</ModalDialog.Header>
        <ModalDialog.Body>
          <Text className={styles.confirmBody}>{confirmBody}</Text>
          {confirmHint ? (
            <Text className={styles.confirmHint}>{confirmHint}</Text>
          ) : null}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            label={confirmOk}
            size={ButtonSize.normal}
            primary
            onClick={handleConfirm}
          />
          <Button
            label={confirmCancel}
            size={ButtonSize.normal}
            onClick={handleCancel}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export { TwoStateToggle };
