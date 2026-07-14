"use client";

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

import React, { memo } from "react";
import classNames from "classnames";

import AvatarBaseReactSvgUrl from "../../assets/avatar.base.react.svg";
import AvatarDarkReactSvgUrl from "../../assets/avatar.dark.react.svg";
import PencilReactSvgUrl from "../../assets/pencil.react.svg";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg";

import { IconSizeType, useClickOutside } from "../../utils";

import { useInterfaceDirection, useTheme } from "../../context";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";

import { IconButton } from "../icon-button";
import { Text } from "../text";
import { type TGetTooltipContent, Tooltip } from "../tooltip";

import styles from "./Avatar.module.scss";

import type { AvatarProps, TAvatarModel } from "./Avatar.types";
import { AvatarRole, AvatarSize, AvatarActionKeys } from "./Avatar.enums";
import { getRoleIcon, Initials, EmptyIcon } from "./Avatar.utils";

export {
  type AvatarProps,
  type TAvatarModel,
  AvatarRole,
  AvatarSize,
  AvatarActionKeys,
};

const AvatarPure = ({
  size,
  source,
  userName,
  role,
  editing,
  isDefaultSource = false,
  hideRoleIcon,
  tooltipContent,
  withTooltip,
  className,
  onClick,
  isGroup = false,
  roleIcon: roleIconProp,
  onChangeFile,
  model,
  hasAvatar,
  noClick = false,
  isNotIcon = false,
  imgClassName = "",
  dataTestId,
}: AvatarProps) => {
  const { isRTL } = useInterfaceDirection();
  const { isBase } = useTheme();

  const iconRef = React.useRef<HTMLDivElement>(null);
  const inputFilesElement = React.useRef<HTMLInputElement>(null);

  const [openEditLogo, setOpenLogoEdit] = React.useState<boolean>(false);

  const onToggleOpenEditLogo = () => setOpenLogoEdit(!openEditLogo);

  useClickOutside(iconRef, () => {
    setOpenLogoEdit(false);
  });

  const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.value = "";
  };

  let isDefault = false;
  let isIcon = false;

  if (typeof source === "string") {
    if (source?.includes("default_user_photo")) isDefault = true;
    else if (source?.includes(".svg")) isIcon = true;
  }

  const avatarContent = source ? (
    typeof source !== "string" ? (
      source
    ) : isIcon && !isNotIcon ? (
      <div className={styles.iconWrapper}>
        <IconButton iconName={source} className="icon" isDisabled />
      </div>
    ) : isDefault ? (
      isBase ? (
        <AvatarBaseReactSvgUrl
          className={styles.image}
          data-is-default="true"
        />
      ) : (
        <AvatarDarkReactSvgUrl
          className={styles.image}
          data-is-default="true"
        />
      )
    ) : (
      <img
        src={source}
        className={`${styles.image}${imgClassName ? ` ${imgClassName}` : ""}`}
        alt="avatar"
      />
    )
  ) : userName ? (
    <Initials userName={userName} size={size} isGroup={isGroup} />
  ) : isDefaultSource ? (
    isBase ? (
      <AvatarBaseReactSvgUrl className={styles.image} data-is-default="true" />
    ) : (
      <AvatarDarkReactSvgUrl className={styles.image} data-is-default="true" />
    )
  ) : (
    <EmptyIcon size={IconSizeType.scale} />
  );

  const roleIcon = roleIconProp ?? getRoleIcon(role);

  const uniqueTooltipId = withTooltip ? `roleTooltip_${Math.random()}` : "";
  const tooltipPlace = isRTL ? "left" : "right";

  const getTooltipContent = ({ content }: TGetTooltipContent) => (
    <Text fontSize="12px">{content}</Text>
  );

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;

    if (onClick) onClick(e);
  };

  const onUploadClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (!onChangeFile) return;
    if (!model) return;
    const menu = model[0];
    menu.onClick(inputFilesElement);
  };

  const onClickAvatar = (e: React.MouseEvent) => {
    if (!onChangeFile) return;

    e.stopPropagation();
    e.preventDefault();
    if (noClick) return;

    if (hasAvatar) {
      return onToggleOpenEditLogo();
    }

    onUploadClick();
  };

  const dropdownElement = (
    <DropDown
      open={openEditLogo}
      clickOutsideAction={() => setOpenLogoEdit(false)}
      withBackdrop={false}
      isDefaultMode={false}
    >
      {model?.map((option) => {
        const optionOnClickAction = () => {
          setOpenLogoEdit(false);

          if (option.key === AvatarActionKeys.PROFILE_AVATAR_UPLOAD) {
            return option.onClick(inputFilesElement);
          }

          option.onClick();
        };

        return (
          <DropDownItem
            key={option.key}
            label={option.label}
            icon={option.icon}
            onClick={optionOnClickAction}
            testId={option.key}
          />
        );
      })}
    </DropDown>
  );

  return (
    <>
      <div
        className={classNames(styles.avatar, className)}
        data-size={size}
        data-no-click={noClick ? "true" : "false"}
        onMouseDown={onMouseDown}
        onClick={onClick || onClickAvatar}
        ref={iconRef}
        data-testid={dataTestId ?? "avatar"}
        role="button"
      >
        <div
          className={classNames(styles.avatarWrapper, className)}
          data-has-source={!!source}
          data-has-username={!!userName}
          data-is-group={isGroup}
        >
          {avatarContent}
        </div>
        {editing && size === "max" ? (
          <div className={classNames(styles.editContainer)}>
            {hasAvatar ? (
              <>
                <IconButton
                  className="edit_icon"
                  iconNode={<PencilReactSvgUrl />}
                  onClick={onToggleOpenEditLogo}
                  size={16}
                  dataTestId="edit_avatar_icon_button"
                />
                {dropdownElement}{" "}
              </>
            ) : (
              <IconButton
                className="edit_icon"
                iconNode={<PlusSvgUrl />}
                onClick={onUploadClick}
                size={16}
                dataTestId="edit_avatar_icon_button"
              />
            )}
          </div>
        ) : (
          roleIcon &&
          !hideRoleIcon && (
            <div
              className={classNames(styles.roleWrapper, "avatar_role-wrapper")}
              data-size={size}
              data-tooltip-id={uniqueTooltipId}
              data-tooltip-content={tooltipContent}
            >
              {roleIcon}
            </div>
          )
        )}
        {withTooltip ? (
          <Tooltip
            float
            id={uniqueTooltipId}
            getContent={getTooltipContent}
            place={tooltipPlace}
            opacity={1}
          />
        ) : null}
      </div>
      {onChangeFile ? (
        <input
          id="customAvatarInput"
          className="custom-file-input"
          type="file"
          onChange={onChangeFile}
          accept="image/png, image/jpeg"
          onClick={onInputClick}
          ref={inputFilesElement}
          style={{ display: "none" }}
          data-testid="file-input"
        />
      ) : null}
    </>
  );
};

const Avatar = memo(AvatarPure);

export { Avatar, AvatarPure };
