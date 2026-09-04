import React from "react";
import classNames from "classnames";

import {
  RectangleSkeleton,
  RectangleSkeletonProps,
} from "../../../rectangle";

import styles from "./SearchLoader.module.scss";

interface SearchLoaderProps extends RectangleSkeletonProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SearchLoader = ({
  className,
  style,

  ...rest
}: SearchLoaderProps) => {
  return (
    <RectangleSkeleton
      height="32px"
      className={classNames(styles.search, className)}
      style={{
        paddingBlock: "0",
        paddingInline: "16px 0",
        marginBottom: "8px",
        ...style,
      }}
      {...rest}
    />
  );
};

export default SearchLoader;
