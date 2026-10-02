import React from "react";
import classNames from "classnames";

import { InfiniteLoaderComponent } from "../../infinite-loader";
import { RowContainerProps } from "./RowContainer.types";
import styles from "./RowContainer.module.scss";

const RowContainer = (props: RowContainerProps) => {
  const {
    manualHeight,
    itemHeight = 50,
    children,
    useReactWindow = true,
    id = "rowContainer",
    className,
    style,
    onScroll,
    filesLength,
    itemCount,
    fetchMoreFiles,
    hasMoreFiles,
    noSelect,
  } = props;

  const containerStyle = manualHeight
    ? ({ ...style, "--manual-height": manualHeight } as React.CSSProperties)
    : style;

  return (
    <div
      id={id}
      className={classNames(styles.container, className, {
        [styles.useReactWindow]: useReactWindow,
        [styles.manualHeight]: manualHeight,
        [styles.noSelect]: noSelect,
      })}
      style={containerStyle}
      data-testid="row-container"
    >
      {useReactWindow ? (
        <InfiniteLoaderComponent
          className="List"
          viewAs="row"
          hasMoreFiles={hasMoreFiles ?? false}
          filesLength={filesLength ?? 0}
          itemCount={itemCount ?? 0}
          loadMoreItems={fetchMoreFiles ?? (() => Promise.resolve())}
          itemSize={itemHeight}
          onScroll={onScroll}
        >
          {children}
        </InfiniteLoaderComponent>
      ) : (
        children
      )}
    </div>
  );
};

export { RowContainer };
