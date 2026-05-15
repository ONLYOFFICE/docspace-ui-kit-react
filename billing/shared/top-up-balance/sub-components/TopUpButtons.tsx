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

import React from "react";
import { useCommonTranslation } from "../../../../utils/i18n";

import { Button, ButtonSize } from "../../../../components/button";
import { toastr } from "../../../../components/toast";

import { Text } from "../../../../components/text";

import { useAmountValue } from "../../../wallet/context";
import styles from "../styles/TopUpModal.module.scss";
import { AI_TOOLS } from "../../../constants";
import { observer } from "mobx-react";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";

interface TopUpButtonsProps {
  currency: string;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  fetchBalance?: () => Promise<void>;
  fetchServiceBalance?: () => Promise<void>;
  fetchTransactionHistory?: (serviceName?: string) => Promise<void>;
  onClose: (isTopUp: boolean) => void;
  isDisabled?: boolean;
  onTopUpBalance: (amount: number, currency: string) => Promise<string>;
  serviceName?: string;
  afterTopUp?: () => void;
}

const TopUpButtons: React.FC<TopUpButtonsProps> = ({
  currency,
  fetchBalance,
  fetchServiceBalance,
  fetchTransactionHistory,
  onClose,
  setIsLoading,
  isLoading,
  onTopUpBalance,
  serviceName,
  afterTopUp,
  isDisabled
}) => {
  const paymentStore = usePaymentStore();

  const { handleServicesQuotas, isAlreadyPaid } = paymentStore;
  const { logoText } = paymentStore;
  const t = useCommonTranslation();

  const { amount, isBalanceInsufficient, hasError } = useAmountValue();

  const isButtonDisabled =
    isDisabled ||
    !amount ||
    !isAlreadyPaid ||
    isBalanceInsufficient ||
    hasError;

  const onTopUp = async () => {
    try {
      setIsLoading(true);

      const res = await onTopUpBalance(+amount, serviceName ?? currency);

      if (!res) {
        throw new Error(t("UnexpectedError"));
      }

      const requests: Promise<unknown>[] = [
        fetchBalance!(),
        fetchTransactionHistory!(serviceName),
      ];

      if (serviceName) {
        requests.push(fetchServiceBalance!());
        requests.push(handleServicesQuotas!());
      }

      await Promise.allSettled(requests);

      const toastMessage =
        serviceName === AI_TOOLS
          ? t("AIServiceToppedUp", { organizationName: logoText })
          : t("WalletToppedUp");

      toastr.success(toastMessage);
      afterTopUp ? afterTopUp() : onClose(true);
    } catch (e) {
      toastr.error(e as unknown as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.buttonContainerWrapper}>
      {isLoading ? <Text>{t("TopUpTakeSomeTimeToComplete")}</Text> : null}
      <div className={styles.buttonContainer}>
        <Button
          key="OkButton"
          label={t("TopUp")}
          size={ButtonSize.normal}
          primary
          scale
          isDisabled={isButtonDisabled}
          onClick={onTopUp}
          isLoading={isLoading}
          testId="top_up_button"
        />
        <Button
          key="CancelButton"
          label={t("CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={() => onClose(false)}
          isDisabled={isLoading}
          testId="cancel_top_up_button"
        />
      </div>
    </div>
  );
};

export default observer(TopUpButtons);

