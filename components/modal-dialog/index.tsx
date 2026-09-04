import React, { useEffect, useState } from "react";
import { isSafari, isTablet } from "react-device-detect";
import throttle from "lodash/throttle";

import { Portal } from "../portal";

import { Modal } from "./sub-components/Modal";

import {
  getCurrentDisplayType,
  handleTouchMove,
  handleTouchStart,
  parseChildren,
} from "./ModalDialog.utils";
import {
  MODAL_DIALOG_BODY_NAME,
  MODAL_DIALOG_CONTAINER_NAME,
  MODAL_DIALOG_FOOTER_NAME,
  MODAL_DIALOG_HEADER_NAME,
} from "./ModalDialog.constants";
import { ModalDialogProps } from "./ModalDialog.types";
import { ModalDialogType } from "./ModalDialog.enums";

const Header = ({ children }: { children: React.ReactNode }) => null;
Header.displayName = MODAL_DIALOG_HEADER_NAME;

const Body = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) => null;
Body.displayName = MODAL_DIALOG_BODY_NAME;

const Footer = ({ children }: { children: React.ReactNode }) => null;
Footer.displayName = MODAL_DIALOG_FOOTER_NAME;

const Container = ({ children }: { children: React.ReactNode }) => null;
Container.displayName = MODAL_DIALOG_CONTAINER_NAME;

const ModalDialog = ({
  ref,
  id,
  style,
  children,
  visible,
  onClose,
  onBackClick,

  className,
  displayType = ModalDialogType.modal,
  displayTypeDetailed,

  autoMaxHeight,
  autoMaxWidth,

  isScrollLocked,

  isDoubleFooterLine,

  embedded,
  withForm,
  withFooterBorder,
  zIndex = 310,
  isLarge = false,
  isHuge = false,
  isLoading = false,
  isCloseable = true,
  withBodyScroll = false,
  containerVisible = false,
  withoutPadding = false,
  withoutHeaderMargin = false,
  hideContent = false,
  dataTestId,
  backdropVisible,

  ...rest
}: ModalDialogProps) => {
  const onCloseEvent = React.useCallback(
    (e?: React.MouseEvent) => {
      if (embedded) return;
      if (isCloseable) onClose?.(e);
    },
    [embedded, isCloseable, onClose],
  );

  const [currentDisplayType, setCurrentDisplayType] = useState(
    getCurrentDisplayType(displayType, displayTypeDetailed),
  );
  const [modalSwipeOffset, setModalSwipeOffset] = useState(0);

  const returnWindowPositionAfterKeyboard = () => {
    if (isSafari && isTablet && window.scrollY !== 0) window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onResize = throttle(() => {
      setCurrentDisplayType(
        getCurrentDisplayType(displayType, displayTypeDetailed),
      );
    }, 300);

    onResize();

    const onSwipe = (e: TouchEvent) =>
      setModalSwipeOffset(handleTouchMove(e, onClose));

    const onSwipeEnd = () => setModalSwipeOffset(0);

    const onKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "Esc" || e.key === "Escape") && visible) onCloseEvent();

      if (
        e.key === "Backspace" &&
        e.target instanceof HTMLElement &&
        e.target.nodeName !== "INPUT" &&
        e.target.nodeName !== "TEXTAREA" &&
        visible
      ) {
        onBackClick?.();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyPress);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", onSwipe);
    window.addEventListener("touchend", onSwipeEnd);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keyup", onKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", onSwipe);
      window.addEventListener("touchend", onSwipeEnd);
    };
  }, [
    displayType,
    displayTypeDetailed,
    onClose,
    onCloseEvent,
    visible,
    onBackClick,
  ]);

  useEffect(() => {
    return () => {
      returnWindowPositionAfterKeyboard();
    };
  }, []);

  const [header, body, footer, container] = parseChildren(
    children,
    Header.displayName,
    Body.displayName,
    Footer.displayName,
    Container.displayName,
  );

  return (
    <Portal
      element={
        <Modal
          ref={ref}
          withForm={withForm}
          isDoubleFooterLine={isDoubleFooterLine}
          id={id}
          style={style}
          className={className}
          currentDisplayType={currentDisplayType}
          withBodyScroll={withBodyScroll}
          isScrollLocked={isScrollLocked}
          isLarge={isLarge || false}
          isHuge={isHuge || false}
          zIndex={zIndex}
          autoMaxHeight={autoMaxHeight}
          autoMaxWidth={autoMaxWidth}
          withFooterBorder={
            withFooterBorder ?? displayType === ModalDialogType.aside
          }
          onClose={onCloseEvent}
          onBackClick={onBackClick}
          isLoading={isLoading}
          header={header}
          body={body}
          footer={footer}
          container={container}
          visible={visible}
          modalSwipeOffset={modalSwipeOffset}
          containerVisible={containerVisible}
          isCloseable={isCloseable ? !embedded : false}
          embedded={embedded}
          withoutPadding={withoutPadding}
          withoutHeaderMargin={withoutHeaderMargin}
          hideContent={hideContent}
          dataTestId={dataTestId}
          backdropVisible={backdropVisible}
          {...rest}
        />
      }
    />
  );
};

ModalDialog.Header = Header;
ModalDialog.Body = Body;
ModalDialog.Footer = Footer;
ModalDialog.Container = Container;

export { ModalDialog };

export { ModalDialogType } from "./ModalDialog.enums";

export { DialogAsideSkeleton } from "./sub-components/skeletons/Dialog.aside";
export { DialogModalSkeleton } from "./sub-components/skeletons/Dialog.modal";
export { DialogReassignmentSkeleton } from "./sub-components/skeletons/Dialog.reassignment";
