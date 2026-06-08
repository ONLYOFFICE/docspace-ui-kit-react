import { observer } from "mobx-react";

import { Consumer } from "../../../../utils";
import { Text } from "../../../../components/text";
import { EmptyView } from "../../../../components/empty-view";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useTheme } from "../../../../context/ThemeContext";

import NoTransactionsIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoTransactionsDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

import TableView from "./TableView";
import styles from "./UpcomingPayments.module.scss";

const UpcomingPayments = () => {
  const { upcomingPayments } = usePaymentStore();
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const emptyView = (
    <EmptyView
      icon={isBase ? <NoTransactionsIcon /> : <NoTransactionsDarkIcon />}
      title={t("NoWalletTransaction")}
      description={t("NoWalletTransactionDescription")}
      options={null}
    />
  );

  return (
    <div className={styles.upcomingPayments}>
      <div className={styles.introText}>
        <Text>{t("UpcomingPaymentsDescription")}</Text>
        <Text>{t("UpcomingPaymentsAutoChargeNote")}</Text>
      </div>

      {upcomingPayments.length ? (
        <Consumer>
          {(context) => <TableView sectionWidth={context.sectionWidth || 0} />}
        </Consumer>
      ) : (
        emptyView
      )}
    </div>
  );
};

export default observer(UpcomingPayments);

