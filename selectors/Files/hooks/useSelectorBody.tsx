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
import { use, useMemo } from "react";

import EmptyScreenFilterFilesLight from "../../../assets/emptyFilter/empty.filter.files.light.svg";
import EmptyScreenFilterFilesDark from "../../../assets/emptyFilter/empty.filter.files.dark.svg";
import EmptyScreenRoomsLight from "../../../assets/emptyview/empty.rooms.root.user.light.svg";
import EmptyScreenRoomsDark from "../../../assets/emptyview/empty.rooms.root.user.dark.svg";

import { getCommonTranslation } from "../../../utils/i18n";
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
  const { isBase } = useTheme();

  const { showBreadCrumbsLoader, isNextPageLoading, showLoader } =
    use(LoadersContext);
  const { displayFileExtension } = use(SettingsContext);

  const headerSelectorProps: TSelectorHeader = withHeader
    ? {
        withHeader,
        headerProps: {
          ...headerProps,
          headerLabel:
            headerProps?.headerLabel || getCommonTranslation("SelectAction"),
          onCloseClick: onCancel,
        },
      }
    : {};

  const searchProps: TSelectorSearch = withSearch
    ? {
        withSearch,
        searchLoader: <SearchLoader />,
        searchPlaceholder: getCommonTranslation("Search"),
        searchValue,
        isSearchLoading: showBreadCrumbsLoader,
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
        cancelButtonLabel:
          cancelButtonLabel || getCommonTranslation("CancelButton"),
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
        bodyIsLoading: showLoader,
      }
    : {};

  const isKnowledgeFolder = selectedTreeNode?.type === FolderType.Knowledge;
  const isEmptyFilesRootScreen = selectedItemType === "files";
  const isEmptyAgentsRootScreen = selectedItemType === "agents";

  const emptyScreenHeader = useMemo(() => {
    if (isKnowledgeFolder) {
      return getCommonTranslation("SelectorEmptyScreenHeaderKnowledge");
    }

    if (isEmptyFilesRootScreen)
      return getCommonTranslation("SelectorEmptyScreenHeader");

    if (isEmptyAgentsRootScreen)
      return getCommonTranslation("EmptyRoomsHeaderAgent");

    return getCommonTranslation("EmptyRoomsHeader");
  }, [isKnowledgeFolder, isEmptyFilesRootScreen, isEmptyAgentsRootScreen]);

  const emptyScreenDescription = isEmptyFilesRootScreen
    ? ""
    : isEmptyAgentsRootScreen
      ? getCommonTranslation("EmptyRoomsDescriptionTextAgent", {
          sectionName: getCommonTranslation("AIAgents"),
        })
      : getCommonTranslation("EmptyRoomsDescriptionText", {
          sectionName: getCommonTranslation("Rooms"),
        });

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
      emptyScreenImage={
        isBase ? <EmptyScreenRoomsLight /> : <EmptyScreenRoomsDark />
      }
      emptyScreenHeader={emptyScreenHeader}
      emptyScreenDescription={emptyScreenDescription}
      searchEmptyScreenImage={
        isBase ? (
          <EmptyScreenFilterFilesLight />
        ) : (
          <EmptyScreenFilterFilesDark />
        )
      }
      searchEmptyScreenHeader={getCommonTranslation("NotFoundTitle")}
      searchEmptyScreenDescription={getCommonTranslation(
        "EmptyFilterDescriptionText",
      )}
      isLoading={showLoader}
      rowLoader={
        <RowLoader
          isMultiSelect={false}
          isUser={isRoot}
          isContainer={showLoader}
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
