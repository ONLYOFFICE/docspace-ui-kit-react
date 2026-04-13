import { useState } from "react";
import { observer } from "mobx-react";
import { Consumer } from "../../../../../../utils";

import useViewEffect from "../../../../../../hooks/useViewEffect";
import useDeviceType from "../../../../../hooks/useDeviceType";
import { usePaymentStore } from "../../../../../store/PaymentStoreProvider";

import TableView from "./TableView";
import RowView from "./RowView";

type ModelSettingsTableProps = {
  isDisabled: boolean;
};

const ModelSettingsTable = ({ isDisabled }: ModelSettingsTableProps) => {
  const { mobileBreakpoint, desktopBreakpoint } = usePaymentStore();

  const [viewAs, setViewAs] = useState("row");

  const currentDeviceType = useDeviceType({
    mobile: mobileBreakpoint,
    desktop: desktopBreakpoint,
  });

  useViewEffect({
    view: viewAs,
    setView: setViewAs,
    currentDeviceType,
  });

  return (
    <Consumer>
      {(context) =>
        viewAs === "table" ? (
          <TableView
            sectionWidth={context.sectionWidth || 0}
            isDisabled={isDisabled}
          />
        ) : (
          <RowView
            sectionWidth={context.sectionWidth || 0}
            isDisabled={isDisabled}
          />
        )
      }
    </Consumer>
  );
};

export default observer(ModelSettingsTable);

