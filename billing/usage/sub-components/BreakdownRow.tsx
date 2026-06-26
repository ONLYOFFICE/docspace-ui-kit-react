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

import { Text } from "../../../components/text";
import { IconButton } from "../../../components/icon-button";
import { Loader } from "../../../components/loader";
import { LoaderTypes } from "../../../components/loader/Loader.enums";

import ChevronIcon from "../../../assets/icons/12/right-arrow.react.svg";
import DownloadIcon from "../../../assets/icons/16/download.react.svg";

import styles from "../styles/Usage.module.scss";

type BreakdownRowProps = {
  title: string;
  subLabel?: string;
  amount: string;
  percent?: number;
  onExpand?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
};

const BreakdownRow = ({
  title,
  subLabel,
  amount,
  percent,
  onExpand,
  onDownload,
  isDownloading = false,
}: BreakdownRowProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.serviceInfo}>
        {onExpand ? (
          <Text
            as="span"
            className={styles.titleRow}
            onClick={onExpand}
            dataTestId="usage_row_expand"
          >
            <Text
              as="span"
              fontSize="14px"
              fontWeight={600}
              truncate
              className={styles.title}
            >
              {title}
            </Text>
            <ChevronIcon className={styles.chevron} />
          </Text>
        ) : (
          <Text
            as="span"
            fontSize="14px"
            fontWeight={600}
            truncate
            className={styles.title}
          >
            {title}
          </Text>
        )}
        {subLabel ? (
          <Text
            fontSize="12px"
            fontWeight={600}
            truncate
            className={styles.subLabel}
          >
            {subLabel}
          </Text>
        ) : null}
      </div>

      <div className={styles.progress}>
        {percent !== undefined ? (
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      <Text fontSize="14px" fontWeight={700} className={styles.amount}>
        {amount}
      </Text>

      {isDownloading ? (
        <div className={styles.download}>
          <Loader type={LoaderTypes.track} size="16px" />
        </div>
      ) : onDownload ? (
        <IconButton
          className={styles.download}
          size={16}
          iconNode={<DownloadIcon />}
          onClick={onDownload}
          isClickable
          dataTestId="usage_row_download"
        />
      ) : (
        <div className={styles.download} />
      )}
    </div>
  );
};

export default BreakdownRow;

