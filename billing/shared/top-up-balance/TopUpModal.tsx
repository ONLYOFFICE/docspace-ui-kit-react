import React, { useState } from "react";
import { useCommonTranslation } from "../../../utils/i18n";
import { observer } from "mobx-react";

import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";

import WalletInfo from "./sub-components/WalletInfo";
import PaymentMethod from "./sub-components/PaymentMethod";
import Amount from "./sub-components/Amount";
import TopUpButtons from "./sub-components/TopUpButtons";
import AutomaticPaymentsBlock from "./sub-components/AutoPayments";
import { AmountProvider } from "../../wallet/context";
import styles from "./styles/TopUpModal.module.scss";
import { useApi } from "../../../providers/api";
import type { DateTime } from "luxon";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

type TopUpModalProps = {
  visible: boolean;
  onClose: (isTopUp: boolean) => void;
  isEditAutoPayment?: boolean;
  headerProps?: {
    isBackButton: boolean;
    onBackClick: () => void;
    onCloseClick: () => void;
  };
  recommendedAmount?: string;
  amount?: string;
  afterTopUp?: () => void;
  serviceName?: string;
};

const TopUpModal = (props: TopUpModalProps) => {
  const {
    visible,
    onClose,
    isEditAutoPayment,
    headerProps,
    recommendedAmount,
    amount,
    afterTopUp,
    serviceName,
  } = props;

  const { paymentApi } = useApi();
  const store = usePaymentStore();

  const {
    fetchBalance,
    fetchTransactionHistory,
    cardLinked,
    accountLink,
    walletCodeCurrency: currency,
    wasFirstTopUp,
    formatWalletCurrency,
  } = store;

  const { walletCustomerStatusNotActive, walletCustomerEmail } = store.tariff;

  const t = useCommonTranslation();

  const balanceValue = formatWalletCurrency!();

  const [isLoading, setIsLoading] = useState(false);

  const topUpDeposit = async (amount: number, currency: string) => {
    const res = await paymentApi.topUpDeposit({
      topUpDepositRequestDto: { amount, currency },
    });
    return res?.data?.response as unknown as string;
  };

  const onFetchHistory = async () => {
    await fetchTransactionHistory?.(serviceName);
  };

  return (
    <AmountProvider initialAmount={recommendedAmount}>
      <ModalDialog
        visible={visible}
        onClose={() => onClose(false)}
        displayType={ModalDialogType.aside}
        {...headerProps}
        withBodyScroll
      >
        <ModalDialog.Header>{t("TopUpWallet")}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.modalBody}>
            <WalletInfo balance={balanceValue} />
            <PaymentMethod
              walletCustomerEmail={walletCustomerEmail!}
              cardLinked={cardLinked!}
              accountLink={accountLink!}
              isDisabled={isLoading}
              walletCustomerStatusNotActive={walletCustomerStatusNotActive!}
              recommendedAmount={recommendedAmount}
              amount={amount}
            />

            <Amount
              formatWalletCurrency={formatWalletCurrency}
              walletCustomerEmail={walletCustomerEmail!}
              isDisabled={(isLoading || walletCustomerStatusNotActive) ?? false}
              walletCustomerStatusNotActive={walletCustomerStatusNotActive}
              recommendedAmount={recommendedAmount}
            />

            {wasFirstTopUp && walletCustomerEmail ? (
              <AutomaticPaymentsBlock
                isEditAutoPayment={isEditAutoPayment!}
                isDisabled={isLoading || walletCustomerStatusNotActive}
              />
            ) : null}
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <TopUpButtons
            currency={currency}
            fetchBalance={fetchBalance}
            fetchTransactionHistory={onFetchHistory}
            onClose={onClose}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            isDisabled={walletCustomerStatusNotActive}
            onTopUpBalance={topUpDeposit}
            afterTopUp={afterTopUp}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </AmountProvider>
  );
};

export default observer(TopUpModal);
