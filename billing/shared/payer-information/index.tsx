import classNames from "classnames";

import { toAbsoluteUrl } from "../../utils/url";
import { Text } from "../../../components/text";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import { Avatar, AvatarRole, AvatarSize } from "../../../components/avatar";
import { toastr } from "../../../components/toast";

import { Link, LinkTarget } from "../../../components/link";
import { useState } from "react";
import { Loader, LoaderTypes } from "../../../components/loader";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useApi } from "../../../providers/api";
import { Encoder } from "../../../utils/encoder";
import styles from "./PayerInformation.module.scss";

const PayerInformation = () => {
  const store = usePaymentStore();
  const { baseUrl } = useApi();

  const { accountLink, isStripePortalAvailable, isOwner } = store;

  const {
    isNotPaidPeriod,
    walletCustomerEmail: email,
    walletCustomerInfo: payerInfo,
    fetchCustomerInfo,
  } = store.tariff;
  const t = useCommonTranslation();

  const [isDisabled, setDisabled] = useState(false);
  const goToStripePortal = () => {
    accountLink
      ? window.open(toAbsoluteUrl(accountLink), "_blank")
      : toastr.error(t("UnexpectedError"));
  };

  const onRefreshData = async () => {
    setDisabled(true);
    try {
      await fetchCustomerInfo(true);
    } catch (error) {
      let errorMessage = "";

      if (typeof error === "object") {
        const err = error as {
          response?: { data?: { error?: { message?: string } } };
          statusText?: string;
          message?: string;
        };
        errorMessage =
          err?.response?.data?.error?.message ||
          err?.statusText ||
          err?.message ||
          "";
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toastr.error(errorMessage || t("UnexpectedError"));
    }
    setDisabled(false);
  };

  const unknownPayerDescription = () => {
    if (isNotPaidPeriod) {
      return isOwner
        ? t("UnknownPayerOwnerUnpaid")
        : t("UnknownPayerAdminUnpaid");
    }

    return isOwner
      ? t("UnknownPayerForOwner")
      : t("UnknownPayerForAdmin");
  };

  const unknownPayerInformation = (
    <div>
      <Text as="span" fontSize="13px">
        {unknownPayerDescription()}
      </Text>
      <div>
        {isStripePortalAvailable ? (
          <div className={styles.infoContainer}>
            <CommonTrans
              i18nKey="ChooseNewPayerOrRefrashData"
              components={{
                1: (
                  <Link
                    noSelect
                    fontWeight={600}
                    target={LinkTarget.blank}
                    className={styles.accountLink}
                    color="accent"
                    onClick={goToStripePortal}
                    dataTestId="stripe_customer_portal_link"
                  />
                ),
                2: (
                  <Link
                    noSelect
                    fontWeight={600}
                    onClick={isDisabled ? () => {} : onRefreshData}
                    textDecoration="underline dotted"
                    className={classNames(styles.refreshData, {
                      [styles.disabled]: isDisabled,
                    })}
                    dataTestId="stripe_customer_refresh_data"
                  />
                ),
              }}
            />
            {isDisabled ? (
              <div className={styles.loaderContainer}>
                <Loader
                  color=""
                  size="16px"
                  type={LoaderTypes.track}
                  className={styles.refreshDataLoader}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  const payerInformation = (
    <Link
      fontWeight={600}
      href={`mailto:${email}`}
      color="accent"
      dataTestId="payer_email_link"
    >
      {email}
    </Link>
  );

  const payerName = () => {
    let emailUnfoundedUser = "";

    if (email) emailUnfoundedUser = `${email}`;

    return (
      <Text as="span" fontWeight={600} fontSize="14px">
        {payerInfo ? (
          Encoder.htmlDecode(payerInfo.displayName ?? "")
        ) : (
          <CommonTrans
            i18nKey="ContactNotFound"
            values={{ email: emailUnfoundedUser }}
            components={{
              1: (
                <Link
                  as="span"
                  className={styles.contactEmail}
                  fontWeight={600}
                  fontSize="14px"
                  href={`mailto:${email}`}
                />
              ),
            }}
          />
        )}
      </Text>
    );
  };

  const avatarSource = payerInfo
    ? payerInfo.hasAvatar && payerInfo.avatar
      ? `${baseUrl}${payerInfo.avatar}`
      : "default_user_photo"
    : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.base}
          source={avatarSource}
          isDefaultSource
          userName={payerInfo?.displayName ?? undefined}
        />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.description}>{payerName()}</div>

        {!payerInfo ? unknownPayerInformation : payerInformation}
      </div>
    </div>
  );
};

export default observer(PayerInformation);

