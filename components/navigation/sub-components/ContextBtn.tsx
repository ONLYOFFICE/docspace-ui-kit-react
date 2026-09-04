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
