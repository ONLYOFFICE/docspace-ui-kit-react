import { MouseEvent } from "react";

export type ICategoryItemProps = {
  /** Heading of the row, rendered as the text of a link at 16px. */
  title: string;
  /** Where the link points. It is dropped while `isDisabled` is set, which leaves an `<a>` with no `href`. */
  url: string;
  /** Explanatory line under the title, at 12px and no wider than 1024px. */
  subtitle: string;
  /** Called with the click event on the title link. Nothing prevents the browser from following `url` — call `preventDefault` yourself when you route in JavaScript. */
  onClickLink: (e: MouseEvent<Element>) => void;
  /** Dims the title, subtitle and arrow, and removes `href` and `onClickLink` from the link. The arrow still renders, so say in the subtitle why the row is unavailable. */
  isDisabled?: boolean;
  /** Shows the paid badge beside the title — unless the page's path starts with `/management`, where it is suppressed. Required, so pass `false` when there is no badge. */
  withPaidBadge: boolean;
  /** Text inside the paid badge. Required even when `withPaidBadge` is `false`; pass an empty string then. */
  badgeLabel: string;
  /** Value of `data-testid` on the wrapper, and the stem of the title link's own `<dataTestId>_category_link`. Without it the link keeps the shared `link` id. */
  dataTestId?: string;
};
