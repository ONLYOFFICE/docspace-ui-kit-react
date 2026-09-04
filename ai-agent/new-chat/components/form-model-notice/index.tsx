"use client";

import React from "react";
import { useStores } from "@onlyoffice/ai-chat";

import { useHasFormAttached } from "../../../providers/files/use-has-form-attached";
import { useFormsRecommendation } from "../../../providers/forms-recommendation";
import RecomendedModel from "../../../recomended-model";

import styles from "./FormModelNotice.module.scss";

/**
 * In-chat notice recommending the model the portal tested for form results,
 * shown above the conversation while the composer carries a DocSpace form.
 *
 * Form-ness comes from the host file row — `isForm` together with the
 * results table the responses land in (`externalDbTableName`) — and is
 * remembered per attachment by the attach helpers: the attachment record
 * itself carries no such flag in this topology (`canAnalyze` is never
 * populated by the DocSpace backend). A form nobody has answered has nothing
 * to discuss, hence the table. The rest of the wiring — which model is recommended, whether the
 * user may change the agent's model, and whether the user already dismissed
 * the notice — is host state, supplied through `formsRecommendation` on
 * `AiAgentProviders`.
 */
export const FormModelNotice = () => {
  const hasFormAttached = useHasFormAttached();
  const {
    recommendedModel,
    canEditAgent,
    onOpenAgentEdit,
    noticeVisible,
    onCloseNotice,
  } = useFormsRecommendation();

  const { useProfilesStore } = useStores();
  // The model the composer actually answers with — the lib's own precedence:
  // the session pick, then the agent's Chat profile, then the portal default.
  const selectedModel = useProfilesStore(
    (s) =>
      (s.sessionChatProfile ?? s.chatProfile ?? s.defaultProfile)?.modelId ??
      "",
  );

  // Closing without a host handler cannot be persisted, so it lasts for this
  // mount only — better than a close button that does nothing.
  const [closed, setClosed] = React.useState(false);

  const onClose = React.useCallback(() => {
    setClosed(true);
    onCloseNotice?.();
  }, [onCloseNotice]);

  if (!hasFormAttached || !recommendedModel) return null;
  if (closed || noticeVisible === false) return null;

  return (
    <div className={styles.formModelNotice}>
      <RecomendedModel
        isChat
        isAdmin={!!canEditAgent}
        selectedModel={selectedModel}
        recomendedModel={recommendedModel}
        onClose={onClose}
        onOpenEdit={onOpenAgentEdit}
      />
    </div>
  );
};

export default FormModelNotice;
