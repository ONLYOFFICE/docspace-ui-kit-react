import { useRef } from "react";
import classNames from "classnames";
import { ReactSVG } from "react-svg";

import CrossIcon from "../../assets/icons/12/cross.react.svg";
import PeopleIcon from "../../assets/icons/16/people.react.svg";

import { Text } from "../text";
import { useCommonTranslation } from "../../utils/i18n";
import { useLiveRegionTextOf } from "../../hooks/useLiveRegionText";

import styles from "./PublicRoomBar.module.scss";
import type { PublicRoomBarProps } from "./PublicRoomBar.types";

const defaultIcon = (
  <div>
    <PeopleIcon />
  </div>
);

const PublicRoomBar = (props: PublicRoomBarProps) => {
  const {
    ref,
    headerText,
    bodyText,
    iconName = defaultIcon,
    hideHeader,
    onClose,
    barIsVisible,
    className,
    dataTestId,
    closeLabel: closeLabelProp,
    live = false,
    ...rest
  } = props;

  const t = useCommonTranslation();
  const closeLabel = closeLabelProp ?? (t("CloseButton") || "Close");

  const headerAs = typeof headerText !== "string" ? "div" : undefined;
  const bodyAs = typeof bodyText !== "string" ? "div" : undefined;

  const icon =
    typeof iconName === "string" ? <ReactSVG src={iconName} /> : iconName;

  // With `live`, a visually hidden status region beside the text takes the
  // text's words a moment after the bar mounts, since a region inserted
  // together with its text is usually not announced. The text itself is
  // drawn at once and is not live, and the close button is outside both.
  const textRef = useRef<HTMLDivElement>(null);
  const announcement = useLiveRegionTextOf(textRef);

  return (
    <div
      className={classNames(
        "public-room-bar",
        styles.container,
        {
          [styles.barVisible]: barIsVisible,
        },
        className,
      )}
      {...rest}
      ref={ref}
      data-testid={dataTestId ?? "public_room_bar"}
    >
      <div className={styles.textContainer} ref={textRef}>
        {!hideHeader ? (
          <div className={styles.headerBody}>
            <div className={styles.headerIcon}>{icon}</div>
            <Text className={styles.header} fontWeight={600} as={headerAs}>
              {headerText}
            </Text>
          </div>
        ) : null}
        <Text
          className={styles.body}
          fontSize="12px"
          fontWeight={400}
          as={bodyAs}
        >
          {bodyText}
        </Text>
      </div>
      {live ? (
        <span
          role="status"
          className={styles.visuallyHidden}
          data-testid="public_room_bar_announcement"
        >
          {announcement}
        </span>
      ) : null}

      {/* A native button; its test id is kept from the IconButton it replaced. */}
      {onClose ? (
        <button
          type="button"
          className={styles.closeIcon}
          aria-label={closeLabel}
          onClick={() => onClose()}
          data-testid="icon-button"
        >
          <CrossIcon aria-hidden="true" focusable="false" />
        </button>
      ) : null}
    </div>
  );
};
PublicRoomBar.displayName = "PublicRoomBar";

export type { PublicRoomBarProps };
export default PublicRoomBar;
