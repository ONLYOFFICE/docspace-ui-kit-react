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

import VerticalDotsReactSvg from "../../../../../../assets/icons/16/vertical-dots.react.svg";

import type { TChat } from "../../../../../../types/ai";
import {
  ContextMenu,
  ContextMenuRefType,
  ContextMenuModel,
} from "../../../../../../components/context-menu";
import { DropDownItem } from "../../../../../../components/drop-down-item";
import { isDesktop } from "../../../../../../utils";
import { Text } from "../../../../../../components/text";
import { IconButton } from "../../../../../../components/icon-button";
import styles from "../../ChatHeader.module.scss";

type ChatListItemProps = {
  chat: TChat;
  onClick: (id: TChat["id"]) => void;
  contextModel: ContextMenuModel[];
  hoveredChatId?: TChat["id"];
  setHoveredChatId: (id: TChat["id"]) => void;
  activeChatId?: TChat["id"];
};

export const ChatListItem = ({
  chat,
  onClick,
  hoveredChatId,
  setHoveredChatId,
  contextModel,
  activeChatId,
}: ChatListItemProps) => {
  const contextMenuRef = React.useRef<ContextMenuRefType>(null);

  const onShowContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    contextMenuRef.current?.show(e);
  };

  const desktop = isDesktop();

  return (
    <DropDownItem
      onClick={(e) => {
        e.stopPropagation();

        const target = e.target as HTMLElement;
        const iconButtonWrapper = target.closest(
          `.${styles.iconButtonWrapper}`,
        );

        if (iconButtonWrapper) {
          return;
        }

        onClick(chat.id);
      }}
      className={classNames("drop-down-item")}
      isActive={activeChatId === chat.id}
      data-id={chat.id}
    >
      <div
        className={styles.dropdowItemWrapper}
        onMouseEnter={() => setHoveredChatId(chat.id)}
      >
        <Text className={styles.chatListItemTitle} truncate title={chat.title}>
          {chat.title}
        </Text>
        {hoveredChatId === chat.id || !desktop ? (
          <div className={styles.iconButtonWrapper} onClick={onShowContextMenu}>
            <IconButton
              iconNode={<VerticalDotsReactSvg />}
              size={16}
              isClickable
              isFill
              onClick={() => {}}
              dataTestId="chat-list-item-context-menu-button"
            />
            <ContextMenu
              ref={contextMenuRef}
              model={contextModel}
              dataTestId="chat-list-item-context-menu"
            />
          </div>
        ) : null}
      </div>
    </DropDownItem>
  );
};
