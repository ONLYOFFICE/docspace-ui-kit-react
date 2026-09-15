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
import SaveIcon from "../../../assets/icons/16/download-file.svg";
import PlusIcon from "../../../assets/icons/16/plus.svg";
import PromptIcon from "../../../assets/icons/16/prompt.svg";
import ArrowUpIcon from "../../../assets/icons/16/upgrade.react.svg";
import ClearIcon from "../../../assets/icons/16/clear.react.svg";
import OpenIcon from "../../../assets/external.link.svg";
import DropdownIcon from "../../../assets/triangle.down.react.svg";
import ArrowDownIcon from "../../../assets/icons/16/output-tokens.svg";
import CodeIcon from "../../../assets/icons/16/code.react.svg";

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
  // Extra class for glyphs that have to carry their own color (see `.tertiary`).
  colorClassName?: string,
): FC<{ size?: number; className?: string }> =>
  function ChatIcon({ size, className }) {
    return (
      <Svg
        width={getSize(size)}
        height={getSize(size)}
        className={classNames(styles.icon, colorClassName, className)}
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
  "btn-more.small": makeIcon(VerticalDotsIcon),
  "btn-edit": makeIcon(PenEditIcon),
  "btn-rename": makeIcon(PenEditIcon),
  "btn-save": makeIcon(SaveIcon),
  "btn-save.small": makeIcon(SaveIcon),
  "btn-attach.small": makeIcon(PlusIcon),
  "btn-prompt": makeIcon(PromptIcon),
  send: makeIcon(ArrowUpIcon),
  "btn-clear": makeIcon(ClearIcon),
  "btn-open": makeIcon(OpenIcon),
  arrow: makeIcon(DropdownIcon),
  "dropdown-toggle": makeIcon(ArrowDownIcon),
  // Tool-call header in the thread. The widget draws its own stroked glyph
  // colored with `--text-tertiary`; DocSpace has the same `</>` mark, so use it
  // and reproduce that color through `.tertiary`.
  code: makeIcon(CodeIcon, styles.tertiary),
};
