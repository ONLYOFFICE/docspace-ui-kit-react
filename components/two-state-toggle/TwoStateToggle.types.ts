export type TwoStateToggleProps = {
  /**
   * Text to the left of the pill. An empty string removes it.
   * @default "DocSpace design"
   */
  title?: string;
  /**
   * Label on the left half of the pill, the classic view.
   * @default "OLD"
   */
  labelOld?: string;
  /**
   * Label on the right half, the new dashboard.
   * @default "NEW"
   */
  labelNew?: string;
  /**
   * Heading of the dialog shown when leaving the new view.
   * @default "Switch to Old Design"
   */
  confirmTitle?: string;
  /**
   * First paragraph of that dialog.
   * @default "You are about to leave the new Dashboard and return to the classic DocSpace view."
   */
  confirmBody?: string;
  /**
   * Second paragraph of that dialog. An empty string removes it.
   * @default "You can return to the new Dashboard at any time by navigating to /dashboard."
   */
  confirmHint?: string;
  /**
   * Label of that dialog's primary button.
   * @default "Switch"
   */
  confirmOk?: string;
  /**
   * Label of its cancel button.
   * @default "Cancel"
   */
  confirmCancel?: string;
  /**
   * Called with the URL to go to — `/dashboard` or `/`, both hard-coded. Pass
   * your router's navigate here; without it the component assigns
   * `window.location.href` and the page reloads.
   */
  onNavigate?: (url: string) => void;
  /** Applied to the wrapper around the title and the pill. */
  className?: string;
};
