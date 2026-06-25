/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from "react";
import classNames from "classnames";
import ActionsHeaderTouchReactSvgUrl from "../../assets/actions.header.touch.react.svg";

import { useTheme } from "../../context/ThemeContext";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";
import { Loader, LoaderTypes } from "../loader";

import styles from "./AddButton.module.scss";

import type { AddButtonProps } from "./AddButton.types";

export type { AddButtonProps };

const AddButton = (props: AddButtonProps) => {
  const {
    isDisabled = false,
    isAction,
    title,
    className,
    id,
    style,
    iconName,
    iconNode,
    onClick,
    iconSize = 12,
    size,

    label,
    titleText,
    fontSize = "13px",
    lineHeight = "20px",
    noSelect,
    dir,
    truncate,

    testId = "selector-add-button",
    isLoading = false,
    tabIndex,
    ...rest
  } = props;

  const { currentColorScheme } = useTheme();
  const mainAccentColor = currentColorScheme?.main?.accent;

  const onClickAction = (e: React.MouseEvent) => {
    if (!isDisabled && !isLoading) onClick?.(e);
  };

  const onKeyDownAction = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isDisabled && !isLoading) {
      onClick?.(e as unknown as React.MouseEvent);
    }
  };

  const buttonClassName = classNames(styles.selectorButton, {
    [styles.isAction]: isAction,
    [styles.isDisabled]: isDisabled,
    [styles.isLoading]: isLoading,
    // [styles.isSize]: !!size,
  });

  const containerClassName = classNames(
    styles.container,
    {
      [styles.isDisabled]: isDisabled,
      [styles.truncate]: truncate,
    },
    className,
  );

  const buttonStyle = mainAccentColor
    ? ({
        ...style,
        "--main-accent-button": `${mainAccentColor}1A`,
        "--selector-add-button-size": size,
      } as React.CSSProperties)
    : style;

  return (
    <div
      data-testid="selector-add-button-container"
      className={containerClassName}
      tabIndex={tabIndex}
      onKeyDown={onKeyDownAction}
      role="button"
    >
      <TooltipContainer
        as="div"
        {...rest}
        id={id}
        style={buttonStyle}
        title={title}
        className={buttonClassName}
        onClick={onClickAction}
        data-testid={testId}
      >
        {isLoading ? (
          <Loader color="" size="20px" type={LoaderTypes.track} />
        ) : (
          <IconButton
            size={iconSize}
            iconNode={iconNode ?? <ActionsHeaderTouchReactSvgUrl />}
            iconName={iconNode ? undefined : iconName}
            isFill
            isDisabled={isDisabled}
            isClickable={!isDisabled}
          />
        )}
      </TooltipContainer>

      {label ? (
        <Text
          className={styles.selectorText}
          fontWeight={600}
          lineHeight={lineHeight}
          onClick={onClickAction}
          title={titleText}
          fontSize={fontSize}
          noSelect={noSelect}
          dir={dir}
          truncate={truncate}
        >
          {label}
        </Text>
      ) : null}
    </div>
  );
};

export { AddButton };
