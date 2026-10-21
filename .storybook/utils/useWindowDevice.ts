import { useEffect, useState } from "react";

import { DeviceType } from "../../enums";
import { isMobile, isTablet } from "../../utils/device";

export const deviceFor = (width: number) => {
  if (isMobile(width)) return DeviceType.mobile;
  if (isTablet(width)) return DeviceType.tablet;
  return DeviceType.desktop;
};

export const useWindowDevice = () => {
  const [device, setDevice] = useState(() => deviceFor(window.innerWidth));

  useEffect(() => {
    const update = () => setDevice(deviceFor(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
};
