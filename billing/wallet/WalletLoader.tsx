import React from "react";
import { RectangleSkeleton } from "../../components/rectangle";
import classNames from "classnames";

import styles from "../shared/transaction-history/styles/TransactionHistory.module.scss";
import TableLoader from "../shared/transaction-history/sub-components/TableLoader";

type WalletLoaderProps = {
  isMobile?: boolean;
  isTablet?: boolean;
};

const WalletLoader: React.FC<WalletLoaderProps> = ({
  isMobile,
  isTablet,
}) => {
  const loaderClassName = classNames(styles.transactionHistoryLoader, {
    [styles.isTablet]: isTablet,
  });

  return (
    <div className={loaderClassName}>
      <div className={styles.descriptionRow}>
        <RectangleSkeleton uniqueKey="wallet-desc-1" height="40px" borderRadius="3px" width="100%" />
        <RectangleSkeleton uniqueKey="wallet-desc-2" height="20px" borderRadius="3px" width="73px" />
      </div>

      <RectangleSkeleton
        uniqueKey="wallet-payment"
        className={styles.paymentLoader}
        height="72px"
        borderRadius="3px"
        width="100%"
      />

      <div className={styles.balanceRow}>
        <RectangleSkeleton
          uniqueKey="wallet-balance-1"
          className={styles.rectangleSkeleton}
          height="22px"
          borderRadius="3px"
          width="64px"
        />
        <RectangleSkeleton
          uniqueKey="wallet-balance-2"
          className={styles.rectangleSkeleton}
          height="60px"
          borderRadius="3px"
          width="152px"
        />
        <RectangleSkeleton
          uniqueKey="wallet-balance-3"
          className={styles.rectangleSkeleton}
          height="32px"
          borderRadius="3px"
          width={isMobile || isTablet ? "100%" : "152px"}
        />
      </div>

      {!isMobile && !isTablet ? (
        <>
          <RectangleSkeleton
            uniqueKey="wallet-flexible-label"
            className={styles.flexibleLoader}
            height="22px"
            borderRadius="3px"
            width="156px"
          />
          <div className={classNames(styles.loaderRow, styles.headerRow)}>
            <RectangleSkeleton
              uniqueKey="wallet-header-1"
              className={styles.flexibleLoader}
              height="32px"
              borderRadius="3px"
            />
            <RectangleSkeleton
              uniqueKey="wallet-header-2"
              className={styles.flexibleLoader}
              height="32px"
              borderRadius="3px"
            />
            <RectangleSkeleton
              uniqueKey="wallet-header-3"
              className={styles.flexibleLoader}
              height="32px"
              borderRadius="3px"
            />
          </div>

          <div className={classNames(styles.loaderRow, styles.dataRow)}>
            <RectangleSkeleton
              uniqueKey="wallet-row-1"
              className={styles.fixedLoader}
              height="16px"
              borderRadius="3px"
            />
            <RectangleSkeleton
              uniqueKey="wallet-row-2"
              className={styles.fixedLoader}
              height="16px"
              borderRadius="3px"
            />
            <RectangleSkeleton
              uniqueKey="wallet-row-3"
              className={styles.fixedLoader}
              height="16px"
              borderRadius="3px"
            />
            <RectangleSkeleton
              uniqueKey="wallet-row-4"
              className={classNames(styles.fixedLoader, styles.lastChild)}
              height="16px"
              borderRadius="3px"
            />
          </div>

          <TableLoader isMobile={isMobile} isTablet={isTablet} />
        </>
      ) : (
        <TableLoader isMobile={isMobile} isTablet={isTablet} />
      )}
    </div>
  );
};

export default WalletLoader;
