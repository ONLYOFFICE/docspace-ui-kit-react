import React from "react";
import classNames from "classnames";

import {
  RectangleSkeleton,
  RectangleSkeletonProps,
} from "../../../rectangle";

import styles from "./RowLoader.module.scss";

interface RowLoaderProps extends RectangleSkeletonProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  isMultiSelect?: boolean;
  isContainer?: boolean;
  isUser?: boolean;
  withAllSelect?: boolean;
  count?: number;
}

const RowLoader = ({
  id,
  className,
  style,
  isMultiSelect,
  isContainer,
  isUser,
  withAllSelect,
  count = 5,
  ...rest
}: RowLoaderProps) => {
  const getRowItem = (key: number) => {
    return (
      <div
        id={id}
        className={classNames(
          styles.item,
          { [styles.isUser]: isUser },
          className,
        )}
        style={style}
        key={`selector-row-${key}`}
        {...rest}
      >
        <RectangleSkeleton className="avatar" width="32px" height="32px" />
        <RectangleSkeleton width="212px" height="16px" />
        {isMultiSelect ? (
          <RectangleSkeleton className="checkbox" width="16px" height="16px" />
        ) : null}
      </div>
    );
  };

  const getRowItems = () => {
    const rows = [];
    for (let i = 0; i < count; i += 1) {
      rows.push(getRowItem(i));
    }

    return rows;
  };

  return isContainer ? (
    <div
      id={id}
      className={classNames(styles.container, className)}
      key="test"
      style={style}
      {...rest}
      data-testid="row-loader"
    >
      {withAllSelect ? (
        <>
          {getRowItem(-1)}
          <div className={styles.divider} />
        </>
      ) : null}
      {getRowItems()}
    </div>
  ) : (
    getRowItem(0)
  );
};

export default RowLoader;
