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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ModalSubComponentsProps) => {
  const internalContentRef = React.useRef<null | HTMLDivElement>(null);
  const contentRef = sheetRef ?? internalContentRef;

  // Opened, the dialog takes the focus unless something inside already has
  // it (a field the caller focuses itself), so Tab starts in the dialog rather
  // than in the page behind it. Closed, the focus goes back to where it was --
  // as long as nothing else has taken it in between.
  //
  // Where it was is read before the commit that shows the dialog touches the
  // DOM: a field with `autoFocus`, or one the content focuses in its own
  // effect, already has the focus by the time the effect below runs, and used
  // to pass for the opener -- so such a dialog never handed the focus back.
  const openerRef = React.useRef<Element | null>(null);
  React.useInsertionEffect(() => {
    if (visible) openerRef.current = document.activeElement;
  }, [visible]);

  React.useEffect(() => {
    if (!visible) return;
    const content = contentRef.current;
    if (!content) return;

    const previous = openerRef.current;
    if (!content.contains(document.activeElement))
      content.focus({ preventScroll: true });

    return () => {
      const { activeElement } = document;
      // `hideContent` unmounts the content node and mounts a new one while
      // the dialog stays open, so the node captured above may be detached by
      // now; the ref holds the one the focus is actually in.
      const focusLeftWithDialog =
        !activeElement ||
        activeElement === document.body ||
        content.contains(activeElement) ||
        !!contentRef.current?.contains(activeElement);
      if (
        focusLeftWithDialog &&
        previous instanceof HTMLElement &&
        previous.isConnected
      )
        previous.focus({ preventScroll: true });
    };
  }, [visible, contentRef]);

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
      // Closed, the dialog stays mounted (the aside slides out, and callers
      // rely on the markup being there) but must not be a dialog to anyone:
      // `aria-hidden` takes it out of the accessibility tree, so a screen
      // reader is not told the rest of the page is inert by a dialog nobody
      // can see, and `inert` takes its controls out of the Tab order.
      aria-hidden={visible ? undefined : true}
      inert={!visible}
    >
      <ModalBackdrop
        className={classNames({
          [styles.modalBackdropActive]: visible,
          [styles.hideBackdrop]: visible && !backdropVisible,
          "backdrop-active": visible,
        })}
        zIndex={zIndex}
      >
        {/* The click-to-close layer. It used to carry `role="dialog"` and
            `aria-modal`, which put them on an element spanning the whole
            viewport and left the dialog itself unnamed: `aria-label` from the
            caller went into `...rest` and onto the header, and only when a
            header was rendered at all. The role belongs on the content. */}
        <div
          id="modal-onMouseDown-close"
          className={dialogClassName}
          style={style}
          onMouseDown={validateOnMouseDown}
        >
          {!hideContent ? (
            <div
              id="modal-dialog"
              ref={contentRef}
              role="dialog"
              tabIndex={-1}
              aria-modal={visible ? true : undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
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
