import type { RoomsType } from "../../enums";

export interface RoomLogoProps extends React.AriaAttributes {
  /** Which room type's glyph to draw. An unknown value, or none, renders an empty box of the logo's size. */
  type?: RoomsType;
  /** Draws the archive glyph instead, whatever `type` says. It wins over every other flag. */
  isArchive?: boolean;
  /** Draws the generic template glyph, ignoring `type`. Checked after `isArchive`. */
  isTemplate?: boolean;
  /** Draws the template variant of `type`'s glyph. The four AI types have no variant and keep their plain glyph. */
  isTemplateRoom?: boolean;
  /** Renders a checkbox next to the glyph. The stylesheet hides it, so it only becomes visible under a rule of yours. */
  withCheckbox?: boolean;
  /** Ticks that checkbox; `false` leaves it empty. A click flips the box itself until this prop next changes. */
  isChecked?: boolean;
  /** Whether that checkbox shows the mixed state instead of a tick. */
  isIndeterminate?: boolean;
  /** Called by the checkbox, and by a tap on the glyph. The glyph calls it only where `react-device-detect` reports a mobile device. */
  onChange?: () => void;
  /** `id` of the outer element. */
  id?: string;
  /** Added before the component's own classes, on the outer element. */
  className?: string;
  /** Inline style of the outer element. */
  style?: React.CSSProperties;
}
