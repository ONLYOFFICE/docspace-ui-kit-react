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

import type {
  FileDtoInteger,
  FolderDtoInteger,
  FolderType,
  RoomType,
  FileType,
  FilesSettingsDto,
  FileEntryDtoIntegerAllOfSecurity,
} from "@onlyoffice/docspace-api-sdk";
export type {
  FilesSettingsDto,
  FolderDtoInteger,
  FolderType as SdkFolderType,
  FileEntryDtoIntegerAllOfSecurity,
};

import type {
  TSelectorItem,
  TBreadCrumb,
  TInfoBar,
  TSelectorHeader,
} from "../../components/selector";
import type { WithFlag, Nullable } from "../../types";
import type { ApplyFilterOption, SearchArea } from "@onlyoffice/docspace-api-sdk";
import type { DeviceType } from "../../enums";
import type { TGetIcon } from "../utils/types";

export type TCreateDefineRoom = {
  label: string;
  type: RoomType;
};

export type FormPropsType = {
  message: string;
  isRoomFormAccessible: boolean;
};

export interface UseRootHelperProps {
  setBreadCrumbs: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setItems: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;

  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>;

  setIsInit: (value: boolean) => void;
  treeFolders?: FolderDtoInteger[];
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
  withAIAgentsTreeFolder?: boolean;
  isUserOnly?: boolean;
}

export type UseSocketHelperProps = {
  setItems: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  disabledItems: (string | number)[];
  disabledFolderType?: FolderType;
  filterParam?: string;
  withCreate?: boolean;
  disableBySecurity?: string;
};

export type UseRoomsHelperProps = TUseInputItemHelper & {
  searchValue?: string;
  disableThirdParty?: boolean;
  isRoomsOnly: boolean;
  roomType?: RoomType | RoomType[];
  excludeItems?: (number | string | undefined)[];
  isInit: boolean;
  createDefineRoomLabel?: string;
  createDefineRoomType?: RoomType;
  onSetBaseFolderPath?: (
    value: number | string | undefined | TBreadCrumb[],
  ) => void;
  getRootData?: () => Promise<void>;
  subscribe: (id: number) => void;
  withInit?: boolean;
  setIsInit: (value: boolean) => void;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setHasNextPage: (value: boolean) => void;
  setTotal: (value: number) => void;
  setIsRoot?: (value: boolean) => void;
  setSelectedItemType?: React.Dispatch<
    React.SetStateAction<"rooms" | "files" | "agents" | undefined>
  >;
  setSelectedItemSecurity?: React.Dispatch<
    React.SetStateAction<
      FileEntryDtoIntegerAllOfSecurity | FileEntryDtoIntegerAllOfSecurity | FileEntryDtoIntegerAllOfSecurity | undefined
    >
  >;
  searchArea?: SearchArea;
};

export type UseFilesHelpersProps = {
  roomsFolderId?: number;
  setBreadCrumbs: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setIsSelectedParentFolder: (value: boolean) => void;
  setHasNextPage: (value: boolean) => void;
  setTotal: (value: number) => void;
  setItems: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
  selectedItemId: string | number | undefined;
  setIsRoot: (value: boolean) => void;
  setIsInit: (value: boolean) => void;
  searchValue?: string;
  disabledItems: (string | number)[];
  disabledFolderType?: FolderType;
  includedItems?: (string | number)[];
  setSelectedItemSecurity: (value: FileEntryDtoIntegerAllOfSecurity | FileEntryDtoIntegerAllOfSecurity) => void;
  isThirdParty: boolean;
  setSelectedTreeNode: (treeNode: FolderDtoInteger) => void;
  filterParam?: string | number;
  getRootData?: () => Promise<void>;
  onSetBaseFolderPath?: (
    value: number | string | undefined | TBreadCrumb[],
  ) => void;
  isRoomsOnly: boolean;
  isUserOnly?: boolean;
  rootThirdPartyId?: string;
  getRoomList?: (
    startIndex: number,
    search?: string | null,
    isInit?: boolean,
    isErrorPath?: boolean,
  ) => Promise<void>;

  getFilesArchiveError: (name: string) => string;
  isInit: boolean;
  withCreate: boolean;
  shareKey?: string;
  setSelectedItemId: (value: number | string) => void;
  setSelectedItemType: (value?: "rooms" | "files" | "agents") => void;

  withInit?: boolean;

  setIsInsideKnowledge: (value: boolean) => void;
  setIsInsideResultStorage: (value: boolean) => void;

  applyFilterOption?: ApplyFilterOption;

  disableBySecurity?: string;
};

