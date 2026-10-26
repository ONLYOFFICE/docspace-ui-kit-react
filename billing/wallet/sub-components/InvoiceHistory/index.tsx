import { useEffect, useState } from "react";
import { observer } from "mobx-react";

import { Consumer } from "../../../../utils";
import { EmptyView } from "../../../../components/empty-view";
import { DeviceType } from "../../../../enums";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useTheme } from "../../../../context/ThemeContext";

import NoInvoicesIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoInvoicesDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useDeviceType from "../../../hooks/useDeviceType";
import useViewEffect from "../../../../hooks/useViewEffect";
import TableLoader from "../../../shared/transaction-history/sub-components/TableLoader";

import TableView from "./TableView";
import RowView from "./RowView";
import styles from "./InvoiceHistory.module.scss";

const InvoiceHistory = () => {
  const {
    invoices,
    isInitInvoices,
    fetchInvoices,
    openInvoice,
    mobileBreakpoint,
    desktopBreakpoint,
  } = usePaymentStore();
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const [viewAs, setViewAs] = useState("table");

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  useViewEffect({ view: viewAs, setView: setViewAs, currentDeviceType });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const onOpenInvoice = (id: number) => openInvoice(id, t);

  if (!isInitInvoices) {
    return (
      <div className={styles.invoiceHistory}>
        <TableLoader
          isMobile={currentDeviceType === DeviceType.mobile}
          isTablet={currentDeviceType === DeviceType.tablet}
        />
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <EmptyView
        icon={isBase ? <NoInvoicesIcon /> : <NoInvoicesDarkIcon />}
        title={t("NoInvoices")}
        description={t("NoInvoicesDescription")}
        options={null}
      />
    );
  }

  return (
    <div className={styles.invoiceHistory}>
      <Consumer>
        {(context) =>
          viewAs === "table" ? (
            <TableView
              sectionWidth={context.sectionWidth || 0}
              invoices={invoices}
              onOpenInvoice={onOpenInvoice}
            />
          ) : (
            <RowView
              sectionWidth={context.sectionWidth || 0}
              invoices={invoices}
              onOpenInvoice={onOpenInvoice}
            />
          )
        }
      </Consumer>
    </div>
  );
};

export default observer(InvoiceHistory);
