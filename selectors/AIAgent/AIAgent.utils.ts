import {
  type FolderDtoInteger,
  type FileEntryDtoIntegerAllOfSecurity,
  FolderType,
} from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem } from "../../components/selector";

export const convertToItems = (
  folders: FolderDtoInteger[],
  disableBySecurity?: string,
) => {
  const items: TSelectorItem[] = folders.map((folder) => {
    const {
      id,
      title,
      roomType,
      logo,
      shared,
      parentId,
      filesCount,
      foldersCount,
      rootFolderType,
      security,

      denyDownload,
      indexing,
      lifetime,
      watermark,
      tags,
      quotaLimit,
    } = folder;

    const logoProps = { icon: "", color: "", iconOriginal: "" };

    if (logo) {
      logoProps.icon = logo.medium ?? "";
      logoProps.color = logo.color ?? "";
      logoProps.iconOriginal = logo.original ?? "";
    }

    const logoCover = logo?.cover;
    const cover = logoCover
      ? { data: logoCover.data ?? "", id: logoCover.id ?? "" }
      : undefined;
    const isTemplate = rootFolderType === FolderType.RoomTemplates;

    const isDisabledBySecurity = disableBySecurity
      ? !security?.[disableBySecurity as keyof FileEntryDtoIntegerAllOfSecurity]
      : false;

    return {
      id,
      label: title ?? "",
      ...logoProps,
      roomType: roomType as NonNullable<typeof roomType>,
      shared: shared ?? false,
      isFolder: true as const,
      parentId: parentId as NonNullable<typeof parentId>,
      filesCount: filesCount ?? 0,
      foldersCount: foldersCount ?? 0,
      rootFolderType: rootFolderType as NonNullable<typeof rootFolderType>,
      security: security as NonNullable<typeof security>,
      cover,
      isTemplate,
      logo,

      title: title ?? undefined,
      denyDownload,
      indexing,
      lifetime,
      watermark,
      tags: tags ?? undefined,
      quotaLimit,
      isDisabled: isDisabledBySecurity,
    };
  });

  return items;
};
