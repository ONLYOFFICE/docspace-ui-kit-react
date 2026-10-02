import React from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";

import styles from "./ArticleFolderLoader.module.scss";
import { FolderLoaderProps } from "./FolderLoader.types";

export const ArticleFolderLoader = ({
  id,
  className,
  style,
  showText,
  isVisitor,
  ...rest
}: FolderLoaderProps) => {
  return (
    <div
      id={id}
      className={`${styles.container} ${className || ""}`}
      style={style}
      data-show-text={showText}
      data-testid="article-folder-loader"
    >
      {isVisitor ? (
        <>
          <div
            className={styles.block}
            data-show-text={showText ? "true" : "false"}
            data-testid="article-folder-loader-block"
          >
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
          </div>

          <div
            className={styles.block}
            data-show-text={showText ? "true" : "false"}
            data-testid="article-folder-loader-block"
          >
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={styles.block}
            data-show-text={showText ? "true" : "false"}
            data-testid="article-folder-loader-block"
          >
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
          </div>

          <div
            className={styles.block}
            data-show-text={showText ? "true" : "false"}
            data-testid="article-folder-loader-block"
          >
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
            <RectangleSkeleton
              {...rest}
              className={classNames(styles.rectangle, "article-folder-loader")}
            />
          </div>
        </>
      )}
    </div>
  );
};
