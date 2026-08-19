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
import { useState, useEffect } from "react";

import { isMobile } from "../../../../utils/device";
import { RectangleSkeleton } from "../../../rectangle";
import styles from "./Dialog.module.scss";

export const DialogInvitePanelSkeleton = () => {
  const [isMobileView, setIsMobileView] = useState(isMobile());

  const checkWidth = () => setIsMobileView(isMobile());

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className={styles.dialogInviteLoader}
      data-testid="dialog-invite-panel-skeleton"
    >
      <div className="dialog-loader-header">
        <RectangleSkeleton height="29px" />
      </div>

      <div className={styles.externalLinksLoader}>
        <div className="external-links-loader">
          <RectangleSkeleton width="177px" height="22px" />
          <RectangleSkeleton className="check-box" width="28px" height="16px" />
        </div>

        <RectangleSkeleton
          className="external-links-loader__description"
          width="320px"
          height="16px"
        />
      </div>

      <div className={styles.inviteInputLoader}>
        <div className={styles.invitePanelLoaderHeader}>
          <RectangleSkeleton
            width={isMobileView ? "156px" : "212px"}
            height="22px"
          />
          <RectangleSkeleton
            width={isMobileView ? "79px" : "122px"}
            height="19px"
          />
        </div>
        <RectangleSkeleton width="100%" height="32px" />
        <div className={styles.invitePanelLoaderFooter}>
          <RectangleSkeleton
            height="32px"
            width={isMobileView ? "237px" : "342px"}
          />
          <RectangleSkeleton width="98px" height="32px" />
        </div>
      </div>

      <div className="dialog-loader-footer">
        <RectangleSkeleton height="40px" />
        <RectangleSkeleton height="40px" />
      </div>
    </div>
  );
};
