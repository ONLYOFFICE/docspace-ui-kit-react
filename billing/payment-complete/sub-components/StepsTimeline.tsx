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
