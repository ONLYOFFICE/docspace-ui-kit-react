import { useState, useEffect } from "react";
import { desktop, isDesktop as isDesktopUtil } from "../../utils/device";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => typeof window !== "undefined" && isDesktopUtil(),
  );

  useEffect(() => {
    const mql = window.matchMedia(desktop);
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
