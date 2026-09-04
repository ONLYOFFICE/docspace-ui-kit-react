import { observer } from "mobx-react";

import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";

import styles from "../../styles/StorageSummary.module.scss";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

type WalletContainerProps = {
  isBalanceInsufficient: boolean;
};

const WalletContainer = (props: WalletContainerProps) => {
  const { isBalanceInsufficient } = props;

  const paymentStore = usePaymentStore();
  const { hasScheduledStorageChange } = paymentStore.tariff;
  const { formatWalletCurrency } = paymentStore;

  if (hasScheduledStorageChange) return null;

  return (
    <div className={styles.walletContainer}>
      <WalletInfo
        balance={formatWalletCurrency()}
        isBalanceInsufficient={isBalanceInsufficient}
        withOpenBilling
      />
    </div>
  );
};

export default observer(WalletContainer);
