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

import socket, {
  SocketCommands,
  SocketEvents,
  type TOptSocket,
} from "../../../utils/socket";

import { useApi } from "../../../providers/api";
import type {
  FileDtoInteger,
  FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem } from "../../../components/selector";
import {
  convertRoomsToItems,
  convertFilesToItems,
  convertFoldersToItems,
} from "..";

import type { UseSocketHelperProps } from "../types";
import { SettingsContext } from "../contexts/Settings";

// Folder ids can be either numeric (server returns number, breadcrumbs/items
// sometimes carry the same id as a string) or non-numeric strings for
// third-party providers. Compare numerically when both sides parse as a
// finite number; otherwise fall back to a strict string compare.
const idsEqual = (
  a: number | string | null | undefined,
  b: number | string | null | undefined,
) => {
  if (a == null || b == null) return false;
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na === nb;
  return String(a) === String(b);
};

const useSocketHelper = ({
  disabledItems,
  disabledFolderType,
  filterParam,
  withCreate,
  setItems,
  setBreadCrumbs,
  setTotal,
  disableBySecurity,
  isRoomDisabled,
}: UseSocketHelperProps) => {
  const { getIcon } = React.use(SettingsContext);
  const { filesApi, foldersApi, roomsApi } = useApi();

  const folderSubscribers = React.useRef(new Set<string>());

  const subscribedId = React.useRef<null | number | string>(null);

  const unsubscribe = React.useCallback((id?: number | string) => {
    if (!id) {
      const roomParts = [...Array.from(folderSubscribers.current)];

      socket?.emit(SocketCommands.Unsubscribe, {
        roomParts,
        individual: true,
      });

      folderSubscribers.current = new Set<string>();
      subscribedId.current = null;

      return;
    }

    const path = `DIR-${id}`;

    if (folderSubscribers.current.has(path)) {
      socket?.emit(SocketCommands.Unsubscribe, {
        roomParts: path,
        individual: true,
      });

      folderSubscribers.current.delete(path);
    }

    if (subscribedId.current === id) subscribedId.current = null;
  }, []);

  const subscribe = React.useCallback(
    (id: number | string) => {
      const roomParts = `DIR-${id}`;

      if (subscribedId.current && subscribedId.current !== id)
        unsubscribe(subscribedId.current);

      subscribedId.current = id;

      if (folderSubscribers.current.has(roomParts)) return;

      // If already subscribed externally (e.g. main view), don't take
      // ownership — adding to folderSubscribers would cause cleanup to
      // unsubscribe it when the selector closes, breaking the main view.
      if (socket?.socketSubscribers.has(roomParts)) return;

      folderSubscribers.current.add(roomParts);

      socket?.emit(SocketCommands.Subscribe, {
        roomParts,
        individual: true,
      });
    },
    [unsubscribe],
  );

  const addItem = React.useCallback(
    async (opt: TOptSocket) => {
      if (!opt?.data) return;
      const data: FileDtoInteger | FolderDtoInteger = JSON.parse(opt.data);

      if (
        "folderId" in data && data.folderId
          ? !idsEqual(data.folderId, subscribedId.current)
          : "parentId" in data &&
            !("roomType" in data) &&
            !idsEqual(data.parentId, subscribedId.current)
      ) {
        return;
      }

      let item: TSelectorItem = {} as TSelectorItem;

      if (opt?.type === "file" && "folderId" in data) {
        const fileRes = await filesApi.getFileInfo({
          fileId: data.id!,
        });
        const file = fileRes.data.response!;
        [item] = convertFilesToItems(
          [file],
          getIcon,
          filterParam,
          undefined,
          disableBySecurity,
        );
      } else if (opt?.type === "folder" && !("folderId" in data)) {
        if ("roomType" in data) {
          const roomRes = await roomsApi.getRoomInfo({
            id: data.id!,
          });
          const room = roomRes.data.response!;
          item = convertRoomsToItems([room], undefined, isRoomDisabled)[0];
        } else {
          const folderRes = await foldersApi.getFolderInfo({
            folderId: data.id!,
          });
          const folder = folderRes.data.response!;
          item = convertFoldersToItems(
            [folder],
            disabledItems,
            filterParam,
            disabledFolderType,
          )[0];
        }
      }

      setItems((value) => {
        if (!item || !value) return value;

        if (opt.type === "folder") {
          setTotal((v) => v + 1);

          if (withCreate) {
            const newValue = [...value];

            let idx = 1;

            if (value[0]?.isInputItem) idx = 0;

            newValue.splice(idx, 1, item);

            return newValue;
          }

          return [item, ...value];
        }

        if (opt.type === "file") {
          let idx = 0;

          for (let i = 0; i < value.length - 1; i += 1) {
            if (
              !value[i]?.isFolder &&
              !value[i]?.isCreateNewItem &&
              !value[i]?.isInputItem
            )
              break;

            idx = i + 1;
          }

          const newValue = [...value];

          newValue.splice(idx, 0, item);

          setTotal((v) => v + 1);

          return newValue;
        }

        return value;
      });
    },
    [
      filesApi,
      foldersApi,
      roomsApi,
      disabledItems,
      disabledFolderType,
      filterParam,
      getIcon,
      setItems,
      setTotal,
      withCreate,
      disableBySecurity,
      isRoomDisabled,
    ],
  );

  const updateItem = React.useCallback(
    async (opt: TOptSocket) => {
      if (!opt?.data) return;

      const data: FileDtoInteger | FolderDtoInteger = JSON.parse(opt.data);

      if (
        (("folderId" in data &&
          data.folderId &&
          !idsEqual(data.folderId, subscribedId.current)) ||
          ("parentId" in data &&
            data.parentId &&
            !idsEqual(data.parentId, subscribedId.current))) &&
        !idsEqual(data.id, subscribedId.current)
      ) {
        return;
      }

      let item: TSelectorItem = {} as TSelectorItem;

      if (opt?.type === "file" && "folderId" in data) {
        const fileRes = await filesApi.getFileInfo({
          fileId: data.id!,
        });
        const file = fileRes.data.response!;
        [item] = convertFilesToItems(
          [file],
          getIcon,
          filterParam,
          undefined,
          disableBySecurity,
        );
      } else if (opt?.type === "folder") {
        if ("roomType" in data) {
          const roomRes = await roomsApi.getRoomInfo({
            id: data.id!,
          });
          const room = roomRes.data.response!;
          item = convertRoomsToItems([room], undefined, isRoomDisabled)[0];
        } else {
          const folderRes = await foldersApi.getFolderInfo({
            folderId: data.id!,
          });
          const folder = folderRes.data.response!;
          item = convertFoldersToItems(
            [folder],
            disabledItems,
            filterParam,
            disabledFolderType,
          )[0];
        }
      }

      if (idsEqual(item?.id, subscribedId.current)) {
        return setBreadCrumbs?.((value) => {
          if (!value) return value;

          const newValue = [...value];

          if (newValue[newValue.length - 1].id === item?.id) {
            newValue[newValue.length - 1].label = item.label;
          }

          return newValue;
        });
      }

      setItems((value) => {
        if (!item || !value) return value;

        if (opt.type === "folder") {
          const idx = value.findIndex((v) => v.id === item?.id && v.isFolder);

          if (idx > -1) {
            const newValue = [...value];

            newValue.splice(idx, 1, item);

            return newValue;
          }

          setBreadCrumbs?.((breadCrumbsValue) => {
            return breadCrumbsValue;
          });
        }

        if (opt.type === "file") {
          const idx = value.findIndex((v) => v.id === item?.id && !v.isFolder);

          if (idx > -1) {
            const newValue = [...value];

            newValue.splice(idx, 1, item);

            return [...newValue];
          }
        }

        return value;
      });
    },
    [
      filesApi,
      foldersApi,
      roomsApi,
      disabledItems,
      disabledFolderType,
      filterParam,
      getIcon,
      setBreadCrumbs,
      setItems,
      disableBySecurity,
      isRoomDisabled,
    ],
  );

  const deleteItem = React.useCallback(
    (opt: TOptSocket) => {
      setItems((value) => {
        if (!value) return value;

        if (opt.type === "folder") {
          const newValue = value.filter(
            (v) => v?.id !== opt?.id || !v.isFolder,
          );

          if (newValue.length !== value.length) {
            setTotal((v) => v - 1);
          }

          return newValue;
        }
        if (opt.type === "file") {
          const newValue = value.filter((v) => v?.id !== opt?.id || v.isFolder);

          if (newValue.length !== value.length) {
            setTotal((v) => v - 1);
          }

          return newValue;
        }

        return value;
      });
    },
    [setItems, setTotal],
  );

  const socketHandlerRef = React.useRef<((opt?: TOptSocket) => void) | null>(
    null,
  );

  socketHandlerRef.current = (opt?: TOptSocket) => {
    switch (opt?.cmd) {
      case "create":
        addItem(opt);
        break;
      case "update":
        updateItem(opt);
        break;
      case "delete":
        deleteItem(opt);
        break;
      default:
    }
  };

  React.useEffect(() => {
    const handler = (opt?: TOptSocket) => socketHandlerRef.current?.(opt);
    socket?.on(SocketEvents.ModifyFolder, handler);
    return () => {
      socket?.off(SocketEvents.ModifyFolder, handler);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return { subscribe, unsubscribe };
};

export default useSocketHelper;
