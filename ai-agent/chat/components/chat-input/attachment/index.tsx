/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";

import AttachmentReactSvg from "../../../../../assets/attachment.react.svg";

import { DeviceType, FolderType } from "../../../../../enums";
import { isDesktop, isTablet } from "../../../../../utils";
import { useCommonTranslation } from "../../../../../utils/i18n";

import type { TFile } from "../../../../../types";

import { FilesSelector } from "../../../../chat/../../selectors/Files";

import type { TSelectorItem } from "../../../../../components/selector";

import type { AttachmentProps } from "../../../Chat.types";
import {
  CHAT_SUPPORTED_FORMATS,
  CHAT_MAX_FILE_COUNT,
} from "../../../Chat.constants";

const Attachment = ({
  isVisible,
  multimodal,
  toggleAttachment,
  getIcon,
  setSelectedFiles,
}: AttachmentProps) => {
  const t = useCommonTranslation();
  const [tempSelectedFiles, setTempSelectedFiles] = React.useState<
    Partial<TFile>[]
  >([]);

  const [withInfo, setWithInfo] = React.useState(true);

  const onSelectItem = (item: TSelectorItem) => {
    if (!item.id || !item.fileExst) return;

    if (tempSelectedFiles.some((file) => file.id === item.id)) {
      setTempSelectedFiles((prev) =>
        prev.filter((file) => file.id !== item.id),
      );
      return;
    }

    setTempSelectedFiles((prev) => {
      if (prev.length >= CHAT_MAX_FILE_COUNT) {
        return prev;
      }

      return [
        ...prev,
        {
          id: Number(item.id),
          title: item.label,
          fileExst: item.fileExst,
          viewUrl: item.viewUrl,
        },
      ];
    });
  };

  if (!isVisible) return null;

  const supportedFormats = multimodal
    ? `${CHAT_SUPPORTED_FORMATS},${multimodal.image.formats.join(",")}`
    : CHAT_SUPPORTED_FORMATS;

  return (
    <FilesSelector
      isPanelVisible={isVisible}
      onCancel={toggleAttachment}
      openRoot
      getIcon={getIcon}
      getIsDisabled={(
        isFirstLoad,
        isSelectedParentFolder,
        selectedItemId,
        selectedItemType,
        isRoot,
        selectedItemSecurity,
        selectedFileInfo,
      ) => {
        if (!selectedItemSecurity?.Read) return true;

        if (!selectedFileInfo) return true;

        return false;
      }}
      onSubmit={() => {
        setSelectedFiles(tempSelectedFiles);
        setTempSelectedFiles([]);
        toggleAttachment();
      }}
      onSelectItem={onSelectItem}
      withHeader
      headerProps={{
        headerLabel: t("SelectFile"),
        isCloseable: true,
        onCloseClick: toggleAttachment,
      }}
      withSearch
      withBreadCrumbs
      withoutBackButton
      withCancelButton
      withCreate={false}
      withSubFolders={false}
      withFooterCheckbox={false}
      withFooterInput={false}
      cancelButtonLabel={t("CancelButton")}
      submitButtonLabel={t("AddButton")}
      disabledItems={[]}
      isRoomsOnly={false}
      isThirdParty={false}
      currentFolderId=""
      rootFolderType={FolderType.Rooms}
      footerCheckboxLabel=""
      footerInputHeader=""
      currentFooterInputValue=""
      descriptionText=""
      getFilesArchiveError={() => ""}
      filterParam={supportedFormats}
      isMultiSelect
      withRecentTreeFolder
      withFavoritesTreeFolder
      withAIAgentsTreeFolder
      disableBySecurity="AskAi"
      currentDeviceType={
        isDesktop()
          ? DeviceType.desktop
          : isTablet()
            ? DeviceType.tablet
            : DeviceType.mobile
      }
      withInfoBar={withInfo}
      maxSelectedItems={CHAT_MAX_FILE_COUNT}
      infoBarData={{
        title: t("SelectorFilesLimit", {
          count: CHAT_MAX_FILE_COUNT,
        }),
        icon: <AttachmentReactSvg />,
        onClose: () => setWithInfo(!withInfo),
        description: t("SelectorFilesLimitDescription"),
      }}
      renderInPortal
    />
  );
};

export default Attachment;
