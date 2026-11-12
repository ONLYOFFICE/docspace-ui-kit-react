import React, { memo } from "react";

import IconPlay from "../../../assets/videoplayer.play.react.svg";
import IconStop from "../../../assets/videoplayer.stop.react.svg";

import type { PlayerPlayButtonProps } from "./PlayerPlayButton.types";
import styles from "./PlayerPlayButton.module.scss";

const PlayerPlayButton = memo(
  ({ isPlaying, onClick }: PlayerPlayButtonProps) => {
    const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
      event.stopPropagation();
    };

    const buttonLabel = isPlaying ? "Pause" : "Play";

    return (
      <div
        className={styles.wrapper}
        onClick={onClick}
        onTouchStart={onTouchStart}
        data-testid="player-play-button"
        aria-label={buttonLabel}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <IconStop data-testid="pause-icon" role="presentation" />
        ) : (
          <IconPlay data-testid="play-icon" role="presentation" />
        )}
      </div>
    );
  },
);

PlayerPlayButton.displayName = "PlayerPlayButton";
export { PlayerPlayButton };
