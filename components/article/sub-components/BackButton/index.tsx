import ArrowIcon from "../../../../assets/arrow-left.react.svg";
import ArrowTabletIcon from "../../../../assets/arrow-left.long.react.svg";

import { IconButton } from "../../../icon-button";
import { Text } from "../../../text";
import { DeviceType } from "../../../../enums";
import { useCommonTranslation } from "../../../../utils";

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

  // When the article is collapsed (showText === false) the column shrinks to
  // the narrow variant, so use the tablet arrow/layout even on desktop —
  // otherwise the desktop styling (margin-inline-start) pushes the arrow
  // off-center in the collapsed column.
  const isDesktop = currentDeviceType === DeviceType.desktop && showText;
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
    >
      <IconButton className={styles.arrowIcon} iconNode={icon} isClickable />
      {showText ? <Text truncate>{label ?? t("Back")}</Text> : null}
    </div>
  );
};

export default BackButton;
