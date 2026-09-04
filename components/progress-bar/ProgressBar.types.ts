export type ProgressBarProps = {
  /** Progress value as a percentage between 0 and 100. Values above 100 will be capped at 100% */
  percent: number;
  /** Custom text label to display alongside the progress bar to describe the ongoing operation */
  label?: string;
  /** When true, displays an infinite loading animation instead of percentage-based progress */
  isInfiniteProgress?: boolean;
  /** Additional CSS class name(s) to customize the progress bar's styling */
  className?: string;
  /** Current status text to display, useful for showing processing states like "uploading", "processing", etc. */
  status?: string;
  /** Error message to display when the operation encounters a problem */
  error?: string;
  /** Custom styles to apply to the progress bar */
  style?: React.CSSProperties;
};

export type PreparationPortalProgressProps = {
  text?: string;
  percent: number;
  className?: string;

  // Accessibility attributes
  role?: string;
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-label"?: string;

  // Testing attributes
  "data-testid"?: string;
  "data-percent"?: number;
};
