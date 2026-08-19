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

import React, { useState, useRef } from "react";

import VerticalDotsReactSvg from "../../../assets/icons/16/vertical-dots.react.svg";

import { DeviceType } from "../../../enums";
import { Nullable } from "../../../types";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { useCommonTranslation } from "../../../utils/i18n";

import { Avatar, AvatarRole, AvatarSize } from "../../avatar";
import { Text } from "../../text";
import { IconButton } from "../../icon-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";

import styles from "../Article.module.scss";
import { ArticleProfileProps } from "../Article.types";

const ArticleProfile = (props: ArticleProfileProps) => {
  const {
    user,
    showText,

    getActions,
    onProfileClick,
    currentDeviceType,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const iconRef = useRef(null);
  const buttonMenuRef = useRef<ContextMenuRefType>(null);
  const menuRef = useRef<ContextMenuRefType>(null);
  const { isRTL } = useInterfaceDirection();
  const t = useCommonTranslation();

  const isTabletView = currentDeviceType === DeviceType.tablet;
  const avatarSize = isTabletView ? AvatarSize.min : AvatarSize.base;

  const toggle = (
    e: React.MouseEvent,
    open: boolean,
    currentRef: React.RefObject<Nullable<ContextMenuRefType>>,
  ) => {
    if (!currentRef?.current) return;
    if (open) currentRef.current.show(e);
    else currentRef.current.hide(e);
    setIsOpen(open);
  };

  const onClick = (e: React.MouseEvent) => toggle(e, !isOpen, buttonMenuRef);

  const onAvatarClick = (e: React.MouseEvent) => {
    if (isTabletView && !showText) {
      toggle(e, !isOpen, menuRef);
    } else {
      onProfileClick?.({ originalEvent: e });
    }
  };

  const onNameClick = (e: React.MouseEvent) => {
    onProfileClick?.({ originalEvent: e });
  };

  const onNameMouseDownClick = (e: React.MouseEvent) => {
    if (e.button !== 1) return;
    onNameClick(e);
  };

  const onHide = () => {
    setIsOpen(false);
  };

  const model = getActions?.(t);

  const displayName = user?.displayName;

  if (currentDeviceType === DeviceType.mobile) return null;

  return (
    <div
      className={styles.profileWrapper}
      data-show-text={showText ? "true" : "false"}
    >
      <div className={styles.articleProfile}>
        <div ref={ref}>
          <Avatar
            className="profile-avatar"
            id="user-avatar"
            size={avatarSize}
            role={AvatarRole.user}
            source={user?.avatar || ""}
            userName={user?.displayName || ""}
            onClick={onAvatarClick}
            dataTestId="profile_user_avatar"
          />
          <ContextMenu
            model={model ?? []}
            containerRef={ref}
            ref={menuRef}
            onHide={onHide}
            scaled={false}
            leftOffset={Number(!isRTL && -50)}
            rightOffset={Number(isRTL && 54)}
            dataTestId="profile_user_menu"
          />
        </div>
        {!isTabletView || showText ? (
          <>
            <div
              className={styles.userName}
              onMouseDown={onNameMouseDownClick}
              onClick={onNameClick}
              data-testid="profile_username"
            >
              <Text fontWeight={600} noSelect truncate dir="auto">
                {displayName}
              </Text>
            </div>
            <div ref={iconRef} className="option-button">
              <IconButton
                className="option-button-icon"
                onClick={onClick}
                iconNode={<VerticalDotsReactSvg />}
                size={32}
                isFill
                dataTestId="profile_user_icon_button"
              />
              <ContextMenu
                model={model || []}
                containerRef={iconRef}
                ref={buttonMenuRef}
                onHide={onHide}
                scaled={false}
                leftOffset={10}
                dataTestId="profile_user_context_menu"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ArticleProfile;
