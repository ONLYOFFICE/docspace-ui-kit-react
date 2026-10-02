import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import { match, P } from "ts-pattern";
import classNames from "classnames";

import CrossIconReactSvgUrl from "../../assets/icons/12/cross.react.svg";

import { Text } from "../text";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";

import type { TagProps, TagType, TagClickEvent } from "./Tag.types";
import styles from "./Tag.module.scss";

const TagPure: FC<TagProps> = ({
  ref,
  tag,
  label,
  isNewTag = false,
  isDisabled,
  isDeleted,
  isLast,
  onDelete,
  onClick,
  tagMaxWidth,
  id,
  className,
  style,
  icon,
  roomType,
  providerType,
  dataTestId,
  onMouseEnter,
  onMouseLeave,
  iconClassName,
  withLabel = true,
  labelSuffix,
  labelSuffixColor,
}) => {
  const onClickAction = React.useCallback(() => {
    if (onClick && !isDisabled && !isDeleted) {
      onClick({ roomType, label: label ?? tag, providerType });
    }
  }, [onClick, isDisabled, isDeleted, roomType, providerType, label, tag]);

  const onDeleteAction = React.useCallback(() => {
    onDelete?.(tag);
  }, [onDelete, tag]);

  return (
    <TooltipContainer
      as="div"
      id={id}
      ref={ref}
      title={label}
      onClick={onClickAction}
      className={classNames(styles.tag, "tag", className, {
        [styles.isNewTag]: isNewTag,
        [styles.isDisabled]: isDisabled,
        [styles.isDeleted]: isDeleted,
        [styles.isClickable]: !!onClick,
        [styles.isLast]: isLast,
        [styles.thirdPartyTag]: icon,
      })}
      style={{ ...style, maxWidth: tagMaxWidth }}
      aria-label={label}
      aria-disabled={isDisabled}
      data-testid={dataTestId ?? "tag_item"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {match(icon)
        .with(P.string, (icon) => (
          <ReactSVG
            className={classNames(styles.thirdPartyTag, iconClassName)}
            src={icon}
          />
        ))
        .with(P.nonNullable, (Icon) => (
          <IconButton
            className={classNames(
              styles.thirdPartyTag,
              styles.icon,
              iconClassName,
            )}
            iconNode={<Icon />}
            size={12}
          />
        ))
        .otherwise(() => null)}
      {withLabel ? (
        <Text title={label} fontSize="13px" noSelect truncate>
          {label}
          {labelSuffix ? (
            <span style={{ color: labelSuffixColor }}>{labelSuffix}</span>
          ) : null}
        </Text>
      ) : null}
      {isNewTag && onDelete ? (
        <IconButton
          className={styles.tagIcon}
          iconNode={<CrossIconReactSvgUrl />}
          size={12}
          onClick={onDeleteAction}
        />
      ) : null}
    </TooltipContainer>
  );
};

TagPure.displayName = "TagPure";

const Tag = React.memo(TagPure);

export { Tag, TagProps, TagType, type TagClickEvent };
