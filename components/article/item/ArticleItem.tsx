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

type ArticleItemPureProps = ArticleItemProps & {
  /** Renders the item's control as a router link: given the link's class
   * and its content, returns the link. Set by the wrapper in `index.tsx`. */
  renderLink?: (
    className: string,
    children: React.ReactNode,
  ) => React.ReactNode;
};

export const ArticleItemPure = (props: ArticleItemPureProps) => {
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
    isLink = false,
    renderLink,
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
  // A middle click on a link is the browser's: it opens the address in a new
  // tab. Only an item that is not a link reports it.
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1 || isLink) return;

    onClickAction(e);
  };

  // Enter and Space on the item's control (when it is not a link, which has
  // its own) and on the badge make a real click, so the handlers receive the
  // mouse event they are typed for.
  const onActivateKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.currentTarget.click();
  };

  const onClickBadgeAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClickBadge?.(id);
  };

  const badgeButtonProps = onClickBadge
    ? {
        role: "button",
        tabIndex: 0,
        "aria-label": badgeTitle || (labelBadge ? String(labelBadge) : text),
        onKeyDown: onActivateKeyDown,
      }
    : {};

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

  // Measured again whenever the label itself changes, not only the tooltip.
  useEffect(() => {
    const textElement = textRef.current;
    if (!showText || !textElement) return;

    setIsTextTruncated(textElement.scrollWidth > textElement.clientWidth);
  }, [showText, text, title]);

  // The control is a transparent layer over the whole row -- a button, or the
  // router link -- named by the item's text. The row itself is no control, so
  // the badge, which has a button of its own, sits beside the control rather
  // than inside it. A click on the layer bubbles to the row's handler; Enter
  // and Space on it make that click too.
  const renderControl = () => {
    const name = <span className={styles.visuallyHidden}>{text}</span>;

    if (isLink && renderLink)
      return renderLink(styles.articleItemControl, name);

    return (
      <span
        className={styles.articleItemControl}
        role="button"
        tabIndex={0}
        aria-current={isActive ? "page" : undefined}
        onKeyDown={onActivateKeyDown}
        data-testid="article-item-control"
      >
        {name}
      </span>
    );
  };

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
        onClick={onClickAction}
        onMouseUp={onMouseUpAction}
        onMouseDown={onMouseDown}
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
          data-testid="article-item-sibling"
          ref={animationElementRef}
        />
        {renderControl()}
        <div
          className={classNames(styles.articleItemImg, {
            [styles.active]: isActive,
          })}
          aria-hidden="true"
        >
          {iconNode ? (
            <div className={styles.nodeIcon}>{iconNode}</div>
          ) : icon ? (
            <ReactSVG className={styles.icon} src={icon} />
          ) : null}
          {!showText ? (
            <>
              {showInitial ? (
                <Text
                  className={classNames(styles.articleItemInitialText)}
                  aria-hidden="true"
                >
                  {getInitial(text)}
                </Text>
              ) : null}
              {showBadge && !iconBadge ? (
                // The dot of the collapsed panel: it only marks the item, and
                // its click is a pointer shortcut. The control names the item.
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
          // Drawn for the eye; the control carries the same text as its name.
          <Text
            ref={textRef}
            className={classNames(styles.articleItemText, "articleItemText", {
              [styles.active]: isActive,
            })}
            aria-hidden="true"
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
            {...badgeButtonProps}
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
