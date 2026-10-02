import React from "react";
import { TooltipContainer } from "../../tooltip";
import styles from "../Navigation.module.scss";

const WarningComponent = ({
  title,
  icon,
}: {
  title?: React.ReactNode;
  icon?: string;
}) => {
  const tooltip = typeof title === "string" ? title : undefined;

  return (
    <TooltipContainer
      as="div"
      className={`${styles.warningText} ${icon ? styles.warningTextWithIcon : ""}`}
      title={tooltip}
    >
      {icon && <img src={icon} alt="" className={styles.warningIcon} />}
      <div className="warning-text">{title}</div>
    </TooltipContainer>
  );
};

export default WarningComponent;
