import { useState, useEffect } from "react";
import { mobile, isMobile as isMobileUtil } from "../../utils/device";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => isMobileUtil());

  useEffect(() => {
    setIsMobile(isMobileUtil());

    const mql = window.matchMedia(mobile);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
