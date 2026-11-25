import React from "react";
import { getProductName } from "../../../utils/product-name";
import { TNavigationLogoProps } from "../Navigation.types";

const NavigationLogo = ({
  logo,
  burgerLogo,

  ...rest
}: TNavigationLogoProps) => {
  return (
    <div {...rest}>
      {logo ? (
        <img className="logo-icon_svg" alt={getProductName()} src={logo} />
      ) : null}
      <div className="header-burger">
        <img src={burgerLogo} alt="" />
      </div>
      <div className="header_separator" />
    </div>
  );
};

export default NavigationLogo;
