export const getTitleWithoutExtension = (
  item: { title?: string; fileExst: string },
  fromTemplate: boolean,
) => {
  const titleWithoutExst = item?.title?.split(".").slice(0, -1).join(".");
  return titleWithoutExst && item.fileExst && !fromTemplate
    ? titleWithoutExst
    : (item?.title ?? "");
};
