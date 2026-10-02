export type ProgressBarProps = {
  /** How far along the operation is, 0 to 100. Anything above 100 is clamped; a negative number is not, and reaches `aria-valuenow` as it stands. */
  percent: number;
  /** Line of text above the bar. It is also the bar's `title` and its `aria-label`, so without it the progress bar has no accessible name. */
  label?: string;
  /** Replaces the filled portion with a strip that slides across the track for ever. `percent` is still what `aria-valuenow` reports, so pass the label instead of a number a reader can act on. */
  isInfiniteProgress?: boolean;
  /** Added after the component's own class on the bar element, not on the outer container. */
  className?: string;
  /** Line of text under the bar — "3 of 4 files processed". It is hidden while `error` is set, which takes the same slot. */
  status?: string;
  /** Line of text under the bar in the error colour. It replaces `status` whenever both are given; nothing else about the bar changes. */
  error?: string;
  /** Inline style of the outer container — the label, the bar and the status line together. The bar itself is styled through the `--progress-bar-*` custom properties. */
  style?: React.CSSProperties;
};

export type PreparationPortalProgressProps = {
  /** Centred line of text under the bar. */
  text?: string;
  /** How far along the operation is, 0 to 100. It is not clamped: a larger number overflows the track. */
  percent: number;
  /** Added to the outer element, replacing nothing — this component has no class of its own there. */
  className?: string;

  // Accessibility attributes

  /** Landmark role of the outer element. Nothing is set by default, so pass `"progressbar"` yourself. */
  role?: string;
  /** Lower bound reported to assistive technology. Not set by default. */
  "aria-valuemin"?: number;
  /** Upper bound reported to assistive technology. Not set by default. */
  "aria-valuemax"?: number;
  /** Current value reported to assistive technology. Not set by default, and not derived from `percent`. */
  "aria-valuenow"?: number;
  /** Accessible name of the outer element. Not set by default. */
  "aria-label"?: string;

  // Testing attributes

  /** Replaces the outer element's `data-testid`. */
  "data-testid"?: string;
  /** Written to the outer element as-is; nothing in the component reads it. */
  "data-percent"?: number;
};
