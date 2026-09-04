import React from "react";

import {
  RectangleSkeleton,
  RectangleSkeletonProps,
} from "../../../rectangle";

import styles from "./BreadCrumbsLoader.module.scss";

interface BreadCrumbsLoaderProps extends RectangleSkeletonProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BreadCrumbsLoader = ({ style, ...rest }: BreadCrumbsLoaderProps) => {
  return (
    <div className={styles.container} data-testid="bread-crumbs-loader">
      <RectangleSkeleton
        width="80px"
        height="22px"
        style={{ ...style }}
        {...rest}
      />
      <RectangleSkeleton
        width="12px"
        height="12px"
        style={{ ...style }}
        {...rest}
      />
      <RectangleSkeleton
        width="80px"
        height="22px"
        style={{ ...style }}
        {...rest}
      />
      <RectangleSkeleton
        width="12px"
        height="12px"
        style={{ ...style }}
        {...rest}
      />
      <RectangleSkeleton
        width="80px"
        height="22px"
        style={{ ...style }}
        {...rest}
      />
    </div>
  );
};

export default BreadCrumbsLoader;
