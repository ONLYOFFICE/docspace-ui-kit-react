import React from "react";
import classNames from "classnames";

import DeveloperReactSvg from "../../../assets/icons/16/catalog.developer.react.svg";
import ArrowReactSvg from "../../../assets/arrow.right.react.svg";

import { DeviceType } from "../../../enums";
import { openingNewTab } from "../../../utils/openingNewTab";
import { Text } from "../../text";
import { TooltipContainer } from "../../tooltip";
import { useCommonTranslation } from "../../../utils/i18n";

import styles from "../Article.module.scss";
import { ArticleDevToolsBarProps } from "../Article.types";

const ArticleDevToolsBar = ({
  withCustomSlot,
  showText,
  articleOpen,
  currentDeviceType,
  toggleArticleOpen,
  path,
  navigate,
}: ArticleDevToolsBarProps) => {
  const onClick = (e: React.MouseEvent) => {
    const pathDevTools = path ?? "/developer-tools";

    if (openingNewTab(pathDevTools, e)) return;

    if (navigate) navigate(pathDevTools);
    else window.location.href = pathDevTools;

    if (articleOpen && currentDeviceType === DeviceType.mobile)
      toggleArticleOpen();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;

    onClick(e);
  };

  const t = useCommonTranslation();

  return (
    <TooltipContainer
      as="div"
      className={classNames(styles.wrapper)}
      onClick={onClick}
      onMouseDown={onMouseDown}
      data-testid="dev-tools-bar"
      data-show-text={showText ? "true" : "false"}
      data-icon-only={showText ? "false" : "true"}
      data-with-custom-slot={withCustomSlot ? "true" : "false"}
      data-hide-profile-block={articleOpen ? "true" : "false"}
      title={showText ? undefined : t("DeveloperTools")}
    >
      <DeveloperReactSvg className="icon" />
      {showText ? (
        <>
          <Text fontWeight={600} fontSize="12px" className="label">
            {t("DeveloperTools")}
          </Text>
          <ArrowReactSvg className="arrow" />
        </>
      ) : null}
    </TooltipContainer>
  );
};

export default ArticleDevToolsBar;
