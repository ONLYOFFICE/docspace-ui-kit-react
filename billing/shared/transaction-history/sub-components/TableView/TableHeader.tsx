import React from "react";
import { useCommonTranslation } from "../../../../../utils/i18n";

import { TableHeader } from "../../../../../components/table";
import { AI_TOOLS } from "../../../../constants";

type TableHeaderProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  columnStorageName: string;
  columnInfoPanelStorageName: string;
  sectionWidth: number;
  itemHeight: number;
  serviceName?: string;
};

const TransactionHistoryTableHeader = (props: TableHeaderProps) => {
  const { serviceName, ...rest } = props;
  const t = useCommonTranslation();

  const isAiTools = serviceName === AI_TOOLS;

  const defaultColumns = [
    {
      key: "Date",
      title: t("Date"),
      enable: true,
      resizable: true,
      sortBy: "AZ",
      active: true,
      minWidth: 150,
    },
    ...(isAiTools
      ? [
          {
            key: "Source",
            title: t("Source"),
            enable: true,
            resizable: true,
            minWidth: 150,
          },
        ]
      : []),
    {
      key: "Type",
      title: t("Type"),
      enable: true,
      resizable: true,
      minWidth: 120,
    },
    {
      key: "Contact",
      title: t("Contact"),
      enable: true,
      resizable: true,
      minWidth: 120,
    },
    {
      key: "Quantity",
      title: t("Quantity"),
      enable: true,
      resizable: true,
      minWidth: 150,
    },
    {
      key: "Amount",
      title: t("Amount"),
      enable: true,
      resizable: true,
      minWidth: 120,
    },
  ];

  return (
    <TableHeader
      columns={defaultColumns}
      showSettings={false}
      useReactWindow
      {...rest}
    />
  );
};

export default TransactionHistoryTableHeader;

