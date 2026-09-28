import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { ShareAccessRights } from "../../enums";
import { globalColors } from "../../providers/theme";

import type { TOption } from "../combobox";

export const data: TOption[] = [
  {
    key: "key1",
    label: "Full access",
    description: "Can edit, share and delete files and folders",
    icon: CatalogFolderReactSvgUrl,
    quota: "paid",
    color: globalColors.favoritesStatus,
    access: ShareAccessRights.FullAccess,
  },
  {
    key: "key2",
    label: "Editor",
    description: "Can edit and share files",
    icon: CatalogFolderReactSvgUrl,
    access: ShareAccessRights.Editing,
  },

  { key: "key3", label: "", isSeparator: true },
  {
    key: "key4",
    label: "Commenter",
    description: "Can comment on and view files",
    icon: CatalogFolderReactSvgUrl,
    access: ShareAccessRights.Comment,
  },
  {
    key: "key5",
    label: "Viewer",
    description: "Can only view files",
    icon: CatalogFolderReactSvgUrl,
    access: ShareAccessRights.ReadOnly,
  },
  {
    key: "key6",
    label: "No access",
    description: "",
    icon: CatalogFolderReactSvgUrl,
    access: ShareAccessRights.DenyAccess,
  },
];
