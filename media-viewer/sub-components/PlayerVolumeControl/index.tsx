import React, { memo } from "react";

import IconVolumeMax from "../../../assets/media.volumemax.react.svg";
import IconVolumeMuted from "../../../assets/media.volumeoff.react.svg";
import IconVolumeMin from "../../../assets/media.volumemin.react.svg";

import styles from "./PlayerVolumeControl.module.scss";

type PlayerVolumeControlProps = {
  volume: number;
  isMuted: boolean;
  toggleVolumeMute: VoidFunction;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PlayerVolumeControl = memo(
  ({
    volume,
    isMuted,
    onChange,
    toggleVolumeMute,
  }: PlayerVolumeControlProps) => {
    return (
      <div
        className={styles.playerVolumeControlWrapper}
        data-testid="player-volume-control"
        role="group"
        aria-label="Volume controls"
      >
        <div
          className={styles.iconWrapper}
          onClick={toggleVolumeMute}
          data-testid="volume-mute-button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          aria-pressed={isMuted}
        >
          {isMuted ? (
            <IconVolumeMuted />
          ) : volume >= 50 ? (
            <IconVolumeMax />
          ) : (
            <IconVolumeMin />
          )}
        </div>
        <div
          className={styles.volumeWrapper}
          data-testid="volume-slider-wrapper"
        >
          <input
            style={{
              backgroundSize: `${volume}% 100%`,
            }}
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={onChange}
            data-testid="volume-slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volume}
            aria-valuetext={`${volume}%`}
          />
        </div>
      </div>
    );
  },
);

PlayerVolumeControl.displayName = "PlayerVolumeControl";

export { PlayerVolumeControl };
