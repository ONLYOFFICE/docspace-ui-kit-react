import classNames from "classnames";

import AdministratorReactSvg from "../../assets/administrator.react.svg";
import OwnerReactSvg from "../../assets/owner.react.svg";
import CameraReactSvg from "../../assets/camera.react.svg";

import { IconSizeType } from "../../utils";
import type { AvatarSize, AvatarRole } from "./Avatar.enums";

import styles from "./Avatar.module.scss";

export const getRoleIcon = (role: AvatarRole) => {
  switch (role) {
    case "admin":
      return (
        <AdministratorReactSvg
          data-size={IconSizeType.scale}
          className={classNames(styles.adminIcon, "admin_icon")}
        />
      );
    case "owner":
      return (
        <OwnerReactSvg
          data-size={IconSizeType.scale}
          className={classNames(styles.ownerIcon, "owner_icon")}
        />
      );
    default:
      return null;
  }
};

const getInitials = (userName: string, isGroup: boolean) => {
  const initials = userName
    .split(/\s/)
    .reduce((response: string, word: string) => response + word.slice(0, 1), "")
    .substring(0, 2);

  return isGroup ? initials.toUpperCase() : initials;
};

export const Initials = ({
  userName,
  size,
  isGroup,
}: {
  userName: string;
  size: AvatarSize;
  isGroup: boolean;
}) => (
  <div
    className={classNames(styles.namedAvatar, { [styles.isGroup]: isGroup })}
    data-size={size}
  >
    {getInitials(userName, isGroup)}
  </div>
);

export const EmptyIcon = ({ size }: { size: IconSizeType }) => {
  return <CameraReactSvg className={styles.emptyIcon} data-size={size} />;
};
