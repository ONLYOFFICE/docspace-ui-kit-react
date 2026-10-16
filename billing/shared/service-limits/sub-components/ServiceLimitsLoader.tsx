import React from "react";
import { RectangleSkeleton } from "../../../../components/rectangle";

import styles from "../styles/ServiceLimitsLoader.module.scss";

const ServiceLimitsLoader: React.FC = () => {
  return (
    <div className={styles.container} data-testid="service_limits_loader">
      <div className={styles.description}>
        <RectangleSkeleton width="100%" height="16px" borderRadius="3px" />
        <RectangleSkeleton width="60%" height="16px" borderRadius="3px" />
      </div>

      <div className={styles.sectionHeader}>
        <RectangleSkeleton width="28px" height="16px" borderRadius="8px" />
        <RectangleSkeleton width="120px" height="16px" borderRadius="3px" />
      </div>

      <div className={styles.sectionBody}>
        <RectangleSkeleton width="320px" height="16px" borderRadius="3px" />

        <div className={styles.controls}>
          <RectangleSkeleton width="120px" height="32px" borderRadius="3px" />
          <RectangleSkeleton width="110px" height="32px" borderRadius="3px" />
        </div>

        <RectangleSkeleton width="240px" height="12px" borderRadius="3px" />
      </div>

      <div className={styles.sectionHeader}>
        <RectangleSkeleton width="28px" height="16px" borderRadius="8px" />
        <RectangleSkeleton width="120px" height="16px" borderRadius="3px" />
      </div>

      <div className={styles.sectionBody}>
        <RectangleSkeleton width="320px" height="16px" borderRadius="3px" />
      </div>
    </div>
  );
};

export default ServiceLimitsLoader;
