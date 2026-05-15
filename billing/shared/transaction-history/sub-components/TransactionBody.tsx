/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useState, type CSSProperties } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";
import { useTheme } from "../../../../context/ThemeContext";

import { EmptyView } from "../../../../components/empty-view";

import { Consumer } from "../../../../utils";

import NoTransactionsFilterIcon from "../../../../assets/no.transactions.react.svg";
import NoTransactionsFilterDarkIcon from "../../../../assets/no.transactions.dark.theme.react.svg";
import NoTransactionsIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoTransactionsDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useViewEffect from "../../../../hooks/useViewEffect";
import useDeviceType from "../../../hooks/useDeviceType";

import styles from "../styles/TransactionHistory.module.scss";

import TableView from "./TableView";
import RowView from "./RowView";

type TransactionHistoryProps = {
  isTransactionHistoryExist: boolean;
  hasAppliedDateFilter: boolean;
  serviceName?: string;
  maxWidth?: number | string;
};

const TransactionBody = ({
  hasAppliedDateFilter,
  isTransactionHistoryExist,
  serviceName,
  maxWidth,
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

  const title = hasAppliedDateFilter
    ? t("NoFindingsFound2")
    : t("NoWalletTransaction");
  const description = hasAppliedDateFilter
    ? t("NoTransactionsFilter")
    : t("NoWalletTransactionDescription");

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

