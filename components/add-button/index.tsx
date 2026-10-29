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

  // The wrapper is the button, so Enter and Space click it, as they would a
  // real one; the click reaches onClickAction like a mouse click does.
  const onKeyDownAction = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    if (isDisabled || isLoading) return;
    e.currentTarget
      .querySelector<HTMLElement>(`.${styles.selectorButton}`)
      ?.click();
  };

  // A role="button" the keyboard cannot reach is no button: it is in the Tab
  // order unless disabled, and a caller's tabIndex still wins.
  const wrapperTabIndex = tabIndex ?? (isDisabled ? -1 : 0);

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
      tabIndex={wrapperTabIndex}
      onKeyDown={onKeyDownAction}
      role="button"
      // Loading drops the key and the click as disabled does, so it is
      // announced the same way, and as busy. The focus stays where it is.
      aria-disabled={isDisabled || isLoading || undefined}
      aria-busy={isLoading || undefined}
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
          <Loader isDecorative color="" size="20px" type={LoaderTypes.track} />
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
