import React from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";

import InfoIcon from "../../../assets/info.outline.react.svg";

import styles from "../PaymentCompletePage.module.scss";
import StepsTimeline, { type TTimelineStep } from "./StepsTimeline";

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

  const steps: TTimelineStep[] = [
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

      <div className={styles.callout} role="status">
        <InfoIcon className={styles.calloutIcon} aria-hidden="true" />
        <Text fontSize="12px" fontWeight={600} lineHeight="16px">
          {t("WalletTopUpKeepOpen")}
        </Text>
      </div>

      <StepsTimeline steps={steps} stepIndex={stepIndex} />

      <Text className={styles.footerNote}>
        {t("WalletTopUpSecuredByStripe")}
      </Text>
    </>
  );
};

export default ProcessingCard;
