import { useEffect, useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";

import { toAbsoluteUrl } from "../../../utils/url";
import classNames from "classnames";
import { observer } from "mobx-react";

import { Link } from "../../../../components/link";
import { Text } from "../../../../components/text";
import { toastr } from "../../../../components/toast";

import { AddButton } from "../../../../components/add-button";

import styles from "../styles/PaymentMethod.module.scss";
import { CardInformation } from "../../card-information";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

type PaymentMethodProps = {
  walletCustomerEmail: string;
  cardLinked: string;
  accountLink: string;
  isDisabled: boolean;
  walletCustomerStatusNotActive: boolean;
  recommendedAmount?: string;
  amount?: string;
};

const PaymentMethod = (props: PaymentMethodProps) => {
  const {
    walletCustomerEmail,
    cardLinked,
    accountLink,
    isDisabled,
    walletCustomerStatusNotActive,
    recommendedAmount,
    amount,
  } = props;

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { fetchCardLinked } = paymentStore;
  const { confirmActionType } = servicesStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(!walletCustomerEmail);

  const updateCardLink = async () => {
    if (walletCustomerEmail) return;

    const basicUrl = `${window.location.href}?complete=true&actionType=${confirmActionType ?? ""}`;
    let url = basicUrl;

    if (recommendedAmount && amount) {
      url = `${basicUrl}&amount=${amount}&recommendedAmount=${recommendedAmount}`;
    }

    try {
      await fetchCardLinked!(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateCardLink();
  }, []);

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  const goStripeAccount = () => {
    accountLink
      ? window.open(toAbsoluteUrl(accountLink), "_blank")
      : toastr.error(t("UnexpectedError"));
  };

  return (
    <div className={styles.addPaymentMethod}>
      <div className={styles.paymentMethodDescription}>
        <div className={styles.paymentMethodTitle}>
          <Text isBold fontSize="16px">
            {t("PaymentMethod")}
          </Text>
          {walletCustomerEmail ? (
            <Link
              fontWeight={600}
              onClick={
                isDisabled || isLoading
                  ? undefined
                  : walletCustomerStatusNotActive
                    ? goLinkCard
                    : goStripeAccount
              }
              textDecoration="underline"
              dataTestId="payment_method_link"
              className={classNames({
                [styles.disabledLink]: isDisabled || isLoading,
              })}
            >
              {walletCustomerStatusNotActive
                ? t("AddPaymentMethod")
                : t("GoToStripe")}
            </Link>
          ) : null}
        </div>

        {!walletCustomerEmail ? (
          <Text fontSize="12px" className={styles.noPayment}>
            {t("YouHaveNotAddedAnyPayment")}
          </Text>
        ) : null}
      </div>
      {walletCustomerEmail ? (
        <CardInformation scale withoutMargin />
      ) : (
        <div className={styles.addPaymentMethodContainer}>
          <AddButton
            testId="payment_method_add_button"
            isLoading={isLoading}
            isDisabled={isLoading}
            label={t("AddPaymentMethod")}
            onClick={goLinkCard}
          />
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethod);

