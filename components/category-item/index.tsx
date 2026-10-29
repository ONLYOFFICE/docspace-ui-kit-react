import ArrowRightIcon from "../../assets/arrow.right.react.svg";

import React from "react";
import classNames from "classnames";

import { Text } from "../text";
import { Badge } from "../badge";
import { Link } from "../link";

import { useTheme } from "../../context/ThemeContext";

import { isManagement } from "../../utils/common";
import { globalColors } from "../../providers/theme";

import { ICategoryItemProps } from "./CategoryItem.types";

import styles from "./CategoryItem.module.scss";

export type { ICategoryItemProps };

export const CategoryItem = ({
  title,
  url,
  subtitle,
  onClickLink,
  isDisabled,
  withPaidBadge,
  badgeLabel,
  dataTestId,
}: ICategoryItemProps) => {
  const { isBase } = useTheme();

  const onClickProp = isDisabled ? {} : { onClick: onClickLink };
  const onHrefProp = isDisabled ? {} : { href: url };
  // Without an href an <a> has no role and leaves the Tab order. A disabled
  // title stays a focusable link that says it is unavailable.
  const disabledProps = isDisabled
    ? { role: "link", "aria-disabled": true, tabIndex: 0 }
    : {};

  return (
    <div className={styles.categoryItemWrapper} data-testid={dataTestId}>
      <div className={styles.categoryItemHeading}>
        <Link
          className={classNames(styles.inheritTitleLink, "header", {
            [styles.disabled]: isDisabled,
          })}
          noHover={isDisabled}
          {...onClickProp}
          {...onHrefProp}
          {...disabledProps}
          dataTestId={dataTestId ? `${dataTestId}_category_link` : undefined}
        >
          {title}
        </Link>
        {withPaidBadge && !isManagement() ? (
          <Badge
            backgroundColor={
              isBase
                ? globalColors.favoritesStatus
                : globalColors.favoriteStatusDark
            }
            label={badgeLabel}
            isPaidBadge
            className="paid-badge"
            fontWeight="700"
          />
        ) : null}
        <ArrowRightIcon
          className={classNames(styles.arrowIcon, "settings_unavailable", {
            [styles.disabled]: isDisabled,
          })}
          aria-hidden="true"
        />
      </div>
      <Text
        className={classNames(styles.categoryItemDescription, {
          [styles.disabled]: isDisabled,
        })}
      >
        {subtitle}
      </Text>
    </div>
  );
};
