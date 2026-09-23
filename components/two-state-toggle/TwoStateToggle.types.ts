export type TwoStateToggleProps = {
  /** Text label shown at the inline start of the toggle; an empty string hides it */
  title?: string;
  /** Label for the classic DocSpace view (inline-start half of the pill) */
  labelOld?: string;
  /** Label for the new Dashboard view (inline-end half of the pill) */
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
   * Accessible name of the switch button. Defaults to the English
   * "Switch DocSpace design"; pass a translated string in a localised UI
   */
  ariaLabel?: string;
  /**
   * Called with the target URL after every switch: `"/dashboard"` when
   * switching to the new view, `"/"` after confirming the switch back to the
   * old one. The targets are fixed; this only decides how to navigate, so pass
   * React Router's `navigate` to avoid a full page reload.
   * Falls back to `window.location.href` when omitted.
   */
  onNavigate?: (url: string) => void;
  /** Additional CSS class applied to the wrapper */
  className?: string;
};
