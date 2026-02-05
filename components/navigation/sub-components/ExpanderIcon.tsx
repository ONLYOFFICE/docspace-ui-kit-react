import React from "react";
import ExpanderDownIcon from "../../../assets/expander-down.react.svg";
import styles from "../Navigation.module.scss";

interface ExpanderIconProps {
  isRotated?: boolean;
}

const ExpanderIcon = ({ isRotated }: ExpanderIconProps) => {
  return (
    <ExpanderDownIcon
      className={`${styles.expanderIcon} ${isRotated ? styles.rotated : ""}`}
    />
  );
};

export default ExpanderIcon;
