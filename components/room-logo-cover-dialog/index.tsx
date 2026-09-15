import React from "react";
import classNames from "classnames";

import { isMobile, isDesktop, isTablet } from "../../utils/device";
import { globalColors } from "../../providers/theme/themes";

import { ModalDialog, ModalDialogType } from "../modal-dialog";
import { Button, ButtonSize } from "../button";

import { RoomLogoCover } from "./RoomLogoCover";

import type {
  RoomLogoCoverDialogProps,
  ICover,
} from "./RoomLogoCoverDialog.types";
import styles from "./RoomLogoCoverDialog.module.scss";

const PADDING_HEIGHT = 84;
const HEIGHT_WITHOUT_BODY = 158;
const CONTENT_SCROLL_DIFF = 260;
const DESKTOP_HEIGHT = 648;
const TABLET_HEIGHT = 854;
const BREAKPOINT_GENERAL_SCROLL = 640;
const HEADER = 70;
const BUTTONS = 80;

const RoomLogoCoverDialog = ({
  t,
  visible,
  covers,
  title = "",
  initialColor,
  initialCover,
  isBaseTheme,
  currentColorScheme,
  onClose,
  onApply,
}: RoomLogoCoverDialogProps) => {
  const defaultColor = initialColor ?? globalColors.logoColors[0];

  const [openColorPicker, setOpenColorPicker] = React.useState(false);

  const selectionRef = React.useRef<{ color: string; cover: ICover | null }>({
    color: defaultColor,
    cover: initialCover ?? null,
  });

  const [height, setHeight] = React.useState(
    `${isDesktop() ? DESKTOP_HEIGHT : TABLET_HEIGHT}px`,
  );
  const [view, setView] = React.useState(isDesktop() ? "desktop" : "tablet");
  const [scrollBodyHeight, setScrollBodyHeight] = React.useState<number | null>(
    null,
  );

  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!visible) return;
    setOpenColorPicker(false);
    selectionRef.current = {
      color: initialColor ?? globalColors.logoColors[0],
      cover: initialCover ?? null,
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const recalculateHeight = React.useCallback(() => {
    const screenHeight = document.documentElement.clientHeight;
    const horizontalScreenOrientation =
      screenHeight < document.documentElement.clientWidth;
    const useGeneralScroll =
      horizontalScreenOrientation && screenHeight < BREAKPOINT_GENERAL_SCROLL;

    if (useGeneralScroll)
      setScrollBodyHeight(screenHeight - HEADER - BUTTONS - PADDING_HEIGHT);
    else if (scrollBodyHeight) setScrollBodyHeight(null);

    if (contentRef.current) {
      const contentHeight = contentRef.current.getBoundingClientRect().height;
      const h = contentHeight + HEIGHT_WITHOUT_BODY;
      const maxH = isDesktop() ? DESKTOP_HEIGHT : TABLET_HEIGHT;

      if (isTablet() && view === "desktop") {
        setView("tablet");
        setHeight(`${maxH}px`);
        return;
      }
      if (isDesktop() && view === "tablet") {
        setView("desktop");
        setHeight(`${maxH}px`);
        return;
      }
      if (h + PADDING_HEIGHT >= window.innerHeight) {
        setHeight(`${window.innerHeight - PADDING_HEIGHT}px`);
      } else if (isDesktop() ? DESKTOP_HEIGHT <= h : TABLET_HEIGHT <= h) {
        setHeight(`${maxH}px`);
      } else {
        setHeight(`${window.innerHeight - PADDING_HEIGHT}px`);
      }
    }
  }, [view, scrollBodyHeight]);

  React.useLayoutEffect(() => {
    recalculateHeight();
  }, [visible, recalculateHeight]);

  React.useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    return () => window.removeEventListener("resize", recalculateHeight);
  }, [recalculateHeight]);

  const scrollH = `${Number(height.replace("px", "")) - CONTENT_SCROLL_DIFF}px`;

  const handleSubmit = () => {
    onApply(selectionRef.current.color, selectionRef.current.cover);
  };

  const handleClose = () => {
    if (openColorPicker) return;
    onClose();
  };

  return (
    <ModalDialog
      visible={visible}
      autoMaxHeight
      className={classNames(styles.roomLogoCoverModal, {
        [styles.hasScrollBody]: !!scrollBodyHeight,
      })}
      style={
        {
          "--dialog-height": height,
          "--scroll-body-height": scrollBodyHeight
            ? `${scrollBodyHeight}px`
            : undefined,
        } as React.CSSProperties
      }
      onClose={handleClose}
      displayType={isMobile() ? ModalDialogType.aside : ModalDialogType.modal}
      withBodyScroll
      withBodyScrollForcibly={!!scrollBodyHeight}
      isScrollLocked={openColorPicker}
      dataTestId="room_logo_cover_dialog"
    >
      <ModalDialog.Header>{t("Common:RoomCover")}</ModalDialog.Header>
      <ModalDialog.Body>
        <RoomLogoCover
          key={visible ? "open" : "closed"}
          t={t}
          covers={covers}
          title={title}
          initialColor={initialColor}
          initialCover={initialCover}
          openColorPicker={openColorPicker}
          isBaseTheme={isBaseTheme}
          currentColorScheme={currentColorScheme}
          forwardedRef={contentRef}
          scrollHeight={scrollH}
          generalScroll={!!scrollBodyHeight}
          onChange={(color, cover) => {
            selectionRef.current = { color, cover };
          }}
          setOpenColorPicker={setOpenColorPicker}
        />
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          scale
          primary
          tabIndex={0}
          size={ButtonSize.normal}
          label={t("Common:ApplyButton")}
          onClick={handleSubmit}
          testId="room_logo_cover_apply_button"
        />
        <Button
          scale
          tabIndex={0}
          onClick={handleClose}
          size={ButtonSize.normal}
          label={t("Common:CancelButton")}
          testId="room_logo_cover_cancel_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export { RoomLogoCoverDialog };
export { RoomLogoCover };
export type { RoomLogoCoverDialogProps, ICover };
export type { RoomLogoCoverProps } from "./RoomLogoCover";

