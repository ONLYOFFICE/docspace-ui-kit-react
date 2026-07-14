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

import { useApi } from "../../../../providers";
import type { AgentIdValidationResult } from "../types";

const useAgentIdValidation = () => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );
  const [isValid, setIsValid] = React.useState(false);
  const { aiApi } = useApi();

  const validateAgentId = React.useCallback(
    async (agentId: string | number): Promise<AgentIdValidationResult> => {
      if (!agentId) {
        const error = "Agent ID is required";
        setValidationError(error);
        setIsValid(false);
        return { isValid: false, error };
      }

      setIsValidating(true);
      setValidationError(null);
      setIsValid(false);

      try {
        const numericId = Number(agentId);
        if (Number.isNaN(numericId)) {
          const error = "Agent ID must be a valid number";
          setValidationError(error);
          setIsValid(false);
          setIsValidating(false);
          return { isValid: false, error };
        }

        await aiApi.getAgentFolder(numericId);

        setIsValid(true);
        setValidationError(null);
        setIsValidating(false);
        return { isValid: true, agentId: numericId };
      } catch (error: unknown) {
        let errorMessage =
          "Please check your API provider settings and Agent ID";

        if (error && typeof error === "object") {
          if ("message" in error && typeof error.message === "string") {
            const message = error.message.toLowerCase();
            if (message.includes("not found") || message.includes("404")) {
              errorMessage =
                "Agent not found. Please check the Agent ID and try again.";
            }
          }
        }

        setValidationError(errorMessage);
        setIsValid(false);
        setIsValidating(false);
        return { isValid: false, error: errorMessage };
      }
    },
    [aiApi],
  );

  return {
    isValidating,
    validationError,
    isValid,
    validateAgentId,
  };
};

export default useAgentIdValidation;
