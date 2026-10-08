import { useEffect, useRef, useState } from "react";

import { Scrollbar, ScrollbarType } from "../../scrollbar";
import { SubInfoPanelBodyProps } from "../Section.types";
import styles from "../Section.module.scss";

const SubInfoPanelBody = ({
  children,
  isInfoPanelScrollLocked,
  withoutScroll,
}: SubInfoPanelBodyProps) => {
  const scrollRef = useRef<ScrollbarType>(null);
  const [scrollYPossible, setScrollYPossible] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(
    scrollYPossible && isInfoPanelScrollLocked,
  );

  useEffect(() => {
    const valueScrollYPossible =
      scrollRef.current?.scrollValues?.scrollYPossible;

    if (scrollRef.current && valueScrollYPossible !== scrollYPossible)
      setScrollYPossible(valueScrollYPossible ?? false);
  }, [scrollRef?.current?.scrollValues?.scrollYPossible, scrollYPossible]);

  useEffect(() => {
    if (scrollYPossible && isInfoPanelScrollLocked !== scrollLocked)
      setScrollLocked(scrollYPossible && isInfoPanelScrollLocked);
  }, [scrollYPossible, isInfoPanelScrollLocked, scrollLocked]);

  // Prevent triggering main scroll if infopanel's scroll is focused
  useEffect(() => {
    const scrollBody = scrollRef.current?.contentElement;
    const onKeyDown = (e: KeyboardEvent) => {
      const isScrollKey =
        ["PageUp", "PageDown", "Home", "End"].indexOf(e.code) > -1;

      if (isScrollKey) {
        e.stopPropagation();
      }
    };

    scrollBody?.addEventListener("keydown", onKeyDown);

    return () => {
      scrollBody?.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (withoutScroll) return children;

  return (
    <Scrollbar
      ref={scrollRef}
      noScrollY={scrollLocked}
      scrollClass="section-scroll info-panel-scroll"
      createContext
      className={styles.scrollbar}
      id="info-panel-body"
    >
      {children}
    </Scrollbar>
  );
};

SubInfoPanelBody.displayName = "SubInfoPanelBody";

export default SubInfoPanelBody;
