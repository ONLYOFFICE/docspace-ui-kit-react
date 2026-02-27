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

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import LogoUrl from "../../assets/dark_leftmenu.svg?url";

import { MCPIcon, MCPIconSize } from ".";

const meta = {
  title: "UI/Data display/MCPIcon",
  component: MCPIcon,
  parameters: {
    docs: {
      description: {
        component: `An icon component for MCP (Model Context Protocol) with configurable size options and image fallback.

### Features

- **Four Sizes**: Small, Medium, Big, and Large
- **Image Support**: Display a custom image or fall back to the first character of the title
- **Error Handling**: Gracefully falls back to title initial if image fails to load

### Usage

\`\`\`tsx
import { MCPIcon, MCPIconSize } from "@docspace/ui-kit/components/mcp-icon";

// With title initial
<MCPIcon title="DocSpace MCP" size={MCPIconSize.Large} />

// With image
<MCPIcon title="My Server" size={MCPIconSize.Medium} imgSrc="/path/to/icon.svg" />
\`\`\``,
      },
    },
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title text (first character used as fallback icon)",
    },
    size: {
      control: "select",
      options: Object.values(MCPIconSize),
      description: "Size of the icon",
      table: {
        defaultValue: { summary: "large" },
      },
    },
    imgSrc: {
      control: "text",
      description: "Image source URL for the icon",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
    },
    dataTestId: {
      control: "text",
      description: "Test ID for testing purposes",
      table: {
        defaultValue: { summary: "mcp-icon" },
      },
    },
  },
} satisfies Meta<typeof MCPIcon>;

type Story = StoryObj<ComponentProps<typeof MCPIcon>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

const LabeledItem = (props: { label: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {props.children}
      <span style={{ fontSize: "12px", color: "#666" }}>{props.label}</span>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "DocSpace MCP",
    size: MCPIconSize.Large,
  },
};

export const WithImage: Story = {
  render: (args) => <MCPIcon {...args} />,
  args: {
    title: "Any",
    size: MCPIconSize.Large,
    imgSrc: LogoUrl,
  },
  parameters: {
    docs: {
      description: {
        story:
          "MCP icon displaying a custom image. Falls back to title initial if the image fails to load.",
      },
      source: {
        code: `<MCPIcon title="My Server" size={MCPIconSize.Large} imgSrc="/path/to/icon.svg" />`,
      },
    },
  },
};

const AllSizesTemplate = () => {
  return (
    <Wrapper>
      {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(
        (key) => (
          <LabeledItem key={key} label={key}>
            <MCPIcon title="DocSpace" size={MCPIconSize[key]} />
          </LabeledItem>
        ),
      )}
    </Wrapper>
  );
};

export const AllSizes: Story = {
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "All available MCP icon sizes: Small, Medium, Big, and Large.",
      },
      source: {
        code: `<MCPIcon title="DocSpace" size={MCPIconSize.Small} />
<MCPIcon title="DocSpace" size={MCPIconSize.Medium} />
<MCPIcon title="DocSpace" size={MCPIconSize.Big} />
<MCPIcon title="DocSpace" size={MCPIconSize.Large} />`,
      },
    },
  },
};

const AllSizesWithImageTemplate = () => {
  return (
    <Wrapper>
      {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(
        (key) => (
          <LabeledItem key={key} label={key}>
            <MCPIcon
              title="DocSpace"
              size={MCPIconSize[key]}
              imgSrc={LogoUrl}
            />
          </LabeledItem>
        ),
      )}
    </Wrapper>
  );
};

export const AllSizesWithImage: Story = {
  render: () => <AllSizesWithImageTemplate />,
  parameters: {
    docs: {
      description: {
        story: "All sizes with a custom image instead of the title initial.",
      },
      source: {
        code: `<MCPIcon title="DocSpace" size={MCPIconSize.Small} imgSrc={logoUrl} />
<MCPIcon title="DocSpace" size={MCPIconSize.Medium} imgSrc={logoUrl} />
<MCPIcon title="DocSpace" size={MCPIconSize.Big} imgSrc={logoUrl} />
<MCPIcon title="DocSpace" size={MCPIconSize.Large} imgSrc={logoUrl} />`,
      },
    },
  },
};
