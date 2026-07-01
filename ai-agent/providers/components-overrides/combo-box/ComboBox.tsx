// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
