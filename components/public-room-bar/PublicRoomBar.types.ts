import type React from "react";

export interface PublicRoomBarProps {
  /** Attached to the outer element. */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Bold first line, beside the icon. A string renders in the kit's `Text`; anything else is wrapped in a `div` instead of `Text`'s usual `p`. `hideHeader` removes it. */
  headerText: string | React.ReactNode;
  /** The line under the header, at 12px. A string renders in the kit's `Text`; anything else is wrapped in a `div` instead of `Text`'s usual `p`. */
  bodyText: string | React.ReactNode;
  /** Icon beside the header, the kit's 16px people glyph when unset. A string is fetched as an SVG through `react-svg`; an element is rendered as given. Only `path` fills are recoloured. */
  iconName?: string | React.ReactElement;
  /** Drops the whole first row, icon and header text together, leaving the body on its own. */
  hideHeader?: boolean;
  /** Called when the close button is clicked. The button exists only while this is set, and the bar does not hide itself. */
  onClose?: () => void;
  /** Added after the component's own classes on the outer element. */
  className?: string;
  /** Inline style of the outer element, and where the `--public-room-bar-*` custom properties go. */
  style?: React.CSSProperties;
  /** Removes the bar's own 20px top margin, for a bar that already sits under something. It shows and hides nothing, whatever the name suggests. */
  barIsVisible?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "public_room_bar" */
  dataTestId?: string;
}
