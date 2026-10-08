import {
  FolderType,
  type FolderDtoInteger,
  type RoomType,
} from "@onlyoffice/docspace-api-sdk";
import type { TSelectorItem } from "../../components/selector";

export const convertToItems = (folders: FolderDtoInteger[]) => {
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

    const icon = logo?.medium ?? undefined;
    const iconOriginal = logo?.original ?? undefined;
    const color = logo?.color ?? undefined;
    const cover = logo?.cover;
    const isTemplate = rootFolderType === FolderType.RoomTemplates;

    return {
      id,
      label: title ?? "",
      icon,
      iconOriginal,
      color,
      roomType: roomType as RoomType,
      shared: shared ?? false,
      isFolder: true as const,
      parentId: parentId ?? 0,
      filesCount: filesCount ?? 0,
      foldersCount: foldersCount ?? 0,
      rootFolderType: rootFolderType ?? 0,
      security: security!,
      cover,
      isTemplate,
      logo,

      title,
      denyDownload,
      indexing,
      lifetime,
      watermark,
      tags,
      quotaLimit,
    } as TSelectorItem;
  });

  return items;
};
