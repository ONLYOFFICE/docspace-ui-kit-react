import React from "react";

import ArrowPathReactSvg from "../../../assets/arrow.path.react.svg";

import { IconButton } from "../../icon-button";

import { TArrowButtonProps } from "../Navigation.types";

const ArrowButton = ({
  isRootFolder,
  showBackButton,
  onBackToParentFolder,
}: TArrowButtonProps) => {
  if (showBackButton) {
    return (
      <div className="navigation-arrow-container">
        <IconButton
          iconNode={<ArrowPathReactSvg />}
          size={17}
          isFill
          onClick={onBackToParentFolder}
          className="arrow-button"
        />
      </div>
    );
  }

  return !isRootFolder ? (
    <div className="navigation-arrow-container">
      <IconButton
        iconNode={<ArrowPathReactSvg />}
        size={17}
        isFill
        onClick={onBackToParentFolder}
        className="arrow-button"
      />
      <div className="navigation-header-separator" />
    </div>
  ) : null;
};

export default React.memo(ArrowButton);
