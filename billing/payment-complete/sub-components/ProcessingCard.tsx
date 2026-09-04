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
