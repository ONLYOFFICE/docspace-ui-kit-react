// Extensions the portal opens in the media viewer rather than the editor.
const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
  "ico",
  "tif",
  "tiff",
  "heic",
  "avif",
]);

/**
 * Opens a chat attachment in the portal. Wired into the chat library's
 * `platform.file.openFile`, which fires when the user clicks a file chip
 * on a sent message.
 *
 * `path` comes from the AI backend attachment record and has the form
 * `"<fileId>/<title>"` for files attached from the portal (the attach
 * dialog sends the entry id as `path` and the backend prepends it to the
 * stored path). Raw-payload drafts (device uploads) have an empty path and
 * never reach this handler — the library guards on it.
 */
export const openAttachedFile = (path: string, name: string): void => {
  if (typeof window === "undefined") return;

  const [idPart] = path.split(/[\\/]/, 1);
  const fileId = Number(idPart);
  if (!Number.isInteger(fileId) || fileId <= 0) {
    console.warn(
      `[ai-agent] openFile: cannot parse a file id from path "${path}"`,
    );
    return;
  }

  const extension = (name.split(".").pop() ?? "").toLowerCase();
  const url = IMAGE_EXTENSIONS.has(extension)
    ? `${window.location.origin}/media/view/${fileId}`
    : `${window.location.origin}/doceditor?fileId=${fileId}`;

  window.open(url, "_blank");
};
