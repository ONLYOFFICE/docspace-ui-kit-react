import React from "react";

import { useCommonTranslation } from "../../../utils/i18n";
import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { Link, LinkType, LinkTarget } from "../../../components/link";

import CheckIcon from "../../../assets/check.edit.react.svg";

import BalanceAmount from "../../shared/balance-amount";

import { PaymentFlavor } from "../PaymentCompletePage.utils";
import styles from "../PaymentCompletePage.module.scss";

type SuccessCardProps = {
  flavor: PaymentFlavor;
  title: string;
  hint: string;
  buttonLabel: string;
  onGoToServiceClick: () => void;
  amount: number;
  currency: string;
  language: string;
  admins: string;
  storage: string;
  price: string;
  docsConnectUsers: number;
  formattedMonthlyPrice: string;
  docsConnectUrl?: string;
};

const SuccessCard = ({
  flavor,
  title,
  hint,
  buttonLabel,
  onGoToServiceClick,
  amount,
  currency,
  language,
  admins,
  storage,
  price,
  docsConnectUsers,
  formattedMonthlyPrice,
  docsConnectUrl,
}: SuccessCardProps) => {
  const t = useCommonTranslation();

  const isDocsConnect = flavor === PaymentFlavor.DocsConnect;

  return (
    <>
      <div
        className={styles.heroBadge}
        data-status="success"
        aria-hidden="true"
      >
        <CheckIcon />
      </div>

      <div className={styles.cardBody}>
        <Text fontSize="16px" fontWeight={600} className={styles.title}>
          {title}
        </Text>
        {flavor === PaymentFlavor.Tariff ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              {t("AdminsAddedAmount", { admins })}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("TariffSuccessDetails", { storage, price })}
            </Text>
          </>
        ) : isDocsConnect ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              {t("DocsConnectUsersAmount", {
                count: docsConnectUsers,
              })}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("DocsConnectPricePerMonth", {
                price: formattedMonthlyPrice,
              })}
            </Text>
          </>
        ) : flavor === PaymentFlavor.DiskStorage && storage ? (
          <>
            <Text as="span" className={styles.adminsAmount}>
              +{storage}
            </Text>
            <Text fontSize="14px" className={styles.tariffActivationDetails}>
              {t("StoragePaywallCallbackPricePerMonth", {
                price: formattedMonthlyPrice,
              })}
            </Text>
          </>
        ) : (
          <>
            <div className={styles.successAmount}>
              <Text as="span" fontSize="28px" fontWeight={700}>
                +
              </Text>
              <BalanceAmount
                amount={amount}
                currency={currency}
                language={language}
                maximumFractionDigits={2}
                mainFontSize="28px"
                fractionFontSize="20px"
                withoutMargin
                showRefresh={false}
              />
            </div>
            <Text fontSize="13px" lineHeight="18px">
              {hint}
            </Text>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          size={ButtonSize.medium}
          primary
          scale
          label={buttonLabel}
          onClick={onGoToServiceClick}
          testId="ai_paywall_go_to_wallet_button"
        />
        {isDocsConnect && docsConnectUrl ? (
          <Link
            className={styles.docsLink}
            type={LinkType.page}
            href={docsConnectUrl}
            target={LinkTarget.blank}
            color="accent"
            fontSize="13px"
            fontWeight={600}
            dataTestId="docs_connect_read_api_docs_link"
          >
            {t("ReadApiDocumentation")}
          </Link>
        ) : null}
      </div>
    </>
  );
};

export default SuccessCard;
