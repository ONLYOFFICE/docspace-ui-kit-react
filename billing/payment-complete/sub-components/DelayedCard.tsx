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
