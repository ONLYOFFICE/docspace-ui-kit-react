import React from "react";
import { isIOS, isMobileOnly, isSafari } from "react-device-detect";
import classNames from "classnames";

import { DialogModalSkeleton } from "./skeletons/Dialog.modal";
import { DialogAsideSkeleton } from "./skeletons/Dialog.aside";
import { Scrollbar } from "../../scrollbar";
import { AsideHeader } from "../../aside";
import styles from "../ModalDialog.module.scss";
import { ModalBackdrop } from "./ModalBackdrop";
import { FormWrapper } from "./FormWrapper";
import { ModalSubComponentsProps } from "../ModalDialog.types";

const ASIDE_PADDING_AFTER_LAST_ITEM = "12px";

const Modal = ({
  ref,
  sheetRef,
  id,
  style,
  className,
  currentDisplayType,
  withBodyScroll,
  isScrollLocked,
  isLarge,
  isHuge,
  zIndex,
  autoMaxHeight,
  autoMaxWidth,
  onClose,
  onBackClick,
  isLoading,
  header,
  body,
  footer,
  container,
  visible,
  withFooterBorder,
  modalSwipeOffset,
  containerVisible,
  isDoubleFooterLine,

  withForm,
  withoutPadding,
  withoutHeaderMargin,
  hideContent,

  isInvitePanelLoader = false,
  onSubmit,
  withBodyScrollForcibly = false,
  withBorder = false,
  dataTestId,
  scrollbarCreateContext,
  backdropVisible = true,
  closeOnBackdropClick = true,
  ...rest
}: ModalSubComponentsProps) => {
  const internalContentRef = React.useRef<null | HTMLDivElement>(null);
  const contentRef = sheetRef ?? internalContentRef;

  const headerComponent = React.isValidElement(header)
    ? (header.props as { children: React.ReactNode }).children
    : null;
  const bodyComponent = React.isValidElement(body)
    ? (body.props as { children: React.ReactNode }).children
    : null;
  const footerComponent = React.isValidElement(footer)
    ? (footer.props as { children: React.ReactNode }).children
    : null;
  const containerComponent = React.isValidElement(container)
    ? (container.props as { children: React.ReactNode }).children
    : null;

  const validateOnMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "modal-onMouseDown-close" && closeOnBackdropClick)
      onClose?.();
  };

  const headerProps = React.isValidElement(header)
    ? (header?.props as { className?: string })
    : { className: "" };
  const bodyProps = React.isValidElement(body)
    ? (body?.props as {
        className?: string;
        ref?: React.RefObject<HTMLDivElement | null>;
      })
    : { className: "" };
  const footerProps = React.isValidElement(footer)
    ? (footer?.props as { className?: string })
    : { className: "" };

  const onTouchMove = () => {
    const { activeElement } = document;
    if (
      activeElement instanceof HTMLElement &&
      activeElement?.tagName === "INPUT"
    ) {
      activeElement.blur();
    }
  };

  const onFocusAction = () => {
    document.addEventListener("touchmove", onTouchMove);
  };

  const onBlurAction = () => {
    document.removeEventListener("touchmove", onTouchMove);
  };

  const iOSActions =
    isMobileOnly && isIOS && isSafari
      ? { onFocus: onFocusAction, onBlur: onBlurAction }
      : {};

  const contentMarginBottom =
    modalSwipeOffset && modalSwipeOffset < 0
      ? `${modalSwipeOffset * 1.1}px`
      : "0px";

  const dialogClassName = classNames(
    styles.dialog,
    className,
    "not-selectable",
    "dialog",
  );

  const contentClassName = classNames(styles.content, {
    [styles.visible]: visible,
    [styles.large]: isLarge,
    [styles.huge]: isHuge,
    [styles.displayTypeModal]: currentDisplayType === "modal",
    [styles.displayTypeAside]: currentDisplayType === "aside",
    [styles.autoMaxHeight]: autoMaxHeight,
    [styles.autoMaxWidth]: autoMaxWidth,
    [styles.withBorder]: withBorder,
  });

  const headerClassName = classNames(
    styles.header,
    "modal-header",
    headerProps.className,
    {
      [styles.displayTypeModal]: currentDisplayType === "modal",
      [styles.withoutHeaderMargin]: withoutHeaderMargin,
    },
  );

  const bodyClassName = classNames(
    styles.body,
    "modal-body",
    bodyProps.className,
    {
      [styles.withBodyScroll]: withBodyScroll,
      [styles.scrollLocked]: isScrollLocked,
      [styles.hasFooter]: !!footer,
      [styles.displayTypeModal]: currentDisplayType === "modal",
      [styles.displayTypeAside]: currentDisplayType === "aside",
      [styles.withoutPadding]: withoutPadding,
    },
  );

  const footerClassName = classNames(
    styles.footer,
    "modal-footer",
    footerProps.className,
    {
      [styles.withFooterBorder]: withFooterBorder,
      [styles.doubleFooterLine]: isDoubleFooterLine,
    },
  );

  return (
    <div
      id={id}
      ref={ref}
      className={classNames(styles.modal, {
        [styles.modalActive]: visible,
      })}
      data-testid={dataTestId ?? "modal"}
    >
      <ModalBackdrop
        className={classNames({
          [styles.modalBackdropActive]: visible,
          [styles.hideBackdrop]: visible && !backdropVisible,
          "backdrop-active": visible,
        })}
        zIndex={zIndex}
      >
        <div
          id="modal-onMouseDown-close"
          className={dialogClassName}
          role="dialog"
          aria-modal="true"
          style={style}
          onMouseDown={validateOnMouseDown}
        >
          {!hideContent ? (
            <div
              id="modal-dialog"
              ref={contentRef}
              style={{ marginBottom: contentMarginBottom }}
              className={contentClassName}
              data-testid="modal-dialog"
            >
              {isLoading ? (
                currentDisplayType === "modal" ? (
                  <DialogModalSkeleton
                    isLarge={isLarge}
                    withFooterBorder={withFooterBorder}
                  />
                ) : (
                  <DialogAsideSkeleton
                    withoutAside
                    isPanel={false}
                    withFooterBorder={withFooterBorder}
                    isInvitePanelLoader={isInvitePanelLoader}
                  />
                )
              ) : container &&
                containerVisible &&
                currentDisplayType !== "modal" ? (
                containerComponent
              ) : (
                <FormWrapper withForm={withForm || false} onSubmit={onSubmit}>
                  {header ? (
                    <AsideHeader
                      id="modal-header-swipe"
                      className={headerClassName}
                      header={headerComponent}
                      onCloseClick={onClose}
                      onBackClick={onBackClick}
                      {...rest}
                    />
                  ) : null}

                  {body ? (
                    <div
                      {...bodyProps}
                      {...iOSActions}
                      className={bodyClassName}
                    >
                      {withBodyScrollForcibly ||
                      (currentDisplayType === "aside" && withBodyScroll) ? (
                        <Scrollbar
                          id="modal-scroll"
                          className="modal-scroll"
                          noScrollY={isScrollLocked}
                          paddingAfterLastItem={ASIDE_PADDING_AFTER_LAST_ITEM}
                          createContext={scrollbarCreateContext}
                        >
                          {bodyComponent}
                        </Scrollbar>
                      ) : (
                        bodyComponent
                      )}
                    </div>
                  ) : null}
                  {footer ? (
                    <div {...footerProps} className={footerClassName}>
                      {footerComponent}
                    </div>
                  ) : null}
                </FormWrapper>
              )}
            </div>
          ) : null}
        </div>
      </ModalBackdrop>
    </div>
  );
};

export { Modal };
