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

import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorContainer from "./ErrorContainer";

const meta = {
  title: "UI/Layout components/ErrorContainer",
  component: ErrorContainer,
  parameters: {
    docs: {
      description: {
        component: `A full-page error display component with animated decorative SVGs, portal logo, and customizable error messaging.

### Features

- **Animated Background**: Decorative SVG elements with CSS animations (birds, clouds, mountains, balloon)
- **Customizable Content**: Header text, body text, and optional custom HTML body
- **Action Button**: Optional primary or secondary button for recovery actions
- **Editor Mode**: Specialized layout for document editor errors
- **Portal Logo**: Optional portal logo display at the top

### Usage

\`\`\`tsx
import ErrorContainer from "@docspace/ui-kit/components/error-container";

// Basic error page
<ErrorContainer
  headerText="Something went wrong"
  bodyText="Please try again later"
/>

// With retry button
<ErrorContainer
  headerText="Server Error"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  onClickButton={handleRetry}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "Header text of the error message",
    },
    bodyText: {
      control: "text",
      description: "Main body text of the error message",
    },
    buttonText: {
      control: "text",
      description: "Text label for the action button",
    },
    customizedBodyText: {
      control: "text",
      description: "Custom HTML content rendered via dangerouslySetInnerHTML",
    },
    isPrimaryButton: {
      control: "boolean",
      description: "Whether the action button uses primary styling",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isEditor: {
      control: "boolean",
      description: "Enable editor mode with absolute positioning layout",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideLogo: {
      control: "boolean",
      description: "Hide the portal logo at the top",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClickButton: { action: "clicked" },
  },
} satisfies Meta<typeof ErrorContainer>;

type Story = StoryObj<ComponentProps<typeof ErrorContainer>>;

export default meta;

export const Default: Story = {
  render: (args) => <ErrorContainer {...args} />,
  args: {
    bodyText: "Try again later",
    headerText: "Some error has happened",
    customizedBodyText: "Customized body",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default error container with header, body text, and customized body content.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  customizedBodyText="Customized body"
/>`,
      },
    },
  },
};

export const WithPrimaryButton: Story = {
  render: (args) => <ErrorContainer {...args} />,
  args: {
    bodyText: "An error occurred while processing your request",
    headerText: "Some error has happened",
    buttonText: "Retry",
    isPrimaryButton: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error container with a primary action button for retry or navigation.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  isPrimaryButton
  onClickButton={handleRetry}
/>`,
      },
    },
  },
};

export const InEditorMode: Story = {
  render: (args) => <ErrorContainer {...args} />,
  args: {
    isEditor: true,
    bodyText: "Editor mode error message",
    buttonText: "Close Editor",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error container in editor mode with absolute positioning for use within the document editor.",
      },
      source: {
        code: `<ErrorContainer
  isEditor
  bodyText="Editor mode error message"
  buttonText="Close Editor"
  onClickButton={handleClose}
/>`,
      },
    },
  },
};

export const WithChildren: Story = {
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Connection Error",
    bodyText: "Unable to connect to the server",
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            color: "var(--text-color)",
          }}
        >
          Please check the following:
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            fontSize: "14px",
            color: "var(--text-color)",
            lineHeight: "1.8",
          }}
        >
          <li>Your internet connection is active</li>
          <li>Server status at status.example.com</li>
          <li>Firewall or antivirus settings</li>
        </ul>
        <p
          style={{
            fontSize: "13px",
            marginTop: "16px",
            color: "var(--gray)",
            fontStyle: "italic",
          }}
        >
          Error Code: ERR_CONNECTION_REFUSED
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error container with custom children content for detailed troubleshooting guidance.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Connection Error"
  bodyText="Unable to connect to the server"
>
  <div>
    <p>Please check the following:</p>
    <ul>
      <li>Your internet connection is active</li>
      <li>Server status</li>
      <li>Firewall settings</li>
    </ul>
  </div>
</ErrorContainer>`,
      },
    },
  },
};

export const CssCustomization = {
  render: () => (
    <div
      style={
        {
          "--error-container-bg": "#e6f3fb",
          "--error-container-text": "#1d2d44",
          "--error-container-link": "#0082c9",
        } as CSSProperties
      }
    >
      <ErrorContainer
        headerText="Connection error"
        bodyText="Unable to connect to the server."
        buttonText="Try again"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--error-container-bg\` | Container background | white / black |
| \`--error-container-text\` | Body text color | theme gray |
| \`--error-container-link\` | Link color | theme link |`,
      },
    },
  },
};
