import React from "react";

import { DeviceType } from "../../../enums";
import { isMobile, isTablet } from "../../../utils/device";

// Self-contained device-type hook for the file selectors/dialogs. Mirrors a
// resize listener rather than reading a store so the dialogs need no MobX
// wiring.
const useDeviceType = () => {
  const [currentDeviceType, setCurrentDeviceType] = React.useState(
    DeviceType.desktop,
  );

  const onResize = React.useCallback(() => {
    if (isMobile()) return setCurrentDeviceType(DeviceType.mobile);
    if (isTablet()) return setCurrentDeviceType(DeviceType.tablet);

    return setCurrentDeviceType(DeviceType.desktop);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined")
      window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return { currentDeviceType };
};

export default useDeviceType;
