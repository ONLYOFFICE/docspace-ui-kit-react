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
    async (
      agentId: string | number,
    ): Promise<AgentIdValidationResult> => {
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
        let errorMessage = "Please check your API provider settings and Agent ID";

        if (error && typeof error === "object") {
          if ("message" in error && typeof error.message === "string") {
            const message = error.message.toLowerCase();
            if (message.includes("not found") || message.includes("404")) {
              errorMessage = "Agent not found. Please check the Agent ID and try again.";
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
