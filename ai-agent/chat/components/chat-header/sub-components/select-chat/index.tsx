/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import SelectSessionReactSvg from "../../../../../../assets/select.session.react.svg";
import RenameReactSvg from "../../../../../../assets/rename.react.svg";
import RemoveSvg from "../../../../../../assets/icons/16/catalog.trash.react.svg";
import SaveToFileIcon from "../../../../../../assets/message.save.svg";

import { RectangleSkeleton } from "../../../../../../components/rectangle";

import socket, { SocketCommands, SocketEvents } from "../../../../../../utils/socket";

import { DropDown } from "../../../../../../components/drop-down";
import { TBreadCrumb } from "../../../../../../components/selector";
import { toastr } from "../../../../../../components/toast";
import { Link, LinkType } from "../../../../../../components/link";

import { useChatStore } from "../../../../store/chatStore";
import { useMessageStore } from "../../../../store/messageStore";
import { openFile } from "../../../../utils";
import { SelectChatProps } from "../../../../Chat.types";
import { TooltipContainer } from "../../../../../../components/tooltip";

import ExportSelector from "../../../export-selector";

import styles from "../../ChatHeader.module.scss";

import RenameChat from "../rename-chat";
import DeleteChat from "../delete-chat";
import { CHAT_LIST_MAX_HEIGHT, CHAT_LIST_WIDTH } from "../../constants";
import { getSelectChatRowHeight } from "../../utils";
import { ChatList } from "../chat-list";
import { getCommonTranslation } from "../../../../../../utils";
import { useApi } from "../../../../../../providers";
import { CommonTrans } from "../../../../../../utils/i18n/CommonTrans";

