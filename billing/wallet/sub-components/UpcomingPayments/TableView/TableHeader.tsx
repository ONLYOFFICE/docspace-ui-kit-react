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

const UpcomingPaymentsTableHeader = (props: TableHeaderProps) => {
  const t = useCommonTranslation();

  const defaultColumns = [
    {
      key: "RenewalDate",
      title: t("RenewalDate"),
      enable: true,
      resizable: true,
      default: true,
      active: true,
      minWidth: 140,
    },
    {
      key: "Type",
      title: t("Type"),
      enable: true,
      resizable: true,
      minWidth: 160,
    },
    {
      key: "Details",
      title: t("Details"),
      enable: true,
      resizable: true,
      minWidth: 140,
    },
    {
      key: "Amount",
      title: t("Amount"),
      enable: true,
      resizable: true,
      minWidth: 120,
    },
    {
      key: "Action",
      title: "",
      enable: true,
      resizable: false,
      minWidth: 120,
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

export default observer(UpcomingPaymentsTableHeader);
