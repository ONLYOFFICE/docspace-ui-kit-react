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

import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { ContentType } from "../../../../../../../enums";

import { Text } from "../../../../../../../components/text";

import type { MessageFilesProps } from "../../../../../Chat.types";

import { openFileInEditor } from "../../../../../utils";
import { useApi } from "../../../../../../../providers/api";

import styles from "../../../ChatMessageBody.module.scss";

const Files = ({
  files,
  getIcon,
  reverse,
  openFile,
}: MessageFilesProps) => {
  const { baseUrl } = useApi();

  const handleFileClick = (fileId: string) => {
    if (openFile) {
      openFile(fileId);
    } else {
      openFileInEditor(fileId, baseUrl);
    }
  };

  if (!files.length) return null;

  return (
    <div
      className={classNames(styles.filesListWrapper, {
        [styles.reverse]: reverse,
      })}
    >
      {files.map((file) => {
        if (file.type !== ContentType.Files) return null;

        return (
          <div
            className={classNames(styles.filesListItem)}
            key={file.id}
            onClick={() => handleFileClick(file.id.toString())}
            data-testid="file-item"
          >
            {(() => {
              const icon = getIcon(24, file.extension!);
              if (typeof icon === "string")
                return (
                  <ReactSVG src={icon} className={styles.filesListItemIcon} />
                );
              if (icon) {
                const Icon = icon;
                return (
                  <div className={styles.filesListItemIcon}>
                    <Icon />
                  </div>
                );
              }
              return null;
            })()}

            <div className={styles.filesListItemInfo}>
              <div className={styles.filesListItemInfoText}>
                <Text
                  fontSize="12px"
                  lineHeight="16px"
                  fontWeight={600}
                  truncate
                >
                  {file.title.replace(file.extension, "")}
                </Text>
                <Text
                  fontSize="12px"
                  lineHeight="16px"
                  fontWeight={600}
                  as="span"
                >
                  {file.extension}
                </Text>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Files;
