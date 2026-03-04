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

import { InputType, TextInput } from "../../../../components/text-input";
import { Button, ButtonSize } from "../../../../components/button";
import { Loader } from "../../../../components/loader";

import useAgentIdValidation from "../hooks/useAgentIdValidation";
import type { AgentIdSetupProps } from "../types";

import styles from "./AgentIdSetup.module.scss";

const AgentIdSetup = ({
  onAgentIdConfigured,
  initialAgentId,
  initialError,
}: AgentIdSetupProps) => {
  const [inputValue, setInputValue] = React.useState(
    initialAgentId ? String(initialAgentId) : "",
  );
  const { isValidating, validationError, validateAgentId } =
    useAgentIdValidation();

  const [localError, setLocalError] = React.useState<string | undefined>(
    initialError,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(undefined);

    if (!inputValue.trim()) {
      setLocalError("Please enter an Agent ID");
      return;
    }

    const result = await validateAgentId(inputValue.trim());

    if (result.isValid && result.agentId) {
      onAgentIdConfigured(result.agentId);
    } else {
      setLocalError(result.error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setLocalError(undefined);
  };

  const displayError = localError || validationError;

  const inputPlaceholder = "Enter Agent ID (e.g., 229754)";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Configure AI Agent</h2>
        <p className={styles.description}>
          Enter the Agent ID to connect to the AI chat service. Make sure the
          API provider is configured correctly.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="agentId" className={styles.label}>
              Agent ID
            </label>
            <TextInput
              id="agentId"
              name="agentId"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={inputPlaceholder}
              hasError={!!displayError}
              isDisabled={isValidating}
              autoFocus
              type={InputType.text}
            />
            {displayError && (
              <div className={styles.error}>
                <span>⚠</span>
                <span>{displayError}</span>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              primary
              size={ButtonSize.medium}
              label={isValidating ? "Validating..." : "Validate & Save"}
              isDisabled={isValidating || !inputValue.trim()}
              className={styles.button}
            />
          </div>
        </form>

        {isValidating && (
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Loader size="16px" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentIdSetup;
