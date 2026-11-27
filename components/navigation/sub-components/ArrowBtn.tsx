import React from "react";

import ArrowPathReactSvg from "../../../assets/arrow.path.react.svg";

import { IconButton } from "../../icon-button";
import { useCommonTranslation } from "../../../utils/i18n";

import { TArrowButtonProps } from "../Navigation.types";

const ArrowButton = ({
  isRootFolder,
  showBackButton,
  onBackToParentFolder,
}: TArrowButtonProps) => {
  const t = useCommonTranslation();

  if (showBackButton) {
    return (
      <div className="navigation-arrow-container">
        <IconButton
          iconNode={<ArrowPathReactSvg />}
          size={17}
          isFill
          onClick={onBackToParentFolder}
          ariaLabel={t("Back")}
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
        ariaLabel={t("Back")}
        className="arrow-button"
      />
      <div className="navigation-header-separator" />
    </div>
  ) : null;
};

export default React.memo(ArrowButton);
