import React from "react";
import BigIconPlay from "../../../assets/media.bgplay.react.svg";
import styles from "./PlayerBigPlayButton.module.scss";
import PlayerBigPlayButtonProps from "./PlayerBigPlayButton.props";

export const PlayerBigPlayButton = ({
  visible,
  onClick,
}: PlayerBigPlayButtonProps) => {
  if (!visible) return;

  return (
    <div
      className={styles.wrapper}
      onContextMenu={(event) => event.preventDefault()}
      data-testid="player-big-play-button"
      aria-label="Play media"
    >
      <BigIconPlay
        onClick={onClick}
        data-testid="play-icon"
        role="presentation"
      />
    </div>
  );
};
