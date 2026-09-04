import React from "react";

import { SectionSubmenuProps } from "../Section.types";
import styles from "../Section.module.scss";

const SectionSubmenu = React.memo(({ children }: SectionSubmenuProps) => {
  return <div className={`${styles.submenu} section-tabs`}>{children}</div>;
});

SectionSubmenu.displayName = "SectionSubmenu";

export default SectionSubmenu;
