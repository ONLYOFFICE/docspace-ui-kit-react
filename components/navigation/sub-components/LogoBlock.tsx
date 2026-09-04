import React from "react";
import { TNavigationLogoProps } from "../Navigation.types";

const NavigationLogo = ({
  logo,
  burgerLogo,

  ...rest
}: TNavigationLogoProps) => {
  return (
    <div {...rest}>
      <img className="logo-icon_svg" alt="logo" src={logo} />
      <div className="header-burger">
        <img src={burgerLogo} alt="burger logo" />
      </div>
      <div className="header_separator" />
    </div>
  );
};

export default NavigationLogo;
