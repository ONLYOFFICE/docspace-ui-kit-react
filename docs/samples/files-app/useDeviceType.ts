import { useEffect, useState } from "react";

import { DeviceType } from "../../../enums";
import { isMobile, isTablet } from "../../../utils/device";

/**
 * The portal's three device types, read off the viewport.
 *
 * The kit's layout components take the type as a prop rather than measuring
 * anything themselves, because on the portal it is one store value every
 * screen agrees on; here the window is that store. `Article` derives its
 * collapsed and mobile forms from the prop, so a constant would leave the
 * sidebar unable to fold and the main button unable to follow it.
 */
const deviceTypeOf = () =>
  isMobile()
    ? DeviceType.mobile
    : isTablet()
      ? DeviceType.tablet
      : DeviceType.desktop;

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    typeof window === "undefined" ? DeviceType.desktop : deviceTypeOf(),
  );

  useEffect(() => {
    const update = () => setDeviceType(deviceTypeOf());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceType;
};
