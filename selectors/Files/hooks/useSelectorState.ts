import React, { use } from "react";

import type { TBreadCrumb, TSelectorItem } from "../../../components/selector";
import {
  FolderType,
  type FolderDtoInteger,
  type FileDtoInteger,
  type FileEntryDtoIntegerAllOfSecurity,
  type FileType,
} from "@onlyoffice/docspace-api-sdk";
import { useCommonTranslation } from "../../../utils/i18n";

import type {
  FilesSelectorProps,
  TFilesSelectorInit,
} from "../FilesSelector.types";
import {
  convertFoldersToItems,
  convertRoomsToItems,
  convertFilesToItems,
} from "../../utils";
import { SettingsContext } from "../../utils/contexts/Settings";

type UseSelectorStateProps = Pick<
  FilesSelectorProps,
  | "checkCreating"
  | "filterParam"
  | "disabledItems"
  | "withCreate"
  | "disableBySecurity"
>;

const transformInitItems = (
  items: (FolderDtoInteger | FileDtoInteger)[],
  disabledItems: (string | number)[],
  withCreate: boolean,
  getIcon: (
    fileExst: string,
    size?: number,
  ) => React.FC<React.SVGProps<SVGSVGElement>> | string | null,
  t: (key: string) => string,
  initSelectedItemType?: string,
  filterParam?: string | number,
  disableBySecurity?: string,
) => {
  const rooms = convertRoomsToItems(
    items.filter(
      (item) => "roomType" in item && item.roomType,
    ) as FolderDtoInteger[],
    t,
  );
  const folders = convertFoldersToItems(
    items.filter(
      (item) => "parentId" in item && item.parentId && !item.roomType,
    ) as FolderDtoInteger[],
    disabledItems,
    filterParam,
  );
  const files = convertFilesToItems(
    items.filter(
      (item) => "folderId" in item && item.folderId,
    ) as FileDtoInteger[],
    getIcon,
    filterParam,
    undefined,
    disableBySecurity,
  );

  return [
    ...((withCreate && [
      {
        isCreateNewItem: true,
        label: initSelectedItemType === "files" ? t("NewFolder") : t("NewRoom"),
        id: "create-folder-item",
        key: "create-folder-item",
        hotkey: "f",
        onBackClick: () => {},
      },
    ]) ||
      []),
    ...rooms,
    ...folders,
    ...files,
  ];
};

const useSelectorState = ({
  checkCreating,
  disabledItems,
  filterParam,
  withCreate,

  withInit,
  initBreadCrumbs,
  initHasNextPage,
  initItems,
  initSearchValue,
  initSelectedItemId,
  initSelectedItemType,
  initTotal,

  disableBySecurity,
}: UseSelectorStateProps & TFilesSelectorInit) => {
  const t = useCommonTranslation();
  const { getIcon } = use(SettingsContext);

  const [breadCrumbs, setBreadCrumbs] = React.useState<TBreadCrumb[]>(
    withInit ? initBreadCrumbs : [],
  );
  const [searchValue, setSearchValue] = React.useState<string>(
    withInit && initSearchValue ? initSearchValue : "",
  );
  const [items, setItems] = React.useState<TSelectorItem[]>(
    withInit
      ? transformInitItems(
          initItems,
          disabledItems,
          withCreate,
          getIcon,
          t,
          initSelectedItemType,
          filterParam,
          disableBySecurity,
        )
      : [],
  );
  const [selectedItemType, setSelectedItemType] = React.useState<
    "rooms" | "files" | "agents" | undefined
  >(withInit ? initSelectedItemType : undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<
    number | string | undefined
  >(withInit ? initSelectedItemId : undefined);
  const [selectedItemSecurity, setSelectedItemSecurity] = React.useState<
    FileEntryDtoIntegerAllOfSecurity | undefined
  >(undefined);
  const [selectedTreeNode, setSelectedTreeNode] = React.useState(
    {} as FolderDtoInteger & { path?: { folderType?: FolderType }[] },
  );
  const [selectedFileInfo, setSelectedFileInfo] = React.useState<{
    id: number | string;
    title: string;
    path?: string[];
    fileExst?: string;
    fileType?: FileType;
    viewUrl?: string;
    inPublic?: boolean;
  } | null>(null);
  const [total, setTotal] = React.useState<number>(withInit ? initTotal : 0);
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(
    withInit ? initHasNextPage : false,
  );
  const [isSelectedParentFolder, setIsSelectedParentFolder] =
    React.useState<boolean>(false);
  const [isDisabledFolder, setIsDisabledFolder] = React.useState<
    boolean | undefined
  >(checkCreating);
  const [isInit, setIsInit] = React.useState<boolean>(!withInit);
  const [isInsideKnowledge, setIsInsideKnowledge] =
    React.useState<boolean>(false);
  const [isInsideResultStorage, setIsInsideResultStorage] =
    React.useState<boolean>(false);
  const [isInsidePrivateRoom, setIsInsidePrivateRoom] =
    React.useState<boolean>(false);

  const [withCreateState, setWithCreateState] =
    React.useState<boolean>(withCreate);

  React.useEffect(() => {
    const isInsideKnowledgeState = !!selectedTreeNode?.path?.find(
      (f) => f.folderType === FolderType.Knowledge,
    );
    const isInsideResultStorageState = !!selectedTreeNode?.path?.find(
      (f) => f.folderType === FolderType.ResultStorage,
    );
    setWithCreateState(
      withCreate && !isInsideKnowledgeState && !isInsideResultStorageState,
    );
    setIsInsideKnowledge(isInsideKnowledgeState);
    setIsInsideResultStorage(isInsideResultStorageState);
  }, [selectedTreeNode, withCreate]);

  return {
    breadCrumbs,
    setBreadCrumbs,
    searchValue,
    setSearchValue,
    items,
    setItems,
    selectedItemType,
    setSelectedItemType,
    selectedItemId,
    setSelectedItemId,
    selectedItemSecurity,
    setSelectedItemSecurity,
    selectedTreeNode,
    setSelectedTreeNode,
    selectedFileInfo,
    setSelectedFileInfo,
    total,
    setTotal,
    hasNextPage,
    setHasNextPage,
    isSelectedParentFolder,
    setIsSelectedParentFolder,
    isDisabledFolder,
    setIsDisabledFolder,
    isInit,
    setIsInit,
    isInsideKnowledge,
    setIsInsideKnowledge,
    isInsideResultStorage,
    setIsInsideResultStorage,
    isInsidePrivateRoom,
    setIsInsidePrivateRoom,
    withCreateState,
  };
};

export default useSelectorState;