export type TUseInputItemHelper = {
  withCreate?: boolean;
  selectedItemId?: string | number | undefined;
  setItems?: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
};

export type TSelectedFileInfo = {
  id: number | string;
  title: string;
  path?: string[] | undefined;
  fileExst?: string | undefined;
  fileType?: FileType | undefined;
  inPublic?: boolean | undefined;
} | null;

export type TFilesSelectorInit = WithFlag<
  "withInit",
  {
    withInit: true;
    initTotal: number;
    initHasNextPage: boolean;
    initItems: FolderDtoInteger[] | (FolderDtoInteger | FileDtoInteger)[];
    initBreadCrumbs: TBreadCrumb[];
    initSelectedItemType: "rooms" | "files" | "agents";
    initSelectedItemId: string | number;
    initSearchValue?: Nullable<string>;
  }
>;

export type FilesSelectorProps = TInfoBar &
  TSelectorHeader &
  TFilesSelectorInit &
  (
    | {
        getIcon: TGetIcon;
        filesSettings?: FilesSettingsDto;
      }
    | { getIcon?: never; filesSettings: FilesSettingsDto }
  ) & {
    disabledItems: (string | number)[];
    disabledFolderType?: FolderType;
    includedItems?: (string | number)[];
    filterParam?: string | number;
    withoutBackButton: boolean;
    withBreadCrumbs: boolean;
    withSearch: boolean;
    cancelButtonLabel: string;
    shareKey?: string;

    treeFolders?: FolderDtoInteger[];
    withRecentTreeFolder?: boolean;
    withFavoritesTreeFolder?: boolean;
    withAIAgentsTreeFolder?: boolean;

    onSetBaseFolderPath?: (
      value: number | string | undefined | TBreadCrumb[],
    ) => void;
    isUserOnly?: boolean;
    openRoot?: boolean;
    roomType?: RoomType | RoomType[];
    isRoomsOnly: boolean;
    isThirdParty: boolean;
    rootThirdPartyId?: string;
    roomsFolderId?: number;
    currentFolderId: number | string;
    parentId?: number | string;
    rootFolderType: FolderType;
    folderIsShared?: boolean;
    onCancel: () => void;
    onSubmit: (
      selectedItemId: string | number | undefined,
      folderTitle: string,
      isPublic: boolean,
      breadCrumbs: TBreadCrumb[],
      fileName: string,
      isChecked: boolean,
      selectedTreeNode: FolderDtoInteger,
      selectedFileInfo: TSelectedFileInfo,
      isInsideKnowledge?: boolean,
      isInsideResultStorage?: boolean,
    ) => void | Promise<void>;
    getIsDisabled: (
      isFirstLoad: boolean,
      isSelectedParentFolder: boolean,
      selectedItemId: string | number | undefined,
      selectedItemType: "rooms" | "files" | "agents" | undefined,
      isRoot: boolean,
      selectedItemSecurity:
        | FileEntryDtoIntegerAllOfSecurity
        | FileEntryDtoIntegerAllOfSecurity
        | FileEntryDtoIntegerAllOfSecurity
        | undefined,
      selectedFileInfo: TSelectedFileInfo,
      isDisabledFolder?: boolean,
      isInsideKnowledge?: boolean,
      isInsideResultStorage?: boolean,
    ) => boolean;
    setIsDataReady?: (value: boolean) => void;
    submitButtonLabel: string;
    withCancelButton: boolean;
    withFooterInput: boolean;
    withFooterCheckbox: boolean;
    footerInputHeader: string;
    currentFooterInputValue: string;
    footerCheckboxLabel: string;
    descriptionText: string;
    submitButtonId?: string;
    cancelButtonId?: string;
    embedded?: boolean;
    isPanelVisible: boolean;
    currentDeviceType: DeviceType;
    getFilesArchiveError: (name: string) => string;

    withCreate: boolean;
    createDefineRoomLabel?: string;
    createDefineRoomType?: RoomType;
    formProps?: FormPropsType;
    withPadding?: boolean;
    checkCreating?: boolean;

    applyFilterOption?: ApplyFilterOption;

    isMultiSelect?: boolean;
    onSelectItem?: (item: TSelectorItem) => void;
    isPortalView?: boolean;
    maxSelectedItems?: number;
    renderInPortal?: boolean;
    disableBySecurity?: string;
    folderFormValidation?: RegExp;
  };
