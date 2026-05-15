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

import type { QuickActionItem, QuickActionsProps } from "./QuickActions.types";

import styles from "./QuickActions.module.scss";

const QuickActionTile = ({ item }: { item: QuickActionItem }) => {
  const { icon, label, onClick, href, target, dataTestId } = item;

  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  if (href) {
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    return (
      <a
        className={styles.tile}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={label}
        data-testid={dataTestId}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.tile}
      onClick={onClick}
      aria-label={label}
      data-testid={dataTestId}
    >
      {content}
    </button>
  );
};

export const QuickActions = ({
  items,
  className,
  dataTestId,
}: QuickActionsProps) => {
  if (items.length === 0) return null;

  return (
    <div
      className={classNames(styles.quickActions, className)}
      data-testid={dataTestId}
    >
      {items.map((item) => (
        <QuickActionTile key={item.id} item={item} />
      ))}
    </div>
  );
};

export type { QuickActionItem, QuickActionsProps };

export * from "./icons";
