// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import { useCommonTranslation } from "../../../../utils/i18n";
import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";
import { Link } from "../../../../components/link";
import { toastr } from "../../../../components/toast";

import { useApi } from "../../../../providers";

import BalanceAmount from "../../../shared/balance-amount";
import PricingBillingBody from "../../panels/ai-service/PricingBillingBody";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { toAbsoluteUrl } from "../../../utils/url";
import { AI_ENUM, AI_TOOLS } from "../../../constants";

import AiPageLoader from "./AiPageLoader";
import styles from "./AiPaywallPage.module.scss";

type AiPaywallPageProps = {
  integrationUrl?: string;
};

const START_AMOUNT = 20;

const AiPaywallPage = ({ integrationUrl }: AiPaywallPageProps) => {
  const t = useCommonTranslation();
  const { rawApiClient } = useApi();

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { paymentMethodInit, isPaymentMethodInit } = paymentStore;

  const {
    aiServiceBalance,
    aiServiceCodeCurrency,
    isInitServicesData,
    initServiceData,
  } = servicesStore;

  const [isPricingBillingVisible, setIsPricingBillingVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    paymentMethodInit(t, integrationUrl);
    initServiceData(t, AI_TOOLS, AI_ENUM, integrationUrl);
  }, []);

  const onOpenPricingBilling = () => setIsPricingBillingVisible(true);
  const onClosePricingBilling = () => setIsPricingBillingVisible(false);

  const onEnableAI = async () => {
    if (isRedirecting) return;

    try {
      setIsRedirecting(true);

      const { data } = await rawApiClient.instance.post(
        "api/2.0/portal/payment/buywalletservice",
        { quantity: START_AMOUNT, serviceName: AI_TOOLS },
      );

      const url = data as unknown as string;

      if (!url) {
        throw new Error(t("UnexpectedError"));
      }

      window.open(toAbsoluteUrl(url), "_top");
    } catch (e) {
      toastr.error(e as Error);
      setIsRedirecting(false);
    }
  };

  if (!isPaymentMethodInit || !isInitServicesData) return <AiPageLoader />;

  return (
    <div className={styles.container}>
      <PricingBillingBody
        visible={isPricingBillingVisible}
        onClose={onClosePricingBilling}
        isBackButton={false}
        withoutFooter
      />

      <div className={styles.heroSection}>
        <Text
          fontSize="18px"
          fontWeight={700}
          lineHeight="24px"
          className={styles.heroTitle}
        >
          {t("AIPaywallHeroTitle", { price: START_AMOUNT })}
        </Text>

        <Text fontSize="13px" lineHeight="18px" className={styles.heroSubtitle}>
          {t("AIPaywallHeroSubtitle")}
        </Text>
      </div>

      <div className={styles.balanceSection}>
        <div className={styles.balanceCard}>
          <Text isBold fontSize="18px" className={styles.balanceLabel}>
            {t("AIPaywallBalanceLabel")}
          </Text>

          <BalanceAmount
            amount={aiServiceBalance ?? 0}
            currency={aiServiceCodeCurrency || "USD"}
            withoutMargin
            showRefresh={false}
          />

          <Button
            size={ButtonSize.small}
            primary
            label={t("AIPaywallEnableButton", { price: START_AMOUNT })}
            onClick={onEnableAI}
            scale
            isLoading={isRedirecting}
            testId="enable_ai_button"
          />

          <Text fontSize="12px" className={styles.secureNote}>
            {t("AIPaywallSecureNote")}
          </Text>
        </div>
      </div>

      <div className={styles.pricingRow}>
        <Link
          className={styles.pricingLink}
          onClick={onOpenPricingBilling}
          textDecoration="underline dotted"
          color="accent"
        >
          <Text fontSize="13px" fontWeight={600}>
            {t("AIPaywallSeePricing")}
          </Text>
        </Link>
      </div>
    </div>
  );
};

export default observer(AiPaywallPage);

