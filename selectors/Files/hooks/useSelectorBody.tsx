import { use, useMemo } from "react";

import EmptyScreenFilterFilesLight from "../../../assets/emptyFilter/empty.filter.files.light.svg";
import EmptyScreenFilterFilesDark from "../../../assets/emptyFilter/empty.filter.files.dark.svg";
import EmptyScreenRoomsLight from "../../../assets/emptyview/empty.rooms.root.user.light.svg";
import EmptyScreenRoomsDark from "../../../assets/emptyview/empty.rooms.root.user.dark.svg";
import EmptyScreenRoomsAgentLight from "../../../assets/emptyview/empty.agents.info.light.svg";
import EmptyScreenRoomsAgentDark from "../../../assets/emptyview/empty.agents.info.dark.svg";

import { useCommonTranslation } from "../../../utils/i18n";
import {
  Selector,
  BreadCrumbsLoader,
  RowLoader,
  SearchLoader,
  type SelectorProps,
  type TSelectorBreadCrumbs,
  type TSelectorCancelButton,
  type TSelectorCheckbox,
  type TSelectorHeader,
  type TSelectorInput,
  type TSelectorSearch,
  type TSelectorSubmitButton,
} from "../../../components/selector";
import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";
import { useTheme } from "../../../context/ThemeContext";

import type { FilesSelectorProps } from "../FilesSelector.types";
import { LoadersContext } from "../../utils/contexts/Loaders";
import { SettingsContext } from "../../utils/contexts/Settings";

type PickedSearchProps = Pick<
  TSelectorSearch,
  "searchValue" | "onSearch" | "onClearSearch"
> & { withSearch: boolean };

type PickedSubmitButtonProps = Pick<
  TSelectorSubmitButton,
  "onSubmit" | "disableSubmitButton"
>;

type PickedBreadCrumbsProps = Pick<
  TSelectorBreadCrumbs,
  "onSelectBreadCrumb" | "breadCrumbs"
> & { withBreadCrumbs: boolean };

type PickedSelectorBodyProps = Pick<
  SelectorProps,
  "items" | "onSelect" | "hasNextPage" | "totalItems" | "loadNextPage"
> & { isRoot: boolean; selectedItemType?: string };

type SelectedTreeNodeProps = {
  selectedTreeNode: FolderDtoInteger;
};

