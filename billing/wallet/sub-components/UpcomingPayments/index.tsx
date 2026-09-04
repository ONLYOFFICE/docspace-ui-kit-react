import { useState } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import { Consumer } from "../../../../utils";
import { Text } from "../../../../components/text";
import { EmptyView } from "../../../../components/empty-view";
import { useCommonTranslation } from "../../../../utils/i18n";
import { useTheme } from "../../../../context/ThemeContext";

import NoSpendingIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoSpendingDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useDeviceType from "../../../hooks/useDeviceType";
import useViewEffect from "../../../../hooks/useViewEffect";

import TableView from "./TableView";
import RowView from "./RowView";
import styles from "./UpcomingPayments.module.scss";

const UpcomingPayments = () => {
  const { upcomingPayments, mobileBreakpoint, desktopBreakpoint } =
    usePaymentStore();
  const { isBase } = useTheme();
  const t = useCommonTranslation();

  const [viewAs, setViewAs] = useState("table");

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  useViewEffect({ view: viewAs, setView: setViewAs, currentDeviceType });

  const emptyView = (
    <EmptyView
      icon={isBase ? <NoSpendingIcon /> : <NoSpendingDarkIcon />}
      title={t("NoUpcomingPayments")}
      description={t("NoUpcomingPaymentsDescription")}
      options={null}
    />
  );

  return (
    <div
      className={classNames(styles.upcomingPayments, {
        [styles.rowView]: viewAs === "row",
      })}
    >
      {upcomingPayments.length ? (
        <>
          <div className={styles.introText}>
            <Text>{t("UpcomingPaymentsDescription")}</Text>
            <Text>{t("UpcomingPaymentsAutoChargeNote")}</Text>
          </div>
          <Consumer>
            {(context) =>
              viewAs === "table" ? (
                <TableView sectionWidth={context.sectionWidth || 0} />
              ) : (
                <RowView sectionWidth={context.sectionWidth || 0} />
              )
            }
          </Consumer>
        </>
      ) : (
        emptyView
      )}
    </div>
  );
};

export default observer(UpcomingPayments);

