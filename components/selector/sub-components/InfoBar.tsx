import { use } from "react";

import PublicRoomBar from "../../public-room-bar";

import { InfoBarContext } from "../contexts/InfoBar";
import type { InfoBarProps } from "../Selector.types";

export const InfoBar = ({ ref, visible, className }: InfoBarProps) => {
  const { infoBarData, withInfoBar } = use(InfoBarContext);

  if (!infoBarData || !withInfoBar || !visible) return;

  return (
    <PublicRoomBar
      ref={ref}
      headerText={infoBarData.title}
      bodyText={infoBarData.description}
      iconName={infoBarData.icon}
      onClose={infoBarData.onClose}
      className={className}
    />
  );
};

InfoBar.displayName = "InfoBar";
