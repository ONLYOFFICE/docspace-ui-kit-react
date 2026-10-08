import React from "react";

import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";

import XIcon from "../../../assets/x.alert.react.svg";

import styles from "../PaymentCompletePage.module.scss";

type ErrorCardProps = {
  title: string;
  hint: string;
  buttonLabel: string;
  onGoToServiceClick: () => void;
};

const ErrorCard = ({
  title,
  hint,
  buttonLabel,
  onGoToServiceClick,
}: ErrorCardProps) => {
  return (
    <>
      <div className={styles.heroBadge} data-status="error" aria-hidden="true">
        <XIcon />
      </div>

      <div className={styles.cardBody}>
        <Text fontSize="16px" fontWeight={600} className={styles.title}>
          {title}
        </Text>

        <Text fontSize="13px" lineHeight="18px">
          {hint}
        </Text>
      </div>

      <div className={styles.actions}>
        <Button
          size={ButtonSize.medium}
          primary
          scale
          label={buttonLabel}
          onClick={onGoToServiceClick}
          testId="ai_paywall_go_to_billing_button"
        />
      </div>
    </>
  );
};

export default ErrorCard;
