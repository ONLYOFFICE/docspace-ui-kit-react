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

/** A single grid3 card: muted title + value + text + link (4 lines). */
const InfoCardLoader = ({ uniqueKey }: { uniqueKey: string }) => (
  <div className={styles.card}>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width="120px" height="12px" borderRadius={R} />
    <RectangleSkeleton uniqueKey={`${uniqueKey}-value`} width="96px" height="20px" borderRadius={R} />
    <RectangleSkeleton uniqueKey={`${uniqueKey}-text`} width="100%" height="14px" borderRadius={R} />
    <RectangleSkeleton uniqueKey={`${uniqueKey}-link`} width="88px" height="14px" borderRadius={R} />
  </div>
);

/** Icon + single line on the left, amount on the right. */
const AddonRowLoader = ({ uniqueKey }: { uniqueKey: string }) => (
  <div className={styles.row}>
    <div className={styles.addonLeft}>
      <RectangleSkeleton uniqueKey={`${uniqueKey}-icon`} width="32px" height="32px" borderRadius={R} />
      <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width="140px" height="14px" borderRadius={R} />
    </div>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-amount`} width="56px" height="14px" borderRadius={R} />
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

      {/* Spend / upcoming */}
      <div className={styles.grid2}>
        <InfoCardLoader uniqueKey="ov-spend" />
        <InfoCardLoader uniqueKey="ov-upcoming" />
      </div>

      {/* Add-ons / payment method */}
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <RectangleSkeleton uniqueKey="ov-addons-header" width="160px" height="16px" borderRadius={R} />
            <RectangleSkeleton uniqueKey="ov-addons-manage" width="60px" height="16px" borderRadius={R} />
          </div>
          <div className={styles.rows}>
            <AddonRowLoader uniqueKey="ov-addon-1" />
            <AddonRowLoader uniqueKey="ov-addon-2" />
            <AddonRowLoader uniqueKey="ov-addon-3" />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <RectangleSkeleton uniqueKey="ov-payment-header" width="140px" height="16px" borderRadius={R} />
            <RectangleSkeleton uniqueKey="ov-payment-manage" width="60px" height="16px" borderRadius={R} />
          </div>
          <div className={styles.rows}>
            <div className={styles.row}>
              <div className={styles.addonLeft}>
                <RectangleSkeleton uniqueKey="ov-payment-icon" width="32px" height="32px" borderRadius={R} />
                <RectangleSkeleton uniqueKey="ov-payment-card" width="150px" height="14px" borderRadius={R} />
              </div>
              <RectangleSkeleton uniqueKey="ov-payment-status" width="56px" height="14px" borderRadius={R} />
            </div>
          </div>
          <RectangleSkeleton uniqueKey="ov-payment-hint" width="100%" height="16px" borderRadius={R} />
        </div>
      </div>
    </div>
  );
};

export default OverviewLoader;
