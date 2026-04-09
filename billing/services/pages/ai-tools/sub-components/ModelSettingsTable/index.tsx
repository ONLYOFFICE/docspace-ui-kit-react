import React from "react";
import { observer } from "mobx-react";
import { Consumer } from "../../../../../../utils";
import { DeviceType } from "../../../../../../enums";

import useViewEffect from "../../../../../../hooks/useViewEffect";

import TableView from "./TableView";
import RowView from "./RowView";

type ModelSettingsTableProps = {
  viewAs?: string;
  setViewAs?: (view: string) => void;
  currentDeviceType?: DeviceType;
  isDisabled: boolean;
};

const ModelSettingsTable = ({
  viewAs,
  setViewAs,
  currentDeviceType,
  isDisabled,
}: ModelSettingsTableProps) => {
  useViewEffect({
    view: viewAs!,
    setView: setViewAs!,
    currentDeviceType: currentDeviceType!,
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
