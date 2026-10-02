import React from "react";

import type { ButtonProps as AiChatButtonProps } from "@onlyoffice/ai-chat";

import { Button, ButtonSize } from "../../../../components/button";

const ButtonOverride: React.FC<AiChatButtonProps> = (props) => {
  const {
    children,
    variant,
    scale,
    disabled,
    onClick,
    className,
    id,
    style,
    tabIndex,
    type,
    isLoading,
  } = props;

  const isStringChild =
    typeof children === "string" || typeof children === "number";
  const label = isStringChild ? String(children) : "";

  return (
    <Button
      id={id}
      type={type}
      label={label}
      style={style}
      tabIndex={tabIndex}
      className={className}
      isDisabled={disabled}
      size={ButtonSize.small}
      scale={scale === "scale"}
      primary={variant !== "default"}
      onClick={onClick as unknown as (e: React.MouseEvent<HTMLElement>) => void}
      isLoading={isLoading}
    >
      {isStringChild ? null : children}
    </Button>
  );
};

ButtonOverride.displayName = "ButtonOverride";

export { ButtonOverride };
