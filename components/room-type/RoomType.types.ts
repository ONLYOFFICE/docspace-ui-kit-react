import type React from "react";
import type { RoomsType } from "../../enums";

export type RoomTypeProps = {
  /** Which room type the row describes. It picks the glyph, the title and the description; an unknown value leaves both texts empty. */
  roomType?: RoomsType;
  /** Whether the row is drawn as opened: an accent border on `dropdownButton`, and its arrow turned the other way. */
  isOpen: boolean;
  /** Which layout to render.
   * @default "listItem" */
  type?: "listItem" | "dropdownButton" | "dropdownItem";
  /** `id` of the outer element. */
  id?: string;
  /** Written to `data-selected-id` and read by nothing else. Required all the same. */
  selectedId: string | number;
  /** Called with the event when the row is clicked. On `listItem` and `dropdownButton` the arrow is a button of its own, so a click on it calls this twice. */
  onClick: React.MouseEventHandler<HTMLElement>;
  /** Greys the row out while `roomType` is `FormRoom`. It is styling only — the row still calls `onClick`. */
  disabledFormRoom?: boolean;
  /** Greys the row out while `roomType` is `PublicRoom`. It is styling only — the row still calls `onClick`. */
  disabledPublicRoom?: boolean;
  /** Replaces the title and the description with the "from template" wording, whatever `roomType` says, and switches the glyph to the template one. */
  isTemplate?: boolean;
  /** Switches the glyph to the template variant of `roomType` without touching the texts. */
  isTemplateRoom?: boolean;
  /** Uses the form-set wording for the title and the description instead of the room type's. */
  isFormSection?: boolean;
};
