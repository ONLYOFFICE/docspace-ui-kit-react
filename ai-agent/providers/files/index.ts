export { getOnlyofficeFileType } from "./file-type";
// The duplicate check stays internal on purpose: `attachFilesToChat` applies
// it itself, so a host never has to remember it (see duplicate-attachments).
export {
  attachFilesToChat,
  type AttachFileInput,
  type AttachedFileInfo,
  type OnFilesAttached,
} from "./attach-files";
// The composer lock a subject attachment ("Analyze responses") puts on the
// draft. Consumed by the chat providers, which own the store bundle.
export { useAnalyzeLock } from "./use-analyze-lock";
export { useAnalyzeQuestions } from "./use-analyze-questions";
export { useComposerTyping } from "./use-composer-typing";
// Provided by AiAgentProviders around the host subtree; consumed by
// `useAttachHostFilesToChat`, so hosts never pass it themselves.
export { OnFilesAttachedContext, useOnFilesAttached } from "./attached-report";
export {
  useAttachHostFilesToChat,
  type ChatAttachableItem,
  type AttachToChatResult,
} from "./use-attach-to-chat";
export { CHAT_ATTACHMENT_LIMIT } from "./limits";
export { useFilesIntegration, type FilesIntegration } from "./use-integration";
export { notifyAlreadyAttached, notifyAttachmentLimit } from "./notices";
// Provided by AiAgentProviders from its `attachmentLimit` prop; the host
// subtree reads it through the attach hook's result, not directly.
export {
  AttachmentLimitContext,
  DEFAULT_ATTACHMENT_CAP,
  useAttachmentLimit,
  type AttachmentCap,
} from "./attachment-limit";
export type {
  ReadSuggestedQuestions,
  SuggestedQuestion,
} from "./suggested-questions";