const useSelectorBody = ({
  // header props
  withHeader,
  headerProps,

  // search input
  withSearch,
  searchValue,
  onSearch,
  onClearSearch,

  // submit button
  submitButtonLabel,
  submitButtonId,
  onSubmit,
  disableSubmitButton,

  // cancel button
  withCancelButton,
  cancelButtonLabel,
  cancelButtonId,
  onCancel,

  // footer input
  withFooterInput,
  footerInputHeader,
  currentFooterInputValue,
  folderFormValidation,

  // footer checkbox
  withFooterCheckbox,
  footerCheckboxLabel,

  // with bread crumbs
  withBreadCrumbs,
  breadCrumbs,
  onSelectBreadCrumb,

  // files selector props
  descriptionText,
  withInfoBar,
  infoBarData,
  withPadding,
  isRoot,

  // selector props
  items,
  onSelect,
  hasNextPage,
  totalItems,
  loadNextPage,
  withInit,

  isMultiSelect,
  maxSelectedItems,

  selectedItemType,
  selectedTreeNode,
}: Omit<FilesSelectorProps, "withSearch" | "onSubmit"> &
  PickedSearchProps &
  PickedSubmitButtonProps &
  PickedBreadCrumbsProps &
  PickedSelectorBodyProps &
  SelectedTreeNodeProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const {
    showBreadCrumbsLoader,
    showSearchLoader,
    isNextPageLoading,
    showBodyLoader,
    isContentLoading,
  } = use(LoadersContext);
  const { displayFileExtension } = use(SettingsContext);

  const headerSelectorProps: TSelectorHeader = withHeader
    ? {
        withHeader,
        headerProps: {
          ...headerProps,
          headerLabel: headerProps?.headerLabel || t("SelectAction"),
          onCloseClick: onCancel,
        },
      }
    : {};

  const searchProps: TSelectorSearch = withSearch
    ? {
        withSearch,
        searchLoader: <SearchLoader />,
        searchPlaceholder: t("Search"),
        searchValue,
        isSearchLoading: showSearchLoader,
        onSearch: onSearch!,
        onClearSearch: onClearSearch!,
      }
    : {};

  const submitButtonProps: TSelectorSubmitButton = {
    onSubmit,
    submitButtonLabel,
    submitButtonId,
    disableSubmitButton,
  };

  const cancelButtonProps: TSelectorCancelButton = withCancelButton
    ? {
        withCancelButton,
        cancelButtonLabel: cancelButtonLabel || t("CancelButton"),
        cancelButtonId,
        onCancel,
      }
    : {};

  const footerInputProps: TSelectorInput = withFooterInput
    ? {
        withFooterInput,
        footerInputHeader,
        currentFooterInputValue,
      }
    : {};

  const footerCheckboxProps: TSelectorCheckbox = withFooterCheckbox
    ? {
        withFooterCheckbox,
        footerCheckboxLabel,
        isChecked: false,
      }
    : {};

  const breadCrumbsProps: TSelectorBreadCrumbs = withBreadCrumbs
    ? {
        breadCrumbs: breadCrumbs!,
        breadCrumbsLoader: <BreadCrumbsLoader />,
        isBreadCrumbsLoading: showBreadCrumbsLoader,
        withBreadCrumbs: true,
        onSelectBreadCrumb: onSelectBreadCrumb!,
        bodyIsLoading: showBodyLoader,
      }
    : {};

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
    if (isEmptyAgentsRootScreen)
      return isBase ? (
        <EmptyScreenRoomsAgentLight />
      ) : (
        <EmptyScreenRoomsAgentDark />
      );

    return isBase ? (
      <EmptyScreenFilterFilesLight />
    ) : (
      <EmptyScreenFilterFilesDark />
    );
  }, [isBase, isEmptyAgentsRootScreen]);

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

    if (isEmptyAgentsRootScreen) return t("NoAIAgentsDescription");

    return t("EmptyRoomsDescriptionText", {
      sectionName: t("Rooms"),
    });
  }, [isEmptyFilesRootScreen, isEmptyAgentsRootScreen, t]);

  const SelectorBody = (
    <Selector
      {...headerSelectorProps}
      {...searchProps}
      {...submitButtonProps}
      {...cancelButtonProps}
      {...footerInputProps}
      {...footerCheckboxProps}
      {...breadCrumbsProps}
      isMultiSelect={isMultiSelect ?? false}
      maxSelectedItems={maxSelectedItems}
      items={items}
      onSelect={onSelect}
      emptyScreenImage={emptyScreenImage}
      emptyScreenHeader={emptyScreenHeader}
      emptyScreenDescription={emptyScreenDescription}
      searchEmptyScreenImage={searchEmptyScreenImage}
      searchEmptyScreenHeader={searchEmptyScreenHeader}
      searchEmptyScreenDescription={searchEmptyScreenDescription}
      isLoading={showBodyLoader}
      isContentLoading={isContentLoading}
      rowLoader={
        <RowLoader
          isMultiSelect={false}
          isUser={isRoot}
          isContainer={showBodyLoader}
        />
      }
      alwaysShowFooter
      isNextPageLoading={isNextPageLoading}
      hasNextPage={hasNextPage}
      totalItems={totalItems}
      loadNextPage={loadNextPage}
      descriptionText={descriptionText}
      disableFirstFetch
      withInfoBar={withInfoBar}
      infoBarData={infoBarData}
      withPadding={withPadding}
      isSSR={withInit}
      folderFormValidation={folderFormValidation}
      displayFileExtension={displayFileExtension}
    />
  );

  return SelectorBody;
};

export default useSelectorBody;
