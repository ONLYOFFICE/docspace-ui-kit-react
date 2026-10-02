import { useEffect, useRef } from "react";
import classNames from "classnames";

import { Portal } from "../../portal";

import { DeviceType } from "../../../enums";

import { Aside } from "../../aside";
import { Backdrop } from "../../backdrop";

import { InfoPanelProps } from "../Section.types";
import styles from "../Section.module.scss";

const InfoPanel = ({
  children,
  isVisible,
  isMobileHidden,
  setIsVisible,
  canDisplay,
  anotherDialogOpen,
  viewAs,
  currentDeviceType,
  topInfoPanel,
  onClose,
  withoutBodyScroll,
}: InfoPanelProps) => {
  const infoPanelRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.id === "InfoPanelWrapper") setIsVisible?.(false);
    };

    if (viewAs === "row" || currentDeviceType !== DeviceType.desktop)
      document.addEventListener("mousedown", onMouseDown);

    window.onpopstate = () => {
      if (currentDeviceType !== DeviceType.desktop && isVisible)
        setIsVisible?.(false);
    };

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [currentDeviceType, isVisible, setIsVisible, viewAs]);

  const infoPanelComponent = topInfoPanel ? (
    <>
      <Backdrop visible isAside withBackground zIndex={310} onClick={onClose} />
      <Aside
        visible
        zIndex={310}
        withoutHeader
        withoutBodyScroll={withoutBodyScroll}
      >
        <div
          className={classNames(styles.infoPanel, styles.infoPanelWrapper, {
            [styles.topInfoPanel]: topInfoPanel,
          })}
          id="InfoPanelWrapper"
          ref={infoPanelRef}
        >
          <div
            className={classNames(styles.infoPanel, {
              [styles.topInfoPanel]: topInfoPanel,
            })}
          >
            {children}
          </div>
        </div>
      </Aside>
    </>
  ) : (
    <div
      className={classNames("info-panel", styles.infoPanelWrapper)}
      id="InfoPanelWrapper"
      ref={infoPanelRef}
    >
      <div className={classNames(styles.infoPanel)}>{children}</div>
    </div>
  );

  const renderPortalInfoPanel = () => {
    const rootElement = document.getElementById("root");

    return (
      <Portal
        element={infoPanelComponent}
        appendTo={rootElement || undefined}
        visible={isVisible && !isMobileHidden ? !anotherDialogOpen : false}
      />
    );
  };

  const isMobileView =
    currentDeviceType === DeviceType.mobile ||
    currentDeviceType === DeviceType.tablet;

  return !isVisible ||
    !canDisplay ||
    (anotherDialogOpen && currentDeviceType !== DeviceType.desktop) ||
    (currentDeviceType !== DeviceType.desktop && isMobileHidden)
    ? null
    : isMobileView || topInfoPanel
      ? renderPortalInfoPanel()
      : infoPanelComponent;
};

export default InfoPanel;
