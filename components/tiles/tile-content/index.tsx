import React from "react";
import styles from "./TileContent.module.scss";
import { TileContentProps } from "./TileContent.types";

export const TileContent = ({
  children,
  id,
  className,
  style,
  onClick,
}: TileContentProps) => {
  return (
    <div
      id={id}
      className={`${styles.tileContent} ${className || ""}`}
      style={style}
      onClick={onClick}
    >
      <div
        className={`${styles.mainContainerWrapper} row-main-wrapper`}
        style={{
          width:
            (React.isValidElement(children) &&
              children.props?.containerWidth) ||
            undefined,
        }}
      >
        <div className={`${styles.mainContainer} row-main-container`}>
          {children}
        </div>
      </div>
    </div>
  );
};
