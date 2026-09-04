import { memo } from "react";
import { SubInfoPanelHeaderProps } from "../Section.types";

const SubInfoPanelHeader = memo(({ children }: SubInfoPanelHeaderProps) => {
  return children;
});

SubInfoPanelHeader.displayName = "SubInfoPanelHeader";

export default SubInfoPanelHeader;
