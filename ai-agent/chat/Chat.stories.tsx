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

import React, { useState, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Chat from "./index";
import type { ChatProps } from "./Chat.types";
import ApiProvider from "../../providers/api/ApiProvider";
import { SocketProvider } from "../../providers/socket/SocketProvider";
import { FieldContainer } from "../../components/field-container";
import { TextInput, InputSize, InputType } from "../../components/text-input";
import { PasswordInput } from "../../components/password-input";
import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";
import { Heading, HeadingLevel, HeadingSize } from "../../components/heading";

import styles from "./ChatStories.module.scss";

const ChatStoryWrapper = (props: ChatProps) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem("storybook_api_url") || "",
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("storybook_api_key") || "",
  );
  const [agentId, setAgentId] = useState(
    localStorage.getItem("storybook_agent_id") || "",
  );
  const [isConfigured, setIsConfigured] = useState(false);

  React.useEffect(() => {
    const savedApiUrl = localStorage.getItem("storybook_api_url");
    const savedApiKey = localStorage.getItem("storybook_api_key");
    const savedAgentId = localStorage.getItem("storybook_agent_id");

    if (savedApiUrl && savedApiKey && savedAgentId) {
      setIsConfigured(true);
    }
  }, []);

  const requiredFieldsFilled =
    apiUrl.trim().length > 0 &&
    apiKey.trim().length > 0 &&
    agentId.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiredFieldsFilled) {
      localStorage.setItem("storybook_api_url", apiUrl);
      localStorage.setItem("storybook_api_key", apiKey);
      localStorage.setItem("storybook_agent_id", agentId);
      setIsConfigured(true);
    }
  };

  const handleSubmitClick = () => {
    if (requiredFieldsFilled) submitButtonRef.current?.click();
  };

  const handleReset = () => {
    setIsConfigured(false);
    localStorage.removeItem("storybook_api_url");
    localStorage.removeItem("storybook_api_key");
    localStorage.removeItem("storybook_agent_id");
  };

  if (!isConfigured) {
    return (
      <div className={styles.configWrapper}>
        <div className={styles.configContainer}>
          <Heading
            level={HeadingLevel.h2}
            size={HeadingSize.medium}
            className={styles.configTitle}
          >
            Configure AI Chat
          </Heading>
          <Text className={styles.configDescription}>
            Please enter the required configuration to initialize the chat
            component.
          </Text>
          <form onSubmit={handleSubmit}>
            <FieldContainer
              labelText="API URL"
              labelVisible
              isVertical
              isRequired
            >
              <TextInput
                size={InputSize.base}
                type={InputType.text}
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                scale
                placeholder="https://api.example.com"
              />
            </FieldContainer>

            <FieldContainer
              labelText="API Key"
              labelVisible
              isVertical
              isRequired
            >
              <PasswordInput
                size={InputSize.base}
                inputValue={apiKey}
                onChange={(_, value) => setApiKey(value ?? "")}
                isFullWidth
                isDisableTooltip
                placeholder="Enter your API key"
                isSimulateType
                autoComplete="off"
              />
            </FieldContainer>

            <FieldContainer
              labelText="Agent ID"
              labelVisible
              isVertical
              isRequired
            >
              <TextInput
                size={InputSize.base}
                type={InputType.text}
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                scale
                placeholder="229754"
              />
              <Text
                style={{ marginTop: "4px", fontSize: "12px", color: "#999" }}
              >
                Numeric identifier of the AI agent
              </Text>
            </FieldContainer>

            <button
              type="submit"
              ref={submitButtonRef}
              hidden
              aria-label="submit"
            />
          </form>

          <div className={styles.configActions}>
            <Button
              primary
              size={ButtonSize.normal}
              label="Initialize Chat"
              scale
              onClick={handleSubmitClick}
              isDisabled={!requiredFieldsFilled}
            />
          </div>

          <Text className={styles.configHint}>
            * All fields are required. Values will be saved in localStorage.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.resetButton}>
        <Button
          size={ButtonSize.small}
          label="Reset Configuration"
          onClick={handleReset}
        />
      </div>
      <ApiProvider url={apiUrl} apiKey={apiKey}>
        <SocketProvider>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chat {...props} agentId={Number(agentId)} />
          </div>
        </SocketProvider>
      </ApiProvider>
    </div>
  );
};

const meta: Meta<typeof Chat> = {
  title: "AI-Agent/Chat",
  component: Chat,
  parameters: {
    layout: "fullscreen",
    noPadding: true,
  },
  decorators: [
    (Story, context) => {
      return <ChatStoryWrapper {...context.args} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Chat>;

const defaultProps: ChatProps = {
  internalInit: true,
  width: "100%",
  height: "100vh",
  isLoading: false,
  useInternalScroll: true,
  agentId: 229754,
  userAvatar: "",
  selectedModel: "gpt-4o",
  getIcon: () => "",
  getResultStorageId: () => null,
  aiReady: true,
  attachmentFile: null,
  clearAttachmentFile: () => {},
  folderFormValidation: /^[a-zA-Z0-9 ]+$/,
  isAdmin: false,
  persistDraft: false,
};

export const Default: Story = {
  args: defaultProps,
};
