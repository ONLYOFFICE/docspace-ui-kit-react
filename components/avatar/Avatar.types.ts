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

export type AvatarProps = {
  /**
   * Diameter of the avatar, from `extraSmall` (24px) to `max` (124px). It also
   * picks the font size of the initials and the size and offset of the role
   * icon; `extraSmall` has neither of those, so it fits a picture only.
   */
  size: AvatarSize;
  /**
   * Which role badge is drawn over the bottom corner. Only `owner` and `admin`
   * draw anything — every other member, `none` included, renders no badge.
   */
  role: AvatarRole;
  /**
   * The picture. A React element is rendered as given; a string is a URL, shown
   * with an `<img>` — except a path containing `.svg`, which is fetched and
   * inlined as an icon unless `isNotIcon` is set, and one containing
   * `default_user_photo`, which is replaced by the kit's own illustration.
   */
  source?: string | React.JSX.Element;
  /**
   * Name to build initials from when there is no `source`: the first letter of
   * each word, two at most. Lower case is preserved unless `isGroup` is set.
   */
  userName?: string;
  /**
   * Shows the edit button over the avatar — a pencil when `hasAvatar`, a plus
   * otherwise. It is read only at `size` `max`; at any other size nothing is
   * rendered.
   */
  editing?: boolean;
  /** Shows the kit's own illustration when there is no `source` and no `userName`. */
  isDefaultSource?: boolean;
  /** Ignored. Nothing reads this prop; the edit button calls `model[0].onClick`. */
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
   * Renders a tooltip anchored to the role badge. It needs a badge to attach
   * to, so it does nothing unless `role` is `owner` or `admin`.
   */
  withTooltip?: boolean;
  /** Text of that tooltip. */
  tooltipContent?: string;
  /**
   * Called on a click on the avatar, and on a middle-button press. Passing it
   * replaces the editing behaviour entirely: the upload menu no longer opens.
   */
  onClick?: (e: React.MouseEvent) => void;
  /** Uppercases the initials and gives them the group background and colour. */
  isGroup?: boolean;
  /** Badge to draw instead of the one `role` would choose. */
  roleIcon?: React.ReactElement;
  /** Stops a click from opening the upload menu, leaving the avatar inert. */
  noClick?: boolean;
  /**
   * Whether the user already has a picture. It picks the pencil over the plus,
   * and decides whether a click opens the menu of `model` or goes straight to
   * the file dialog.
   */
  hasAvatar?: boolean;
  /**
   * Called with the change event of the hidden file input, which is rendered
   * only when this prop is given. Without it the avatar is not editable at all.
   */
  onChangeFile?: () => void;

  /**
   * Actions of the edit menu, in order. The first entry is the upload action:
   * it is what a click runs when there is no picture yet, and the entry whose
   * `key` is `AvatarActionKeys.PROFILE_AVATAR_UPLOAD` is handed the file
   * input's ref.
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
