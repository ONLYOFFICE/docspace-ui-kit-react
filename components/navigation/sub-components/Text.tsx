import React from "react";
import { Badge } from "../../badge";

import styles from "../Navigation.module.scss";
import { TTextProps } from "../Navigation.types";

import ArrowIcon from "./ArrowIcon";
import Heading from "./Heading";
import ExpanderIcon from "./ExpanderIcon";

const Text = ({
  title,
  isOpen,
  isRootFolder,
  isRootFolderTitle,
  onClick,
  badgeLabel,
  className,
  titleTooltip,
  ...rest
}: TTextProps) => {
  return (
    <div
      className={`${className} ${styles.textContainer}`}
      onClick={onClick}
      data-root-folder={isRootFolder}
      data-root-folder-title={isRootFolderTitle}
      {...rest}
    >
      <Heading
        title={titleTooltip ?? title}
        truncate
        isRootFolderTitle={isRootFolderTitle}
      >
        {title}
      </Heading>
      {badgeLabel ? (
        <Badge
          className={`${styles.titleBlockBadge} ${isRootFolderTitle ? styles.rootFolderTitle : ""}`}
          label={badgeLabel}
          fontSize="9px"
          padding="2px 5px"
          fontWeight={700}
          borderRadius="50px"
          noHover
          isHovered={false}
        />
      ) : null}
      {isRootFolderTitle ? <ArrowIcon /> : null}
      {!isRootFolderTitle && !isRootFolder ? (
        <ExpanderIcon isRotated={isOpen} />
      ) : null}
    </div>
  );
};

export default React.memo(Text);
