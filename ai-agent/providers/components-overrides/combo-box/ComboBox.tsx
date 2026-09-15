import React from "react";

import type { ComboBoxProps as AiChatComboBoxProps } from "@onlyoffice/ai-chat";
import { useImages, useTheme } from "@onlyoffice/ai-chat";

import { ComboBox } from "../../../../components/combobox";
import type { TOption } from "../../../../components/combobox/ComboBox.types";

const PLACEHOLDER_KEY = "__ai_chat_combobox_placeholder__";

const ComboBoxOverride: React.FC<AiChatComboBoxProps> = (props) => {
  const {
    placeholder,
    value,
    className,
    isError,
    withoutBg,
    disabled,
    items,
    "data-testid": dataTestId,
  } = props;

  const { getIconComponent, getImageSrc } = useImages();
  const { themeType, scale } = useTheme();

  // DocSpace ComboBox/DropDownItem accept icon as `string` (URL/data URL)
  // or `React.ElementType` (component reference) — not rendered JSX. So we
  // return the component or src directly, matching DropDownItemOverride.
  const resolveIcon = React.useCallback(
    (
      icon: string | React.ReactNode,
    ): string | React.ElementType | undefined => {
      if (icon == null) return undefined;
      if (typeof icon !== "string") {
        // DocSpace ComboBox expects a URL string or a component reference, not
        // rendered JSX. Wrapping JSX in an inline component would allocate a new
        // reference on every call (breaking memoization downstream) and still
        // isn't a shape DropDownItem renders, so we don't support it here.
        if (React.isValidElement(icon)) {
          console.warn(
            "[ComboBoxOverride] JSX element passed as icon is not supported; " +
              "pass an icon URL or component reference instead.",
          );
        }
        return undefined;
      }

      const IconComponent = getIconComponent(icon);
      if (IconComponent) return IconComponent;

      const result = getImageSrc(icon, themeType, scale);
      if (result) return result.src;

      return undefined;
    },
    [getIconComponent, getImageSrc, themeType, scale],
  );

  const options = React.useMemo<TOption[]>(
    () =>
      items.map((item, idx) => ({
        key: String(idx),
        label: item.text,
        icon: resolveIcon(item.icon),
        isSeparator: item.isSeparator,
      })),
    [items, resolveIcon],
  );

  const selectedOption = React.useMemo<TOption>(() => {
    const idx = items.findIndex((item) => item.text === value);
    if (idx >= 0) return options[idx] ?? options[0];
    return { key: PLACEHOLDER_KEY, label: placeholder ?? "" };
  }, [items, value, options, placeholder]);

  const handleSelect = React.useCallback(
    (option: TOption) => {
      const idx = Number.parseInt(String(option.key), 10);
      const item = Number.isFinite(idx) ? items[idx] : undefined;
      // ai-chat items expect a DOM Event; synthesize one — none of the
      // four real callsites read e.target / e.currentTarget on selection.
      item?.onClick(new Event("click"));
    },
    [items],
  );

  return (
    <ComboBox
      options={options}
      selectedOption={selectedOption}
      onSelect={handleSelect}
      isDisabled={disabled || items.length === 0}
      noBorder={withoutBg}
      className={
        isError ? `${className ?? ""} combo-box-error`.trim() : className
      }
      dataTestId={dataTestId}
      scaled
      scaledOptions
      showDisabledItems
      dropDownMaxHeight={400}
      directionY="both"
    />
  );
};

ComboBoxOverride.displayName = "ComboBoxOverride";

export { ComboBoxOverride };
