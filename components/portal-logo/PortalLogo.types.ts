export type PortalLogoProps = React.AriaAttributes & {
  /** Added to the `<img>`, or to the fallback logo, next to the component's own `logo-wrapper` class. It never reaches the wrapper around it. */
  className?: string;
  /** Watches the window width and swaps to the small logo in a fixed bar at 600px and narrower. Without it the logo is hidden at those widths.
   * @default false */
  isResizable?: boolean;
  /** Accessible name of the logo, on the image and on the mark shown when it fails to load. Without it, the product name as the portal brands it; an empty string makes the logo decorative. */
  alt?: string;
  /** Value of `data-testid` on the wrapper, or on the fallback logo that replaces it.
   * @default "portal-logo" */
  dataTestId?: string;
};
