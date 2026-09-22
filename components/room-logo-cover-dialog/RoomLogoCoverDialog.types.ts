import type React from "react";

import type { TTranslation } from "../../utils";
import type { TColorScheme } from "../../providers/theme/themes";
import type { ICover } from "../../types";

export type { ICover };

export type RoomLogoCoverDialogProps = {
  /** Translation function. The dialog asks it for `Common:RoomCover`, `Common:ApplyButton` and `Common:CancelButton`, and its icon picker for keys outside `Common`, so a portal translation context is required. */
  t: TTranslation;
  /** Whether the dialog is on screen. Opening it remounts the picker, which discards whatever was chosen last time. */
  visible: boolean;
  /** The cover icons to offer. Each carries raw SVG markup that is injected into the page, so take them only from a source you trust. An empty array leaves the icon picker out. */
  covers: ICover[];
  /** Room title, used for the initials drawn on the preview when no icon is chosen.
   * @default "" */
  title?: string;
  /** Colour selected when the dialog opens, as `#rrggbb`. Defaults to the first of the kit's logo colours. */
  initialColor?: string;
  /** Cover selected when the dialog opens, or `null` for the initials. */
  initialCover?: ICover | null;
  /** Whether the preview is drawn for the light theme. Taken from the theme context when it is not passed. */
  isBaseTheme?: boolean;
  /** The portal's accent colours, used to tint the hovered and selected icon. Without it those states have no accent. */
  currentColorScheme?: TColorScheme;
  /** Called by the cancel button, the header cross, Escape and the backdrop — but not while the colour picker is open, which swallows all four. */
  onClose: () => void;
  /** Called with the chosen colour and cover when apply is clicked. The dialog does not close itself. */
  onApply: (color: string, cover: ICover | null) => void;
};

export type CustomLogoProps = {
  /** Background of the preview tile, as `#rrggbb`. */
  color: string;
  /** Cover whose SVG markup is drawn on the tile, or `null` for the initials. */
  cover: ICover | null;
  /** Draws the initials instead of `cover`. */
  withoutIcon: boolean;
  /** Whether to draw the light-theme variant. */
  isBaseTheme: boolean;
  /** The initials to draw, already reduced from the room title. */
  roomTitle: string;
};

export type SelectColorProps = {
  /** Translation function, for the `Common:Color` label and the picker's buttons. */
  t: TTranslation;
  /** The preset swatches to offer, as `#rrggbb` strings. */
  logoColors: string[];
  /** The swatch currently marked as chosen. */
  selectedColor: string;
  /** Called with the colour that was picked, from a swatch or from the picker. */
  onChangeColor: (value: string) => void;
  /** The colour chosen outside the presets, or `null` while there is none. */
  customColor: string | null;
  /** Whether the colour picker is open. */
  openColorPicker: boolean;
  /** Opens and closes the colour picker. While it is open the dialog refuses to close. */
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SelectIconProps = {
  /** Translation function. This picker asks for keys outside the `Common` namespace the kit ships. */
  t: TTranslation;
  /** Whether the initials are chosen instead of an icon. */
  withoutIcon: boolean;
  /** Toggles between the initials and the last chosen icon. */
  setWithoutIcon: (value: boolean) => void;
  /** Called with the icon that was clicked. */
  setIcon: (icon: ICover) => void;
  /** The icons to offer. Their SVG markup is injected into the page as it is. */
  covers: ICover[];
  /** The portal's accent colours, used to tint the hovered and selected icon. */
  currentColorScheme?: TColorScheme;
  /** Id of the icon currently marked as chosen. */
  coverId: string;
};
