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
