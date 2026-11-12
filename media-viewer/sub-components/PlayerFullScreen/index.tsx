import React, { memo } from "react";
import IconExitFullScreen from "../../../assets/videoplayer.exit.react.svg";
import IconFullScreen from "../../../assets/videoplayer.full.react.svg";
import PlayerFullSceenProps from "./PlayerFullScreen.props";
import styles from "./PlayerFullScreen.module.scss";

const PlayerFullScreen = memo(
  ({ isAudio, onClick, isFullScreen }: PlayerFullSceenProps) => {
    if (isAudio) return;

    const buttonLabel = isFullScreen ? "Exit full screen" : "Enter full screen";

    return (
      <div
        className={styles.wrapper}
        onClick={onClick}
        data-testid="player-fullscreen"
        aria-label={buttonLabel}
        aria-pressed={isFullScreen}
      >
        {isFullScreen ? (
          <IconExitFullScreen
            data-testid="exit-fullscreen-icon"
            role="presentation"
          />
        ) : (
          <IconFullScreen
            data-testid="enter-fullscreen-icon"
            role="presentation"
          />
        )}
      </div>
    );
  },
);

PlayerFullScreen.displayName = "PlayerFullScreen";
export { PlayerFullScreen };
