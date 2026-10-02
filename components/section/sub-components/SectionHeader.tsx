import React from "react";
import classNames from "classnames";

import { SectionHeaderProps } from "../Section.types";
import styles from "../Section.module.scss";

const SectionHeader = (props: SectionHeaderProps) => {
  const { className, ...rest } = props;

  return (
    <div
      className={classNames(`section-header`, className, styles.header)}
      {...rest}
    />
  );
};

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
