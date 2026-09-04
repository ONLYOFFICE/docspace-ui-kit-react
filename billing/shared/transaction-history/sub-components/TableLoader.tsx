import React from "react";
import { RectangleSkeleton } from "../../../../components/rectangle";
import classNames from "classnames";

import styles from "../styles/TransactionHistory.module.scss";

type TableLoaderProps = {
  isMobile?: boolean;
  isTablet?: boolean;
};

const TableLoader = ({ isMobile, isTablet }: TableLoaderProps) => {
  return !isMobile && !isTablet ? (
    <div className={classNames(styles.loaderRow, styles.bodyRow)}>
      <RectangleSkeleton uniqueKey="table-body-1" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-2" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-3" height="20px" borderRadius="3px" width="100%" />
      <RectangleSkeleton uniqueKey="table-body-4" height="20px" borderRadius="3px" width="100%" />
    </div>
  ) : (
    <>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-1-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-1-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-1-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-2-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-2-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-2-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
      <div className={styles.mobileBody}>
        <div className={styles.mobileBodyLeft}>
          <RectangleSkeleton uniqueKey="table-mobile-3-title" height="20px" borderRadius="3px" width="100%" />
          <RectangleSkeleton uniqueKey="table-mobile-3-sub" height="20px" borderRadius="3px" width="114px" />
        </div>
        <RectangleSkeleton uniqueKey="table-mobile-3-badge" height="16px" borderRadius="3px" width="58px" />
      </div>
    </>
  );
};

export default TableLoader;
