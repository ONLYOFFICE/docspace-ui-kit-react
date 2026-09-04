export const getFolderUrl = (baseUrl: string, folderId: string | number): string => {
  return `${baseUrl}/rooms/personal/filter?folder=${folderId}`;
};

export const getIsDisabled = (
  isFirstLoad: boolean,
  isSelectedParentFolder: boolean,
  selectedItemId: string | number | undefined,
  selectedItemType: "rooms" | "files" | "agents" | undefined,
  isRoot: boolean,
): boolean => {
  if (isFirstLoad) return true;
  if (isSelectedParentFolder) return true;
  if (isRoot) return true;
  if (!selectedItemId) return true;
  if (selectedItemType === "rooms") return true;
  return false;
};