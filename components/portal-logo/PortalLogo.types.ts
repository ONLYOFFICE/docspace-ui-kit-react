export type PortalLogoProps = React.AriaAttributes & {
  /** Added to the `<img>`, or to the fallback logo, next to the component's own `logo-wrapper` class. It never reaches the wrapper around it. */
  className?: string;
  /** Watches the window width and swaps to the small logo in a fixed bar at 600px and narrower. Without it the logo is hidden at those widths.
   * @default false */
  isResizable?: boolean;
  /** Accessible name of the logo: the `alt` of the image, and the `aria-label` of the bundled mark shown when the image fails to load. Pass the portal or product name, translated. An empty string marks the logo as decorative. */
  alt?: string;
  /** Value of `data-testid` on the wrapper, or on the fallback logo that replaces it.
   * @default "portal-logo" */
  dataTestId?: string;
};
