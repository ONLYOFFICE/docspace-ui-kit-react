import type { RoomsType } from "../../enums";

export interface RoomLogoProps {
  /** Which room type's glyph to draw. An unknown value, or none, renders an empty box of the logo's size. */
  type?: RoomsType;
  /** Ignored. Nothing reads this prop; there is no privacy glyph in the folder. */
  isPrivacy?: boolean;
  /** Draws the archive glyph instead, whatever `type` says. It wins over every other flag. */
  isArchive?: boolean;
  /** Draws the generic template glyph, ignoring `type`. Checked after `isArchive`. */
  isTemplate?: boolean;
  /** Draws the template variant of `type`'s glyph. There is no AI template variant — that one falls back to the plain AI glyph. */
  isTemplateRoom?: boolean;
  /** Renders a checkbox next to the glyph. The stylesheet hides it, so it only becomes visible under a rule of yours. */
  withCheckbox?: boolean;
  /** Whether that checkbox is checked. */
  isChecked?: boolean;
  /** Whether that checkbox shows the mixed state instead of a tick. */
  isIndeterminate?: boolean;
  /** Called by the checkbox, and by a tap on the glyph itself — but the glyph only calls it on a device `react-device-detect` reports as mobile. */
  onChange?: () => void;
  /** `id` of the outer element. */
  id?: string;
  /** Added before the component's own classes, on the outer element. */
  className?: string;
  /** Inline style of the outer element. */
  style?: React.CSSProperties;
}
