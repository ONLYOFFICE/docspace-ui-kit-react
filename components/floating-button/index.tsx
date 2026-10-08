import React, { useMemo, forwardRef } from "react";

import UploadIcon from "../../assets/icons/24/upload.react.svg";
import TrashIcon from "../../assets/icons/24/trash.react.svg";
import ButtonAlertIcon from "../../assets/button.alert.react.svg";
import PlusIcon from "../../assets/icons/16/button.plus.react.svg";
import MinusIcon from "../../assets/icons/16/button.minus.react.svg";
import RefreshIcon from "../../assets/icons/16/refresh.react.svg";
import CloseIcon from "../../assets/close-icon.react.svg";
import ExportRoomIndexIcon from "../../assets/icons/24/export-room-index.react.svg";
import HorizontalDotsIcon from "../../assets/icons/16/horizontal-dots.react.svg";
import ArrowIcon from "../../assets/icons/16/top-arrow.react.svg";
import TickIcon from "../../assets/icons/12/tick.react.svg";
import StoppedIcon from "../../assets/icons/16/catalog.spam.react.svg";
import DeletePermanentlyIcon from "../../assets/icons/24/delete-permanently.react.svg";
import CopyIcon from "../../assets/icons/24/copy.react.svg";
import DownloadIcon from "../../assets/icons/24/download.react.svg";
import DuplicateIcon from "../../assets/icons/24/duplicate.react.svg";
import MarkAsReadIcon from "../../assets/icons/24/mark-as-read.react.svg";
import MoveIcon from "../../assets/icons/24/move.react.svg";
import FileIcon from "../../assets/icons/24/file.svg";
import BackupIcon from "../../assets/icons/24/backup.react.svg";

import classNames from "classnames";

import { useCommonTranslation } from "../../utils/i18n";

import { FloatingButtonProps } from "./FloatingButton.types";
import { FloatingButtonIcons } from "./FloatingButton.enums";
import styles from "./FloatingButton.module.scss";

const ICON_COMPONENTS = {
  [FloatingButtonIcons.upload]: <UploadIcon data-testid="icon-upload" />,
  [FloatingButtonIcons.other]: (
    <FileIcon className="icon-other" data-testid="icon-other" />
  ),
  [FloatingButtonIcons.trash]: <TrashIcon data-testid="icon-trash" />,
  [FloatingButtonIcons.move]: <MoveIcon data-testid="icon-move" />,
  [FloatingButtonIcons.plus]: <PlusIcon data-testid="icon-plus" />,
  [FloatingButtonIcons.minus]: <MinusIcon data-testid="icon-minus" />,
  [FloatingButtonIcons.refresh]: <RefreshIcon data-testid="icon-refresh" />,
  [FloatingButtonIcons.duplicate]: (
    <DuplicateIcon data-testid="icon-duplicate" />
  ),
  [FloatingButtonIcons.exportIndex]: (
    <ExportRoomIndexIcon data-testid="icon-exportIndex" />
  ),
  [FloatingButtonIcons.dots]: <HorizontalDotsIcon data-testid="icon-dots" />,
  [FloatingButtonIcons.arrow]: <ArrowIcon data-testid="icon-arrow" />,
  [FloatingButtonIcons.deletePermanently]: (
    <DeletePermanentlyIcon data-testid="icon-deletePermanently" />
  ),
  [FloatingButtonIcons.copy]: <CopyIcon data-testid="icon-copy" />,
  [FloatingButtonIcons.download]: <DownloadIcon data-testid="icon-download" />,
  [FloatingButtonIcons.markAsRead]: (
    <MarkAsReadIcon data-testid="icon-markAsRead" />
  ),
  [FloatingButtonIcons.backup]: <BackupIcon data-testid="icon-backup" />,
} as const;

