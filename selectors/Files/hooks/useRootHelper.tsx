// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { use } from "react";

import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api";
import { getCommonTranslation } from "../../../utils/i18n";
import type { TSelectorItem } from "../../../components/selector";
import { getDefaultBreadCrumb } from "../../utils";
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
import CatalogAiAgentsSvg from "../../../assets/icons/16/catalog.ai-agents.react.svg";

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
  [FolderType.AiAgents]: CatalogAiAgentsSvg,
};

const useRootHelper = ({
  setBreadCrumbs,

  setItems,
  treeFolders,
  withRecentTreeFolder,
  withFavoritesTreeFolder,
  withAIAgentsTreeFolder,

  setTotal,
  setHasNextPage,
  isUserOnly,
  setIsInit,
}: UseRootHelperProps) => {
  const { setIsBreadCrumbsLoading, setIsNextPageLoading, setIsFirstLoad } =
    use(LoadersContext);

  const { foldersApi } = useApi();

  const [isRoot, setIsRoot] = React.useState<boolean>(false);
  const requestRunning = React.useRef(false);

  const getRootData = React.useCallback(async () => {
    if (requestRunning.current) return;

    requestRunning.current = true;
    setBreadCrumbs([getDefaultBreadCrumb()]);
    setIsRoot(true);
    setIsNextPageLoading(true);
    setIsBreadCrumbsLoading(false);
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

    currentTree?.forEach((folder) => {
      const IconComponent = folder.rootFolderType
        ? catalogIcons[folder.rootFolderType]
        : undefined;
      const avatar = IconComponent ? (
        <IconComponent key={folder.rootFolderType} />
      ) : undefined;

      if (
        (!isUserOnly && folder.rootFolderType === FolderType.VirtualRooms) ||
        folder.rootFolderType === FolderType.USER ||
        (withRecentTreeFolder && folder.rootFolderType === FolderType.Recent) ||
        (withFavoritesTreeFolder &&
          folder.rootFolderType === FolderType.Favorites) ||
        (withAIAgentsTreeFolder &&
          folder.rootFolderType === FolderType.AiAgents)
      ) {
        let title = "";
        switch (folder.rootFolderType) {
          case FolderType.USER:
            title = getCommonTranslation("MyDocuments");
            break;
          case FolderType.VirtualRooms:
            title = getCommonTranslation("Rooms");
            break;
          case FolderType.Favorites:
            title = getCommonTranslation("Favorites");
            break;
          case FolderType.Recent:
            title = getCommonTranslation("Recent");
            break;
          case FolderType.AiAgents:
            title = getCommonTranslation("AIAgents");
            break;
          default:
            break;
        }
        newItems.push({
          label: title,
          id: folder.id!,
          parentId: folder.parentId!,
          rootFolderType: folder.rootFolderType,
          filesCount: folder.filesCount!,
          foldersCount: folder.foldersCount!,
          security: folder.security!,
          isFolder: true,
          avatar,
          disableMultiSelect: true,
        });
      }
    });

    setItems(newItems);
    setTotal(newItems.length);
    setHasNextPage(false);
    setIsNextPageLoading(false);
    setIsInit(false);
    setIsFirstLoad(false);
    requestRunning.current = false;
  }, [
    foldersApi,
    isUserOnly,
    setIsFirstLoad,
    setBreadCrumbs,
    setHasNextPage,
    setIsBreadCrumbsLoading,
    setIsInit,
    setIsNextPageLoading,
    setItems,
    setTotal,
    treeFolders,
    withRecentTreeFolder,
    withFavoritesTreeFolder,
    withAIAgentsTreeFolder,
  ]);

  return { isRoot, setIsRoot, getRootData };
};

export default useRootHelper;
