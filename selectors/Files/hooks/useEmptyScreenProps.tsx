import { useMemo } from "react";
import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import EmptyScreenFilterFilesLight from "../../../assets/emptyFilter/empty.filter.files.light.svg";
import EmptyScreenFilterFilesDark from "../../../assets/emptyFilter/empty.filter.files.dark.svg";
import EmptyScreenRoomsLight from "../../../assets/emptyview/empty.rooms.root.user.light.svg";
import EmptyScreenRoomsDark from "../../../assets/emptyview/empty.rooms.root.user.dark.svg";
import EmptyScreenRoomsAgentLight from "../../../assets/emptyview/empty.agents.info.light.svg";
import EmptyScreenRoomsAgentDark from "../../../assets/emptyview/empty.agents.info.dark.svg";

import { useCommonTranslation } from "../../../utils/i18n";
import { useTheme } from "../../../context/ThemeContext";

type UseEmptyScreenPropsArgs = {
  selectedItemType?: string;
  selectedTreeNode?: FolderDtoInteger;
  /** The list offers "New agent": the host can create one and the user may. */
  canCreateAgent?: boolean;
};

// What the Files selector shows on an empty list and on an empty search, by
// the section the user is in.
const useEmptyScreenProps = ({
  selectedItemType,
  selectedTreeNode,
  canCreateAgent,
}: UseEmptyScreenPropsArgs) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const isKnowledgeFolder = selectedTreeNode?.type === FolderType.Knowledge;
  const isEmptyFilesRootScreen = selectedItemType === "files";
  const isEmptyAgentsRootScreen = selectedItemType === "agents";

  const emptyScreenHeader = useMemo(() => {
    if (isKnowledgeFolder) {
      return t("SelectorEmptyScreenHeaderKnowledge");
    }

    if (isEmptyFilesRootScreen) return t("SelectorEmptyScreenHeader");

    if (isEmptyAgentsRootScreen)
      return t("NoAIAgents", { aiAgents: t("AIAgents") });

    return t("EmptyRoomsHeader");
  }, [isKnowledgeFolder, isEmptyFilesRootScreen, isEmptyAgentsRootScreen, t]);

  const emptyScreenImage = useMemo(() => {
    if (isEmptyAgentsRootScreen)
      return isBase ? (
        <EmptyScreenRoomsAgentLight />
      ) : (
        <EmptyScreenRoomsAgentDark />
      );

    return isBase ? <EmptyScreenRoomsLight /> : <EmptyScreenRoomsDark />;
  }, [isBase, isEmptyAgentsRootScreen]);

  const searchEmptyScreenImage = useMemo(() => {
    if (isEmptyAgentsRootScreen) return emptyScreenImage;

    return isBase ? (
      <EmptyScreenFilterFilesLight />
    ) : (
      <EmptyScreenFilterFilesDark />
    );
  }, [isBase, isEmptyAgentsRootScreen, emptyScreenImage]);

  const searchEmptyScreenHeader = useMemo(() => {
    if (isEmptyAgentsRootScreen)
      return t("NoAIAgentsSearch", { aiAgents: t("AIAgents") });

    return t("NotFoundTitle");
  }, [isEmptyAgentsRootScreen, t]);

  const searchEmptyScreenDescription = useMemo(() => {
    if (isEmptyAgentsRootScreen) return t("NoAIAgentsSearchDescription");

    return t("EmptyFilterDescriptionText");
  }, [isEmptyAgentsRootScreen, t]);

  const emptyScreenDescription = useMemo(() => {
    if (isEmptyFilesRootScreen) return "";

    // The description asks the user to create an agent, so it goes with the
    // "New agent" link and not without it.
    if (isEmptyAgentsRootScreen)
      return canCreateAgent ? t("EmptyAIAgentsSelectorDescription") : "";

    return t("EmptyRoomsDescriptionText", {
      sectionName: t("Rooms"),
    });
  }, [isEmptyFilesRootScreen, isEmptyAgentsRootScreen, canCreateAgent, t]);

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
