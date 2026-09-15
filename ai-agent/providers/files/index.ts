export { getOnlyofficeFileType } from "./file-type";
// The duplicate check stays internal on purpose: `attachFilesToChat` applies
// it itself, so a host never has to remember it (see duplicate-attachments).
export {
  attachFilesToChat,
  type AttachFileInput,
  type AttachedFileInfo,
  type OnFilesAttached,
} from "./attach-files";
export { useHasFormAttached } from "./use-has-form-attached";
export {
  useAttachHostFilesToChat,
  type ChatAttachableItem,
  type AttachToChatResult,
} from "./use-attach-to-chat";
export { CHAT_ATTACHMENT_LIMIT } from "./limits";
export {
  useFilesIntegration,
  type FilesIntegration,
} from "./use-integration";
export { notifyAlreadyAttached, notifyAttachmentLimit } from "./notices";
