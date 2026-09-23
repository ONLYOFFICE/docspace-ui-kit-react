import type React from "react";

import type { TTranslation } from "../../utils";
import type { TColorScheme } from "../../providers/theme/themes";
import type { ICover } from "../../types";

export type { ICover };

export type RoomLogoCoverDialogProps = {
  /** Translation function; the dialog does not translate on its own */
  t: TTranslation;
  /** Whether the dialog is open; selection is reset each time it opens */
  visible: boolean;
  /** Cover glyphs to choose from; `data` is inline SVG markup. The icon section is hidden when empty */
  covers: ICover[];
  /** Room title; its first and last characters are shown in the preview when no cover is selected */
  title?: string;
  /** Hex colour selected on open; defaults to the first palette colour */
  initialColor?: string;
  /** Cover selected on open; `null` or omitted means no cover */
  initialCover?: ICover | null;
  /** Renders the preview for the light theme; falls back to the theme context when omitted */
  isBaseTheme?: boolean;
  /** Portal colour scheme; its `main.accent` highlights the hovered and selected cover */
  currentColorScheme?: TColorScheme;
  /** Called by Cancel and by the dialog closing itself (close control, Escape); ignored while the colour picker is open */
  onClose: () => void;
  /** Called by Apply with the chosen colour and cover (`null` for none); does not close the dialog */
  onApply: (color: string, cover: ICover | null) => void;
};

export type CustomLogoProps = {
  color: string;
  cover: ICover | null;
  withoutIcon: boolean;
  isBaseTheme: boolean;
  roomTitle: string;
};

export type SelectColorProps = {
  t: TTranslation;
  logoColors: string[];
  selectedColor: string;
  onChangeColor: (value: string) => void;
  customColor: string | null;
  openColorPicker: boolean;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SelectIconProps = {
  t: TTranslation;
  withoutIcon: boolean;
  setWithoutIcon: (value: boolean) => void;
  setIcon: (icon: ICover) => void;
  covers: ICover[];
  currentColorScheme?: TColorScheme;
  coverId: string;
};
