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

import { Button, Heading, HeadingSize, Text } from "../";
import { LoaderWrapper } from ".";

const meta = {
  title: "UI/Status components/LoaderWrapper",
  component: LoaderWrapper,
  parameters: {
    docs: {
      description: {
        component: `A wrapper component that dims its children and disables pointer events during loading states.

### Features

- **Soft Overlay**: Reduces opacity to 0.5 instead of hiding content
- **Interaction Lock**: Automatically disables pointer events to prevent accidental clicks
- **Smooth Transition**: 0.3s ease-in-out opacity animation
- **Plug-and-Play**: Works with any child tree and keeps layout intact

### Usage

\`\`\`tsx
import { LoaderWrapper } from "@docspace/ui-kit/components/loader-wrapper";

<LoaderWrapper isLoading={isLoading}>
  <SectionContent />
</LoaderWrapper>
\`\`\``,
      },
    },
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
      description: "Content to render inside the wrapper",
    },
    isLoading: {
      control: "boolean",
      description: "Toggles the loading overlay style and interaction lock",
    },
    testId: {
      control: "text",
      description: "Optional data-testid override for automated testing",
      table: {
        defaultValue: { summary: "loader-wrapper" },
      },
    },
  },
} satisfies Meta<typeof LoaderWrapper>;

type Story = StoryObj<ComponentProps<typeof LoaderWrapper>>;

export default meta;

const cardContent = (
  <div
    style={{
      padding: "24px 32px",
      borderRadius: "16px",
      border: "1px solid var(--stroke-light, #e1e6eb)",
      background: "var(--background-surface, #fff)",
      minWidth: 320,
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <Heading size={HeadingSize.medium}>Lorem ipsum</Heading>
    <Text color="var(--text-secondary, #4f5d75)" lineHeight="22px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </Text>
    <Button primary label="Lorem ipsum" />
  </div>
);

export const IdleContent: Story = {
  render: (args) => <LoaderWrapper {...args} />,
  args: {
    isLoading: false,
    children: cardContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content in idle state with full opacity and pointer events enabled.",
      },
      source: {
        code: `<LoaderWrapper isLoading={false}>
  <CardContent />
</LoaderWrapper>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--loader-wrapper-loading-opacity": "0.3",
          "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
        } as CSSProperties
      }
    >
      <LoaderWrapper isLoading>{cardContent}</LoaderWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--loader-wrapper-loading-opacity\` | Opacity when in loading state | \`0.5\` |
| \`--loader-wrapper-idle-opacity\` | Opacity when idle | \`1\` |
| \`--loader-wrapper-transition\` | CSS transition for opacity | \`opacity 0.3s ease-in-out\` |`,
      },
    },
  },
};

export const LoadingContent: Story = {
  render: (args) => <LoaderWrapper {...args} />,
  args: {
    isLoading: true,
    children: cardContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content in loading state with reduced opacity (0.5) and pointer events disabled.",
      },
      source: {
        code: `<LoaderWrapper isLoading>
  <CardContent />
</LoaderWrapper>`,
      },
    },
  },
};
