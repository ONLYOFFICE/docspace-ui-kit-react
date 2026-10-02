import React from "react";
import classNames from "classnames";
import SendClockIcon from "../../../assets/send.clock.react.svg";
import styles from "../PeopleSelector.module.scss";

interface SendClockIconProps {
  className?: string;
}

const StyledSendClockIcon: React.FC<SendClockIconProps> = ({ className }) => {
  return (
    <SendClockIcon className={classNames(styles.sendClockIcon, className)} />
  );
};

export default StyledSendClockIcon;
