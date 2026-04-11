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

import classNames from "classnames";

import { toAbsoluteUrl } from "../../utils/url";
import { Text } from "../../../components/text";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";
import { Avatar, AvatarRole, AvatarSize } from "../../../components/avatar";
import { toastr } from "../../../components/toast";
import DefaultUserPhoto from "../../../assets/default_user_photo_size_82-82.png";
import { Link, LinkTarget } from "../../../components/link";
import { useState } from "react";
import { Loader, LoaderTypes } from "../../../components/loader";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useApi } from "../../../providers";

import styles from "./PayerInformation.module.scss";
import { getBrandName } from "../../../../../packages/shared/constants/brands";

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
    const userNotFound = `${t("UserNotFoundMatchingEmail")} `;

    let invalidEmailDescription = isOwner
      ? t("UnknownPayerForOwner", {
          productName: getBrandName("ProductName"),
        })
      : t("UnknownPayerForAdmin", {
          productName: getBrandName("ProductName"),
        });

    if (isNotPaidPeriod) {
      invalidEmailDescription = isOwner
        ? t("InvalidEmailWithoutActiveSubscription", {
            productName: getBrandName("ProductName"),
          })
        : t("InvalidEmailWithoutActiveSubscriptionByAdmin", {
            productName: getBrandName("ProductName"),
          });

      return userNotFound + invalidEmailDescription;
    }

    return userNotFound + invalidEmailDescription;
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

    if (email) emailUnfoundedUser = `"${email}"`;

    return (
      <Text as="span" fontWeight={600} fontSize="14px">
        {payerInfo ? (
          payerInfo.displayName
        ) : (
          <CommonTrans
           
            i18nKey="UserNotFound"
            values={{ email: emailUnfoundedUser }}
            components={{
              1: (
                <Text
                  as="span"
                  className={styles.refreshData}
                  fontWeight={600}
                  fontSize="14px"
                />
              ),
            }}
          />
        )}
      </Text>
    );
  };

  const avatarSource = payerInfo
    ? (payerInfo.hasAvatar && payerInfo.avatar
        ? `${baseUrl}${payerInfo.avatar}`
        : DefaultUserPhoto) ?? undefined
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
