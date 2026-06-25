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
