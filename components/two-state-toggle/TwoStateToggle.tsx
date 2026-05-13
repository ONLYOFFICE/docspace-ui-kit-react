// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