const FloatingButton = forwardRef<HTMLDivElement, FloatingButtonProps>(
  (
    {
      id,
      className,
      style,
      icon = FloatingButtonIcons.other,
      iconUrl,
      alert = false,
      completed = false,
      stopped = false,
      onClick,
      color,
      clearUploadedFilesHistory,
      withoutProgress,
      showCancelButton,
      showCloseIcon,
      withoutStatus = false,
      percent,
      label,
      cancelLabel,
    },
    ref,
  ) => {
    const t = useCommonTranslation();

    const iconComponent = useMemo(() => {
      if (iconUrl) {
        // Decorative: the circle is named by `label`.
        return <img width={20} src={iconUrl} alt="" />;
      }
      return (
        ICON_COMPONENTS[icon] ?? ICON_COMPONENTS[FloatingButtonIcons.other]
      );
    }, [icon, iconUrl]);

    const handleProgressClear = () => {
      clearUploadedFilesHistory?.();
    };

    const buttonClassName = useMemo(() => {
      return classNames([className, "not-selectable"]) || "not-selectable";
    }, [className]);

    const accentIcons = [
      FloatingButtonIcons.upload,
      FloatingButtonIcons.trash,
      FloatingButtonIcons.deletePermanently,
      FloatingButtonIcons.other,
    ] as const;

    const isAccentIcon = accentIcons.includes(
      icon as (typeof accentIcons)[number],
    );

    const isCompleted = completed;

    // A positive number is a known progress and draws an arc. An absent
    // percent, or 0, spins the ring: the portal starts every operation at 0
    // and many never report a value in between, so 0 means "not known yet".
    const hasPercent =
      typeof percent === "number" && !Number.isNaN(percent) && percent > 0;
    const progressValue = hasPercent
      ? Math.min(100, Math.max(0, percent))
      : undefined;

    const buttonLabel = label ?? `${icon} button`;
    const cancelName = cancelLabel ?? (t("Common:CancelButton") || "Cancel");

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      // A real click, so onClick receives the mouse event it is typed for.
      e.currentTarget.click();
    };

    return (
      <div
        className={classNames(
          styles.floatingButtonWrapper,
          "layout-progress-bar_wrapper",
          { [styles.showCloseIcon]: showCloseIcon },
        )}
      >
        <div
          id={id}
          ref={ref}
          onClick={onClick}
          data-testid="floating-button"
          data-role="button"
          {...(onClick
            ? { role: "button", tabIndex: 0, onKeyDown }
            : { role: "img" })}
          aria-label={buttonLabel}
          className={classNames(styles.circleWrap, buttonClassName, {
            [styles.loading]: !isCompleted,
            [styles.completed]: isCompleted,
          })}
          style={
            color
              ? ({
                  "--floating-circle-button-background": color,
                  ...style,
                } as React.CSSProperties)
              : { ...style }
          }
        >
          <div
            className={classNames(styles.circle, {
              [styles.loading]: !isCompleted,
              [styles.completed]: isCompleted,
            })}
            data-testid="floating-button-progress"
          >
            {withoutProgress ? null : (
              <div
                className={classNames(styles.loader, {
                  [styles.withProgress]: hasPercent,
                })}
                {...(hasPercent && {
                  style: {
                    "--percent-percentage": `${progressValue}%`,
                  } as React.CSSProperties,
                })}
              />
            )}
            <div className={classNames(styles.floatingButton)}>
              <div
                className={classNames(styles.iconBox, "icon-box", {
                  [styles.accentIcon]: isAccentIcon,
                })}
              >
                {iconComponent}
              </div>
              {!withoutStatus && (stopped || alert || isCompleted) ? (
                <div
                  data-testid="floating-button-alert"
                  className={classNames(styles.alertIcon, {
                    [styles.stopped]: stopped,
                    [styles.alert]: !stopped && alert,
                    [styles.complete]: !stopped && !alert && isCompleted,
                  })}
                >
                  {stopped ? (
                    <StoppedIcon
                      className="stopped-icon"
                      data-testid="floating-button-stopped-icon"
                      style={{ overflow: "hidden", verticalAlign: "middle" }}
                    />
                  ) : alert ? (
                    <ButtonAlertIcon
                      data-testid="floating-button-alert-icon"
                      style={{ overflow: "hidden", verticalAlign: "middle" }}
                    />
                  ) : (
                    <TickIcon
                      className="tick-icon"
                      data-testid="floating-button-tick-icon"
                      style={{ overflow: "hidden", verticalAlign: "middle" }}
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {withoutProgress ? null : (
          // Outside the circle, whose role makes its children presentational.
          <div
            className={styles.visuallyHidden}
            role="progressbar"
            aria-label={buttonLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isCompleted ? 100 : progressValue}
            data-testid="floating-button-progressbar"
          />
        )}

        {showCancelButton ? (
          <button
            type="button"
            className="layout-progress-bar_close-icon"
            onClick={handleProgressClear}
            aria-label={cancelName}
            data-testid="floating-button-close-icon"
          >
            <CloseIcon aria-hidden="true" focusable="false" />
          </button>
        ) : null}
      </div>
    );
  },
);

FloatingButton.displayName = "FloatingButton";

export { FloatingButton, FloatingButtonIcons };
