import React from "react";
import { observer } from "mobx-react";

import { TableHeader } from "../../../../../components/table";
import { useCommonTranslation } from "../../../../../utils/i18n";

type TableHeaderProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  columnStorageName: string;
  columnInfoPanelStorageName: string;
  sectionWidth: number;
  itemHeight: number;
};

const InvoiceHistoryTableHeader = (props: TableHeaderProps) => {
  const t = useCommonTranslation();

  const defaultColumns = [
    {
      key: "Date",
      title: t("Date"),
      enable: true,
      resizable: true,
      default: true,
      active: true,
      minWidth: 180,
    },
    {
      key: "Amount",
      title: t("Amount"),
      enable: true,
      resizable: true,
      minWidth: 120,
    },
    {
      key: "Actions",
      title: t("Actions"),
      enable: true,
      resizable: true,
      minWidth: 140,
    },
  ];

  return (
    <TableHeader
      columns={defaultColumns}
      showSettings={false}
      useReactWindow={false}
      {...props}
    />
  );
};

export default observer(InvoiceHistoryTableHeader);
