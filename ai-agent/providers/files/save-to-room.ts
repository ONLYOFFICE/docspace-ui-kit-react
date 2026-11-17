import type { GeneratedImageAction } from "@onlyoffice/ai-chat";

import type { CopyToRoomFile } from "./copy-to-room-dialog";
import { fileIdOfPath } from "./open-file";

/**
 * "Save to room..." in the footer of a generated image's card, after its
 * Download: it copies the portal file the picture was saved as (its stored
 * path names it, `"<fileId>/<title>"`) into a room or folder the user
 * picks. A picture not saved as a portal file has no such action.
 */
export const saveToRoomImageAction = (
  label: string,
  onSaveToRoom: (file: CopyToRoomFile) => void,
): GeneratedImageAction => ({
  id: "save-to-room",
  label,
  isVisible: (image) => fileIdOfPath(image.path) !== null,
  onClick: (image) => {
    const id = fileIdOfPath(image.path);
    if (id !== null) onSaveToRoom({ id, title: image.name });
  },
});
