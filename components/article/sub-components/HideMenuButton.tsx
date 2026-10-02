import React from "react";

import ArticleHideMenuReactSvg from "../../../assets/article-hide-menu.react.svg";
import ArticleShowMenuReactSvg from "../../../assets/article-show-menu.react.svg";

import { Text } from "../../text";
import { useCommonTranslation } from "../../../utils/i18n";

import styles from "../Article.module.scss";
import { ArticleHideMenuButtonProps } from "../Article.types";

const HideArticleMenuButton = ({
  showText,
  hideProfileBlock,
  toggleShowText,
  withCustomSlot,
}: ArticleHideMenuButtonProps) => {
  const t = useCommonTranslation();

  return (
    <div
      className={styles.hideArticleMenuButton}
      onClick={toggleShowText}
      data-show-text={showText ? "true" : "false"}
      data-with-custom-slot={withCustomSlot ? "true" : "false"}
      data-hide-profile-block={hideProfileBlock ? "true" : "false"}
    >
      {showText ? (
        <div className="article-hide-menu-container">
          <ArticleHideMenuReactSvg className="article-hide-menu-icon_svg" />
          <Text
            className="article-hide-menu-text"
            fontWeight={600}
            fontSize="15px"
            lineHeight="16px"
            noSelect
            truncate
          >
            {t("HideArticleMenu")}
          </Text>
        </div>
      ) : (
        <div
          className="article-show-menu-container"
          id="document_catalog-show-menu"
        >
          <ArticleShowMenuReactSvg className="article-show-menu-icon_svg" />
        </div>
      )}
    </div>
  );
};

export default HideArticleMenuButton;
