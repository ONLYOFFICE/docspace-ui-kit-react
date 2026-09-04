import { useState, type CSSProperties } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";
import { useTheme } from "../../../../context/ThemeContext";

import { EmptyView } from "../../../../components/empty-view";

import { Consumer } from "../../../../utils";

import NoTransactionsIcon from "../../../../assets/no.transactions.react.svg";
import NoTransactionsDarkIcon from "../../../../assets/no.transactions.dark.theme.react.svg";
import NoTransactionsFilterIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoTransactionsFilterDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useViewEffect from "../../../../hooks/useViewEffect";
import useDeviceType from "../../../hooks/useDeviceType";
import { isDocsConnectServiceName } from "../../../utils/docs-connect";

import styles from "../styles/TransactionHistory.module.scss";

import TableView from "./TableView";
import RowView from "./RowView";

type TransactionHistoryProps = {
  isTransactionHistoryExist: boolean;
  hasAppliedDateFilter: boolean;
  serviceName?: string;
  maxWidth?: number | string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const TransactionBody = ({
  hasAppliedDateFilter,
  isTransactionHistoryExist,
  serviceName,
  maxWidth,
  emptyTitle,
  emptyDescription,
}: TransactionHistoryProps) => {
  const { isBase } = useTheme();
  const { mobileBreakpoint, desktopBreakpoint } = usePaymentStore();

  const [viewAs, setViewAs] = useState("table");

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  useViewEffect({
    view: viewAs,
    setView: setViewAs,
    currentDeviceType,
  });

  const t = useCommonTranslation();

  const emptyIcon = isBase ? (
    <NoTransactionsIcon />
  ) : (
    <NoTransactionsDarkIcon />
  );

  const filterIcon = isBase ? (
    <NoTransactionsFilterIcon />
  ) : (
    <NoTransactionsFilterDarkIcon />
  );

  const isDocsConnect = isDocsConnectServiceName(serviceName);

  const title = hasAppliedDateFilter
    ? t("NoFindingsFound2")
    : (emptyTitle ??
      (isDocsConnect ? t("NoDocsConnectTransaction") : t("NoWalletTransaction")));
  const description = hasAppliedDateFilter
    ? t("NoTransactionsFilter")
    : (emptyDescription ??
      (isDocsConnect
        ? t("NoDocsConnectTransactionDescription")
        : t("NoWalletTransactionDescription")));

  const emptyView = (
    <EmptyView
      icon={hasAppliedDateFilter ? filterIcon : emptyIcon}
      title={title}
      description={description}
      options={null}
    />
  );

  const renderContent = (
    <Consumer>
      {(context) =>
        viewAs === "table" ? (
          <TableView
            sectionWidth={context.sectionWidth || 0}
            serviceName={serviceName}
          />
        ) : (
          <RowView
            sectionWidth={context.sectionWidth || 0}
            serviceName={serviceName}
          />
        )
      }
    </Consumer>
  );

  const wrapperStyle =
    maxWidth !== undefined
      ? ({
          "--transaction-body-max-width":
            typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        } as CSSProperties)
      : undefined;

  return (
    <div className={styles.transactionBodyWrapper} style={wrapperStyle}>
      {isTransactionHistoryExist ? renderContent : emptyView}
    </div>
  );
};

export default observer(TransactionBody);
