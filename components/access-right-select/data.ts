import { ShareAccessRights } from "../../enums";
import { globalColors } from "../../providers/theme";

import type { TOption } from "../combobox";

export const data: TOption[] = [
  {
    key: "key1",
    label: "Full access",
    description: "Can edit, share and delete files and folders",
    quota: "paid",
    color: globalColors.favoritesStatus,
    access: ShareAccessRights.FullAccess,
  },
  {
    key: "key2",
    label: "Editor",
    description: "Can edit and share files",
    access: ShareAccessRights.Editing,
  },

  { key: "key3", label: "", isSeparator: true },
  {
    key: "key4",
    label: "Commenter",
    description: "Can comment on and view files",
    access: ShareAccessRights.Comment,
  },
  {
    key: "key5",
    label: "Viewer",
    description: "Can only view files",
    access: ShareAccessRights.ReadOnly,
  },
  {
    key: "key6",
    label: "No access",
    description: "",
    access: ShareAccessRights.DenyAccess,
  },
];
