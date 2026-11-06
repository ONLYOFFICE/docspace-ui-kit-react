import ArrowIcon from "../../../../assets/arrow-left.react.svg";
import ArrowTabletIcon from "../../../../assets/arrow-left.long.react.svg";

import { IconButton } from "../../../icon-button";
import { Text } from "../../../text";
import { DeviceType } from "../../../../enums";
import { useCommonTranslation } from "../../../../utils";
import { activateOnButtonKey } from "../../../../utils/keyboard-activation";

import { ArticleHeaderLoader } from "../../skeletons";

import styles from "../../Article.module.scss";

const BackButton = ({
  showText,
  currentDeviceType,
  onLogoClickAction,
  isLoading,
  toggleArticleOpen,
  navigate,
  onBack,
  label,
}: {
  showText: boolean;
  currentDeviceType: DeviceType;
  onLogoClickAction?: () => void;
  isLoading?: boolean;
  toggleArticleOpen?: () => void;
  navigate?: (path: string) => void;
  onBack?: () => void;
  label?: string;
}) => {
  const t = useCommonTranslation();

  const onClickBack = () => {
    onLogoClickAction?.();

    if (toggleArticleOpen && currentDeviceType === DeviceType.mobile)
      toggleArticleOpen();

    if (onBack) {
      onBack();
    } else if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  };

  // The row is a div: a button to the keyboard.
  const onKeyDownBack = (e: React.KeyboardEvent<HTMLDivElement>) =>
    activateOnButtonKey(e, onClickBack);

  // When the article is collapsed (showText === false) the column shrinks to
  // the narrow variant, so use the tablet arrow/layout even on desktop —
  // otherwise the desktop styling (margin-inline-start) pushes the arrow
  // off-center in the collapsed column.
  const isDesktop = currentDeviceType === DeviceType.desktop && showText;
  const text = label ?? t("Back");
  const icon = isDesktop ? <ArrowIcon /> : <ArrowTabletIcon />;

  if (isLoading)
    return (
      <ArticleHeaderLoader
        height="18px"
        width="211px"
        showText={showText}
        className={styles.backButton}
      />
    );
  return (
    <div
      className={styles.backButton}
      data-show-article={showText ? "true" : "false"}
      data-arrow-type={isDesktop ? "desktop" : "tablet"}
      onClick={onClickBack}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDownBack}
      // Collapsed, only the arrow shows: the name comes from here instead.
      aria-label={showText ? undefined : text}
    >
      <IconButton className={styles.arrowIcon} iconNode={icon} isClickable />
      {showText ? <Text truncate>{text}</Text> : null}
    </div>
  );
};

export default BackButton;