const SelectChat = ({
  isLoadingProp,
  agentId,
  getIcon,
  getResultStorageId,
  folderFormValidation,
  allowExternalNavigation,
  onSelectChat,
}: SelectChatProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState("");
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const {
    chats,
    isLoading,
    currentChat,
    fetchChat,
    deleteChat,
    totalChats,
    fetchNextChats,
    hasNextChats,
    updateUrlChatId,
  } = useChatStore();
  const { fetchMessages, startNewChat, isRequestRunning } = useMessageStore();
  const { aiApi, baseUrl } = useApi();

  const closeExportSelector = () => setIsExportOpen(false);

  const toggleOpen = () => {
    if (isRequestRunning) return;
    setIsOpen((value) => !value);
    setHoveredItem("");
  };

  const onSelectAction = (id: string) => {
    if (isRequestRunning) return;
    fetchChat(id);
    fetchMessages(id);
    toggleOpen();
    onSelectChat?.(id);
  };

  const onRenameToggle = React.useCallback(() => {
    if (isRequestRunning) return;
    setIsOpen(false);
    setIsRenameOpen((value) => !value);
  }, [isRequestRunning]);

  const onDeleteToggle = React.useCallback(() => {
    if (isRequestRunning) return;
    setIsOpen(false);
    setIsDeleteOpen((value) => !value);
  }, [isRequestRunning]);

  const getFileName = () => {
    const title = chats.find((chat) => chat.id === hoveredItem)?.title;

    return title ?? "";
  };

  const onDelete = React.useCallback(() => {
    if (isRequestRunning) return;
    setIsOpen(false);
    setIsDeleteOpen(true);
  }, [isRequestRunning]);

  const onSaveToFileAction = React.useCallback(async () => {
    if (isRequestRunning) return;
    setIsExportOpen(true);
    setIsOpen(false);
  }, [hoveredItem, chats, isRequestRunning]);

  const onSubmit = React.useCallback(
    async (
      selectedItemId: string | number | undefined,
      folderTitle: string,
      isPublic: boolean,
      breadCrumbs: TBreadCrumb[],
      fileName: string,
      isChecked: boolean,
    ) => {
      if (!selectedItemId) return;

      const chatParts = ["CHAT-" + hoveredItem];

      socket?.emit(SocketCommands.Subscribe, {
        roomParts: ["CHAT-" + hoveredItem],
        individual: true,
      });

      await aiApi.exportChat(hoveredItem, selectedItemId, fileName);

      socket?.on(SocketEvents.ExportChat, (data) => {
        const { resultFile } = data;

        const title = chats.find((chat) => chat.id === hoveredItem)?.title;

        if (resultFile) {
          if (isChecked) {
            openFile(resultFile.id!.toString(), allowExternalNavigation, baseUrl);
          }

          const toastMsg = (
            <CommonTrans
              i18nKey="ChatExported"
              values={{ fileName, title }}
              components={{
                1: <b />,
                2: allowExternalNavigation ? (
                  <Link
                    type={LinkType.action}
                    onClick={() => openFile(resultFile.id!.toString(), allowExternalNavigation, baseUrl)}
                  />
                ) : (
                  <span />
                ),
              }}
            />
          );

          toastr.success(toastMsg);
        } else {
          toastr.error(data.error);
        }

        socket?.off(SocketEvents.ExportChat);
        socket?.emit(SocketCommands.Unsubscribe, {
          roomParts: chatParts,
          individual: true,
        });
      });

      setIsExportOpen(false);
    },
    [hoveredItem, chats, isRequestRunning],
  );

  const contextModel = React.useMemo(() => {
    return [
      {
        key: "rename",
        label: getCommonTranslation("Rename"),
        iconNode: <RenameReactSvg />,
        onClick: onRenameToggle,
      },
      {
        key: "save_to_file",
        label: getCommonTranslation("SaveToFile"),
        iconNode: <SaveToFileIcon />,
        onClick: onSaveToFileAction,
      },
      { key: "separator", isSeparator: true },
      {
        key: "remove",
        label: getCommonTranslation("Delete"),
        iconNode: <RemoveSvg />,
        onClick: onDelete,
      },
    ];
  }, [onDelete, onRenameToggle, onSaveToFileAction]);

  const rowHeight = getSelectChatRowHeight();

  const maxHeight =
    chats.length > 7 ? CHAT_LIST_MAX_HEIGHT : rowHeight * chats.length;

  React.useEffect(() => {
    if (isRequestRunning) {
      setIsOpen(false);
    }
  }, [isRequestRunning]);

  React.useEffect(() => {
    if (!isOpen) return;

    const onResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  if (isLoadingProp) {
    return (
      <RectangleSkeleton
        width="32px"
        height="32px"
        borderRadius="3px"
        style={{ minWidth: "32px" }}
      />
    );
  }

  if (!chats.length) return null;

  return (
    <>
      <TooltipContainer
        as="div"
        title={getCommonTranslation("ChatHistory")}
        className={classNames(styles.selectChat, { [styles.open]: isOpen })}
        onClick={toggleOpen}
        ref={parentRef}
        data-testid="select-chat"
      >
        <SelectSessionReactSvg />
      </TooltipContainer>
      {isOpen ? (
        <DropDown
          open={isOpen}
          // isDefaultMode
          zIndex={500}
          clickOutsideAction={() => setIsOpen(false)}
          directionY="bottom"
          directionX="right"
          forwardedRef={parentRef}
          maxHeight={maxHeight}
          manualWidth={`${CHAT_LIST_WIDTH}px`}
          isNoFixedHeightOptions
          dataTestId="select-chat-dropdown"
        >
          <ChatList
            chats={chats}
            activeChatId={currentChat?.id}
            contextModel={contextModel}
            onSelectChat={onSelectAction}
            hoveredChatId={hoveredItem}
            setHoveredChatId={setHoveredItem}
            loadNextPage={fetchNextChats}
            hasNextPage={hasNextChats}
            isNextPageLoading={isLoading}
            total={totalChats}
          />
        </DropDown>
      ) : null}
      {isRenameOpen ? (
        <RenameChat
          chatId={hoveredItem}
          prevTitle={chats.find((chat) => chat.id === hoveredItem)?.title || ""}
          onRenameToggle={onRenameToggle}
        />
      ) : null}
      {isDeleteOpen ? (
        <DeleteChat
          chatId={hoveredItem}
          chatTitle={getFileName()}
          onDeleteToggle={onDeleteToggle}
        />
      ) : null}
      {isExportOpen ? (
        <ExportSelector
          getIcon={getIcon}
          showFolderSelector={isExportOpen}
          onCloseFolderSelector={closeExportSelector}
          currentFolderId={getResultStorageId?.() || agentId}
          getFileName={getFileName}
          onSubmit={onSubmit}
          folderFormValidation={folderFormValidation}
          allowExternalNavigation={allowExternalNavigation}
        />
      ) : null}
    </>
  );
};

export default observer(SelectChat);
