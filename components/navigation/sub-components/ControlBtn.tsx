import React from "react";

import { isTablet } from "../../../utils";
import { Button, ButtonSize } from "../../button";

import styles from "../Navigation.module.scss";

import { TControlButtonProps } from "../Navigation.types";

import ToggleInfoPanelButton from "./ToggleInfoPanelBtn";
import AiChatButton from "./AiChatBtn";
import PlusButton from "./PlusBtn";
import ContextButton from "./ContextBtn";
import WarningComponent from "./WarningComponent";

const ControlButtons = ({
  isRootFolder,
  isInfoPanelVisible,
  toggleInfoPanel,
  toggleDropBox,
  titles,

  // Plus button props
  canCreate,
  getContextOptionsPlus,
  withMenu,
  onPlusClick,
  isFrame,
  onCloseDropBox,

  // Context button props
  getContextOptionsFolder,
  isTrashFolder,
  isMobile,
  isMobileOnly,
  onContextOptionsClick,
  isPublicRoom,

  // Navigation button props
  navigationButtonLabel,
  onNavigationButtonClick,

  // Visibility controls
  isDesktop,
  showTitle,

  // Tariff bar
  tariffBar,
  title,

  // Guidance props
  addButtonRef,
  buttonRef,
  contextButtonAnimation,
  guidAnimationVisible,
  setGuidAnimationVisible,
  isContextButtonVisible,

  isPlusButtonVisible,
  contextMenuHeader,
  analyzeResponsesButton,

  // AI chat button props
  toggleChatPanel,
  isChatPanelVisible,
  hideChatButton,
}: TControlButtonProps) => {
  const toggleInfoPanelAction = () => {
    toggleInfoPanel?.();
    toggleDropBox?.();
  };

  const isTabletView = isTablet();
  const contextOptionsFolder = getContextOptionsFolder();
  const containVisible = contextOptionsFolder.some((item) => !item.disabled);

  const renderNavigationButton = () => {
    if (!navigationButtonLabel || isFrame || isRootFolder) return null;

    return (
      <Button
        ref={buttonRef}
        className="navigation_button"
        testId="navigation_button"
        label={navigationButtonLabel}
        size={ButtonSize.extraSmall}
        onClick={onNavigationButtonClick}
      />
    );
  };

  const renderTariffBar = () => {
    if (!tariffBar || isFrame) return null;

    const cloneProps = { title };

    return (
      <div className={styles.tariffWrapper}>
        {React.cloneElement(tariffBar, cloneProps)}
      </div>
    );
  };

  const renderPlusButton = () => {
    if ((isMobile && !isFrame) || !canCreate) return null;

    return (
      <PlusButton
        forwardedRef={addButtonRef}
        id="header_add-button"
        className="add-button"
        getData={getContextOptionsPlus}
        withMenu={withMenu}
        onPlusClick={onPlusClick}
        isFrame={isFrame}
        title={titles?.actions}
        onCloseDropBox={onCloseDropBox}
      />
    );
  };

  const renderContextButton = (visible: boolean) => {
    // console.log(visible);

    if (!visible || isFrame) return null;

    return (
      <ContextButton
        id="header_optional-button"
        className="option-button"
        getData={getContextOptionsFolder}
        withMenu={withMenu}
        title={title}
        isTrashFolder={isTrashFolder}
        isMobile={isMobile || false}
        isMobileOnly={isMobileOnly || false}
        contextMenuHeader={contextMenuHeader}
        onCloseDropBox={onCloseDropBox}
        onContextOptionsClick={onContextOptionsClick}
        contextButtonAnimation={contextButtonAnimation}
        guidAnimationVisible={guidAnimationVisible}
        setGuidAnimationVisible={setGuidAnimationVisible}
        ignoreChangeView={!!(isMobile && !!contextMenuHeader)}
      />
    );
  };

  const renderToggleInfoPanel = () => {
    if (isDesktop) return null;

    return (
      <ToggleInfoPanelButton
        isRootFolder={isRootFolder}
        isInfoPanelVisible={isInfoPanelVisible}
        toggleInfoPanel={toggleInfoPanelAction}
        titles={titles}
      />
    );
  };

  // Desktop keeps the AI chat button in Navigation's right-hand button row,
  // next to the info panel toggle; below that breakpoint the row is not
  // rendered, so the button joins the control buttons instead.
  const renderAiChatButton = () => {
    if (isDesktop || !toggleChatPanel || hideChatButton) return null;

    return (
      <AiChatButton
        id="ai-chat-button"
        toggleChatPanel={toggleChatPanel}
        isChatPanelVisible={isChatPanelVisible ?? false}
        titles={titles}
      />
    );
  };

  const renderWarning = () => {
    if (!isDesktop || !titles?.warningText) return null;

    return (
      <WarningComponent
        title={titles?.warningText}
        icon={titles?.warningIcon}
      />
    );
  };

  return (
    <div
      id="control-buttons-container"
      className={styles.controlButtonContainer}
      data-is-frame={isFrame}
      data-show-title={showTitle}
    >
      {/* First child: below the desktop breakpoint this row is `row-reverse`,
          so DOM order runs right-to-left and the first child lands on the
          header's trailing edge. That keeps the AI chat button aligned with
          the other trailing-edge controls instead of being pushed inwards by
          buttons that reserve width while rendering nothing visible. */}
      {renderAiChatButton()}
      {isPlusButtonVisible ? renderPlusButton() : null}
      {renderContextButton((isContextButtonVisible && !isPublicRoom) ?? false)}
      {renderToggleInfoPanel()}
      {renderContextButton((isPublicRoom && containVisible) ?? false)}
      {renderWarning()}
      {!isTabletView ? renderNavigationButton() : null}
      {renderTariffBar()}
      {analyzeResponsesButton ?? null}
      {isTabletView ? renderNavigationButton() : null}
    </div>
  );
};

export default ControlButtons;
