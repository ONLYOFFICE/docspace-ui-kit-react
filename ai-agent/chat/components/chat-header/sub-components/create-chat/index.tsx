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

import { observer } from "mobx-react";
import classNames from "classnames";

import PlusReactSvgUrl from "../../../../../../assets/icons/16/plus.svg";

import { RectangleSkeleton } from "../../../../../../components/rectangle";

import { Text } from "../../../../../../components/text";

import { useMessageStore } from "../../../../store/messageStore";
import { useChatStore } from "../../../../store/chatStore";

import styles from "../../ChatHeader.module.scss";
import { useCommonTranslation } from "../../../../../../utils/i18n";

const CreateChat = ({
  isLoadingProp,
  isDisabled,
  onNewChat,
}: {
  isLoadingProp?: boolean;
  isDisabled?: boolean;
  onNewChat?: () => void;
}) => {
  const { messages, isRequestRunning, startNewChat } = useMessageStore();
  const { setCurrentChat } = useChatStore();
  const t = useCommonTranslation();

  if (isLoadingProp)
    return (
      <RectangleSkeleton
        width="96px"
        height="32px"
        borderRadius="3px"
        style={{ minWidth: "32px" }}
      />
    );

  if (messages.length === 0) return null;

  const onClickAction = () => {
    if (isDisabled || isRequestRunning) return;

    setCurrentChat(null);
    startNewChat();
    onNewChat?.();
  };

  return (
    <div
      className={classNames(styles.createChat, {
        [styles.disabled]: isDisabled,
      })}
      onClick={onClickAction}
      data-testid="create-chat"
      aria-disabled={isDisabled}
    >
      <PlusReactSvgUrl />
      <Text fontSize="13px" lineHeight="15px" fontWeight={600}>
        {t("AINewChat")}
      </Text>
    </div>
  );
};

export default observer(CreateChat);
