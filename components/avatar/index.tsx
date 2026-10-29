"use client";

import React, { memo } from "react";
import classNames from "classnames";

import AvatarBaseReactSvgUrl from "../../assets/avatar.base.react.svg";
import AvatarDarkReactSvgUrl from "../../assets/avatar.dark.react.svg";
import PencilReactSvgUrl from "../../assets/pencil.react.svg";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg";

import { IconSizeType, useClickOutside } from "../../utils";

import { useInterfaceDirection, useTheme } from "../../context";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";

import { IconButton } from "../icon-button";
import { Text } from "../text";
import { type TGetTooltipContent, Tooltip } from "../tooltip";

import styles from "./Avatar.module.scss";

import type { AvatarProps, TAvatarModel } from "./Avatar.types";
import { AvatarRole, AvatarSize, AvatarActionKeys } from "./Avatar.enums";
import { getRoleIcon, Initials, EmptyIcon, isSvgSource } from "./Avatar.utils";

export {
  type AvatarProps,
  type TAvatarModel,
  AvatarRole,
  AvatarSize,
  AvatarActionKeys,
};

const AvatarPure = ({
  size,
  source,
  userName,
  role,
  editing,
  isDefaultSource = false,
  hideRoleIcon,
  tooltipContent,
  withTooltip,
  className,
  onClick,
  isGroup = false,
  roleIcon: roleIconProp,
  onChangeFile,
  model,
  hasAvatar,
  noClick = false,
  isNotIcon = false,
  imgClassName = "",
  dataTestId,
}: AvatarProps) => {
  const { isRTL } = useInterfaceDirection();
  const { isBase } = useTheme();

  const iconRef = React.useRef<HTMLDivElement>(null);
  const inputFilesElement = React.useRef<HTMLInputElement>(null);

  const [openEditLogo, setOpenLogoEdit] = React.useState<boolean>(false);

  const instanceId = React.useId();

  const onToggleOpenEditLogo = () => setOpenLogoEdit((open) => !open);

  // The pencil sits inside the avatar, whose own handler toggles the menu
  // as well; the pencil keeps its click to itself so it counts once.
  const onEditButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleOpenEditLogo();
  };

  useClickOutside(iconRef, () => {
    setOpenLogoEdit(false);
  });

  const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.value = "";
  };

  let isDefault = false;
  let isIcon = false;

  if (typeof source === "string") {
    if (source?.includes("default_user_photo")) isDefault = true;
    else if (isSvgSource(source)) isIcon = true;
  }

  const avatarContent = source ? (
    typeof source !== "string" ? (
      source
    ) : isIcon && !isNotIcon ? (
      <div className={styles.iconWrapper}>
        <IconButton iconName={source} className="icon" isDisabled />
      </div>
    ) : isDefault ? (
      isBase ? (
        <AvatarBaseReactSvgUrl
          className={styles.image}
          data-is-default="true"
        />
      ) : (
        <AvatarDarkReactSvgUrl
          className={styles.image}
          data-is-default="true"
        />
      )
    ) : (
      <img
        src={source}
        className={`${styles.image}${imgClassName ? ` ${imgClassName}` : ""}`}
        alt={userName ?? ""}
      />
    )
  ) : userName ? (
    <Initials userName={userName} size={size} isGroup={isGroup} />
  ) : isDefaultSource ? (
    isBase ? (
      <AvatarBaseReactSvgUrl className={styles.image} data-is-default="true" />
    ) : (
      <AvatarDarkReactSvgUrl className={styles.image} data-is-default="true" />
    )
  ) : (
    <EmptyIcon size={IconSizeType.scale} />
  );

  const roleIcon = roleIconProp ?? getRoleIcon(role);

  const uniqueTooltipId = withTooltip ? `roleTooltip_${instanceId}` : "";
  const tooltipPlace = isRTL ? "left" : "right";

  const getTooltipContent = ({ content }: TGetTooltipContent) => (
    <Text fontSize="12px">{content}</Text>
  );

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;

    if (onClick) onClick(e);
  };

  const onUploadClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (!onChangeFile) return;
    if (!model) return;
    const menu = model[0];
    menu.onClick(inputFilesElement);
  };

  const onClickAvatar = (e: React.MouseEvent) => {
    if (!onChangeFile) return;

    e.stopPropagation();
    e.preventDefault();
    if (noClick) return;

    if (hasAvatar) {
      return onToggleOpenEditLogo();
    }

    onUploadClick();
  };

  const dropdownElement = (
    <DropDown
      open={openEditLogo}
      clickOutsideAction={() => setOpenLogoEdit(false)}
      withBackdrop={false}
      isDefaultMode={false}
    >
      {model?.map((option) => {
        const optionOnClickAction = (e?: React.SyntheticEvent) => {
          // The entry sits inside the avatar; its click must not reach the
          // avatar's own handler and open the menu again.
          e?.stopPropagation();
          setOpenLogoEdit(false);

          if (option.key === AvatarActionKeys.PROFILE_AVATAR_UPLOAD) {
            return option.onClick(inputFilesElement);
          }

          option.onClick();
        };

        return (
          <DropDownItem
            key={option.key}
            label={option.label}
            icon={option.icon}
            onClick={optionOnClickAction}
            testId={option.key}
          />
        );
      })}
    </DropDown>
  );

  // The avatar is a button only when a click does something: a handler of
  // the host's, or the built-in upload behaviour.
  const isInteractive = !!onClick || (!!onChangeFile && !noClick);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    e.currentTarget.click();
  };

  return (
    <>
      <div
        className={classNames(styles.avatar, className)}
        data-size={size}
        data-no-click={noClick ? "true" : "false"}
        onMouseDown={onMouseDown}
        onClick={onClick || onClickAvatar}
        onKeyDown={isInteractive ? onKeyDown : undefined}
        ref={iconRef}
        data-testid={dataTestId ?? "avatar"}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive && userName ? userName : undefined}
      >
        <div
          className={classNames(styles.avatarWrapper, className)}
          data-has-source={!!source}
          data-has-username={!!userName}
          data-is-group={isGroup}
        >
          {avatarContent}
        </div>
        {editing && size === "max" ? (
          <div className={classNames(styles.editContainer)}>
            {hasAvatar ? (
              <>
                <IconButton
                  className="edit_icon"
                  iconNode={<PencilReactSvgUrl />}
                  onClick={onEditButtonClick}
                  size={16}
                  dataTestId="edit_avatar_icon_button"
                />
                {dropdownElement}{" "}
              </>
            ) : (
              <IconButton
                className="edit_icon"
                iconNode={<PlusSvgUrl />}
                onClick={onUploadClick}
                size={16}
                dataTestId="edit_avatar_icon_button"
              />
            )}
          </div>
        ) : (
          roleIcon &&
          !hideRoleIcon && (
            <div
              className={classNames(styles.roleWrapper, "avatar_role-wrapper")}
              data-size={size}
              data-tooltip-id={uniqueTooltipId}
              data-tooltip-content={tooltipContent}
            >
              {roleIcon}
            </div>
          )
        )}
        {withTooltip ? (
          <Tooltip
            float
            id={uniqueTooltipId}
            getContent={getTooltipContent}
            place={tooltipPlace}
            opacity={1}
          />
        ) : null}
      </div>
      {onChangeFile ? (
        <input
          id={`${instanceId}-avatar-file`}
          className="custom-file-input"
          type="file"
          onChange={onChangeFile}
          accept="image/png, image/jpeg"
          onClick={onInputClick}
          ref={inputFilesElement}
          style={{ display: "none" }}
          data-testid="file-input"
        />
      ) : null}
    </>
  );
};

const Avatar = memo(AvatarPure);

export { Avatar, AvatarPure };
