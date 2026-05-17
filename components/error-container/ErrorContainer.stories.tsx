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
