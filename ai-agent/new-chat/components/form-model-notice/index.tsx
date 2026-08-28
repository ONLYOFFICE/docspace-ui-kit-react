/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
 * Form-ness comes from the host file row (`isForm`), remembered per
 * attachment by the attach helpers — the attachment record itself carries no
 * such flag in this topology (`canAnalyze` is never populated by the DocSpace
 * backend). The rest of the wiring — which model is recommended, whether the
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
