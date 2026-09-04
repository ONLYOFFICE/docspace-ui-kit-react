import { OPERATIONS_NAME } from "../../constants";

export const FloatingButtonIcons = {
  upload: OPERATIONS_NAME.upload,
  trash: OPERATIONS_NAME.trash,
  move: OPERATIONS_NAME.move,
  duplicate: OPERATIONS_NAME.duplicate,
  plus: "plus",
  minus: "minus",
  refresh: "refresh",
  exportIndex: OPERATIONS_NAME.exportIndex,
  dots: "dots",
  arrow: "arrow",
  deletePermanently: OPERATIONS_NAME.deletePermanently,
  download: OPERATIONS_NAME.download,
  copy: OPERATIONS_NAME.copy,
  markAsRead: OPERATIONS_NAME.markAsRead,
  other: OPERATIONS_NAME.other,
  backup: OPERATIONS_NAME.backup,
} as const;
