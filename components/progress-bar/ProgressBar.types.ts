export type ProgressBarProps = {
  /** How far along the operation is, 0 to 100. The value is clamped to that range, and a non-number (`NaN`, `Infinity`) counts as 0. */
  percent: number;
  /** Line of text above the bar. It is also the bar's `title` and its `aria-label`, so without it the progress bar has no accessible name. */
  label?: string;
  /** Replaces the filled portion with a strip that slides across the track for ever, and marks the bar indeterminate: `aria-valuenow` is left out and `aria-busy` is set, so `percent` is not announced. */
  isInfiniteProgress?: boolean;
  /** Added after the component's own class on the bar element, not on the outer container. */
  className?: string;
  /** Line of text under the bar — "3 of 4 files processed". It sits in a polite live region, so a change is announced. It is hidden while `error` is set, which takes the same slot. */
  status?: string;
  /** Line of text under the bar in the error colour, rendered with `role="alert"` so it is announced. It replaces `status` whenever both are given; nothing else about the bar changes. */
  error?: string;
  /** Inline style of the outer container — the label, the bar and the status line together. The bar itself is styled through the `--progress-bar-*` custom properties. */
  style?: React.CSSProperties;
};

export type PreparationPortalProgressProps = {
  /** Centred line of text under the bar. */
  text?: string;
  /** How far along the operation is, 0 to 100. The value is clamped to that range for the fill, the printed number and `aria-valuenow`; a non-number counts as 0. */
  percent: number;
  /** Added to the outer element, replacing nothing — this component has no class of its own there. */
  className?: string;

  // Accessibility attributes

  /** Role of the outer element. `"progressbar"` by default; pass another only if you know why. */
  role?: string;
  /** Lower bound reported to assistive technology. `0` by default. */
  "aria-valuemin"?: number;
  /** Upper bound reported to assistive technology. `100` by default. */
  "aria-valuemax"?: number;
  /** Current value reported to assistive technology. Derived from the clamped `percent` by default; a value passed here replaces it. */
  "aria-valuenow"?: number;
  /** Accessible name of the outer element. Defaults to `text`, so the caption names the bar. */
  "aria-label"?: string;

  // Testing attributes

  /** Replaces the outer element's `data-testid`. */
  "data-testid"?: string;
  /** Written to the outer element as-is; nothing in the component reads it. */
  "data-percent"?: number;
};
