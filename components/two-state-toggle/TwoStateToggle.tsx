/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
