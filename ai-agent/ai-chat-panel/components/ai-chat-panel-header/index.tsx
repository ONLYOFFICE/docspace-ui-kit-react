import classNames from "classnames";

import { IconButton } from "../../../../components/icon-button";
import { Text } from "../../../../components/text";

import { ChatToolbar } from "../../../chat-toolbar";

import ExpandIcon from "../../../../assets/icons/17/expand.svg";
import CollapseIcon from "../../../../assets/icons/17/collapse.svg";
import CrossIcon from "../../../../assets/icons/17/cross.react.svg";

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
  onClose,
  enterFullscreenTooltip,
  exitFullscreenTooltip,
  closeTooltip,
  className,
}: AiChatPanelHeaderProps) => {
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
        <ChatToolbar className={styles.toolbar} />
        {extras ? <div className={styles.extras}>{extras}</div> : null}
      </div>

      <div className={styles.actions}>
        {rightExtras}
        {onToggleFullscreen ? (
          <IconButton
            iconNode={isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
            size={17}
            className={styles.fullscreenToggle}
            onClick={onToggleFullscreen}
            tooltipId="ai-chat-panel-fullscreen-tooltip"
            tooltipContent={
              isFullscreen ? exitFullscreenTooltip : enterFullscreenTooltip
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
