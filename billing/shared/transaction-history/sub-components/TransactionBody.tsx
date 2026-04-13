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
import { useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { observer } from "mobx-react";
import { useTheme } from "../../../../context/ThemeContext";

import { EmptyView } from "../../../../components/empty-view";

import { Consumer } from "../../../../utils";

import NoTransactionsIcon from "../../../../assets/no.transactions.react.svg";
import NoTransactionsFilterIcon from "../../../../assets/no.transactions.filter.react.svg";
import NoTransactionsFilterDarkIcon from "../../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import useViewEffect from "../../../../hooks/useViewEffect";
import useDeviceType from "../../../hooks/useDeviceType";

import TableView from "./TableView";
import RowView from "./RowView";

type TransactionHistoryProps = {
  isTransactionHistoryExist: boolean;
  hasAppliedDateFilter: boolean;
  serviceName?: string;
};

const TransactionBody = ({
  hasAppliedDateFilter,
  isTransactionHistoryExist,
  serviceName,
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
      icon={hasAppliedDateFilter ? filterIcon : <NoTransactionsIcon />}
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

  return isTransactionHistoryExist ? renderContent : emptyView;
};

export default observer(TransactionBody);

