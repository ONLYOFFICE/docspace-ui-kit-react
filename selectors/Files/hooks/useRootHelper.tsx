import React, { use } from "react";

import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api";
import { useCommonTranslation } from "../../../utils/i18n";
import type { TSelectorItem } from "../../../components/selector";
import { toastr, type TData } from "../../../components/toast";
import { getDefaultBreadCrumb } from "../../utils";
import {
  AI_HUB_ROOT_FOLDER_TYPE,
  FORMS_ROOT_FOLDER_TYPE,
  PRIVATE_ROOMS_ROOT_FOLDER_TYPE,
  PRIVATE_SECTION_ID,
  FORMS_SECTION_ID,
} from "../../utils/constants";
import { LoadersContext } from "../../utils/contexts/Loaders";

import CatalogDocumentsSvg from "../../../assets/icons/16/catalog.documents.react.svg";
import CatalogRoomsSvg from "../../../assets/icons/16/catalog.rooms.react.svg";
import CatalogArchiveSvg from "../../../assets/icons/16/catalog.archive.react.svg";
import CatalogSharedSvg from "../../../assets/icons/16/catalog.shared.outline.svg";
import CatalogPortfolioSvg from "../../../assets/icons/16/catalog.portfolio.react.svg";
import CatalogFavoritesSvg from "../../../assets/icons/16/catalog.favorites.react.svg";
import CatalogRecentSvg from "../../../assets/icons/16/catalog-settings-restore.svg";
import CatalogPrivateSvg from "../../../assets/icons/16/catalog.private.react.svg";
import CatalogTrashSvg from "../../../assets/icons/16/catalog.trash.react.svg";

import type { UseRootHelperProps } from "../FilesSelector.types";

const catalogIcons: Partial<Record<FolderType, React.FC>> = {
  [FolderType.USER]: CatalogDocumentsSvg,
  [FolderType.VirtualRooms]: CatalogRoomsSvg,
  [FolderType.Archive]: CatalogArchiveSvg,
  [FolderType.SHARE]: CatalogSharedSvg,
  [FolderType.COMMON]: CatalogPortfolioSvg,
  [FolderType.Favorites]: CatalogFavoritesSvg,
  [FolderType.Recent]: CatalogRecentSvg,
  [FolderType.Privacy]: CatalogPrivateSvg,
  [FolderType.TRASH]: CatalogTrashSvg,
  [AI_HUB_ROOT_FOLDER_TYPE as FolderType]: CatalogRoomsSvg,
};

// Canonical display order of root folders, matching the left-side Article menu.
const rootFolderDisplayOrder: FolderType[] = [
  FolderType.USER,
  FolderType.VirtualRooms,
  AI_HUB_ROOT_FOLDER_TYPE as FolderType,
  FolderType.SHARE,
  FolderType.Favorites,
  FolderType.Recent,
  FolderType.Archive,
  FolderType.Privacy,
  FolderType.COMMON,
  FolderType.TRASH,
];

