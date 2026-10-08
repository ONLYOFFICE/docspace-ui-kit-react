import React from "react";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { HelpButton } from "../../components/help-button";
import { Link } from "../../components/link";
import { combineUrl } from "../../utils/combineUrl";
import type { TTranslation } from "../../utils/common";
import type { TenantQuotaFeatureDto } from "@onlyoffice/docspace-api-sdk";
import { FREE_BACKUP } from "../constants";

import HelpReactSvg from "../../assets/help.react.svg";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./MainTariff.module.scss";

const BenefitsContainer = observer(({ t }: { t: TTranslation }) => {
  const store = usePaymentStore();
  const { portalPaymentQuotasFeatures: features } = store.paymentQuotas;

  const renderTooltip = () => {
    const onClickServiceUrl = () => {
      window.DocSpace.navigate(store.routes.services);
    };

    return (
      <HelpButton
        className="payment-tooltip"
        offsetRight={0}
        iconNode={<HelpReactSvg />}
        tooltipContent={
          <CommonTrans
            i18nKey="NeedMoreGoToAddons"
            components={{
              1: (
                <Link
                  key="contact-payer-link"
                  tag="a"
                  color="accent"
                  onClick={onClickServiceUrl}
                />
              ),
            }}
          />
        }
      />
    );
  };

  return (
    <div className={styles.benefitsBody}>
      <Text fontSize="16px" fontWeight="600" className={styles.benefitsText}>
        {t("Benefits")}
      </Text>
      {features &&
        Array.from(features.values()).map((item: TenantQuotaFeatureDto) => {
          if (!item.title || !item.image) return;
          return (
            <div
              className={styles.paymentBenefits}
              key={item.title || item.image}
            >
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO fix
                dangerouslySetInnerHTML={{ __html: item.image }}
                className={styles.iconsContainer}
              />
              <div className={styles.benefitsFeature}>
                <Text as="span">{item.title}</Text>
                {item.id === FREE_BACKUP ? renderTooltip() : null}
              </div>
            </div>
          );
        })}
    </div>
  );
});

export default BenefitsContainer;
