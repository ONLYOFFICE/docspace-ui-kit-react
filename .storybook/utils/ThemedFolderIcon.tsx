import React from "react";
import classNames from "classnames";

import CatalogFolderReactSvg from "../../assets/icons/16/catalog.folder.react.svg";

import styles from "./ThemedFolderIcon.module.scss";

const ThemedFolderIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <CatalogFolderReactSvg
    {...props}
    className={classNames(styles.icon, className)}
  />
);

export default ThemedFolderIcon;
