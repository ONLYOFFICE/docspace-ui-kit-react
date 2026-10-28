import { useEffect, useRef } from "react";
import classNames from "classnames";

import { Portal } from "../../portal";

import { DeviceType } from "../../../enums";
import { INFO_PANEL_MAX_WIDTH, INFO_PANEL_WIDTH } from "../../../utils/device";

import { Aside } from "../../aside";
import { Backdrop } from "../../backdrop";

import { useEdgeResizer } from "../hooks/useEdgeResizer";
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
  isResizable,
  width,
  onResize,
}: InfoPanelProps) => {
  const infoPanelRef = useRef<null | HTMLDivElement>(null);

  const canResize =
    !!isResizable && currentDeviceType === DeviceType.desktop && !topInfoPanel;

  const {
    panelRef,
    isDockedResize,
    onResizerPointerDown,
    onResizerDoubleClick,
  } = useEdgeResizer({
    isVisible: !!isVisible && !!canDisplay,
    canResize,
    cssVariable: "--info-panel-width",
    minWidth: INFO_PANEL_WIDTH,
    maxWidth: INFO_PANEL_MAX_WIDTH,
    defaultWidth: INFO_PANEL_WIDTH,
    onResize,
  });

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
      <div
        ref={panelRef}
        className={classNames(styles.infoPanel)}
        style={
          isDockedResize && width
            ? ({ "--info-panel-width": `${width}px` } as React.CSSProperties)
            : undefined
        }
      >
        {canResize ? (
          <div
            role="presentation"
            className={classNames(styles.infoPanelResizer, "not-selectable")}
            onPointerDown={onResizerPointerDown}
            onDoubleClick={onResizerDoubleClick}
            data-testid="info-panel-resizer"
          />
        ) : null}
        {children}
      </div>
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
