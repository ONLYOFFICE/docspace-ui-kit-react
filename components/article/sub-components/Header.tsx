import React from "react";

import { getLogoUrl } from "../../../utils/getLogoUrl";
import { DeviceType, WhiteLabelLogoType } from "../../../enums";
import { ArticleHeaderLoader } from "../skeletons";
import { useTheme } from "../../../context/ThemeContext";

import { AsideHeader } from "../../aside";
import BackButton from "./BackButton";

import styles from "../Article.module.scss";

import { ArticleHeaderProps } from "../Article.types";

const ArticleHeader = ({
  showText,
  children,
  onLogoClickAction,
  isBurgerLoading,

  withCustomArticleHeader,
  currentDeviceType,
  onIconClick,
  showBackButton,
  navigate,
  onBack,
  ...rest
}: ArticleHeaderProps) => {
  const { isBase } = useTheme();

  const onLogoClick = () => {
    onLogoClickAction?.();
    if (navigate) navigate("/");
    else window.location.href = "/";
  };

  const onLogoAuxClick = (e: React.MouseEvent) => {
    const isMouseWheelClick = e.button === 1;

    if (!isMouseWheelClick) return;

    e.preventDefault();
    window.open("/", "_blank");
  };

  const burgerLogo = getLogoUrl(
    WhiteLabelLogoType.LeftMenu,
    !isBase,
    false,
    "",
    true,
  );
  const logo = getLogoUrl(
    WhiteLabelLogoType.LightSmall,
    !isBase,
    false,
    "",
    true,
  );

  if (currentDeviceType === DeviceType.mobile)
    return (
      <AsideHeader
        headerHeight={showBackButton ? "76px" : "49px"}
        isCloseable
        withoutBorder
        onCloseClick={onIconClick}
        headerComponent={
          showBackButton ? (
            <BackButton
              showText={showText}
              currentDeviceType={currentDeviceType}
              toggleArticleOpen={onIconClick}
              navigate={navigate}
              onBack={onBack}
            />
          ) : null
        }
      />
    );

  const isLoadingComponent =
    currentDeviceType === DeviceType.tablet ? (
      <ArticleHeaderLoader
        height="28px"
        width={showText ? "100%" : "28px"}
        showText={showText}
      />
    ) : (
      <ArticleHeaderLoader height="28px" width="211px" showText={showText} />
    );

  const mainComponent = (
    <>
      {currentDeviceType === DeviceType.tablet ? (
        <div
          className={styles.iconBox}
          data-show-text={showText ? "true" : "false"}
        >
          <img
            src={burgerLogo}
            className="burger-logo"
            alt="burger-logo"
            onClick={onLogoClick}
            onAuxClick={onLogoAuxClick}
          />
        </div>
      ) : null}
      <div
        className={styles.heading}
        data-show-text={showText ? "true" : "false"}
      >
        {currentDeviceType === DeviceType.tablet ? (
          <img
            className="logo-icon_svg"
            alt="burger-logo"
            src={logo}
            onClick={onLogoClick}
            onAuxClick={onLogoAuxClick}
          />
        ) : (
          <div onClick={onLogoClick} onAuxClick={onLogoAuxClick}>
            <img className="logo-icon_svg" alt="burger-logo" src={logo} />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={styles.articleHeader}
      data-show-text={showText ? "true" : "false"}
      {...rest}
    >
      {withCustomArticleHeader && children
        ? children
        : isBurgerLoading
          ? isLoadingComponent
          : mainComponent}
    </div>
  );
};

ArticleHeader.displayName = "Header";

export default ArticleHeader;
