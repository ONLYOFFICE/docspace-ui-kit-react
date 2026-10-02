import React from "react";

import { SectionFooterProps } from "../Section.types";
import styles from "../Section.module.scss";

const SectionFooter = React.memo(({ children }: SectionFooterProps) => {
  return <div className={styles.footer}>{children}</div>;
});

SectionFooter.displayName = "SectionFooter";

export default SectionFooter;
