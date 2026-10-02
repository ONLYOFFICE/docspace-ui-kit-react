import type { Nullable, TLogo } from "../../types";
import type { ROOM_ACTION_KEYS } from "../../constants";

type RoomIconDefault = {
  /** Room name. Only its initials are drawn — the first letter of the first word and of the last. */
  title: string;
  /** Paints the tile in the archive grey instead of `color`, and turns off the hover overlay. */
  isArchive?: boolean;
  /** Side of the square, as a px string. It is also divided to scale the cover glyph, so a value in any other unit gives `NaN`.
   * @default "32px" */
  size?: string;
  /** Corner radius of the tile and of the image inside it.
   * @default "6px" */
  radius?: string;
  /** Draws the initials instead of the logo, whatever `logo` holds. */
  showDefault?: boolean;
  /** Added to the `<img>` the logo renders into. The type refuses it alongside a required `color`: a coloured default or an image, not both. */
  imgClassName?: string;
  /** Added to the outer element, before the component's own classes. */
  className?: string;
  /** Value of `data-testid` on the outer element.
   * @default "room-icon" */
  dataTestId?: string;
};

/** One entry of the logo menu. The upload entry is told apart by its key and is handed the file input's ref instead of nothing. */
export type TModel = { label: string; icon: string } & (
  | {
      key: string;
      onClick: () => void;
    }
  | {
      key: typeof ROOM_ACTION_KEYS.CREATE_EDIT_ROOM_UPLOAD;
      onClick: (ref?: React.RefObject<Nullable<HTMLInputElement>>) => void;
    }
);

type RoomIconExpansion = {
  /** Image faded in over the tile while the pointer is on it. Ignored while `isArchive` is set. */
  hoverSrc?: string;
  /** Adds the pencil button and the menu it opens. It also makes the tile 64px wide at the least. */
  withEditing?: boolean;
  /** Called with the change event of the hidden file input. Passing it is what renders that input at all. */
  onChangeFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Draws a dashed empty frame with a camera glyph and a plus button, for a room that has no logo yet.
   * It replaces every other content, including the initials. */
  isEmptyIcon?: boolean;
  /** Horizontal offset of the logo menu.
   * @default "-10px" */
  dropDownManualX?: string;
  /** Entries of the logo menu. Without it the menu opens empty. */
  model?: TModel[];
  /** The room's logo: a URL, or the portal's logo object. An object with a `cover` is inlined as a base64 SVG and recoloured; otherwise `medium` is used as a URL. */
  logo?: TLogo | string;
  /** Text of the badge's tooltip. It also needs `tooltipId`, and it is what makes the badge show a pointer cursor. */
  tooltipContent?: string;
  /** Id the badge's tooltip is registered under. Without it the tooltip has nothing to attach to. */
  tooltipId?: string;
  /** Draws the template outline instead of the round tile, with the logo shrunk to 24px inside it. */
  isTemplate?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "room-icon" */
  dataTestId?: string;
};

type RoomIconColor = {
  /** Background of the tile and the source of the initials' colour, as six hex digits **without** a leading `#`. Required unless you pass `imgClassName` instead. */
  color: string;
  /** Added to the `<img>` the logo renders into. The type refuses it alongside a required `color`: a coloured default or an image, not both. */
  imgClassName?: undefined;
};

type RoomIconImage = {
  /** Background of the tile and the source of the initials' colour, as six hex digits **without** a leading `#`. Required unless you pass `imgClassName` instead. */
  color?: string | undefined;
  /** Added to the `<img>` the logo renders into. The type refuses it alongside a required `color`: a coloured default or an image, not both. */
  imgClassName?: string;
};

type RoomIconBadge = {
  /** URL of the badge glyph, drawn in the corner. Either this or `badgeIconNode` renders the badge; `withEditing` suppresses it. */
  badgeUrl?: string;
  /** Badge glyph as a node, used instead of `badgeUrl`. */
  badgeIconNode?: React.ReactNode;
  /** Keeps the glyph's own colours instead of filling it with the tile's background colour. */
  badgeIconColor?: string;
  /** Called when the badge is clicked. The click also reaches the tile, which toggles the logo menu. */
  onBadgeClick?: () => void;
};

type RoomIconNonBadge = {
  /** URL of the badge glyph, drawn in the corner. Either this or `badgeIconNode` renders the badge; `withEditing` suppresses it. */
  badgeUrl?: undefined;
  /** Badge glyph as a node, used instead of `badgeUrl`. */
  badgeIconNode?: undefined;
  /** Keeps the glyph's own colours instead of filling it with the tile's background colour. */
  badgeIconColor?: undefined;
  /** Called when the badge is clicked. The click also reaches the tile, which toggles the logo menu. */
  onBadgeClick?: undefined;
};

export type RoomIconProps = RoomIconDefault &
  RoomIconExpansion &
  (RoomIconColor | RoomIconImage) &
  (RoomIconBadge | RoomIconNonBadge);
