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

import React, { useState, useRef, useEffect, useCallback } from "react";

import VerticalDotsReactSvg from "../../../assets/icons/17/vertical-dots.react.svg";

import { IconButton } from "../../icon-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { TooltipContainer } from "../../tooltip";

import { TContextButtonProps } from "../Navigation.types";

const ContextButton = ({
  className,
  getData,
  withMenu = true,
  isTrashFolder,
  isMobile,
  isMobileOnly,
  id,
  onCloseDropBox,
  onContextOptionsClick,
  contextButtonAnimation,
  guidAnimationVisible,
  setGuidAnimationVisible,
  ignoreChangeView,
  contextMenuHeader,
  title,
  ...rest
}: TContextButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationClasses, setAnimationClasses] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<ContextMenuRefType>(null);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const resetAnimation = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setAnimationClasses([]);
    setAnimationPlayed(false);
    if (setGuidAnimationVisible) {
      setGuidAnimationVisible(false);
    }
  }, [setGuidAnimationVisible]);

  useEffect(() => {
    if (isOpen && animationPlayed) {
      resetAnimation();
      return;
    }

    if (isOpen) {
      return;
    }

    if (guidAnimationVisible && contextButtonAnimation && !animationPlayed) {
      setAnimationPlayed(true);
      const cleanup = contextButtonAnimation(setAnimationClasses);
      cleanupRef.current = cleanup;
    }
  }, [
    guidAnimationVisible,
    contextButtonAnimation,
    isOpen,
    animationPlayed,
    setGuidAnimationVisible,
    resetAnimation,
  ]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (setGuidAnimationVisible) {
        setGuidAnimationVisible(false);
      }
      setAnimationClasses([]);
    };
  }, [setGuidAnimationVisible]);

  const toggle = (e: React.MouseEvent<HTMLDivElement>, open: boolean) => {
    if (open && animationPlayed) {
      resetAnimation();
    }

    if (open) {
      menuRef.current?.show(e);
    } else {
      menuRef.current?.hide(e);
    }

    setIsOpen(open);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onContextOptionsClick?.();
    if (withMenu) toggle(e, !isOpen);
  };

  const onHide = () => {
    setIsOpen(false);
    onCloseDropBox?.();
  };

  const model = getData();

  return (
    <TooltipContainer
      as="div"
      ref={ref}
      className={`${className} ${animationClasses.join(" ")}`}
      title={title}
      {...rest}
    >
      <IconButton
        onClick={onClick}
        iconNode={<VerticalDotsReactSvg />}
        id={id}
        size={17}
        isFill
      />
      <ContextMenu
        model={model}
        ref={menuRef}
        onHide={onHide}
        scaled={false}
        withBackdrop={isMobileOnly}
        leftOffset={isTrashFolder ? 188 : isMobile ? 150 : 0}
        ignoreChangeView={ignoreChangeView}
        headerOnlyMobile={!!contextMenuHeader}
        header={contextMenuHeader}
        badgeUrl={contextMenuHeader?.badgeUrl}
      />
    </TooltipContainer>
  );
};

export default ContextButton;
