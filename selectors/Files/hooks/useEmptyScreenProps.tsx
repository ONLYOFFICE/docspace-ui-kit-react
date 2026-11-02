import { useMemo } from "react";
import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import EmptyScreenFilterFilesLight from "../../../assets/emptyFilter/empty.filter.files.light.svg";
import EmptyScreenFilterFilesDark from "../../../assets/emptyFilter/empty.filter.files.dark.svg";
import EmptyScreenRoomsLight from "../../../assets/emptyview/empty.rooms.root.user.light.svg";
import EmptyScreenRoomsDark from "../../../assets/emptyview/empty.rooms.root.user.dark.svg";

import { useCommonTranslation } from "../../../utils/i18n";
import { useTheme } from "../../../context/ThemeContext";

type UseEmptyScreenPropsArgs = {
  selectedItemType?: string;
  selectedTreeNode?: FolderDtoInteger;
};

// What the Files selector shows on an empty list and on an empty search, by
// the section the user is in.
const useEmptyScreenProps = ({
  selectedItemType,
  selectedTreeNode,
}: UseEmptyScreenPropsArgs) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const isKnowledgeFolder = selectedTreeNode?.type === FolderType.Knowledge;
  const isEmptyFilesRootScreen = selectedItemType === "files";

  const emptyScreenHeader = useMemo(() => {
    if (isKnowledgeFolder) {
      return t("SelectorEmptyScreenHeaderKnowledge");
    }

    if (isEmptyFilesRootScreen) return t("SelectorEmptyScreenHeader");

    return t("EmptyRoomsHeader");
  }, [isKnowledgeFolder, isEmptyFilesRootScreen, t]);

  const emptyScreenImage = useMemo(
    () => (isBase ? <EmptyScreenRoomsLight /> : <EmptyScreenRoomsDark />),
    [isBase],
  );

  const searchEmptyScreenImage = useMemo(
    () =>
      isBase ? <EmptyScreenFilterFilesLight /> : <EmptyScreenFilterFilesDark />,
    [isBase],
  );

  const searchEmptyScreenHeader = t("NotFoundTitle");
  const searchEmptyScreenDescription = t("EmptyFilterDescriptionText");

  const emptyScreenDescription = useMemo(() => {
    if (isEmptyFilesRootScreen) return "";

    return t("EmptyRoomsDescriptionText", {
      sectionName: t("Rooms"),
    });
  }, [isEmptyFilesRootScreen, t]);

  return {
    emptyScreenImage,
    emptyScreenHeader,
    emptyScreenDescription,
    searchEmptyScreenImage,
    searchEmptyScreenHeader,
    searchEmptyScreenDescription,
  };
};

export default useEmptyScreenProps;
