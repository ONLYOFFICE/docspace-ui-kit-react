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

import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Label component displays the field name in forms. It supports required field indication, error states, and various display options.",
      },
    },
  },
  argTypes: {
    text: {
      description: "The text content of the label",
      control: "text",
    },
    title: {
      description: "Title attribute for the label",
      control: "text",
    },
    htmlFor: {
      description: "Associates the label with a form control",
      control: "text",
    },
    isRequired: {
      description: "Shows a required field indicator (*)",
      control: "boolean",
    },
    error: {
      description: "Displays the label in error state",
      control: "boolean",
    },
    truncate: {
      description: "Truncates text that overflows",
      control: "boolean",
    },
    isInline: {
      description: "Displays the label inline",
      control: "boolean",
    },
    display: {
      description: "CSS display property",
      control: "select",
      options: ["block", "inline", "inline-block", "flex"],
    },
    style: {
      description: "Custom CSS styles",
      control: "object",
    },
    className: {
      description: "Additional CSS class names",
      control: "text",
    },
  },
};

type Story = StoryObj<typeof Label>;

export default meta;

export const Default: Story = {
  args: {
    text: "First name",
    title: "Enter your first name",
    htmlFor: "firstName",
    isRequired: false,
    error: false,
    truncate: false,
    isInline: false,
    display: "block",
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    text: "Email address",
    title: "Enter your email address",
    htmlFor: "email",
    isRequired: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    text: "Password",
    title: "Enter your password",
    htmlFor: "password",
    error: true,
  },
};

export const Truncated: Story = {
  render: (args) => (
    <div style={{ width: "150px", border: "1px solid #ccc", padding: "8px" }}>
      <Label style={{ display: "block" }} {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    text: "This is a very long label that will be truncated",
    title: "Full text shown on hover",
    truncate: true,
  },
};

export const Inline: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Label {...args} />
      <input type="text" id={args.htmlFor} style={{ padding: "4px" }} />
    </div>
  ),
  args: {
    ...Default.args,
    text: "Username",
    title: "Enter username",
    htmlFor: "username",
    isInline: true,
  },
};

export const WithChildren: Story = {
  render: (args) => (
    <Label {...args}>
      <span style={{ marginLeft: "8px", color: "#666" }}>(optional)</span>
    </Label>
  ),
  args: {
    ...Default.args,
    text: "Phone number",
    title: "Enter phone number",
    htmlFor: "phone",
  },
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    text: "Custom Label",
    className: "custom-label",
    style: {
      fontWeight: 700,
      color: "#2c3e50",
      textTransform: "uppercase",
    },
  },
};

export const RequiredWithError: Story = {
  args: {
    ...Default.args,
    text: "Email address",
    htmlFor: "email",
    isRequired: true,
    error: true,
  },
};

export const FormExample: Story = {
  render: () => (
    <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Label text="Username" htmlFor="username" isRequired />
        <input
          type="text"
          id="username"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
      <div>
        <Label text="Email" htmlFor="email" isRequired error />
        <input
          type="email"
          id="email"
          style={{
            display: "block",
            marginTop: 4,
            padding: 8,
            borderColor: "red",
          }}
        />
      </div>
      <div>
        <Label text="Bio" htmlFor="bio">
          <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span>
        </Label>
        <textarea
          id="bio"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
    </form>
  ),
};
