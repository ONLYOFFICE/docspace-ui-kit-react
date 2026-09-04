import React, { use } from "react";

import {
  RoomType as ApiRoomType,
  StorageFilter,
  FolderType,
  type RoomType as RoomTypeEnum,
  type FolderDtoInteger,
  type SearchArea,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api";
import { RoomsTypeValues } from "../../../utils/common";
import RoomType from "../../../components/room-type";
import { Tooltip } from "../../../components/tooltip";
import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";
import { toastr, type TData } from "../../../components/toast";

import { LoadersContext } from "../contexts/Loaders";

import { PAGE_COUNT, FORMS_SEARCH_AREA } from "../constants";
import type { UseRoomsHelperProps } from "../types";
import { useCommonTranslation } from "../../../utils/i18n";
import {
  convertRoomsToItems,
  getDefaultBreadCrumb,
  buildSpecialFolderItems,
} from "..";

import useInputItemHelper from "./useInputItemHelper";

const useRoomsHelper = ({
  setHasNextPage,
  setTotal,
  setItems,
  setBreadCrumbs,
  setIsRoot,
  onSetBaseFolderPath,

  searchValue,
  searchArea,
  roomType,
  formsSection,
  isRoomsOnly,

  isInit,
  setIsInit,
  withCreate,
  disabledCreatePublicRoom,
  disableThirdParty,
  excludeItems,
  createDefineRoomLabel,
  createDefineRoomType,
  getRootData,
  setSelectedItemType,
  subscribe,
  setSelectedItemSecurity,
  setSelectedTreeNode,
  isRoomDisabled,

  recentFolder,
  favoritesFolder,
  withRecentTreeFolder,
  withFavoritesTreeFolder,
  roomsFolderId,
}: UseRoomsHelperProps) => {
  const t = useCommonTranslation();
  const {
    setIsNextPageLoading,
    hideSectionLoader,
    finishFullLoad,

    isFullLoadActive,
  } = use(LoadersContext);

  const { roomsApi } = useApi();

  const { addInputItem } = useInputItemHelper({ withCreate, setItems });

  const requestRunning = React.useRef(false);
  const initRef = React.useRef(isInit);
  const firstLoadRef = React.useRef(isFullLoadActive);

  React.useEffect(() => {
    firstLoadRef.current = isFullLoadActive;
  }, [isFullLoadActive]);

  React.useEffect(() => {
    initRef.current = isInit;
  }, [isInit]);

  // The type dropdown only opens outside the Forms section (a forms-scoped
  // listing gets createRoomType and creates the room straight away), and form
  // filling rooms cannot be created from the Rooms section.
  const createDropDownItems = React.useMemo(() => {
    return RoomsTypeValues.filter(
      (value) => value !== ApiRoomType.FillingFormsRoom,
    ).map((value) => {
      const isPublicRoomDisabled =
        !!disabledCreatePublicRoom && value === ApiRoomType.PublicRoom;

      const onClick = () => {
        if (isPublicRoomDisabled) return;

        addInputItem("", "", value as RoomTypeEnum, t("EnterName"));
      };

      const roomTypeElement = (
        <RoomType
          key={value}
          roomType={value}
          selectedId={value}
          type="dropdownItem"
          isOpen={false}
          disabledPublicRoom={disabledCreatePublicRoom}
          onClick={onClick}
        />
      );

      if (!isPublicRoomDisabled) return roomTypeElement;

      const tooltipId = `create-room-type-disabled-${value}`;

      return (
        <div key={value} id={tooltipId}>
          {roomTypeElement}
          <Tooltip
            id={`${tooltipId}-instance`}
            anchorSelect={`#${tooltipId}`}
            place="bottom"
            float
            getContent={() => t("PublicRoomCreationDisabled")}
          />
        </div>
      );
    });
  }, [addInputItem, disabledCreatePublicRoom, t]);

  const getRoomList = React.useCallback(
    async (sIndex: number) => {
      if (requestRunning.current) return;

      requestRunning.current = true;
      setIsNextPageLoading(true);

      try {
        let startIndex = sIndex;

        if (withCreate) {
          startIndex -= startIndex % 100;
        }

        const filterValue = searchValue || "";

        let typeFilter: RoomTypeEnum[] | undefined;

        if (roomType || createDefineRoomType) {
          const types: RoomTypeEnum[] = roomType
            ? Array.isArray(roomType)
              ? [...roomType]
              : [roomType]
            : [];
          if (createDefineRoomType && !types.includes(createDefineRoomType)) {
            types.push(createDefineRoomType);
          }
          typeFilter = types.length > 0 ? types : undefined;
        }

        if (!typeFilter && formsSection !== undefined) {
          typeFilter = formsSection
            ? [ApiRoomType.FillingFormsRoom]
            : Object.values(ApiRoomType).filter(
                (value) =>
                  value !== ApiRoomType.FillingFormsRoom &&
                  value !== ApiRoomType.AiRoom,
              );
        }

        // Form filling rooms live only in the Forms section, so a listing scoped
        // to them must ask for that search area - otherwise the server looks
        // inside the Rooms section and returns nothing.
        const isFormRoomOnlyFilter =
          !!typeFilter &&
          typeFilter.length > 0 &&
          typeFilter.every((value) => value === ApiRoomType.FillingFormsRoom);

        const effectiveSearchArea = searchArea
          ? (searchArea as SearchArea)
          : formsSection || isFormRoomOnlyFilter
            ? (FORMS_SEARCH_AREA as unknown as SearchArea)
            : undefined;

        const res = await roomsApi.getRoomsFolder({
          type: typeFilter,
          searchArea: effectiveSearchArea,
          storageFilter: disableThirdParty ? StorageFilter.Internal : undefined,
          count: PAGE_COUNT,
          startIndex,
          filterValue,
        });
        const roomsFromApi = res.data.response!;

        const { folders, total, count, current } = roomsFromApi;

        if (initRef.current) {
          const { title, id } = current!;

          if (isRoomsOnly) subscribe(id!);

          const breadCrumbs: TBreadCrumb[] = [
            { label: title!, id: id!, isRoom: true },
          ];

          if (!isRoomsOnly) breadCrumbs.unshift({ ...getDefaultBreadCrumb(t) });

          onSetBaseFolderPath?.(breadCrumbs);

          setBreadCrumbs?.(breadCrumbs);

          hideSectionLoader("breadcrumbs");
        }

        const itemList: TSelectorItem[] = convertRoomsToItems(
          folders ?? [],
          t,
          isRoomDisabled,
        ).filter((x) => (excludeItems ? !excludeItems.includes(x.id) : true));

        setHasNextPage(count === PAGE_COUNT);

        setSelectedItemSecurity?.(current!.security!);

        setSelectedTreeNode?.({
          ...current!,
          path: roomsFromApi.pathParts,
        } as FolderDtoInteger);

        if (firstLoadRef.current || startIndex === 0) {
          const { security } = current!;

          if (withCreate && security?.Create) {
            setTotal(total + 1);
            const createRoomType =
              createDefineRoomType ??
              (formsSection ? ApiRoomType.FillingFormsRoom : undefined);
            const createItem: TSelectorItem = {
              isCreateNewItem: true,
              label: createDefineRoomLabel ?? t("NewRoom"),
              id: "create-room-item",
              key: "create-room-item",
              hotkey: "r",
              isRoomsOnly,
              createDefineRoomType: createRoomType,
              dropDownItems: createRoomType ? undefined : createDropDownItems,

              onBackClick: () => {
                setIsRoot?.(true);
                setSelectedItemType?.(undefined);
                setBreadCrumbs?.((val) => {
                  const newVal = [...val];

                  newVal.pop();

                  return newVal;
                });
                getRootData?.();
              },
            };

            if (createRoomType) {
              createItem.onCreateClick = () =>
                addInputItem("", "", createRoomType, createDefineRoomLabel);
            }

            itemList.unshift(createItem);
          } else {
            setTotal(total);
          }

          if (
            startIndex === 0 &&
            !searchValue &&
            (withRecentTreeFolder || withFavoritesTreeFolder)
          ) {
            const specialItems = buildSpecialFolderItems({
              section: formsSection ? "forms" : "rooms",
              recentFolder,
              favoritesFolder,
              withRecent: withRecentTreeFolder,
              withFavorites: withFavoritesTreeFolder,
              parentId: formsSection ? undefined : roomsFolderId,
              // Scope filter for Recent/Favorites: the type of the rooms to
              // keep, not the root section - so this stays FillingFormsRoom (15).
              folderType: formsSection
                ? FolderType.FillingFormsRoom
                : undefined,
              withSeparator: itemList.length > 0,
              t,
            });

            if (specialItems.length) {
              itemList.unshift(...specialItems);
              const base = withCreate && security?.Create ? total + 1 : total;
              setTotal(base + specialItems.length);
            }
          }

          setItems?.(itemList);
        } else {
          setItems?.((prevState) => {
            if (prevState) return [...prevState, ...itemList];
            return [...itemList];
          });
        }

        setIsRoot?.(false);
        setIsInit(false);
      } catch (error) {
        toastr.error(error as TData);
      } finally {
        requestRunning.current = false;
        setIsNextPageLoading(false);
        // Also ends the content refresh; skipping it on the error path would
        // leave the skeleton on screen and hideSectionLoader a permanent no-op
        finishFullLoad();
      }
    },
    [
      roomsApi,
      searchValue,
      createDefineRoomType,
      setHasNextPage,
      setSelectedItemSecurity,
      setIsRoot,
      setIsInit,
      setIsNextPageLoading,
      roomType,
      formsSection,
      isRoomsOnly,
      subscribe,
      onSetBaseFolderPath,
      setBreadCrumbs,
      hideSectionLoader,
      withCreate,
      setItems,
      setTotal,
      createDefineRoomLabel,
      createDropDownItems,
      setSelectedItemType,
      getRootData,
      addInputItem,
      searchArea,
      disableThirdParty,
      excludeItems,
      setSelectedTreeNode,
      t,
      recentFolder,
      favoritesFolder,
      withRecentTreeFolder,
      withFavoritesTreeFolder,
      roomsFolderId,
      isRoomDisabled,
      finishFullLoad,
    ],
  );

  return { getRoomList };
};

export default useRoomsHelper;

