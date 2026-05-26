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
 * This license applies only to their non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import { RectangleSkeleton } from "../../../../components/rectangle";
import classNames from "classnames";

import styles from "../styles/TransactionHistory.module.scss";

type TableLoaderProps = {
  isMobile?: boolean;
  isTablet?: boolean;
};

const TableLoader = ({ isMobile, isTablet }: TableLoaderProps) => {
  return !isMobile && !isTablet ? (
    <div className={classNames(styles.loaderRow, styles.bodyRow)}>
      <RectangleSkeleton uniqueKey="table-body-1" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-2" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-3" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-4" height="20px" borderRadius="3px" width="100%" />
    </div>
  ) : (
    <>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-1-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-1-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-1-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-2-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-2-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-2-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-3-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-3-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-3-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
    </>
  );
};

export default TableLoader;
