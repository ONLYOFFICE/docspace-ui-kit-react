import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";
import { isMobile } from "react-device-detect";

import { useAnimation } from "../../../hooks/useAnimation";

import { Text } from "../../text";
import { Badge } from "../../badge";

import { TooltipContainer } from "../../tooltip";

import { ArticleItemProps } from "./ArticleItem.types";
import styles from "./ArticleItem.module.scss";

const getInitial = (text: string) => text.substring(0, 1).toUpperCase();

export const ArticleItemPure = (props: ArticleItemProps) => {
  const {
    className,
    id,
    style,
    icon,
    text,
    showText = false,
    onClick,
    onDrop,
    isEndOfBlock = false,
    isActive = false,
    isDragging = false,
    isDragActive = false,
    showInitial = false,
    showBadge = false,
    labelBadge,
    iconBadge,
    onClickBadge,
    isHeader = false,
    isFirstHeader = false,
    folderId,
    badgeTitle,
    badgeComponent,
    title,
    item,
    iconNode,
    withAnimation,
    dataTooltipId,
  } = props;

  // Animation hook
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(isActive);

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const onClickAction = (e: React.MouseEvent) => {
    onClick?.(e, id);

    // Start animation if withAnimation is true
    if (withAnimation) {
      triggerAnimation();
    }
  };
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;

    onClickAction(e);
  };
  const onClickBadgeAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClickBadge?.(id);
  };

  const onMouseUpAction = () => {
    if (isDragging) onDrop?.(id, text, item);
  };

  const renderHeaderItem = () => {
    return (
      <div
        className={classNames(styles.articleItemHeaderContainer, {
          [styles.showText]: showText,
          [styles.firstHeader]: isFirstHeader,
        })}
        data-testid="article-item-header"
      >
        <Text className={styles.articleItemHeaderText} truncate noSelect>
          {showText ? text : ""}
        </Text>
      </div>
    );
  };

  const tooltipTitle = !showText || isTextTruncated ? title : undefined;

  useEffect(() => {
    const textElement = textRef.current;
    if (!showText || !textElement) return;

    setIsTextTruncated(textElement.scrollWidth > textElement.clientWidth);
  }, [showText, title]);

  const renderItem = () => {
    return (
      <TooltipContainer
        as="div"
        className={classNames(styles.articleItemContainer, className, {
          [styles.showText]: showText,
          [styles.endOfBlock]: isEndOfBlock,
          [styles.active]: isActive,
        })}
        style={style}
        data-testid="article-item"
        title={tooltipTitle}
        ref={parentElementRef}
        data-tooltip-id={dataTooltipId}
      >
        <div
          className={classNames(styles.articleItemSibling, {
            [styles.active]: isActive,
            [styles.animationReady]: isAnimationReady,
            [styles.animatedProgress]:
              isActive && animationPhase === "progress",
            [styles.animatedFinish]: isActive && animationPhase === "finish",
            [styles.dragging]: isDragging,
            [styles.dragActive]: isDragActive,
            [styles.mobileDevice]: isMobile,
          })}
          style={{ "--end-width": `${endWidth}%` } as React.CSSProperties}
          id={folderId}
          onClick={onClickAction}
          onMouseUp={onMouseUpAction}
          onMouseDown={onMouseDown}
          data-testid="article-item-sibling"
          ref={animationElementRef}
        />
        <div
          className={classNames(styles.articleItemImg, {
            [styles.active]: isActive,
          })}
        >
          {iconNode ? (
            <div className={styles.nodeIcon}>{iconNode}</div>
          ) : icon ? (
            <ReactSVG className={styles.icon} src={icon} />
          ) : null}
          {!showText ? (
            <>
              {showInitial ? (
                <Text className={classNames(styles.articleItemInitialText)}>
                  {getInitial(text)}
                </Text>
              ) : null}
              {showBadge && !iconBadge ? (
                <TooltipContainer
                  as="div"
                  className={classNames(styles.articleItemBadgeWrapper, {
                    [styles.showText]: showText,
                  })}
                  onClick={onClickBadgeAction}
                />
              ) : null}
            </>
          ) : null}
        </div>
        {showText ? (
          <Text
            ref={textRef}
            className={classNames(styles.articleItemText, "articleItemText", {
              [styles.active]: isActive,
            })}
            noSelect
          >
            {text}
          </Text>
        ) : null}
        {showBadge && showText ? (
          <TooltipContainer
            as="div"
            className={classNames(styles.articleItemBadgeWrapper, {
              [styles.showText]: showText,
            })}
            onClick={onClickBadgeAction}
            title={badgeTitle}
          >
            {iconBadge ? (
              <ReactSVG className={styles.articleItemIcon} src={iconBadge} />
            ) : (
              (badgeComponent ?? (
                <Badge className={styles.articleItemBadge} label={labelBadge} />
              ))
            )}
          </TooltipContainer>
        ) : null}
      </TooltipContainer>
    );
  };

  return isHeader ? renderHeaderItem() : renderItem();
};

const ArticleItem = React.memo(ArticleItemPure);

export { ArticleItem };
