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

import React from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { AIAgentsSelector } from "../../../../selectors/AIAgent";
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
              <span>{"\u26A0"}</span>
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
        <AIAgentsSelector
          onSubmit={handleAgentSelected}
          onClose={() => setIsSelectorOpen(false)}
        />
      )}
    </>
  );
};

export default AgentIdSetup;
