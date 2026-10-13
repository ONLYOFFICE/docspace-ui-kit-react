import classNames from "classnames";
import { ReactSVG } from "react-svg";

import CrossIcon from "../../assets/icons/12/cross.react.svg";
import PeopleIcon from "../../assets/icons/16/people.react.svg";

import { Text } from "../text";
import { useCommonTranslation } from "../../utils/i18n";
import { useLiveRegionText } from "../../hooks/useLiveRegionText";

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
    ...rest
  } = props;

  const t = useCommonTranslation();
  const closeLabel = closeLabelProp ?? (t("CloseButton") || "Close");

  const headerAs = typeof headerText !== "string" ? "div" : undefined;
  const bodyAs = typeof bodyText !== "string" ? "div" : undefined;

  const icon =
    typeof iconName === "string" ? <ReactSVG src={iconName} /> : iconName;

  const text = (
    <>
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
    </>
  );

  // A region inserted together with its text is usually not announced, so
  // the live region mounts empty and the text is rendered into it right
  // after mount.
  const liveText = useLiveRegionText(text);

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
      {/* A polite live region around the text only, so the announcement
          leaves out the close button. It is filled after mount, above. */}
      <div className={styles.textContainer} role="status">
        {liveText}
      </div>

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
