import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const {
    isInit,
    fetchAll,
    portalLimit,
    isPortalSaving,
    savePortalLimit,
    setPortalLimitEnabled,
    userLimit,
    isUserSaving,
    saveUserLimit,
    setUserLimitEnabled,
  } = useServiceLimitStore();
  const { balance, fetchBalance, routes, tariff } = usePaymentStore();
  const { walletCustomerEmail, fetchCustomerInfo } = tariff;

  const [isCustomerChecked, setIsCustomerChecked] = useState(false);

  useEffect(() => {
    const loadLimits = async () => {
      const requests: Promise<unknown>[] = [
        fetchAll(),
        fetchCustomerInfo().finally(() => setIsCustomerChecked(true)),
      ];

      if (!balance) requests.push(fetchBalance());

      try {
        await Promise.all(requests);
      } catch (error) {
        toastr.error(error as Error);
      }
    };

    loadLimits();
  }, [fetchAll]);

  const hasCustomer = !!walletCustomerEmail;

  if (!isInit || !isCustomerChecked || (hasCustomer && !balance))
    return <ServiceLimitsLoader />;

  const paymentMethodRoute = routes.paymentMethod;

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

      {hasCustomer ? null : (
        <Text className={styles.notice}>
          {t("ServiceLimitsNoPaymentMethod")}
          {paymentMethodRoute ? (
            <Link
              className={styles.noticeLink}
              fontSize="13px"
              fontWeight={600}
              color="accent"
              onClick={() => navigate(paymentMethodRoute)}
              dataTestId="service_limits_add_payment_method_link"
            >
              {t("AddPaymentMethod")}
            </Link>
          ) : null}
        </Text>
      )}

      <LimitSection
        title={t("PortalLimit")}
        description={t("PortalLimitDescription")}
        limit={portalLimit}
        usage={portalLimit?.usage ?? null}
        isSaving={isPortalSaving}
        onSave={savePortalLimit}
        onSetEnabled={setPortalLimitEnabled}
        isDisabled={!hasCustomer}
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
        isDisabled={!hasCustomer}
        testId="user_limit"
      />
    </div>
  );
};

export default observer(ServiceLimits);
