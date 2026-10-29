import React from "react";

import type { RoomType as SdkRoomType } from "@onlyoffice/docspace-api-sdk";

import type { TRoomTypeValue as RoomType } from "../../../types";

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
            // The server takes every room type; only the SDK enum lags.
            createRoomRequestDto: {
              roomType: roomType as SdkRoomType,
              title: value,
            },
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

      // The input row is replaced here, not by the socket "folder created"
      // event: that event may be for another folder, and it does not arrive
      // at a root (e.g. the rooms root), where nothing is subscribed. Keyed by
      // id, so when the socket listed the folder first the row is just dropped.
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
