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

import { Label } from ".";

const meta = {
  title: "UI/Data display/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `Label component displays field names in forms with support for required indicators and error states.

### Features

- **Required Indicator**: Show a red asterisk (*) for required fields
- **Error State**: Highlight the label in red for validation errors
- **Truncation**: Truncate overflowing text with ellipsis
- **Inline Display**: Render inline alongside form controls
- **Form Association**: Associates with form controls via \`htmlFor\`
- **Children Support**: Render additional content (e.g., "(optional)") inside the label

### Accessibility

- \`aria-required\`: Indicates when the associated field is required
- \`aria-invalid\`: Indicates when the associated field has an error

### Usage

\`\`\`tsx
import { Label } from "@docspace/ui-kit/components/label";

// Basic label
<Label text="First name" htmlFor="firstName" />

// Required field
<Label text="Email" htmlFor="email" isRequired />

// Error state
<Label text="Password" htmlFor="password" error />

// With children
<Label text="Phone" htmlFor="phone">
  <span>(optional)</span>
</Label>
\`\`\``,
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description: "The text content of the label",
    },
    title: {
      control: "text",
      description: "Title attribute for hover tooltip",
    },
    htmlFor: {
      control: "text",
      description: "Associates the label with a form control",
    },
    isRequired: {
      control: "boolean",
      description: "Shows a required field indicator (*)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    error: {
      control: "boolean",
      description: "Displays the label in error state (red color)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    truncate: {
      control: "boolean",
      description: "Truncates text that overflows with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description: "Displays the label inline",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    display: {
      control: "select",
      options: ["block", "inline", "inline-block", "flex"],
      description: "CSS display property",
    },
  },
} satisfies Meta<typeof Label>;

type Story = StoryObj<ComponentProps<typeof Label>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Label {...args} />,
  args: {
    text: "First name",
    title: "Enter your first name",
    htmlFor: "firstName",
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--label-required-color": "#0082c9",
          "--label-error-color": "#d0021b",
          "--text-size": "14px",
          "--text-weight": "700",
        } as CSSProperties
      }
    >
      <Wrapper>
        <Label text="Display name" htmlFor="displayName" isRequired />
        <Label text="Email address" htmlFor="email" isRequired error />
        <Label text="Bio" htmlFor="bio" />
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--label-required-color\` | Color of the required asterisk (*) | error status color |
| \`--label-error-color\` | Label text color in error state | error status color |
| \`--text-size\` | Font size (via Text component) | \`13px\` |
| \`--text-weight\` | Font weight (via Text component) | \`400\` |`,
      },
    },
  },
};

const RequiredTemplate = () => {
  return (
    <Wrapper>
      <Label text="Email address" htmlFor="email" isRequired />
      <Label text="Password" htmlFor="password" isRequired />
      <Label text="Username" htmlFor="username" isRequired />
    </Wrapper>
  );
};

const ErrorTemplate = () => {
  return (
    <Wrapper>
      <Label text="Password" htmlFor="password" error />
      <Label text="Email" htmlFor="email" isRequired error />
    </Wrapper>
  );
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: 150, border: "1px solid #ccc", padding: 8 }}>
      <Label
        text="This is a very long label that will be truncated"
        title="Full text shown on hover"
        truncate
        style={{ display: "block" }}
      />
    </div>
  );
};

const InlineTemplate = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Label text="Username" htmlFor="username" isInline />
      <input type="text" id="username" style={{ padding: 4 }} />
    </div>
  );
};

const WithChildrenTemplate = () => {
  return (
    <Label text="Phone number" htmlFor="phone">
      <span style={{ marginLeft: 8, color: "#666" }}>(optional)</span>
    </Label>
  );
};

const FormExampleTemplate = () => {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <Label text="Username" htmlFor="form-username" isRequired />
        <input
          type="text"
          id="form-username"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
      <div>
        <Label text="Email" htmlFor="form-email" isRequired error />
        <input
          type="email"
          id="form-email"
          style={{
            display: "block",
            marginTop: 4,
            padding: 8,
            borderColor: "red",
          }}
        />
      </div>
      <div>
        <Label text="Bio" htmlFor="form-bio">
          <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span>
        </Label>
        <textarea
          id="form-bio"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
    </form>
  );
};

export const RequiredLabels: Story = {
  render: () => <RequiredTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Labels with a required field indicator (*) to mark mandatory form fields.",
      },
      source: {
        code: `<Label text="Email address" htmlFor="email" isRequired />
<Label text="Password" htmlFor="password" isRequired />
<Label text="Username" htmlFor="username" isRequired />`,
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => <ErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Labels in error state display red text to indicate validation failures.",
      },
      source: {
        code: `<Label text="Password" htmlFor="password" error />
<Label text="Email" htmlFor="email" isRequired error />`,
      },
    },
  },
};

export const TruncatedLabel: Story = {
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Label that truncates with an ellipsis when it exceeds the container width.",
      },
      source: {
        code: `<div style={{ width: 150 }}>
  <Label text="This is a very long label that will be truncated" truncate />
</div>`,
      },
    },
  },
};

export const InlineLabel: Story = {
  render: () => <InlineTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Inline label displayed next to a form control in a horizontal layout.",
      },
      source: {
        code: `<Label text="Username" htmlFor="username" isInline />
<input type="text" id="username" />`,
      },
    },
  },
};

export const WithChildren: Story = {
  render: () => <WithChildrenTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Label with additional child content rendered alongside the text.",
      },
      source: {
        code: `<Label text="Phone number" htmlFor="phone">
  <span style={{ marginLeft: 8, color: "#666" }}>(optional)</span>
</Label>`,
      },
    },
  },
};

export const FormExample: Story = {
  render: () => <FormExampleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Complete form example showing labels with required, error, and optional states.",
      },
      source: {
        code: `<Label text="Username" htmlFor="username" isRequired />
<input type="text" id="username" />

<Label text="Email" htmlFor="email" isRequired error />
<input type="email" id="email" />

<Label text="Bio" htmlFor="bio">
  <span>(optional)</span>
</Label>
<textarea id="bio" />`,
      },
    },
  },
};
