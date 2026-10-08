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
  SpecialFolderScope,
} from "../../components/selector";
import type { WithFlag, Nullable } from "../../types";
import type {
  ApplyFilterOption,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";
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
  withFormsTreeFolder?: boolean;
  isUserOnly?: boolean;
  setRecentFolder?: (folder?: FolderDtoInteger) => void;
  setFavoritesFolder?: (folder?: FolderDtoInteger) => void;
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
      | FileEntryDtoIntegerAllOfSecurity
      | FileEntryDtoIntegerAllOfSecurity
      | FileEntryDtoIntegerAllOfSecurity
      | undefined
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
  pinnedRootId?: number | string;
  includedItems?: (string | number)[];
  setSelectedItemSecurity: (
    value: FileEntryDtoIntegerAllOfSecurity | FileEntryDtoIntegerAllOfSecurity,
  ) => void;
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
  setIsInsidePrivateRoom: (value: boolean) => void;

  applyFilterOption?: ApplyFilterOption;

  disableBySecurity?: string;
  withSubFolders?: boolean;

  recentFolder?: FolderDtoInteger | null;
  favoritesFolder?: FolderDtoInteger | null;
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
  activeSpecialScope?: SpecialFolderScope | null;
  formsSection?: boolean;
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
    isRoomDisabled?: (room: FolderDtoInteger) => boolean;
    pinnedRootId?: number | string;
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
    withFormsTreeFolder?: boolean;

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
      isInsidePrivateRoom?: boolean,
    ) => void | Promise<void>;
    getIsDisabled: (
      isLoading: boolean,
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
      isInsidePrivateRoom?: boolean,
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
    /** Disables the Public room type in the create-room dropdown */
    disabledCreatePublicRoom?: boolean;
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
    withSubFolders?: boolean;
  };
