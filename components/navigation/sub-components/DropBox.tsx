import React, { useCallback } from "react";
import { VariableSizeList } from "react-window";

import { DeviceType } from "../../../enums";

import { Scrollbar } from "../../scrollbar";

import styles from "../Navigation.module.scss";
import { TDropBoxProps } from "../Navigation.types";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";

import NavigationLogo from "./LogoBlock";
import ArrowButton from "./ArrowBtn";
import ControlButtons from "./ControlBtn";
import Row from "./Row";

const DropBox = ({
  ref,
  sectionHeight,
  dropBoxWidth,
  isRootFolder,
  onBackToParentFolder,
  canCreate,
  navigationItems,
  getContextOptionsFolder,
  getContextOptionsPlus,
  toggleDropBox,
  toggleInfoPanel,
  onClickAvailable,
  isInfoPanelVisible,
  isDesktop,
  isDesktopClient,
  withLogo,
  burgerLogo,
  isFrame,
  currentDeviceType,
  navigationTitleContainerNode,
  onCloseDropBox,
  isContextButtonVisible,
  isPublicRoom,

  isPlusButtonVisible,
  showTitleInDropBox,
}: TDropBoxProps) => {
  const [dropBoxHeight, setDropBoxHeight] = React.useState(0);
  const { interfaceDirection } = useInterfaceDirection();

  const countItems = navigationItems.length;

  const getItemSize = useCallback(
    (index: number): number => {
      if (index === countItems - 1) return 51;
      return currentDeviceType !== DeviceType.desktop ? 36 : 30;
    },
    [countItems, currentDeviceType],
  );

  React.useEffect(() => {
    const itemsHeight = navigationItems.map((item, index) =>
      getItemSize(index),
    );

    const currentHeight = itemsHeight.reduce((a, b) => a + b);

    // Reserve header height only when title is shown
    let navHeight = showTitleInDropBox === false ? 0 : 41;

    if (currentDeviceType === DeviceType.tablet) {
      navHeight = showTitleInDropBox === false ? 0 : 49;
    }

    if (currentDeviceType === DeviceType.mobile) {
      navHeight = showTitleInDropBox === false ? 0 : 45;
    }

    if (!sectionHeight || sectionHeight <= 0) {
      // Fallback for Storybook/no layout context
      setDropBoxHeight(Math.max(1, currentHeight));
    } else {
      const candidate =
        currentHeight + navHeight > sectionHeight
          ? sectionHeight - navHeight - 20
          : currentHeight;
      setDropBoxHeight(Math.max(1, candidate));
    }
  }, [
    sectionHeight,
    currentDeviceType,
    navigationItems,
    getItemSize,
    showTitleInDropBox,
  ]);

  const isTabletView = currentDeviceType === DeviceType.tablet;

  return (
    <div
      ref={ref}
      className={styles.box}
      data-with-logo={withLogo ? "true" : "false"}
      data-is-frame={isFrame ? "true" : "false"}
      style={
        {
          "--drop-box-width": `${dropBoxWidth}px`,
          "--drop-box-height":
            sectionHeight && sectionHeight > 0 && sectionHeight < dropBoxHeight
              ? `${sectionHeight}px`
              : null,
          // Explicit height when no sectionHeight provided (Storybook)
          height:
            (!sectionHeight || sectionHeight <= 0) && dropBoxHeight
              ? `${dropBoxHeight}px`
              : undefined,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.container}
        data-is-drop-box-component="true"
        data-is-desktop-client={isDesktopClient ? "true" : "false"}
        data-with-logo={withLogo && isTabletView ? "true" : "false"}
        data-is-desktop={isDesktop ? "true" : "false"}
        data-is-frame={isFrame ? "true" : "false"}
        data-is-frame-logo={isFrame && withLogo ? "true" : "false"}
        data-is-root-folder={isRootFolder ? "true" : "false"}
      >
        {withLogo ? (
          <NavigationLogo
            burgerLogo={burgerLogo}
            className="navigation-logo drop-box-logo"
          />
        ) : null}
        <ArrowButton
          isRootFolder={isRootFolder}
          onBackToParentFolder={onBackToParentFolder}
        />

        {showTitleInDropBox !== false ? navigationTitleContainerNode : null}

        <ControlButtons
          isDesktop={isDesktop}
          isMobile={currentDeviceType !== DeviceType.desktop}
          isRootFolder={isRootFolder}
          canCreate={canCreate}
          getContextOptionsFolder={getContextOptionsFolder}
          getContextOptionsPlus={getContextOptionsPlus}
          toggleInfoPanel={toggleInfoPanel}
          toggleDropBox={toggleDropBox}
          isInfoPanelVisible={isInfoPanelVisible}
          onCloseDropBox={onCloseDropBox}
          showTitle
          isContextButtonVisible={isContextButtonVisible}
          isPublicRoom={isPublicRoom}
          isPlusButtonVisible={isPlusButtonVisible}
        />
      </div>

      <VariableSizeList
        direction={interfaceDirection}
        height={dropBoxHeight}
        width="auto"
        itemCount={countItems}
        itemSize={getItemSize}
        itemData={[
          navigationItems,
          onClickAvailable,
          { withLogo: !!withLogo, currentDeviceType },
        ]}
        outerElementType={Scrollbar}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
};

DropBox.displayName = "DropBox";

export default React.memo(DropBox);
