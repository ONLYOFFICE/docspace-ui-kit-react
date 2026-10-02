import React from "react";
import classNames from "classnames";

import { InfiniteLoaderComponent } from "../../infinite-loader";

import { TableBodyProps } from "../Table.types";
import styles from "./TableBody.module.scss";

const TableBodyPure = (props: TableBodyProps) => {
  const {
    columnStorageName,
    columnInfoPanelStorageName,
    fetchMoreFiles,
    children,
    filesLength,
    hasMoreFiles,
    itemCount,
    itemHeight = 41,
    useReactWindow = true,
    onScroll,
    infoPanelVisible = false,
  } = props;

  if (!columnStorageName || !columnInfoPanelStorageName) return <div />;

  const classes = classNames(styles.tableBody, "table-container_body", {
    [styles.useReactWindow]: useReactWindow,
    [styles.infoPanelVisible]: infoPanelVisible,
  });

  return useReactWindow ? (
    <div className={classes} data-testid="table-body">
      <InfiniteLoaderComponent
        className="TableList"
        viewAs="table"
        hasMoreFiles={hasMoreFiles}
        filesLength={filesLength}
        itemCount={itemCount}
        loadMoreItems={fetchMoreFiles}
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        itemSize={itemHeight}
        onScroll={onScroll}
        infoPanelVisible={infoPanelVisible}
      >
        {children}
      </InfiniteLoaderComponent>
    </div>
  ) : (
    <div data-testid="table-body" className={classes}>
      {children}
    </div>
  );
};

const TableBody = React.memo(TableBodyPure);

export { TableBody };
