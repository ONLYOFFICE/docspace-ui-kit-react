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

import classNames from "classnames";

import { isTablet } from "../../utils";
import { Text } from "../text";

import styles from "./EmptyScreenContainer.module.scss";

import type { EmptyScreenContainerProps } from "./EmptyScreenContainer.types";

const EmptyScreenContainer = (props: EmptyScreenContainerProps) => {
  const {
    imageSrc,
    imageAlt,
    headerText,
    subheadingText,
    descriptionText,
    buttons,
    imageStyle,
    buttonStyle,
    withoutFilter,
    className,
  } = props;

  return (
    <div
      className={classNames(
        styles.body,
        {
          [styles.withoutFilter]: withoutFilter,
          [styles.withSubheading]: !!subheadingText,
          [styles.withDescription]: !!descriptionText,
        },
        className,
      )}
      data-testid="empty-screen-container"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={!isTablet() ? imageStyle : {}}
        className={classNames(styles.image, "ec-image")}
      />

      {headerText ? (
        <Text
          as="span"
          fontSize="19px"
          fontWeight="700"
          className={classNames(styles.header, "ec-header")}
        >
          {headerText}
        </Text>
      ) : null}

      {subheadingText ? (
        <Text
          as="span"
          fontWeight="600"
          className={classNames(styles.subheading, "ec-subheading")}
        >
          {subheadingText}
        </Text>
      ) : null}

      {descriptionText ? (
        <Text
          as="span"
          fontSize="12px"
          className={classNames(styles.description, "ec-desc")}
        >
          {descriptionText}
        </Text>
      ) : null}

      {buttons ? (
        <div
          className={classNames(styles.buttons, "ec-buttons")}
          style={buttonStyle}
        >
          {buttons}
        </div>
      ) : null}
    </div>
  );
};

export { EmptyScreenContainer };
