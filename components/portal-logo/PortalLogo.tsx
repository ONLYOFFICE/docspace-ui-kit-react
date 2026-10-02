"use client";

import React, { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import classNames from "classnames";
import LightSmallLogo from "../../assets/logo/lightsmall.svg";

import { size as deviceSize } from "../../utils";
import { getLogoUrl } from "../../utils/getLogoUrl";

import { WhiteLabelLogoType } from "../../enums";
import { useTheme } from "../../context/ThemeContext";
import type { PortalLogoProps } from "./PortalLogo.types";
import styles from "./PortalLogo.module.scss";

const PortalLogo = ({ className, isResizable = false }: PortalLogoProps) => {
  const [isError, setIsError] = useState(false);

  const { isBase } = useTheme();

  const [size, setSize] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const onResize = () => {
    setSize(window.innerWidth);
  };

  React.useEffect(() => {
    if (isResizable) window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isResizable]);

  const isMobile = size <= deviceSize.mobile;

  const logoSize =
    isResizable && isMobile
      ? WhiteLabelLogoType.LightSmall
      : WhiteLabelLogoType.LoginPage;

  const logo = getLogoUrl(logoSize, !isBase);

  const wrapperClassName = classNames(styles.wrapper, {
    [styles.mobile]: isMobile,
    [styles.resizable]: isResizable,
    "not-mobile": !isMobileOnly,
  });

  if (isError) {
    return <LightSmallLogo className={classNames("logo-wrapper", className)} />;
  }

  return (
    <div className={wrapperClassName}>
      {logo ? (
        <img
          src={logo}
          className={classNames("logo-wrapper", className)}
          alt="portal logo"
          onError={() => setIsError(true)}
        />
      ) : null}
    </div>
  );
};

export default PortalLogo;
