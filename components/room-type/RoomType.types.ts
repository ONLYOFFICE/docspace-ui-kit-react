import type React from "react";
import type { RoomsType } from "../../enums";

export type RoomTypeProps = {
  /** Room type whose logo, title and description are shown. */
  roomType?: RoomsType;
  /** Open state; on `dropdownButton` it adds the open border and reverses the arrow. */
  isOpen: boolean;

  /** Display variant. */
  type?: "listItem" | "dropdownButton" | "dropdownItem";
  /** DOM `id` of the root element. */
  id?: string;
  /** Written to the root element as `data-selected-id`; not used for rendering. */
  selectedId: string | number;

  /** Click handler on the root element; the arrow button calls it as well. */
  onClick: React.MouseEventHandler<HTMLElement>;
  /** Styles a `FormRoom` item as disabled (`listItem` and `dropdownItem`). */
  disabledFormRoom?: boolean;
  /** Styles a `PublicRoom` item as disabled (`listItem` and `dropdownItem`). */
  disabledPublicRoom?: boolean;
  /** Shows the "from template" title and description; also passed to `RoomLogo`. */
  isTemplate?: boolean;
  /** Passed to `RoomLogo` as `isTemplateRoom`. */
  isTemplateRoom?: boolean;
  /** Shows the form-set title and description instead of the room type's. */
  isFormSection?: boolean;
};
