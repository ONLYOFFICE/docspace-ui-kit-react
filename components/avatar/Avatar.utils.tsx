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

import AdministratorReactSvg from "../../assets/administrator.react.svg";
import OwnerReactSvg from "../../assets/owner.react.svg";
import CameraReactSvg from "../../assets/camera.react.svg";

import { IconSizeType } from "../../utils";
import type { AvatarSize, AvatarRole } from "./Avatar.enums";

import styles from "./Avatar.module.scss";

export const getRoleIcon = (role: AvatarRole) => {
  switch (role) {
    case "admin":
      return (
        <AdministratorReactSvg
          data-size={IconSizeType.scale}
          className={classNames(styles.adminIcon, "admin_icon")}
        />
      );
    case "owner":
      return (
        <OwnerReactSvg
          data-size={IconSizeType.scale}
          className={classNames(styles.ownerIcon, "owner_icon")}
        />
      );
    default:
      return null;
  }
};

const getInitials = (userName: string, isGroup: boolean) => {
  const initials = userName
    .split(/\s/)
    .reduce((response: string, word: string) => response + word.slice(0, 1), "")
    .substring(0, 2);

  return isGroup ? initials.toUpperCase() : initials;
};

export const Initials = ({
  userName,
  size,
  isGroup,
}: {
  userName: string;
  size: AvatarSize;
  isGroup: boolean;
}) => (
  <div
    className={classNames(styles.namedAvatar, { [styles.isGroup]: isGroup })}
    data-size={size}
  >
    {getInitials(userName, isGroup)}
  </div>
);

export const EmptyIcon = ({ size }: { size: IconSizeType }) => {
  return <CameraReactSvg className={styles.emptyIcon} data-size={size} />;
};
