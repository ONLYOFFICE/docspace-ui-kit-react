import React from "react";

import DefaultIcon from "../../../assets/default.react.svg";
import RootIcon from "../../../assets/root.react.svg";
import DefaultTabletIcon from "../../../assets/default.tablet.react.svg";
import RootTabletIcon from "../../../assets/root.tablet.react.svg";

import { DeviceType } from "../../../enums";

import { Text } from "../../text";

import styles from "../Navigation.module.scss";
import { TNavigationItemProps } from "../Navigation.types";

const Item = ({
  id,
  title,
  isRoot,
  isRootRoom,
  onClick,
  withLogo,
  currentDeviceType,
  isRootTemplates,
  ...rest
}: TNavigationItemProps) => {
  const onClickAvailable = () => {
    onClick?.(id, isRootRoom, isRootTemplates);
  };

  return (
    <div
      id={`${id}`}
      className={styles.item}
      onClick={onClickAvailable}
      data-root={isRoot ? "true" : "false"}
      data-with-logo={withLogo ? "true" : "false"}
      {...rest}
    >
      <div className={styles.itemWrapper}>
        {currentDeviceType !== DeviceType.desktop ? (
          isRoot ? (
            <RootTabletIcon />
          ) : (
            <DefaultTabletIcon />
          )
        ) : isRoot ? (
          <RootIcon />
        ) : (
          <DefaultIcon />
        )}
      </div>

      <Text
        fontWeight={isRoot ? "600" : "400"}
        fontSize="15px"
        truncate
        title={title}
        className={styles.text}
        data-root={isRoot ? "true" : "false"}
        noSelect
      >
        {title}
      </Text>
    </div>
  );
};

export default React.memo(Item);
