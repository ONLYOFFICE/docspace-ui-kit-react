import React from "react";

import { RectangleSkeleton } from "../../components/rectangle";

import styles from "./Overview.module.scss";
import loaderStyles from "./OverviewLoader.module.scss";

const R = "3px";

/** Card header: title on the left, a short link/action on the right. */
const HeaderLoader = ({
  uniqueKey,
  titleWidth = "150px",
}: {
  uniqueKey: string;
  titleWidth?: string;
}) => (
  <div className={styles.cardHeader}>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width={titleWidth} height="14px" borderRadius={R} />
    <RectangleSkeleton uniqueKey={`${uniqueKey}-link`} width="60px" height="14px" borderRadius={R} />
  </div>
);

/** Shared loader for the spend / add-ons / upcoming cards: header + value + 3 rows. */
const CardListLoader = ({ uniqueKey }: { uniqueKey: string }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <RectangleSkeleton uniqueKey={`${uniqueKey}-title`} width="146px" height="16px" borderRadius={R} />
      <RectangleSkeleton uniqueKey={`${uniqueKey}-link`} width="57px" height="20px" borderRadius={R} />
    </div>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-value`} width="59px" height="24px" borderRadius={R} />
    <div className={styles.rows}>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r1l`} width="170px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r1r`} width="65px" height="20px" borderRadius={R} />
      </div>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r2l`} width="103px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r2r`} width="78px" height="20px" borderRadius={R} />
      </div>
      <div className={styles.row}>
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r3l`} width="139px" height="16px" borderRadius={R} />
        <RectangleSkeleton uniqueKey={`${uniqueKey}-r3r`} width="46px" height="20px" borderRadius={R} />
      </div>
    </div>
  </div>
);

/** List row: label on the left (optional leading icon), value on the right. */
const RowLoader = ({
  uniqueKey,
  left = "180px",
  right = "48px",
  icon = false,
}: {
  uniqueKey: string;
  left?: string;
  right?: string;
  icon?: boolean;
}) => (
  <div className={styles.row}>
    <div className={styles.addonLeft}>
      {icon ? (
        <RectangleSkeleton uniqueKey={`${uniqueKey}-icon`} width="32px" height="32px" borderRadius={R} />
      ) : null}
      <RectangleSkeleton uniqueKey={`${uniqueKey}-l`} width={left} height="14px" borderRadius={R} />
    </div>
    <RectangleSkeleton uniqueKey={`${uniqueKey}-r`} width={right} height="14px" borderRadius={R} />
  </div>
);

const OverviewLoader = () => {
  return (
    <div className={loaderStyles.loader}>
      {/* Available credits */}
      <div className={`${styles.card} ${styles.creditsCard}`}>
        <div className={styles.creditsTop}>
          <div className={loaderStyles.creditsLeft}>
            <RectangleSkeleton uniqueKey="ov-credits-title" width="132px" height="14px" borderRadius={R} />
            <RectangleSkeleton uniqueKey="ov-credits-amount" width="180px" height="28px" borderRadius={R} />
          </div>
          <RectangleSkeleton uniqueKey="ov-credits-button" width="104px" height="32px" borderRadius={R} />
        </div>
      </div>

      {/* Current plan (full width) */}
      <div className={`${styles.card} ${styles.planCard}`}>
        <div className={styles.planInfo}>
          <RectangleSkeleton uniqueKey="ov-plan-title" width="80px" height="14px" borderRadius={R} />
          <RectangleSkeleton uniqueKey="ov-plan-name" width="96px" height="20px" borderRadius={R} />
          <RectangleSkeleton uniqueKey="ov-plan-text" width="200px" height="14px" borderRadius={R} />
        </div>
        <RectangleSkeleton uniqueKey="ov-plan-button" width="120px" height="32px" borderRadius={R} />
      </div>

      {/* Month-to-date spend / active add-ons */}
      <div className={styles.grid2}>
        <CardListLoader uniqueKey="ov-spend" />
        <CardListLoader uniqueKey="ov-addons" />
      </div>

      {/* Upcoming payments / payment method */}
      <div className={styles.grid2}>
        <CardListLoader uniqueKey="ov-upcoming" />

        <div className={styles.card}>
          <HeaderLoader uniqueKey="ov-payment" />
          <div className={`${styles.rows} ${styles.cardBody}`}>
            <RowLoader uniqueKey="ov-payment-1" left="180px" right="40px" icon />
            <RowLoader uniqueKey="ov-payment-2" left="160px" right="40px" icon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewLoader;
