import type React from "react";

import type { TTranslation } from "../../utils";
import type { TColorScheme } from "../../providers/theme/themes";
import type { ICover } from "../../types";

export type { ICover };

export type RoomLogoCoverDialogProps = {
  t: TTranslation;
  visible: boolean;
  covers: ICover[];
  title?: string;
  initialColor?: string;
  initialCover?: ICover | null;
  isBaseTheme?: boolean;
  currentColorScheme?: TColorScheme;
  onClose: () => void;
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
