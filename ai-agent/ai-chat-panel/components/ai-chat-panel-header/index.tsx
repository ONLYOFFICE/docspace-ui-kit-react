// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useStores } from "@onlyoffice/ai-chat";

import { IconButton } from "../../../../components/icon-button";
import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";

import ExpandIcon from "../../../../assets/icons/17/expand.svg";
import CollapseIcon from "../../../../assets/icons/17/collapse.svg";
import CrossIcon from "../../../../assets/icons/17/cross.react.svg";
import PlusIcon from "../../../../assets/icons/12/plus.svg";

import type { AiChatPanelHeaderProps } from "./AiChatPanelHeader.types";
import styles from "./AiChatPanelHeader.module.scss";

export type { AiChatPanelHeaderProps } from "./AiChatPanelHeader.types";

const AiChatPanelHeader = ({
  title,
  titleId,
  extras,
  rightExtras,
  isFullscreen = false,
  onToggleFullscreen,
  isFullscreenToggleDisabled = false,
  onClose,
  enterFullscreenTooltip,
  exitFullscreenTooltip,
  closeTooltip,
  className,
}: AiChatPanelHeaderProps) => {
  const { t } = useTranslation("Common");
  const stores = useStores();
  const startNewChat = stores.useThreadsStore((s) => s.onSwitchToNewThread);

  const renderTitle = () => {
    if (title === undefined || title === null) return null;
    if (typeof title === "string") {
      return (
        <Text
          id={titleId}
          className={styles.title}
          fontSize="16px"
          fontWeight={700}
          truncate
        >
          {title}
        </Text>
      );
    }
    return (
      <span id={titleId} className={styles.title}>
        {title}
      </span>
    );
  };

  return (
    <div className={classNames(styles.header, className)}>
      <div className={styles.left}>
        {renderTitle()}
        <Button
          primary
          icon={<PlusIcon />}
          onClick={startNewChat}
          size={ButtonSize.small}
          className={styles.newChatButton}
          label={t("Common:AINewChat")}
          aria-label={t("Common:AINewChat")}
        />
        {extras ? <div className={styles.extras}>{extras}</div> : null}
      </div>

      <div className={styles.actions}>
        {rightExtras}
        {onToggleFullscreen ? (
          <IconButton
            iconNode={isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
            size={17}
            className={classNames(styles.fullscreenToggle, {
              [styles.disabled]: isFullscreenToggleDisabled,
            })}
            onClick={onToggleFullscreen}
            isDisabled={isFullscreenToggleDisabled}
            tooltipId={
              isFullscreenToggleDisabled
                ? undefined
                : "ai-chat-panel-fullscreen-tooltip"
            }
            tooltipContent={
              isFullscreenToggleDisabled
                ? undefined
                : isFullscreen
                  ? exitFullscreenTooltip
                  : enterFullscreenTooltip
            }
            dataTestId="ai-chat-panel-fullscreen"
          />
        ) : null}
        {onClose ? (
          <IconButton
            iconNode={<CrossIcon />}
            size={17}
            onClick={onClose}
            tooltipId="ai-chat-panel-close-tooltip"
            tooltipContent={closeTooltip}
            dataTestId="ai-chat-panel-close"
          />
        ) : null}
      </div>
    </div>
  );
};

export default AiChatPanelHeader;
