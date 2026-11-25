import React, { useCallback } from "react";

import { Consumer, DomHelpers } from "../../utils";
import { Backdrop } from "../backdrop";

import ArrowButton from "./sub-components/ArrowBtn";
import ControlButtons from "./sub-components/ControlBtn";
import ToggleInfoPanelButton from "./sub-components/ToggleInfoPanelBtn";
import AiChatButton from "./sub-components/AiChatBtn";
import NavigationLogo from "./sub-components/LogoBlock";
import DropBox from "./sub-components/DropBox";

import NavigationText from "./sub-components/Text";

import { DeviceType } from "../../enums";
import styles from "./Navigation.module.scss";
import { omitAriaProps, pickAriaProps } from "../../utils/aria-props";
import { TNavigationProps } from "./Navigation.types";
import Badges from "./sub-components/Badges";

const Navigation = ({
  isRootFolder,
  title,
  titleContent,
  canCreate,
  onClickFolder,
  navigationItems,
  getContextOptionsPlus,
  getContextOptionsFolder,
  onBackToParentFolder,
  isTrashFolder,
  toggleInfoPanel,
  isInfoPanelVisible,
  titles,
  withMenu,
  onPlusClick,
  isDesktop: isDesktopClient,
  isFrame,
  hideInfoPanel,
  showRootFolderTitle,
  withLogo,
  burgerLogo,
  isPublicRoom,
  titleIcon,
  titleIconTooltip,
  currentDeviceType,
  rootRoomTitle,
  showTitle,
  navigationButtonLabel,
  onNavigationButtonClick,
  tariffBar,
  showNavigationButton,
  badgeLabel,
  onContextOptionsClick,
  onLogoClick,
  buttonRef,
  addButtonRef,
  contextButtonAnimation,
  guidAnimationVisible,
  setGuidAnimationVisible,
  ref,
  isContextButtonVisible,
  isPlusButtonVisible,
  showBackButton,
  contextMenuHeader,
  analyzeResponsesButton,
  beforeContextButton,
  titleTooltip,
  toggleChatPanel,
  isChatPanelVisible,
  hideChatButton,

  ...rest
}: TNavigationProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [firstClick, setFirstClick] = React.useState(true);
  const [dropBoxWidth, setDropBoxWidth] = React.useState(0);

  const dropBoxRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const setContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const isDesktop = currentDeviceType === DeviceType.desktop;

  // Desktop keeps both of these in the right-hand button row; below that
  // breakpoint the info panel toggle is dropped and the AI chat button moves
  // into the control buttons (see ControlBtn).
  const showChatButton = isDesktop && !!toggleChatPanel && !hideChatButton;
  const showInfoPanelToggle = isDesktop && !hideInfoPanel;

  const toggleDropBox = useCallback(() => {
    if (navigationItems?.length === 0) return;
    if (isRootFolder) return setIsOpen(false);
    setIsOpen((prev) => !prev);

    if (containerRef.current)
      setDropBoxWidth(DomHelpers.getOuterWidth(containerRef.current));

    setFirstClick(true);
  }, [isRootFolder, navigationItems?.length]);

  const onCloseDropBox = () => {
    if (isOpen) setIsOpen(false);
  };

  const onMissClick = React.useCallback(
    (e: MouseEvent) => {
      const path = e.composedPath && e.composedPath();

      if (!firstClick) {
        if (dropBoxRef.current && !path.includes(dropBoxRef.current))
          toggleDropBox();
      } else {
        setFirstClick((prev) => !prev);
      }
    },
    [firstClick, toggleDropBox, setFirstClick],
  );

  const onClickAvailable = React.useCallback(
    (id: number | string, isRootRoom: boolean, isRootTemplates?: boolean) => {
      onClickFolder?.(id, isRootRoom, isRootTemplates);
      toggleDropBox();
    },
    [onClickFolder, toggleDropBox],
  );

  const onResize = React.useCallback(() => {
    if (containerRef.current)
      setDropBoxWidth(DomHelpers.getOuterWidth(containerRef.current));
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", onMissClick);
      window.addEventListener("resize", onResize);
    } else {
      window.removeEventListener("click", onMissClick);
      window.removeEventListener("resize", onResize);
      setFirstClick(true);
    }

    return () => {
      window.removeEventListener("click", onMissClick);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, onResize, onMissClick]);

  React.useEffect(() => {
    if (!navigationItems?.length) {
      setIsOpen(false);
    }
  }, [navigationItems]);

  // Focus follows the box: into its copy of the title when it opens from the
  // header, and back to the header's title when it closes with the focus in
  // it -- unless something else has taken the focus by then.
  const focusInDropBoxRef = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen) {
      if (!focusInDropBoxRef.current) return;
      focusInDropBoxRef.current = false;
      const active = document.activeElement;
      if (active && active !== document.body) return;
      containerRef.current
        ?.querySelector<HTMLElement>("[aria-expanded]")
        ?.focus();
      return;
    }

    if (containerRef.current?.contains(document.activeElement))
      dropBoxRef.current
        ?.querySelector<HTMLElement>("[aria-expanded]")
        ?.focus();

    const onFocusIn = (e: FocusEvent) => {
      focusInDropBoxRef.current = !!dropBoxRef.current?.contains(
        e.target as Node,
      );
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) setIsOpen(false);
    };

    focusInDropBoxRef.current = !!dropBoxRef.current?.contains(
      document.activeElement,
    );
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const canOpenDropBox = !isRootFolder && !!navigationItems?.length;

  const onBackToParentFolderAction = React.useCallback(() => {
    setIsOpen((val) => !val);
    onBackToParentFolder?.();
  }, [onBackToParentFolder]);

  const showRootFolderNavigation =
    !isRootFolder &&
    showRootFolderTitle &&
    ((navigationItems && navigationItems.length > 1) || rootRoomTitle) &&
    currentDeviceType !== DeviceType.mobile;

  const navigationTitleNode = titleContent ? (
    <div className="title-block" data-testid="navigation-title-content">
      {titleContent}
    </div>
  ) : (
    <div className="title-block">
      <NavigationText
        className="title-block-text"
        title={title}
        isOpen={false}
        isRootFolder={isRootFolder}
        onClick={toggleDropBox}
        isButton={canOpenDropBox}
        isExpanded={canOpenDropBox ? isOpen : undefined}
        isRootFolderTitle={false}
        badgeLabel={!showRootFolderNavigation ? badgeLabel : ""}
        titleTooltip={!showRootFolderNavigation ? titleTooltip : undefined}
      />
    </div>
  );

  // With rootRoomTitle and a single crumb there is no parent to open.
  const parentItem = navigationItems?.[navigationItems.length - 2];

  const onTextClick = React.useCallback(() => {
    if (parentItem) onClickFolder(parentItem.id, false, false);
    setIsOpen(false);
  }, [parentItem, onClickFolder]);

  const navigationTitleContainerNode = showRootFolderNavigation ? (
    <div className="title-container">
      <div className="badges-container">
        <Badges
          titleIcon={titleIcon}
          isRootFolder={isRootFolder}
          titleIconTooltip={titleIconTooltip}
        />
        <NavigationText
          className="room-title"
          title={rootRoomTitle || parentItem?.title || ""}
          isOpen={isOpen}
          isRootFolder={isRootFolder}
          isRootFolderTitle
          isButton
          onClick={onTextClick}
          badgeLabel={badgeLabel}
        />
      </div>
      {navigationTitleNode}
    </div>
  ) : (
    <div className="badges-container">
      <Badges
        titleIcon={titleIcon}
        isRootFolder={isRootFolder}
        titleIconTooltip={titleIconTooltip}
      />
      {navigationTitleNode}
    </div>
  );

  const haveItems = !!navigationItems?.length;

  return (
    <Consumer>
      {(context) => (
        <>
          {isOpen && haveItems ? (
            <>
              <Backdrop
                visible={isOpen}
                withBackground={false}
                withoutBackground
                zIndex={400}
                onClick={onCloseDropBox}
              />

              <DropBox
                {...omitAriaProps(rest)}
                isDesktop={isDesktop}
                ref={dropBoxRef}
                dropBoxWidth={dropBoxWidth}
                sectionHeight={context.sectionHeight || 0}
                isRootFolder={isRootFolder}
                onBackToParentFolder={onBackToParentFolderAction}
                canCreate={canCreate}
                navigationItems={navigationItems}
                getContextOptionsFolder={getContextOptionsFolder}
                getContextOptionsPlus={getContextOptionsPlus}
                toggleDropBox={toggleDropBox}
                toggleInfoPanel={toggleInfoPanel}
                isInfoPanelVisible={isInfoPanelVisible}
                onClickAvailable={onClickAvailable}
                isDesktopClient={isDesktopClient}
                withLogo={withLogo}
                burgerLogo={burgerLogo}
                currentDeviceType={currentDeviceType}
                navigationTitleContainerNode={navigationTitleContainerNode}
                onCloseDropBox={onCloseDropBox}
                isFrame={isFrame}
                isContextButtonVisible={isContextButtonVisible}
                isPublicRoom={isPublicRoom}
                isPlusButtonVisible={isPlusButtonVisible}
              />
            </>
          ) : null}
          <div
            {...pickAriaProps(rest)}
            ref={setContainerRef}
            className={styles.container}
            data-is-root-folder={isRootFolder ? "true" : "false"}
            data-is-show-back-button={showBackButton ? "true" : "false"}
            data-is-trash-folder={isTrashFolder ? "true" : "false"}
            data-is-desktop={isDesktop ? "true" : "false"}
            data-is-desktop-client={isDesktopClient ? "true" : "false"}
            data-is-info-panel-visible={isInfoPanelVisible ? "true" : "false"}
            data-with-logo={withLogo ? "true" : "false"}
            data-is-frame={isFrame ? "true" : "false"}
            data-is-public-room={isPublicRoom ? "true" : "false"}
            data-show-navigation-button={
              showNavigationButton ? "true" : "false"
            }
            data-with-leading-controls={beforeContextButton ? "true" : "false"}
            data-is-drop-box-component="false"
          >
            {withLogo ? (
              <NavigationLogo
                className="navigation-logo"
                logo={typeof withLogo === "string" ? withLogo : ""}
                burgerLogo={burgerLogo}
                onClick={onLogoClick}
              />
            ) : null}
            <ArrowButton
              isRootFolder={isRootFolder}
              showBackButton={showBackButton}
              onBackToParentFolder={onBackToParentFolder}
            />

            {showTitle ? navigationTitleContainerNode : null}

            <ControlButtons
              buttonRef={buttonRef}
              addButtonRef={addButtonRef}
              isRootFolder={isRootFolder}
              canCreate={canCreate}
              getContextOptionsFolder={getContextOptionsFolder}
              getContextOptionsPlus={getContextOptionsPlus}
              toggleInfoPanel={toggleInfoPanel}
              isInfoPanelVisible={isInfoPanelVisible}
              isDesktop={isDesktop}
              titles={titles}
              withMenu={withMenu}
              onPlusClick={onPlusClick}
              isFrame={isFrame}
              isPublicRoom={isPublicRoom}
              isTrashFolder={isTrashFolder}
              showTitle={showTitle}
              navigationButtonLabel={navigationButtonLabel}
              onNavigationButtonClick={onNavigationButtonClick}
              tariffBar={tariffBar}
              title={title}
              onContextOptionsClick={onContextOptionsClick}
              isMobile={currentDeviceType !== DeviceType.desktop}
              isMobileOnly={currentDeviceType === DeviceType.mobile}
              contextButtonAnimation={contextButtonAnimation}
              guidAnimationVisible={guidAnimationVisible}
              setGuidAnimationVisible={setGuidAnimationVisible}
              isContextButtonVisible={isContextButtonVisible}
              isPlusButtonVisible={isPlusButtonVisible}
              contextMenuHeader={contextMenuHeader}
              analyzeResponsesButton={analyzeResponsesButton}
              beforeContextButton={beforeContextButton}
              toggleChatPanel={toggleChatPanel}
              isChatPanelVisible={isChatPanelVisible}
              hideChatButton={hideChatButton}
            />
          </div>
          {/* Rendered only when it actually holds something: the container
              carries a 20px inline-start margin, and an empty one still
              reserves it, pushing the control buttons away from the header's
              trailing edge below the desktop breakpoint. */}
          {showChatButton || showInfoPanelToggle ? (
            <div className={styles.buttonsContainer}>
              {showChatButton ? (
                <AiChatButton
                  id="ai-chat-button"
                  toggleChatPanel={toggleChatPanel!}
                  isChatPanelVisible={isChatPanelVisible ?? false}
                  titles={titles}
                />
              ) : null}
              {showInfoPanelToggle ? (
                <ToggleInfoPanelButton
                  id="info-panel-toggle--open"
                  isRootFolder={isRootFolder}
                  toggleInfoPanel={toggleInfoPanel}
                  isInfoPanelVisible={isInfoPanelVisible}
                  titles={titles}
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </Consumer>
  );
};

export default React.memo(Navigation);
