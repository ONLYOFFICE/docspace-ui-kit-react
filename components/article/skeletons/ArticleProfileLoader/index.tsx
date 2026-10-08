import React from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";

import styles from "./ArticleProfileLoader.module.scss";
import { ProfileLoaderProps } from "./ProfileLoader.types";

export const ArticleProfileLoader = ({
  id,
  className,
  style,
  showText,
}: ProfileLoaderProps) => {
  return (
    <div
      id={id}
      className={classNames(styles.container, className)}
      style={style}
      data-testid="article-profile-loader"
      data-show-text={showText ? "true" : "false"}
    >
      <div className={styles.block}>
        {showText ? (
          <>
            <RectangleSkeleton width="40px" height="40px" borderRadius="50%" />
            <RectangleSkeleton width="131px" height="18px" className="title" />
            <RectangleSkeleton
              width="16px"
              height="16px"
              className="option-button"
            />
          </>
        ) : (
          <RectangleSkeleton width="32px" height="32px" borderRadius="50%" />
        )}
      </div>
    </div>
  );
};
