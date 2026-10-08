import { useEffect, use } from "react";
import { isMobile as isMobileDevice } from "react-device-detect";

import { DeviceType } from "../../enums";
import { isTablet, isMobile } from "../../utils/device";
import { Context } from "../../utils/context";

type UseViewEffectProps = {
  view: string;
  setView: (view: string) => void;
  currentDeviceType: DeviceType;
};

type ContextType = {
  sectionWidth?: number;
  sectionHeight?: number;
};

const useViewEffect = ({
  view,
  setView,
  currentDeviceType,
}: UseViewEffectProps) => {
  const { sectionWidth } = use<ContextType>(Context);

  useEffect(() => {
    const isNotRowView = view !== "row";
    const isNotTableView = view !== "table";

    if ((isNotTableView && isNotRowView) || !sectionWidth) return;

    if (
      isMobileDevice ||
      ((isTablet() || isMobile()) && currentDeviceType !== DeviceType.desktop)
    ) {
      if (isNotRowView) setView("row");
    } else if (isNotTableView) {
      setView("table");
    }
  }, [sectionWidth, currentDeviceType, view, setView]);
};

export default useViewEffect;
