import React, { useState, useRef } from "react";

import PlusReactSvg from "../../../assets/icons/17/plus.svg";

import { IconButton } from "../../icon-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { TPlusButtonProps } from "../Navigation.types";
import { isMobile } from "../../../utils";
import { TooltipContainer } from "../../tooltip";

const PlusButton = ({
  className,
  getData,
  withMenu = true,
  onPlusClick,
  isFrame,
  id,
  onCloseDropBox,
  forwardedRef,
  title,
  ...rest
}: TPlusButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<ContextMenuRefType>(null);

  const toggle = (e: React.MouseEvent<HTMLDivElement>, open: boolean) => {
    if (open) {
      menuRef.current?.show(e);
    } else {
      menuRef.current?.hide(e);
    }

    setIsOpen(open);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (withMenu) toggle(e, !isOpen);
    else onPlusClick?.();
  };

  const onHide = () => {
    setIsOpen(false);
    onCloseDropBox?.();
  };

  const model = getData();

  return (
    <TooltipContainer
      as="div"
      ref={forwardedRef}
      className={className}
      title={title}
      {...rest}
      data-testid="plus-button"
    >
      <IconButton
        onClick={onClick}
        iconNode={<PlusReactSvg />}
        id={id}
        size={17}
        isFill
      />
      <ContextMenu
        model={model}
        containerRef={forwardedRef}
        ref={menuRef}
        onHide={onHide}
        scaled={false}
        leftOffset={isFrame ? 190 : 150}
        headerOnlyMobile
        ignoreChangeView
        withBackdrop={isMobile()}
      />
    </TooltipContainer>
  );
};

export default PlusButton;
