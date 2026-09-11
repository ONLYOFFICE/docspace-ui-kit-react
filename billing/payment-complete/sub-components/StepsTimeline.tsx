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

import { Text } from "../../../components/text";
import { Loader, LoaderTypes } from "../../../components/loader";

import CheckIcon from "../../../assets/check.edit.react.svg";

import styles from "../PaymentCompletePage.module.scss";

export type TTimelineStep = {
  key: string;
  label: React.ReactNode;
  doneLabel?: React.ReactNode;
};

/** `active` spins, `current` is the step the flow has just stopped at */
type TStepState = "done" | "active" | "current" | "pending";

type StepsTimelineProps = {
  steps: TTimelineStep[];
  /** index of the first step that is not done yet */
  stepIndex: number;
  /** while running the current step spins; once stopped it is only highlighted */
  isRunning?: boolean;
  /** pending steps show their numbers */
  numbered?: boolean;
};

const getStepState = (
  index: number,
  stepIndex: number,
  isRunning: boolean,
): TStepState => {
  if (index < stepIndex) return "done";
  if (index === stepIndex) return isRunning ? "active" : "current";
  return "pending";
};

const StepsTimeline = ({
  steps,
  stepIndex,
  isRunning = true,
  numbered = false,
}: StepsTimelineProps) => {
  return (
    <ol className={styles.timeline}>
      {steps.map((step, index) => {
        const state = getStepState(index, stepIndex, isRunning);
        const isLast = index === steps.length - 1;
        const nextState = isLast
          ? null
          : getStepState(index + 1, stepIndex, isRunning);
        const connectorState =
          state === "done" && (nextState === "done" || nextState === "active")
            ? "done"
            : "pending";

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
                data-state={connectorState}
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
              {(state === "pending" || state === "current") && numbered
                ? index + 1
                : null}
            </Text>
            <Text
              className={styles.timelineLabel}
              as="span"
              fontSize="14px"
              fontWeight={700}
            >
              {state === "done" && step.doneLabel ? step.doneLabel : step.label}
            </Text>
          </li>
        );
      })}
    </ol>
  );
};

export default StepsTimeline;
