import classNames from "classnames";
import styles from "./ViewerLoader.module.scss";
import type { ViewerLoaderProps } from "./ViewerLoader.types";

export const ViewerLoader = ({
  onClick,
  isError,
  isLoading,
  withBackground,
}: ViewerLoaderProps) => {
  if (!isLoading || isError) return;

  return (
    <div
      className={classNames(styles.loaderWrapper, {
        [styles.withBackground]: withBackground,
      })}
      onClick={onClick}
      data-testid="viewer-loader-wrapper"
    >
      <div
        className={styles.loader}
        role="progressbar"
        aria-label="Loading content"
        data-testid="viewer-loader"
      />
    </div>
  );
};
