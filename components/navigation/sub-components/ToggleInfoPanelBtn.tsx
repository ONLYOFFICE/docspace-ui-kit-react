import React from "react";

import PanelReactSvg from "../../../assets/panel.react.svg";

import { IconButton } from "../../icon-button";

import styles from "../Navigation.module.scss";
import { TToggleInfoPanelButtonProps } from "../Navigation.types";

const ToggleInfoPanelButton = ({
  toggleInfoPanel,
  id,
  titles,
  isRootFolder,
  isInfoPanelVisible,
}: TToggleInfoPanelButtonProps) => {
  return (
    <div
      className={styles.infoPanelToggleWrapper}
      data-visible={isInfoPanelVisible ? "true" : "false"}
      data-root-folder={isRootFolder ? "true" : "false"}
    >
      <div className="info-panel-toggle-bg">
        <IconButton
          id={id}
          className="info-panel-toggle"
          iconNode={<PanelReactSvg />}
          size={16}
          isFill
          title={titles?.infoPanel}
          onClick={toggleInfoPanel}
        />
      </div>
    </div>
  );
};

export default ToggleInfoPanelButton;
