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

import type { RoomType } from "@onlyoffice/docspace-api-sdk";

import { useApi } from "../../../providers/api/ApiProvider";
import type { TSelectorItem } from "../../../components/selector";
import { toastr } from "../../../components/toast";

import { convertFoldersToItems, convertRoomsToItems } from "..";
import type { TUseInputItemHelper } from "../types";

const useInputItemHelper = ({
  withCreate,
  selectedItemId,
  setItems,
}: TUseInputItemHelper) => {
  const { foldersApi, roomsApi } = useApi();
  const selectedItemIdRef = React.useRef(selectedItemId);

  React.useEffect(() => {
    selectedItemIdRef.current = selectedItemId;
  }, [selectedItemId]);

  const onCancelInput = React.useCallback(() => {
    if (!withCreate) return;

    setItems?.((value) => {
      if (!value[1]?.isInputItem && !value[0]?.isInputItem) return value;

      let idx = 1;

      if (value[0].isInputItem) idx = 0;

      const newValue = [...value];

      newValue.splice(idx, 1);

      return newValue;
    });
  }, [setItems, withCreate]);

  const onAcceptInput = React.useCallback(
    async (value: string, roomType?: RoomType, isAgent?: boolean) => {
      const currentSelectedItemId = selectedItemIdRef.current;
      if (!withCreate || (!currentSelectedItemId && !roomType && !isAgent))
        return;

      let createdItem: TSelectorItem | undefined;

      try {
        // if (isAgent) await createAIAgent({ title: value });
        // NOTE: currentSelectedItemId can be string but types cannot be fixed right now, using type assertion
        if (currentSelectedItemId) {
          const res = await foldersApi.createFolder({
            folderId: Number(currentSelectedItemId),
            createFolder: {
              title: value.trimEnd(),
            },
          });

          const created = res.data?.response;

          if (created) [createdItem] = convertFoldersToItems([created], []);
        } else if (roomType) {
          const res = await roomsApi.createRoom({
            createRoomRequestDto: { roomType, title: value },
          });

          const created = res.data?.response;

          if (created) [createdItem] = convertRoomsToItems([created]);
        }
      } catch (e) {
        console.log(e);
        toastr.error(e as string);
        // Drop the input row so it does not hang after a failed request.
        onCancelInput();
        return;
      }

      // The socket "folder created" event replaces the input row, but it only
      // arrives for the folder the selector is subscribed to. At a root
      // (e.g. the rooms root) there is no subscription, so reconcile locally.
      // Keyed by id, so the socket handler winning the race is a no-op.
      setItems?.((value) => {
        const idx = value.findIndex((item) => item.isInputItem);

        if (idx === -1) return value;

        const newValue = [...value];

        if (!createdItem || value.some((item) => item.id === createdItem!.id)) {
          newValue.splice(idx, 1);

          return newValue;
        }

        newValue.splice(idx, 1, createdItem);

        return newValue;
      });
    },
    [withCreate, foldersApi, roomsApi, setItems, onCancelInput],
  );

  const addInputItem = React.useCallback(
    (
      defaultInputValue: string,
      icon: string | React.ReactElement,
      roomType?: RoomType,
      placeholder?: string,
      isAgent?: boolean,
    ) => {
      if (!withCreate || !setItems) return;

      const inputItem: TSelectorItem = {
        label: "",
        id: "new-folder-input",
        isInputItem: true,
        onAcceptInput: (value: string) =>
          onAcceptInput(value, roomType, isAgent),
        onCancelInput,
        defaultInputValue,
        icon,
        roomType,
        placeholder,
      };

      setItems((value) => {
        if (value[1]?.isInputItem || value[0]?.isInputItem) return value;

        const newValue = [...value];

        newValue.splice(1, 0, inputItem);

        return newValue;
      });
    },
    [onAcceptInput, onCancelInput, setItems, withCreate],
  );

  return { onAcceptInput, onCancelInput, addInputItem };
};

export default useInputItemHelper;
