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

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { Loader, LoaderTypes } from "../../../components/loader";

import CheckIcon from "../../../assets/check.edit.react.svg";
import InfoIcon from "../../../assets/info.outline.react.svg";

import styles from "../PaymentCompletePage.module.scss";

type TTariffActivation = {
  plan: string;
  admins: string;
  storage: string;
};

type ProcessingCardProps = {
  title: string;
  hint: string;
  stepIndex: number;
  topUpPrice: string;
  activateStepLabel: string;
  tariffActivation?: TTariffActivation;
};

const ProcessingCard = ({
  title,
  hint,
  stepIndex,
  topUpPrice,
  activateStepLabel,
  tariffActivation,
}: ProcessingCardProps) => {
  const t = useCommonTranslation();

  const tariffStep = tariffActivation ? (
    <span className={styles.tariffActivation}>
      <Text as="span" fontSize="14px" fontWeight={700}>
        {t("ActivatingPlan", { planName: tariffActivation.plan })}
      </Text>
      <Text
        as="span"
        fontSize="12px"
        fontWeight={400}
        className={styles.tariffActivationDetails}
      >
        {t("TariffActivationDetails", {
          admins: tariffActivation.admins,
          storage: tariffActivation.storage,
        })}
      </Text>
    </span>
  ) : null;

  const steps: {
    key: string;
    label: React.ReactNode;
    doneLabel?: React.ReactNode;
  }[] = [
    { key: "card", label: t("WalletTopUpStepCardSaved") },
    {
      key: "topup",
      label: t("WalletTopUpCallbackStep", { price: topUpPrice }),
      doneLabel: t("WalletTopUpCallbackStepDone", { price: topUpPrice }),
    },
    ...(tariffStep
      ? [{ key: "tariff", label: tariffStep }]
      : activateStepLabel
        ? [{ key: "service", label: activateStepLabel }]
        : []),
  ];

  return (
    <>
      <div className={styles.heroText}>
        <Text fontSize="16px" fontWeight={600} className={styles.title}>
          {title}
        </Text>
        <Text lineHeight="20px">{hint}</Text>
      </div>

      <div className={styles.keepOpenCallout} role="status">
        <InfoIcon className={styles.keepOpenCalloutIcon} aria-hidden="true" />
        <Text fontSize="12px" fontWeight={600} lineHeight="16px">
          {t("WalletTopUpKeepOpen")}
        </Text>
      </div>

      <ol className={styles.timeline}>
        {steps.map((step, index) => {
          const state =
            index < stepIndex
              ? "done"
              : index === stepIndex
                ? "active"
                : "pending";
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.key}
              className={styles.timelineItem}
              data-state={state}
            >
              {!isLast ? (
                <Text
                  className={styles.timelineConnector}
                  aria-hidden="true"
                  as="span"
                />
              ) : null}
              <Text
                className={styles.timelineDot}
                aria-hidden="true"
                as="span"
                data-state={state}
              >
                {state === "done" ? <CheckIcon /> : null}
                {state === "active" ? (
                  <Loader type={LoaderTypes.track} size="20px" />
                ) : null}
              </Text>
              <Text
                className={styles.timelineLabel}
                as="span"
                fontSize="14px"
                fontWeight={700}
              >
                {state === "done" && step.doneLabel
                  ? step.doneLabel
                  : step.label}
              </Text>
            </li>
          );
        })}
      </ol>

      <Text className={styles.footerNote}>
        {t("WalletTopUpSecuredByStripe")}
      </Text>
    </>
  );
};

export default ProcessingCard;
