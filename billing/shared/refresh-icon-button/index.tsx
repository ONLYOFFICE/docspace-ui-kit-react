import React from "react";
import classNames from "classnames";

import RefreshReactSvgUrl from "../../../assets/icons/16/refresh.react.svg?url";
import { IconButton } from "../../../components/icon-button";

import styles from "./RefreshIconButton.module.scss";

type RefreshIconButtonProps = {
  onRefresh: () => void;
  isRefreshing?: boolean;
  size?: number;
  className?: string;
};

const RefreshIconButton = ({
  onRefresh,
  isRefreshing = false,
  size = 16,
  className,
}: RefreshIconButtonProps) => {
  return (
    <IconButton
      iconName={RefreshReactSvgUrl}
      size={size}
      onClick={onRefresh}
      className={classNames(styles.refreshIcon, className, {
        [styles.spinning]: isRefreshing,
      })}
    />
  );
};

export default RefreshIconButton;
