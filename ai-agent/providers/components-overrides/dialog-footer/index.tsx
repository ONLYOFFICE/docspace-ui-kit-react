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

