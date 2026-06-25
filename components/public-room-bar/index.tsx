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
import { ReactSVG } from "react-svg";

import CrossIcon from "../../assets/icons/12/cross.react.svg";
import PeopleIcon from "../../assets/icons/16/people.react.svg";

import { Text } from "../text";
import { IconButton } from "../icon-button";

import styles from "./PublicRoomBar.module.scss";
import type { PublicRoomBarProps } from "./PublicRoomBar.types";

const defaultIcon = (
  <div>
    <PeopleIcon />
  </div>
);

const PublicRoomBar = (props: PublicRoomBarProps) => {
  const {
    ref,
    headerText,
    bodyText,
    iconName = defaultIcon,
    hideHeader,
    onClose,
    barIsVisible,
    className,
    dataTestId,
    ...rest
  } = props;

  const headerAs = typeof headerText !== "string" ? "div" : undefined;
  const bodyAs = typeof bodyText !== "string" ? "div" : undefined;

  const icon =
    typeof iconName === "string" ? <ReactSVG src={iconName} /> : iconName;

  return (
    <div
      className={classNames(
        "public-room-bar",
        styles.container,
        {
          [styles.barVisible]: barIsVisible,
        },
        className,
      )}
      {...rest}
      ref={ref}
      data-testid={dataTestId ?? "public_room_bar"}
    >
      <div className={styles.textContainer}>
        {!hideHeader ? (
          <div className={styles.headerBody}>
            <div className={styles.headerIcon}>{icon}</div>
            <Text className={styles.header} fontWeight={600} as={headerAs}>
              {headerText}
            </Text>
          </div>
        ) : null}
        <Text
          className={styles.body}
          fontSize="12px"
          fontWeight={400}
          as={bodyAs}
        >
          {bodyText}
        </Text>
      </div>

      {onClose ? (
        <IconButton
          className={styles.closeIcon}
          size={12}
          iconNode={<CrossIcon />}
          onClick={onClose}
        />
      ) : null}
    </div>
  );
};
PublicRoomBar.displayName = "PublicRoomBar";

export default PublicRoomBar;
