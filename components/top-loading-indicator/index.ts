const MAX = 100;
let timerId: ReturnType<typeof setTimeout> | null;
let width = 0;
let percentage = 0;
let isEnding = false;
let endingStartTime = 0;
let startTime = 0;

const getElement = () => {
  return typeof document !== "undefined"
    ? document.getElementById("ipl-progress-indicator")
    : null;
};

const setAttributes = (element: HTMLElement | null) => {
  if (!element) return;
  element.setAttribute("role", "progressbar");
  element.setAttribute("aria-valuemin", "0");
  element.setAttribute("aria-valuemax", "100");
  element.setAttribute("data-test-id", "top-loader");
};

const cancelProgress = () => {
  if (timerId) clearTimeout(timerId);
  timerId = null;
  const elem = getElement();
  if (elem) {
    elem.style.width = "0px";
    elem.setAttribute("aria-valuenow", "0");
  }
  width = 0;
  percentage = 0;
  isEnding = false;
  endingStartTime = 0;
  startTime = 0;
};

const animatingWidth = () => {
  if (width >= MAX) {
    cancelProgress();
    return;
  }

  const now = Date.now();

  if (isEnding) {
    // End progress in 1 second for smooth completion
    const elapsed = now - endingStartTime;
    const progress = Math.min(elapsed / 1000, 1); // 0 to 1 over 1 second (1000ms)
    width = percentage + (MAX - percentage) * progress;
  } else if (startTime > 0) {
    // Normal progression: 50% in first second, then 10% every second
    const elapsed = now - startTime;

    if (elapsed <= 1000) {
      // First second: 0% to 50%
      width = (elapsed / 1000) * 50;
    } else {
      // After first second: add 10% every second
      const secondsAfterFirst = Math.floor((elapsed - 1000) / 1000);
      width = Math.min(50 + (secondsAfterFirst + 1) * 10, 90); // Cap at 90% until end() is called
    }
  }

  const elem = getElement();
  if (elem) {
    elem.style.width = `${width}%`;
    elem.setAttribute("aria-valuenow", width.toString());
  }
};

const startInterval = () => {
  if (timerId) return;

  const elem = getElement();
  if (elem) {
    setAttributes(elem);
  }

  startTime = Date.now();
  timerId = setInterval(animatingWidth, 50); // Update every 50ms for smooth animation
};

class TopLoaderService {
  static start() {
    percentage = 0;
    width = 0;
    isEnding = false;
    endingStartTime = 0;

    const elem = getElement();
    if (elem) elem.setAttribute("aria-valuenow", "0");

    startInterval();
  }

  static cancel() {
    cancelProgress();
  }

  static end() {
    if (!timerId) return;

    percentage = width; // Store current width as starting point for ending animation
    isEnding = true;
    endingStartTime = Date.now();
  }
}

export { TopLoaderService };
