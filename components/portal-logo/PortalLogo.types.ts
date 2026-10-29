export type PortalLogoProps = {
  /** Added to the `<img>`, next to the component's own `logo-wrapper` class. It never reaches the wrapper around it. */
  className?: string;
  /** Watches the window width and swaps to the small logo in a fixed bar below 600px. Without it the logo is simply hidden at those widths.
   * @default false */
  isResizable?: boolean;
  /** Accessible name of the logo: the `alt` of the image, and the `aria-label` of the bundled mark shown when the image fails to load. Pass the portal or product name, translated. An empty string marks the logo as decorative. */
  alt?: string;
};
