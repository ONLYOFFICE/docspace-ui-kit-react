import type React from "react";

import type { AvatarRole, AvatarSize, AvatarActionKeys } from "./Avatar.enums";

export type TAvatarModel = { label: string; icon: string } & (
  | {
      key: string;
      onClick: () => void;
    }
  | {
      key: typeof AvatarActionKeys.PROFILE_AVATAR_UPLOAD;
      onClick: (ref?: React.RefObject<HTMLDivElement | null>) => void;
    }
);

export type AvatarProps = React.AriaAttributes & {
  /**
   * Diameter of the avatar, from `extraSmall` (24px) to `max` (124px). The
   * initials and the role badge are sized to match; `extraSmall` has rules for
   * neither, so it fits a picture only.
   */
  size: AvatarSize;
  /**
   * Which role badge is drawn over the bottom corner. Only `owner` and `admin`
   * draw one; every other member, `none` included, draws none.
   */
  role: AvatarRole;
  /**
   * The picture: a React element is rendered as given, a URL as an `<img>`. A
   * URL whose path ends in `.svg` is drawn as an icon, and one containing
   * `default_user_photo` becomes the kit's illustration.
   */
  source?: string | React.JSX.Element;
  /**
   * Name the initials are built from when there is no `source`. It is also the
   * picture's `alt` text and, on a clickable avatar, its accessible name.
   */
  userName?: string;
  /**
   * Shows the edit button over the avatar: a pencil when `hasAvatar`, a plus
   * otherwise. Only `size` `max` draws it; at other sizes it has no effect.
   */
  editing?: boolean;
  /** Shows the kit's own illustration when there is no `source` and no `userName`. */
  isDefaultSource?: boolean;
  /** Ignored. Nothing reads this prop; the edit button runs the first `model` entry. */
  editAction?: () => void;
  /** Hides the role badge that `role` would otherwise draw. */
  hideRoleIcon?: boolean;
  /** Applied to the avatar element and, again, to the picture inside it. */
  className?: string;
  /** Ignored. Nothing reads this prop and no `id` reaches the DOM. */
  id?: string;
  /** Ignored. Nothing reads this prop and no inline style reaches the DOM. */
  style?: React.CSSProperties;
  /**
   * Renders a tooltip anchored to the role badge. Without a badge it shows
   * nothing.
   */
  withTooltip?: boolean;
  /** Text shown in the badge's tooltip when `withTooltip` is set. */
  tooltipContent?: string;
  /**
   * Called on a click, on Enter or Space while the avatar has focus, and on a
   * middle-button press. A click on the avatar then opens neither the menu nor
   * the file dialog; the edit button still does.
   */
  onClick?: (e: React.MouseEvent) => void;
  /** Uppercases the initials and gives them the group background and colour. */
  isGroup?: boolean;
  /** Badge to draw instead of the one `role` would choose. */
  roleIcon?: React.ReactElement;
  /**
   * Stops a click on the avatar from opening the menu or the file dialog, and
   * drops its button role. `onClick` and the edit button still work.
   */
  noClick?: boolean;
  /**
   * Whether the user already has a picture. With it, a click opens the menu of
   * `model` under a pencil; without it, a click runs the first entry, under a plus.
   */
  hasAvatar?: boolean;
  /**
   * Called with the change event of the hidden file input, which is rendered
   * only when this prop is given. Without it the avatar is not editable at all.
   */
  onChangeFile?: () => void;

  /**
   * Actions of the edit menu, in order. The first entry runs directly when
   * there is no picture. The entry keyed `PROFILE_AVATAR_UPLOAD` is handed the
   * file input's ref.
   */
  model?: TAvatarModel[];
  /** Renders a `.svg` source as a picture rather than fetching it as an icon. */
  isNotIcon?: boolean;
  /** Added to the `<img>`, for a source shown as a picture. */
  imgClassName?: string;
  /** Value of `data-testid` on the avatar.
   * @default "avatar" */
  dataTestId?: string;
};
