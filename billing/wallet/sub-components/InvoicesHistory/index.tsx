import { useState } from "react";
import { observer } from "mobx-react";

import { Consumer } from "../../../../utils";
import { EmptyView } from "../../../../components/empty-view";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useTheme } from "../../../../context/ThemeContext";

import NoInvoicesIcon from "../../../../assets/no.transactions.react.svg";
import NoInvoicesDarkIcon from "../../../../assets/no.transactions.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useDeviceType from "../../../hooks/useDeviceType";
import useViewEffect from "../../../../hooks/useViewEffect";

import TableView from "./TableView";
import RowView from "./RowView";
import { FAKE_INVOICES } from "./fakeInvoices";
import styles from "./InvoicesHistory.module.scss";

const InvoicesHistory = () => {
  const { mobileBreakpoint, desktopBreakpoint } = usePaymentStore();
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const invoices = FAKE_INVOICES;

  const [viewAs, setViewAs] = useState("table");

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  useViewEffect({ view: viewAs, setView: setViewAs, currentDeviceType });

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
    <div className={styles.invoicesHistory}>
      <Consumer>
        {(context) =>
          viewAs === "table" ? (
            <TableView
              sectionWidth={context.sectionWidth || 0}
              invoices={invoices}
            />
          ) : (
            <RowView
              sectionWidth={context.sectionWidth || 0}
              invoices={invoices}
            />
          )
        }
      </Consumer>
    </div>
  );
};

export default observer(InvoicesHistory);
