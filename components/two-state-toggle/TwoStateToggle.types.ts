export type TwoStateToggleProps = {
  /** Text label shown to the left of the toggle */
  title?: string;
  /** Label for the classic DocSpace view (left side of pill) */
  labelOld?: string;
  /** Label for the new Dashboard view (right side of pill) */
  labelNew?: string;
  /** Confirmation modal title (shown when switching NEW → OLD) */
  confirmTitle?: string;
  /** Confirmation modal main body text */
  confirmBody?: string;
  /** Hint shown below the body — e.g. how to return to new view */
  confirmHint?: string;
  /** Confirmation modal "proceed" button label */
  confirmOk?: string;
  /** Confirmation modal "cancel" button label */
  confirmCancel?: string;
  /**
   * Called when the user navigates to a new URL.
   * Provide React Router's `navigate` here to avoid a full page reload
   * when switching to the new Dashboard view.
   * Falls back to `window.location.href` when omitted.
   */
  onNavigate?: (url: string) => void;
  /** Additional CSS class applied to the wrapper */
  className?: string;
};
