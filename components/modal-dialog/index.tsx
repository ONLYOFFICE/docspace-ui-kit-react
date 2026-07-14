/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
