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

import { RectangleSkeleton } from "../../components/rectangle";

import styles from "./Overview.module.scss";
import loaderStyles from "./OverviewLoader.module.scss";

const R = "3px";

/** Card header: title on the left, a short link/action on the right. */
const HeaderLoader = ({
  uniqueKey,
  titleWidth = "150px",
}: {
  uniqueKey: string;
  titleWidth?: string;
}) => (
  <div className={styles.cardHeader}>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width={titleWidth} height="14px" borderRadius={R} />
    <RectangleSkeleton uniqueKey={`${uniqueKey}-link`} width="60px" height="14px" borderRadius={R} />
  </div>
);

/** Shared loader for the spend / add-ons / upcoming cards: header + value + 3 rows. */
const CardListLoader = ({ uniqueKey }: { uniqueKey: string }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width="146px" height="16px" borderRadius={R} />
      <RectangleSkeleton uniqueKey={`${uniqueKey}-link`} width="57px" height="20px" borderRadius={R} />
    </div>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-value`} width="59px" height="24px" borderRadius={R} />
    <div className={styles.rows}>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r1l`} width="170px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r1r`} width="65px" height="20px" borderRadius={R} />
      </div>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r2l`} width="103px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r2r`} width="78px" height="20px" borderRadius={R} />
      </div>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r3l`} width="139px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r3r`} width="46px" height="20px" borderRadius={R} />
      </div>
    </div>
  </div>
);

/** List row: label on the left (optional leading icon), value on the right. */
const RowLoader = ({
  uniqueKey,
  left = "180px",
  right = "48px",
  icon = false,
}: {
  uniqueKey: string;
  left?: string;
  right?: string;
  icon?: boolean;
}) => (
  <div className={styles.row}>
    <div className={styles.addonLeft}>
      {icon ? (
        <RectangleSkeleton uniqueKey={`${uniqueKey}-icon`} width="32px" height="32px" borderRadius={R} />
      ) : null}
      <RectangleSkeleton uniqueKey={`${uniqueKey}-l`} width={left} height="14px" borderRadius={R} />
    </div>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-r`} width={right} height="14px" borderRadius={R} />
  </div>
);

const OverviewLoader = () => {
  return (
    <div className={loaderStyles.loader}>
      {/* Available credits */}
      <div className={`${styles.card} ${styles.creditsCard}`}>
        <div className={styles.creditsTop}>
          <div className={loaderStyles.creditsLeft}>
            <RectangleSkeleton uniqueKey="ov-credits-title" width="132px" height="14px" borderRadius={R} />
            <RectangleSkeleton uniqueKey="ov-credits-amount" width="180px" height="28px" borderRadius={R} />
          </div>
          <RectangleSkeleton uniqueKey="ov-credits-button" width="104px" height="32px" borderRadius={R} />
        </div>
      </div>

      {/* Current plan (full width) */}
      <div className={`${styles.card} ${styles.planCard}`}>
        <div className={styles.planInfo}>
          <RectangleSkeleton uniqueKey="ov-plan-title" width="80px" height="14px" borderRadius={R} />
          <RectangleSkeleton uniqueKey="ov-plan-name" width="96px" height="20px" borderRadius={R} />
          <RectangleSkeleton uniqueKey="ov-plan-text" width="200px" height="14px" borderRadius={R} />
        </div>
        <RectangleSkeleton uniqueKey="ov-plan-button" width="120px" height="32px" borderRadius={R} />
      </div>

      {/* Month-to-date spend / active add-ons */}
      <div className={styles.grid2}>
        <CardListLoader uniqueKey="ov-spend" />
        <CardListLoader uniqueKey="ov-addons" />
      </div>

      {/* Upcoming payments / payment method */}
      <div className={styles.grid2}>
        <CardListLoader uniqueKey="ov-upcoming" />

        <div className={styles.card}>
          <HeaderLoader uniqueKey="ov-payment" />
          <div className={styles.rows}>
            <RowLoader uniqueKey="ov-payment-1" left="180px" right="40px" icon />
            <RowLoader uniqueKey="ov-payment-2" left="160px" right="40px" icon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewLoader;
