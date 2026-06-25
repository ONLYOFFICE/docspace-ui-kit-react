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
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import styles from "./RowContent.module.scss";
import { RowContentProps } from "./RowContent.types";
import { getSideInfo } from "./RowContent.utils";

const RowContent = (props: RowContentProps) => {
  const {
    children,
    disableSideInfo = false,
    id,
    className,
    style,
    sideColor,
    onClick,
    sectionWidth,
    convertSideInfo = true,
  } = props;

  const { interfaceDirection } = useInterfaceDirection();

  const sideInfo = getSideInfo(children, convertSideInfo, interfaceDirection);

  let mainContainerWidth;

  if (React.isValidElement(children[0]))
    mainContainerWidth =
      (children[0].props && children[0].props.containerWidth) || "140px";

  const mainContainerStyle = mainContainerWidth
    ? ({
        ...style,
        "--main-container-width": mainContainerWidth,
      } as React.CSSProperties)
    : style;

  return (
    <div
      className={classNames(
        styles.rowContent,
        { [styles.sectionWidth]: sectionWidth },
        className,
      )}
      id={id}
      onClick={onClick}
      style={style}
      data-testid="row-content"
    >
      <div
        data-testid="main-container-wrapper"
        className={classNames(
          styles.mainContainerWrapper,
          "row-main-container-wrapper",
        )}
        style={mainContainerStyle}
      >
        <div className={classNames(styles.mainContainer, "rowMainContainer")}>
          {children[0]}
        </div>
        <div className={classNames(styles.mainIcons, "mainIcons")}>
          {children[1]}
        </div>
      </div>
      {children.map((element: React.ReactNode, index: number) => {
        if (index > 1 && React.isValidElement(element)) {
          const p = element.props as {
            containerWidth?: string;
            containerMinWidth?: string;
          };
          return (
            <div
              data-testid="side-container"
              className={classNames(styles.sideContainerWrapper)}
              key={`side-${index * 10}`}
              style={{
                width: p.containerWidth || "40px",
                minWidth: p.containerMinWidth || "40px",
              }}
            >
              {element}
            </div>
          );
        }
        return null;
      })}
      {!disableSideInfo ? (
        <div
          data-testid="tablet-side-info"
          className={classNames(styles.tabletSideInfo)}
          style={{ color: sideColor }}
        >
          {sideInfo}
        </div>
      ) : null}
    </div>
  );
};

export { RowContent };
