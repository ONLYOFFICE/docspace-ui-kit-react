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
import classNames from "classnames";

import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";

import WarningIcon from "../../../assets/danger.toast.react.svg";

import type { TDelayedContent } from "../PaymentCompletePage.utils";
import styles from "../PaymentCompletePage.module.scss";
import StepsTimeline from "./StepsTimeline";

type DelayedCardProps = {
  content: TDelayedContent;
  /** the transfer request is still in flight: step 2 spins, the button stays hidden */
  isProcessing: boolean;
  onGoToBillingClick: () => void;
};

const DelayedCard = ({
  content,
  isProcessing,
  onGoToBillingClick,
}: DelayedCardProps) => {
  return (
    <>
      <div className={styles.heroText}>
        <Text fontSize="16px" fontWeight={600} className={styles.title}>
          {content.title}
        </Text>
        <Text lineHeight="20px">{content.hint}</Text>
      </div>

      <div
        className={classNames(styles.callout, styles.calloutWarning)}
        role="status"
      >
        <WarningIcon className={styles.calloutIcon} aria-hidden="true" />
        <Text fontSize="13px" lineHeight="18px">
          {content.callout}
        </Text>
      </div>

      <StepsTimeline
        steps={content.steps}
        stepIndex={isProcessing ? 1 : 2}
        isRunning={isProcessing}
        numbered
      />

      <div
        className={classNames(styles.actionsReveal, {
          [styles.actionsRevealPending]: isProcessing,
        })}
        aria-hidden={isProcessing}
      >
        <div
          className={classNames(styles.actions, {
            [styles.actionsPending]: isProcessing,
          })}
        >
          <Button
            size={ButtonSize.medium}
            primary
            scale
            label={content.buttonLabel}
            onClick={onGoToBillingClick}
            isDisabled={isProcessing}
            testId="payment_complete_back_to_billing_button"
          />
        </div>
      </div>

      <Text className={styles.footerNote}>{content.footerNote}</Text>
    </>
  );
};

export default DelayedCard;
