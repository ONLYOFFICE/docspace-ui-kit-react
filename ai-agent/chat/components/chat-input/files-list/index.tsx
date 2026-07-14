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
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import CloseCircleReactSvg from "../../../../../assets/remove.session.svg";

import { Text } from "../../../../../components/text";
import { IconButton } from "../../../../../components/icon-button";
import { Scrollbar } from "../../../../../components/scrollbar";
import { Loader, LoaderTypes } from "../../../../../components/loader";

import type { FilesListProps } from "../../../Chat.types";
import { downloadImageAsBase64 } from "../../../utils";

import styles from "../ChatInput.module.scss";

const FilesList = ({
  files,
  isFixed,
  multimodal,
  getIcon,
  onRemove,
}: FilesListProps) => {
  const [imgsBase64, setImgsBase64] = React.useState<Map<string, string>>(
    new Map(),
  );

  React.useEffect(() => {
    if (!files.length) return;

    const imgFiles = files.filter(
      (file) =>
        file.fileExst && multimodal?.image.formats.includes(file.fileExst),
    );

    if (!imgFiles.length) return;

    const downloadImages = async () => {
      const newImg = new Map<string, string>();

      for (const file of imgFiles) {
        if (!file.viewUrl || !file.id) continue;

        const result = await downloadImageAsBase64(file.viewUrl);
        newImg.set(file.id.toString(), result);
      }

      setImgsBase64(newImg);
    };

    downloadImages();
  }, [files, multimodal]);

  if (!files.length) return null;

  return (
    <div
      className={classNames(styles.filesList, {
        [styles.filesListFixed]: isFixed,
      })}
    >
      <Scrollbar noScrollY>
        <div className={styles.filesListWrapper}>
          {files.map((file) => {
            const isImage =
              file.fileExst &&
              multimodal?.image.formats.includes(file.fileExst);

            return (
              <div
                className={styles.filesListItem}
                key={file.id}
                style={{ maxWidth: "300px" }}
                data-testid="files-list-item"
              >
                {(() => {
                  const icon = getIcon(24, file.fileExst ?? "");
                  if (typeof icon === "string")
                    return (
                      <ReactSVG
                        src={icon}
                        className={styles.filesListItemIcon}
                      />
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
                  {isImage ? (
                    imgsBase64.get(file.id?.toString() || "") ? (
                      <img
                        className={styles.filesListItemImage}
                        src={imgsBase64.get(file.id?.toString() || "")}
                        alt={file.title}
                      />
                    ) : (
                      <Loader
                        className={styles.loader}
                        size="20px"
                        type={LoaderTypes.track}
                      />
                    )
                  ) : (
                    <div className={styles.filesListItemInfoText}>
                      <Text
                        fontSize="12px"
                        lineHeight="16px"
                        fontWeight={600}
                        truncate
                      >
                        {file.title?.replaceAll(file?.fileExst || "", "")}
                      </Text>
                      <Text
                        fontSize="12px"
                        lineHeight="16px"
                        fontWeight={600}
                        as="span"
                      >
                        {file.fileExst}
                      </Text>
                    </div>
                  )}

                  {onRemove ? (
                    <IconButton
                      iconNode={<CloseCircleReactSvg />}
                      size={16}
                      isClickable
                      onClick={() => onRemove(file)}
                      dataTestId="remove-file-button"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Scrollbar>
    </div>
  );
};

export default FilesList;
