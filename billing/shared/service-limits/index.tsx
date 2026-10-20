import React, { useEffect } from "react";
import { observer } from "mobx-react";

import { Link, LinkTarget } from "../../../components/link";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServiceLimitStore } from "../../store/ServiceLimitStoreProvider";

import LimitSection from "./LimitSection";
import ServiceLimitsLoader from "./sub-components/ServiceLimitsLoader";
import styles from "./styles/ServiceLimits.module.scss";

type ServiceLimitsProps = {
  helpUrl?: string;
  onOpenContacts?: () => void;
};

const ServiceLimits = ({ helpUrl, onOpenContacts }: ServiceLimitsProps) => {
  const t = useCommonTranslation();
  const limitStore = useServiceLimitStore();
  const paymentStore = usePaymentStore();
  const {
    isInit,
    portalLimit,
    isPortalSaving,
    savePortalLimit,
    setPortalLimitEnabled,
    userLimit,
    isUserSaving,
    saveUserLimit,
    setUserLimitEnabled,
  } = limitStore;
  const { walletCodeCurrency } = paymentStore;

  useEffect(() => {
    const loadLimits = async () => {
      try {
        if (!walletCodeCurrency) await paymentStore.fetchBalance();
        await limitStore.fetchAll();
      } catch (error) {
        toastr.error(error as Error);
      }
    };

    loadLimits();
  }, [limitStore]);

  if (!isInit) return <ServiceLimitsLoader />;

  const contactsLink = (
    <Link
      fontSize="13px"
      fontWeight={600}
      color="accent"
      onClick={onOpenContacts}
      dataTestId="user_limit_contacts_link"
    />
  );

  return (
    <div className={styles.container} data-testid="service_limits">
      <Text className={styles.description}>
        <CommonTrans
          i18nKey="ServiceLimitsDescription"
          components={{ 1: <Text as="span" fontWeight={600} /> }}
        />
        {helpUrl ? (
          <Link
            className={styles.helpLink}
            href={helpUrl}
            target={LinkTarget.blank}
            fontSize="13px"
            fontWeight={600}
            color="accent"
            dataTestId="service_limits_help_link"
          >
            {t("HelpCenter")}
          </Link>
        ) : null}
      </Text>

      <LimitSection
        title={t("PortalLimit")}
        description={t("PortalLimitDescription")}
        limit={portalLimit}
        usage={portalLimit?.usage ?? null}
        isSaving={isPortalSaving}
        onSave={savePortalLimit}
        onSetEnabled={setPortalLimitEnabled}
        testId="portal_limit"
      />

      <LimitSection
        title={t("PerUserLimit")}
        description={t("PerUserLimitDescription")}
        enabledHint={
          <CommonTrans
            i18nKey="PerUserLimitContactsHint"
            components={{ 1: contactsLink }}
          />
        }
        limit={userLimit}
        usage={null}
        isSaving={isUserSaving}
        onSave={saveUserLimit}
        onSetEnabled={setUserLimitEnabled}
        testId="user_limit"
      />
    </div>
  );
};

export default observer(ServiceLimits);
