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

import type { FC, SVGProps } from "react";
import classNames from "classnames";

import type { ImageOverrides } from "@onlyoffice/ai-chat";

import CrossIcon from "../../../assets/icons/16/cross.react.svg";
import CopyIcon from "../../../assets/icons/16/copy.react.svg";
import DownloadIcon from "../../../assets/icons/16/download.react.svg";
import TrashIcon from "../../../assets/icons/16/trash.react.svg";
import RefreshIcon from "../../../assets/icons/16/refresh.react.svg";
import VerticalDotsIcon from "../../../assets/icons/16/vertical-dots.react.svg";
import PenEditIcon from "../../../assets/icons/12/pen-edit.react.svg";
import SaveIcon from "../../../assets/icons/16/catalog-settings-data-management.svg";
import PlusIcon from "../../../assets/icons/16/plus.svg";
import PromptIcon from "../../../assets/icons/16/prompt.svg";

import styles from "./Icon.module.scss";

// The widget renders a component override as `<Icon size className />` and
// drops everything else (color/width/height). Adapt a DocSpace SVG to that
// contract: map `size` onto width/height and attach the recolor class.

const getSize = (size?: number): number | undefined => {
  if (!size) return undefined;

  if (size >= 20) return 16;

  return size;
};

const makeIcon = (
  Svg: FC<SVGProps<SVGSVGElement>>,
): FC<{ size?: number; className?: string }> =>
  function ChatIcon({ size, className }) {
    return (
      <Svg
        width={getSize(size)}
        height={getSize(size)}
        className={classNames(styles.icon, className)}
      />
    );
  };

// DocSpace icons for the widget's UI-control glyphs. Only controls with a
// clean single-shape DocSpace equivalent are remapped; file-format and
// AI-capability glyphs, plus controls with no neutral equivalent
// (search/settings/send), keep the widget defaults.
export const imageOverrides: ImageOverrides = {
  "btn-close": makeIcon(CrossIcon),
  "btn-close.small": makeIcon(CrossIcon),
  "clear.search": makeIcon(CrossIcon),
  "btn-copy": makeIcon(CopyIcon),
  "btn-download": makeIcon(DownloadIcon),
  "btn-remove": makeIcon(TrashIcon),
  "btn-reset": makeIcon(RefreshIcon),
  more: makeIcon(VerticalDotsIcon),
  "btn-edit": makeIcon(PenEditIcon),
  "btn-rename": makeIcon(PenEditIcon),
  "btn-save": makeIcon(SaveIcon),
  "btn-zoomup": makeIcon(PlusIcon),
  "btn-prompt": makeIcon(PromptIcon),
};
