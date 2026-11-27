import type React from "react";
import type { RoomsType } from "../../enums";

export type RoomTypeProps = React.AriaAttributes & {
  /** Which room type the row describes: its glyph, title and description. An unknown value, or none, leaves both texts and the glyph box empty. */
  roomType?: RoomsType;
  /** Whether the row is drawn as opened: an accent border on `dropdownButton`, and its arrow turned the other way. */
  isOpen: boolean;
  /** Which layout to render: a bordered card with an arrow, a dropdown's collapsed button, or a borderless dropdown entry.
   * @default "listItem" */
  type?: "listItem" | "dropdownButton" | "dropdownItem";
  /** `id` of the outer element. */
  id?: string;
  /** Written to `data-selected-id` and read by nothing else. Required all the same. */
  selectedId: string | number;
  /** Called with the event on a click anywhere in the row, once per click. Enter and Space click the row too. A disabled row never calls it; `dropdownButton` has no disabled state. */
  onClick: React.MouseEventHandler<HTMLElement>;
  /** Greys the row out while `roomType` is `FormRoom`, marks it `aria-disabled` and stops it calling `onClick`. The `dropdownButton` layout ignores it. */
  disabledFormRoom?: boolean;
  /** Greys the row out while `roomType` is `PublicRoom`, marks it `aria-disabled` and stops it calling `onClick`. The `dropdownButton` layout ignores it. */
  disabledPublicRoom?: boolean;
  /** Greys the row out whatever `roomType` is, marks it `aria-disabled` and stops it calling `onClick`. The `dropdownButton` layout ignores it. */
  isDisabled?: boolean;
  /** Replaces the title and the description with the "from template" wording, whatever `roomType` says, and switches the glyph to the template one. */
  isTemplate?: boolean;
  /** Switches the glyph to the template variant of `roomType` without touching the texts. */
  isTemplateRoom?: boolean;
  /** Uses the form-space wording for the title and the description instead of the room type's. */
  isFormSection?: boolean;
};
