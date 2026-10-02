import React from "react";
import { Text } from "../../../components/text";

import styles from "../styles/ServiceComponents.module.scss";

interface ServiceContentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceContent: React.FC<ServiceContentProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className={styles.serviceContent}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.serviceInfo}>
        <Text fontSize="12px" fontWeight={600}>
          {title}
        </Text>
        <Text fontSize="10px" className={styles.serviceDescription}>
          {description}
        </Text>
      </div>
    </div>
  );
};

export default ServiceContent;
