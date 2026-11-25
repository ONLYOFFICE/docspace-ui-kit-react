import { formatTime } from "../../MediaViewer.utils";

import styles from "./PlayerDuration.module.scss";

type PlayerDurationProps = {
  currentTime: number;
  duration: number;
};

export const PlayerDuration = ({
  currentTime,
  duration,
}: PlayerDurationProps) => {
  return (
    <div className={styles.wrapper} data-testid="player-duration">
      <time data-testid="current-time">{formatTime(currentTime)}</time> /{" "}
      <time data-testid="total-duration">{formatTime(duration)}</time>
    </div>
  );
};
