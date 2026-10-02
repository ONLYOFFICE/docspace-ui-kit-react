import React from "react";

/**
 * Owns the "content refresh" (dimming) state of a selector: while a reload
 * of already-displayed content is in progress, the stale content stays on
 * screen dimmed instead of being replaced with a skeleton.
 *
 * `startContentLoading` is a no-op until the initial load has settled —
 * dimming needs content behind it, and before that the skeleton owns the
 * screen. Pass `initiallyLoaded` when the selector mounts with preloaded
 * data (`withInit`) and never runs an initial load.
 */
const useContentLoading = ({
  initiallyLoaded,
}: { initiallyLoaded?: boolean } = {}) => {
  const [isContentLoading, setIsContentLoadingState] = React.useState(false);

  const initialLoadDoneRef = React.useRef(Boolean(initiallyLoaded));

  const startContentLoading = React.useCallback(() => {
    if (!initialLoadDoneRef.current) return;
    setIsContentLoadingState(true);
  }, []);

  const finishContentLoading = React.useCallback(() => {
    initialLoadDoneRef.current = true;
    setIsContentLoadingState(false);
  }, []);

  return { isContentLoading, startContentLoading, finishContentLoading };
};

export default useContentLoading;
