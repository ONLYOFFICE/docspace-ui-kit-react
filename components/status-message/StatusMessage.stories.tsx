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

import { useState } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";

import StatusMessage from ".";

const meta = {
  title: "UI/Feedback/StatusMessage",
  component: StatusMessage,
  parameters: {
    docs: {
      description: {
        component: `Component for displaying animated status messages with error or warning styling.

### Features

- **Animated Entry/Exit**: Smooth slide-in and fade-out animations
- **Warning Variant**: Alternative styling for warning messages
- **Auto-Hide**: Automatically hides when the message is cleared
- **Message Swap**: Smoothly transitions between different messages
- **Danger Icon**: Displays a warning icon alongside the message text

### Usage

\`\`\`tsx
import StatusMessage from "@docspace/ui-kit/components/status-message";

// Error message
<StatusMessage message="Invalid email address" />

// Warning message
<StatusMessage message="Password is too weak" isWarning />

// Controlled visibility (clear message to hide)
<StatusMessage message={error || ""} />
\`\`\``,
      },
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "Message text to display. Set to empty string to hide.",
    },
    isWarning: {
      control: "boolean",
      description: "Display with warning styling instead of error",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof StatusMessage>;

type Story = StoryObj<ComponentProps<typeof StatusMessage>>;

export default meta;

export const Default: Story = {
  render: (args) => <StatusMessage {...args} />,
  args: {
    message: "This is a status message",
  },
};

const WarningTemplate = () => {
  return <StatusMessage message="This is a warning message" isWarning />;
};

const ToggleTemplate = () => {
  const [message, setMessage] = useState("Click the button to dismiss");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusMessage message={message} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          label="Show Message"
          size={ButtonSize.small}
          onClick={() => setMessage("Status message is visible")}
        />
        <Button
          label="Hide Message"
          size={ButtonSize.small}
          onClick={() => setMessage("")}
        />
      </div>
    </div>
  );
};

const MessageSwapTemplate = () => {
  const [message, setMessage] = useState("First message");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusMessage message={message} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          label="Message A"
          size={ButtonSize.small}
          onClick={() => setMessage("First message")}
        />
        <Button
          label="Message B"
          size={ButtonSize.small}
          onClick={() => setMessage("Second message")}
        />
        <Button
          label="Clear"
          size={ButtonSize.small}
          onClick={() => setMessage("")}
        />
      </div>
    </div>
  );
};

export const WarningMessage: Story = {
  render: () => <WarningTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Status message with warning styling for non-critical alerts.",
      },
      source: {
        code: `<StatusMessage message="This is a warning message" isWarning />`,
      },
    },
  },
};

export const ToggleVisibility: Story = {
  render: () => <ToggleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates showing and hiding the status message by setting the message to an empty string.",
      },
      source: {
        code: `const [message, setMessage] = useState("Click the button to dismiss");

<StatusMessage message={message} />
<Button label="Show" onClick={() => setMessage("Visible")} />
<Button label="Hide" onClick={() => setMessage("")} />`,
      },
    },
  },
};

export const MessageSwap: Story = {
  render: () => <MessageSwapTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates smooth transitions when swapping between different messages.",
      },
      source: {
        code: `const [message, setMessage] = useState("First message");

<StatusMessage message={message} />
<Button label="Message A" onClick={() => setMessage("First message")} />
<Button label="Message B" onClick={() => setMessage("Second message")} />
<Button label="Clear" onClick={() => setMessage("")} />`,
      },
    },
  },
};
