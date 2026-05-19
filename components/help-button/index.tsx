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

"use client";

import React from "react";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import InfoReactSvg from "../../assets/info.react.svg";
import { IconButton } from "../icon-button";
import { Tooltip } from "../tooltip";

import type { HelpButtonProps } from "./HelpButton.types";

export type { HelpButtonProps };

const HelpButton = (props: HelpButtonProps) => {
  const {
    id,
    className = "icon-button",
    iconName,
    size = 12,
    color,
    dataTip,
    getContent,
    place,
    offset,
    style,
    afterShow,
    afterHide,
    tooltipMaxWidth,
    tooltipContent,
    openOnClick = true,
    isClickable = true,
    children,
    isOpen,
    noUserSelect,
    dataTestId,
    tooltipStyle,
    iconNode,
  } = props;

  const currentId = id || uniqueId();
  const ref = React.useRef(null);
  const componentClass = classNames(className, "help-icon");

  const contentString = React.useMemo(() => {
    if (getContent) {
      const content = getContent({ content: null, activeAnchor: null });
      return typeof content === "string" ? content : null;
    }
    return typeof tooltipContent === "string" ? tooltipContent : null;
  }, [getContent, tooltipContent]);

  const useGlobalTooltip = contentString !== null;

  const globalTooltipProps = useGlobalTooltip
    ? {
        "data-tooltip-id": "info-tooltip",
        "data-tooltip-content": contentString,
        "data-tooltip-place": place || "top",
      }
    : {};

  const anchorSelect = children
    ? `div[id='${currentId}']`
    : `div[id='${currentId}'] svg`;

  const localTooltipProps = {
    clickable: true,
    openOnClick,
    place: place || "top",
    offset,
    afterShow,
    afterHide,
    maxWidth: tooltipMaxWidth,
    anchorSelect,
    isOpen,
    noUserSelect,
    tooltipStyle,
  };

  return (
    <div ref={ref} style={style} data-testid={dataTestId ?? "help-button"}>
      {children ? (
        <div id={currentId} className={componentClass} {...globalTooltipProps}>
          {children}
        </div>
      ) : (
        <IconButton
          id={currentId}
          className={componentClass}
          isClickable={isClickable}
          iconName={iconName}
          iconNode={iconNode ?? <InfoReactSvg />}
          size={size}
          color={color}
          data-for={currentId}
          dataTip={dataTip}
          {...globalTooltipProps}
        />
      )}

      {!useGlobalTooltip && (getContent || tooltipContent) ? (
        getContent ? (
          <Tooltip {...localTooltipProps} getContent={getContent} />
        ) : (
          <Tooltip {...localTooltipProps}>{tooltipContent}</Tooltip>
        )
      ) : null}
    </div>
  );
};

export { HelpButton };
