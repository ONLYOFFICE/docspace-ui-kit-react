import React from "react";
import classNames from "classnames";

import { isMobile } from "../../utils/device";
import { globalColors } from "../../providers/theme/themes";
import { getRoomTitle } from "../room-icon/RoomIcon.utils";
import { useTheme } from "../../context/ThemeContext";
import { Scrollbar } from "../scrollbar";

import { CustomLogo } from "./sub-components/CustomLogo";
import { SelectColor } from "./sub-components/SelectColor";
import { SelectIcon } from "./sub-components/SelectIcon";

import type { TTranslation } from "../../utils";
import type { TColorScheme } from "../../providers/theme/themes";
import type { ICover } from "./RoomLogoCoverDialog.types";
import styles from "./RoomLogoCoverDialog.module.scss";

export type RoomLogoCoverProps = {
  /** Translation function. Besides `Common:Color` the icon picker asks for keys outside the `Common` namespace the kit ships. */
  t: TTranslation;

  /** The cover icons to offer. Each carries raw SVG markup that is injected into the page, so take them only from a source you trust. An empty array leaves the icon picker out. */
  covers: ICover[];
  /** Room title, reduced to initials for the preview when no icon is chosen.
   * @default "" */
  title?: string;

  /** Colour chosen on the first render, as `#rrggbb`. Anything but `undefined` wins over `coverColor` and `logoColor`. */
  initialColor?: string;
  /** Cover chosen on the first render. An explicit `null` selects the initials and still wins over `coverId` and `logoCover`. */
  initialCover?: ICover | null;

  /** A room's stored colour, six hex digits **without** a leading `#`. Used only when `initialColor` is absent. */
  logoColor?: string;
  /** A room's stored cover. Used only when `initialCover` and `coverId` are absent, and only together with `withSelection`. */
  logoCover?: ICover | null;
  /** A room's stored cover colour, six hex digits **without** a leading `#`. Used only when `initialColor` is absent, and it wins over `logoColor`. */
  coverColor?: string;
  /** Id of a room's stored cover, looked up in `covers`. Used only when `initialCover` is absent. */
  coverId?: string;
  /** Lets `logoCover` be taken as the starting cover. Without it that field is ignored. */
  withSelection?: boolean;

  /** Whether the colour picker is open. The component does not own this: hold it in the state of whatever wraps it. */
  openColorPicker: boolean;

  /** Whether the preview is drawn for the light theme. Taken from the theme context when it is not passed. */
  isBaseTheme?: boolean;
  /** The portal's accent colours, used to tint the hovered and selected icon. Without it those states have no accent. */
  currentColorScheme?: TColorScheme;

  /** Attached to the outer element, for measuring its height. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Height of the scroll area around the two pickers, as a CSS length. Ignored on mobile and while `generalScroll` is set. */
  scrollHeight?: string;
  /** Drops the inner scroll area, for when something outside scrolls instead. */
  generalScroll?: boolean;

  /** Called once after mount with the starting colour and cover, so the owner can record what it will get back unchanged. */
  onInit?: (color: string, cover: ICover | null) => void;
  /** Called with the colour and cover after every change. This is the only way out: the component keeps the selection in its own state. */
  onChange?: (color: string, cover: ICover | null) => void;
  /** Opens and closes the colour picker. */
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomLogoCover = ({
  t,
  covers,
  title = "",
  initialColor,
  initialCover,
  logoColor,
  logoCover,
  coverColor,
  coverId,
  withSelection,
  openColorPicker,
  isBaseTheme,
  currentColorScheme,
  forwardedRef,
  scrollHeight,
  generalScroll,
  onInit,
  onChange,
  setOpenColorPicker,
}: RoomLogoCoverProps) => {
  const { isBase } = useTheme();
  const effectiveIsBaseTheme = isBaseTheme ?? isBase;

  const roomTitle = React.useMemo(() => getRoomTitle(title), [title]);

  const defaultCover: ICover | null = (() => {
    if (initialCover !== undefined) return initialCover;
    if (coverId) return covers.find((c) => c.id === coverId) ?? null;
    if (logoCover != null && withSelection) return logoCover;
    return null;
  })();

  const defaultColor: string = (() => {
    if (initialColor !== undefined) return initialColor;
    if (coverColor) return `#${coverColor}`;
    if (logoColor) return `#${logoColor}`;
    return globalColors.logoColors[0];
  })();

  const [selectedColor, setSelectedColor] =
    React.useState<string>(defaultColor);
  const [selectedCover, setSelectedCover] = React.useState<ICover | null>(
    defaultCover,
  );
  const [withoutIcon, setWithoutIcon] = React.useState<boolean>(
    defaultCover == null,
  );

  React.useEffect(() => {
    onInit?.(selectedColor, withoutIcon ? null : selectedCover);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange?.(color, withoutIcon ? null : selectedCover);
  };

  const handleSetIcon = (icon: ICover) => {
    setSelectedCover(icon);
    setWithoutIcon(false);
    onChange?.(selectedColor, icon);
  };

  const handleWithoutIconChange = (value: boolean) => {
    if (value && selectedCover === null) return;
    setWithoutIcon(value);
    onChange?.(selectedColor, value ? null : selectedCover);
  };

  const customColor = globalColors.logoColors.includes(selectedColor)
    ? null
    : selectedColor;

  const selectContainerBody = (
    <>
      <div className="color-select-container">
        <SelectColor
          t={t}
          selectedColor={selectedColor}
          logoColors={globalColors.logoColors}
          customColor={customColor}
          openColorPicker={openColorPicker}
          setOpenColorPicker={setOpenColorPicker}
          onChangeColor={handleColorChange}
        />
      </div>
      {covers.length > 0 ? (
        <div className="icon-select-container">
          <SelectIcon
            t={t}
            withoutIcon={withoutIcon}
            currentColorScheme={currentColorScheme}
            coverId={selectedCover?.id ?? ""}
            setIcon={handleSetIcon}
            setWithoutIcon={handleWithoutIconChange}
            covers={covers}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <div
      ref={forwardedRef}
      className={classNames(styles.roomLogoCoverContainer, {
        [styles.scrollLocked]: openColorPicker,
      })}
    >
      <div className="room-logo-container">
        <CustomLogo
          isBaseTheme={effectiveIsBaseTheme}
          color={selectedColor}
          cover={withoutIcon ? null : selectedCover}
          withoutIcon={withoutIcon}
          roomTitle={roomTitle}
        />
      </div>
      <div className="select-container">
        {isMobile() || generalScroll ? (
          selectContainerBody
        ) : (
          <Scrollbar style={{ height: scrollHeight }}>
            {selectContainerBody}
          </Scrollbar>
        )}
      </div>
    </div>
  );
};

export { RoomLogoCover };
