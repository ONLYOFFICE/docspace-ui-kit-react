import type {
  FolderType,
  RoomType,
  FolderDto,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";
import type { TFileEntrySecurity } from "../../../types";

import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";

export type TUseInputItemHelper = {
  withCreate?: boolean;
  selectedItemId?: string | number | undefined;
  setItems?: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
};

export type TGetIcon = (
  size: number,
  fileExst: string,
) => React.FC<React.SVGProps<SVGSVGElement>> | string | null;

export type UseRoomsHelperProps = TUseInputItemHelper & {
  isAgent?: boolean;
  searchValue?: string;
  searchArea?: SearchArea | string;
  disableThirdParty?: boolean;
  isRoomsOnly: boolean;
  roomType?: RoomType | RoomType[];
  formsSection?: boolean;
  excludeItems?: (number | string | undefined)[];
  isInit: boolean;
  createDefineRoomLabel?: string;
  createDefineRoomType?: RoomType;
  /** Disables the Public room type in the create-room dropdown */
  disabledCreatePublicRoom?: boolean;
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
    React.SetStateAction<TFileEntrySecurity | undefined>
  >;
  setSelectedTreeNode?: React.Dispatch<React.SetStateAction<FolderDto>>;
  isRoomDisabled?: (room: FolderDto) => boolean;
  recentFolder?: FolderDto | null;
  favoritesFolder?: FolderDto | null;
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
};

export type UseAgentsHelperProps = TUseInputItemHelper & {
  searchValue?: string;
  // isRoomsOnly: boolean;
  excludeItems?: (number | string | undefined)[];
  isInit: boolean;
  createDefineLabel?: string;
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
    React.SetStateAction<TFileEntrySecurity | undefined>
  >;
  setSelectedTreeNode?: React.Dispatch<React.SetStateAction<FolderDto>>;
  disableBySecurity?: string;
  recentFolder?: FolderDto | null;
  favoritesFolder?: FolderDto | null;
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
};

export type UseSocketHelperProps = {
  setItems: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  disabledItems: (string | number)[];
  disabledFolderType?: FolderType;
  filterParam?: string | number;
  withCreate?: boolean;
  disableBySecurity?: string;
  isRoomDisabled?: (room: FolderDto) => boolean;
};