const getRootFolderOrder = (folder: FolderDtoInteger) => {
  const index =
    folder.rootFolderType != null
      ? rootFolderDisplayOrder.indexOf(folder.rootFolderType)
      : -1;

  // Unknown types go to the end, keeping their original relative order.
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const useRootHelper = ({
  setBreadCrumbs,

  setItems,
  treeFolders,
  withAIRoomsTreeFolder,
  withRoomsTreeFolder,
  withFormsTreeFolder,
  withPrivateTreeFolder,
  setRecentFolder,
  setFavoritesFolder,

  setTotal,
  setHasNextPage,
  isUserOnly,
  setIsInit,
}: UseRootHelperProps) => {
  const t = useCommonTranslation();
  const { hideSectionLoader, setIsNextPageLoading, finishFullLoad } =
    use(LoadersContext);

  const { foldersApi } = useApi();

  const [isRoot, setIsRoot] = React.useState<boolean>(false);
  const requestRunning = React.useRef(false);

  const getRootData = React.useCallback(async () => {
    if (requestRunning.current) return;

    requestRunning.current = true;
    setBreadCrumbs([getDefaultBreadCrumb(t)]);
    setIsRoot(true);
    setIsNextPageLoading(true);
    hideSectionLoader("breadcrumbs");

    try {
      const newItems: TSelectorItem[] = [];

      let currentTree: FolderDtoInteger[] | null = null;

      if (treeFolders && treeFolders?.length > 0) {
        currentTree = treeFolders;
      } else {
        const res = await foldersApi.getRootFolders();
        const rootFolders = res.data.response ?? [];
        currentTree = rootFolders
          .map((item) => item.current)
          .filter((f): f is FolderDtoInteger => f != null);
      }

      const orderedTree = [...(currentTree ?? [])].sort(
        (a, b) => getRootFolderOrder(a) - getRootFolderOrder(b),
      );

      orderedTree.forEach((folder) => {
        if (folder.rootFolderType === FolderType.Recent)
          setRecentFolder?.(folder);
        if (folder.rootFolderType === FolderType.Favorites)
          setFavoritesFolder?.(folder);

        const IconComponent = folder.rootFolderType
          ? catalogIcons[folder.rootFolderType]
          : undefined;
        const avatar = IconComponent ? (
          <IconComponent key={folder.rootFolderType} />
        ) : undefined;

        const isRoomsRoot =
          !isUserOnly && folder.rootFolderType === FolderType.VirtualRooms;

        if (
          (withRoomsTreeFolder &&
            !isUserOnly &&
            folder.rootFolderType === FolderType.VirtualRooms) ||
          folder.rootFolderType === FolderType.USER ||
          (withAIRoomsTreeFolder &&
            !isUserOnly &&
            Number(folder.rootFolderType) === AI_HUB_ROOT_FOLDER_TYPE)
        ) {
          let title = "";

          switch (folder.rootFolderType) {
            case FolderType.USER:
              title = t("Files");
              break;
            case FolderType.VirtualRooms:
              title = t("Rooms");
              break;
            case AI_HUB_ROOT_FOLDER_TYPE as FolderType:
              title = t("AiWorkspace");
              break;
            default:
              break;
          }

          newItems.push({
            label: title,
            id: folder.id!,
            parentId: folder.parentId!,
            rootFolderType: folder.rootFolderType!,
            filesCount: folder.filesCount!,
            foldersCount: folder.foldersCount!,
            security: folder.security!,
            isFolder: true,
            avatar,
            disableMultiSelect: true,
          });
        }

        // Forms is listed off the rooms root but is a section of its own, so it
        // stays when Rooms itself is hidden.
        if (withFormsTreeFolder && isRoomsRoot) {
          newItems.push({
            label: t("Forms"),
            id: FORMS_SECTION_ID,
            parentId: folder.parentId!,
            rootFolderType: FORMS_ROOT_FOLDER_TYPE as FolderType,
            filesCount: folder.filesCount!,
            foldersCount: folder.foldersCount!,
            security: folder.security!,
            isFolder: true,
            avatar: <CatalogDocumentsSvg />,
            disableMultiSelect: true,
          });
        }

        // Private rooms sit under the rooms root too, and the Rooms listing
        // never returns them: they are reached through an entry of their own.
        if (withPrivateTreeFolder && isRoomsRoot) {
          newItems.push({
            label: t("Private"),
            id: PRIVATE_SECTION_ID,
            parentId: folder.parentId!,
            rootFolderType: PRIVATE_ROOMS_ROOT_FOLDER_TYPE as FolderType,
            filesCount: folder.filesCount!,
            foldersCount: folder.foldersCount!,
            security: folder.security!,
            isFolder: true,
            avatar: <CatalogPrivateSvg />,
            disableMultiSelect: true,
          });
        }
      });

      setItems(newItems);
      setTotal(newItems.length);
      setHasNextPage(false);
      setIsInit(false);
    } catch (error) {
      toastr.error(error as TData);
    } finally {
      requestRunning.current = false;
      setIsNextPageLoading(false);
      finishFullLoad();
    }
  }, [
    foldersApi,
    isUserOnly,
    finishFullLoad,
    setBreadCrumbs,
    setHasNextPage,
    hideSectionLoader,
    setIsInit,
    setIsNextPageLoading,
    setItems,
    setTotal,
    t,
    treeFolders,
    withAIRoomsTreeFolder,
    withRoomsTreeFolder,
    withFormsTreeFolder,
    withPrivateTreeFolder,
    setRecentFolder,
    setFavoritesFolder,
  ]);

  return { isRoot, setIsRoot, getRootData };
};

export default useRootHelper;
