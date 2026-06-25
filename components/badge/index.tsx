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

import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types";

export type { BadgeProps };

const Badge = (props: BadgeProps) => {
  const {
    ref,
    onClick,
    fontSize = "11px",
    color,
    fontWeight = 800,
    backgroundColor,
    borderRadius = "11px",
    padding = "0px 5px",
    maxWidth = "50px",
    height,
    type,
    isHovered = false,
    border,
    label = 0,
    onMouseLeave,
    onMouseOver,
    noHover = false,
    className,
    isVersionBadge,
    isPaidBadge,
    isMutedBadge,
    dataTestId,
    ...rest
  } = props;

  const onClickAction = React.useCallback(
    (e: React.MouseEvent) => {
      if (!onClick) return;

      e.preventDefault();
      onClick(e);
    },
    [onClick],
  );

  const shouldDisplay = label && label !== "0";

  const badgeStyle = {
    height,
    border,
    borderRadius,
    "--badge-background-color": backgroundColor,
  } as React.CSSProperties;

  const innerStyle = isPaidBadge
    ? ({
        padding,
        borderRadius,
        "--badge-background-color": backgroundColor,
      } as React.CSSProperties)
    : ({
        maxWidth,
        padding,
        borderRadius,
        "--badge-background-color": backgroundColor,
      } as React.CSSProperties);

  const textStyle = {
    fontSize,
    fontWeight,
    color,
  } as React.CSSProperties;

  return (
    <TooltipContainer
      as="div"
      ref={ref}
      className={`${styles.badge} ${styles.themed} ${className || ""}`}
      style={badgeStyle}
      onClick={onClickAction}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      role="status"
      aria-label={`${label} ${type || ""}`}
      aria-live="polite"
      aria-atomic="true"
      data-testid={dataTestId ?? "badge"}
      data-hidden={!shouldDisplay}
      data-no-hover={noHover}
      data-is-hovered={isHovered}
      data-type={type}
      data-version-badge={isVersionBadge}
      data-paid={isPaidBadge}
      data-muted={isMutedBadge}
      {...rest}
    >
      <div
        className={styles.inner}
        style={innerStyle}
        data-type={type}
        data-testid="badge-inner"
        aria-hidden="true"
        data-no-hover={noHover}
      >
        <Text
          className={styles.text}
          style={textStyle}
          textAlign="center"
          data-testid="badge-text"
          data-color={!!color}
        >
          {label}
        </Text>
      </div>
    </TooltipContainer>
  );
};

Badge.displayName = "Badge";

export { Badge };
