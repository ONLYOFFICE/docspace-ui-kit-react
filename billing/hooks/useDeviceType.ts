import { useState, useEffect, useCallback } from "react";

import { DeviceType } from "../../enums";
import { size as defaultSize } from "../../utils/device";

type Breakpoints = {
  mobile: number;
  desktop: number;
};

const getDeviceType = (
  width: number,
  breakpoints: Breakpoints = {
    mobile: defaultSize.mobile,
    desktop: defaultSize.desktop,
  },
): DeviceType => {
  if (width <= breakpoints.mobile) return DeviceType.mobile;
  if (width < breakpoints.desktop) return DeviceType.tablet;
  return DeviceType.desktop;
};

const getWindowWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : defaultSize.desktop;

const useDeviceType = (breakpoints?: Partial<Breakpoints>): DeviceType => {
  const mobile = breakpoints?.mobile ?? defaultSize.mobile;
  const desktop = breakpoints?.desktop ?? defaultSize.desktop;
  const bp: Breakpoints = { mobile, desktop };

  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    getDeviceType(getWindowWidth(), bp),
  );

  const onResize = useCallback(() => {
    setDeviceType(getDeviceType(window.innerWidth, bp));
  }, [mobile, desktop]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return deviceType;
};

export default useDeviceType;
