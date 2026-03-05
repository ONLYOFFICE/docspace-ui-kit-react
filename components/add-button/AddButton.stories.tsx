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

import { AddButton } from ".";

const meta = {
  title: "UI/Interactive elements/AddButton",
  component: AddButton,
  parameters: {
    docs: {
      description: {
        component: `AddButton is a compact action button for adding items, typically used in selectors and lists.

### Features

- **Optional Label**: Text displayed next to the icon
- **Loading State**: Spinner replaces icon during async operations
- **Accent Style**: Accent color variant for emphasis
- **Disabled State**: Prevents interaction
- **Custom Icon**: Configurable icon and icon size
- **Truncation**: Long labels can be truncated
- **Keyboard Support**: Responds to Enter key when focused

### Usage

\`\`\`tsx
import { AddButton } from "@docspace/ui-kit/components/add-button";

// Basic add button
<AddButton title="Add item" onClick={handleAdd} />

// With label
<AddButton title="Add user" label="Add user" onClick={handleAdd} />

// Accent style
<AddButton title="Create new" isAction onClick={handleCreate} />

// Loading state
<AddButton title="Adding..." isLoading />
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Tooltip text",
    },
    label: {
      control: "text",
      description: "Text label next to the button",
    },
    isDisabled: {
      control: "boolean",
      description: "Disabled state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAction: {
      control: "boolean",
      description: "Use accent colors",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading spinner instead of icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    iconSize: {
      control: "number",
      description: "Icon size in pixels",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    size: {
      control: "text",
      description: "Button container size",
    },
    fontSize: {
      control: "text",
      description: "Label font size",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    truncate: {
      control: "boolean",
      description: "Truncate label text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof AddButton>;

type Story = StoryObj<ComponentProps<typeof AddButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <AddButton {...args} onClick={() => alert("Add clicked")} />
  ),
  args: {
    title: "Add item",
  },
};

const WithLabelTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Add item" label="Add user" onClick={() => {}} />
      <AddButton
        title="Add item"
        label="Add group"
        isAction
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const WithLabel: Story = {
  render: () => <WithLabelTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "AddButton with text labels. Left: default style. Right: accent style.",
      },
      source: {
        code: `<AddButton title="Add item" label="Add user" onClick={handleClick} />
<AddButton title="Add item" label="Add group" isAction onClick={handleClick} />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Add item" isDisabled onClick={() => {}} />
      <AddButton
        title="Add item"
        label="Disabled with label"
        isDisabled
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled add buttons cannot be interacted with and have reduced opacity.",
      },
      source: {
        code: `<AddButton title="Add item" isDisabled />
<AddButton title="Add item" label="Disabled with label" isDisabled />`,
      },
    },
  },
};

const AccentTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Default" onClick={() => {}} />
      <AddButton title="Accent" isAction onClick={() => {}} />
    </Wrapper>
  );
};

export const AccentStyle: Story = {
  render: () => <AccentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Accent style uses theme accent colors for emphasis. Left: default. Right: accent.",
      },
      source: {
        code: `<AddButton title="Default" onClick={handleClick} />
<AddButton title="Accent" isAction onClick={handleClick} />`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <AddButton {...args} />,
  args: {
    title: "Adding...",
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state replaces the icon with a spinner. The button cannot be clicked while loading.",
      },
      source: {
        code: `<AddButton title="Adding..." isLoading />`,
      },
    },
  },
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: "150px" }}>
      <AddButton
        title="Add item"
        label="This is a very long label that should be truncated"
        truncate
        onClick={() => {}}
      />
    </div>
  );
};

export const TruncatedLabel: Story = {
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Long labels can be truncated when the container width is limited.",
      },
      source: {
        code: `<AddButton title="Add item" label="Very long label text..." truncate onClick={handleClick} />`,
      },
    },
  },
};

const CustomSizeTemplate = () => {
  return (
    <Wrapper>
      <AddButton title="Default" onClick={() => {}} />
      <AddButton
        title="Large icon"
        iconSize={16}
        size="36px"
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const CustomIconSize: Story = {
  render: () => <CustomSizeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon size and container size can be customized. Left: default (12px icon). Right: larger (16px icon, 36px container).",
      },
      source: {
        code: `<AddButton title="Default" onClick={handleClick} />
<AddButton title="Large icon" iconSize={16} size="36px" onClick={handleClick} />`,
      },
    },
  },
};
