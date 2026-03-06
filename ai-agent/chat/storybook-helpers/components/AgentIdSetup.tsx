// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React from "react";

import { Button, ButtonSize } from "../../../../components/button";
import AIAgentSelector from "../../../../selectors/AIAgent";
import { useApi } from "../../../../providers";
import type { TSelectorItem } from "../../../../components/selector";

import type { AgentIdSetupProps } from "../types";

import styles from "./AgentIdSetup.module.scss";

const AgentIdSetup = ({
  onAgentIdConfigured,
  initialError,
}: AgentIdSetupProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [isApiValidating, setIsApiValidating] = React.useState(true);
  const [apiError, setApiError] = React.useState<string | undefined>(
    initialError,
  );

  const { profilesApi } = useApi();

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await profilesApi.getSelfProfile();
        setApiError(undefined);
      } catch {
        setApiError(
          "Failed to connect to the portal. Please check your API settings in the API Config.",
        );
      } finally {
        setIsApiValidating(false);
      }
    };

    checkConnection();
  }, [profilesApi]);

  const handleAgentSelected = (items: TSelectorItem[]) => {
    setIsSelectorOpen(false);
    if (items.length > 0 && items[0].id) {
      onAgentIdConfigured(items[0].id);
    }
  };

  const buttonText = "Browse AI Agents";

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Configure AI Agent</h2>
          <p className={styles.description}>
            Select an AI agent from your portal to enable the chat component.
          </p>

          {apiError && (
            <div className={styles.error}>
              <span>⚠</span>
              <span>{apiError}</span>
            </div>
          )}

          <Button
            type="button"
            primary
            size={ButtonSize.medium}
            label={buttonText}
            onClick={() => setIsSelectorOpen(true)}
            isLoading={isApiValidating}
            isDisabled={!!apiError || isApiValidating}
          />
        </div>
      </div>
      {isSelectorOpen && (
        <AIAgentSelector
          onSubmit={handleAgentSelected}
          onClose={() => setIsSelectorOpen(false)}
        />
      )}
    </>
  );
};

export default AgentIdSetup;
