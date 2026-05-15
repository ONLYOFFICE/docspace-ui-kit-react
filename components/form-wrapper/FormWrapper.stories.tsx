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

import { FormWrapper } from "./index";

import styles from "./FormWrapper.stories.module.scss";

const meta = {
  title: "UI/Form controls/FormWrapper",
  component: FormWrapper,
  parameters: {
    docs: {
      description: {
        component: `A styled container component that wraps form content with consistent padding, background, and border-radius. Typically used on login and registration pages.

### Features

- **Consistent Styling**: Provides unified padding, background, and border-radius for forms
- **Flexible Content**: Accepts any React children as form content
- **Customizable**: Supports custom className, id, and inline styles

### Usage

\`\`\`tsx
import { FormWrapper } from "@docspace/ui-kit/components/form-wrapper";

<FormWrapper>
  <Input placeholder="Email" />
  <Input placeholder="Password" type="password" />
  <Button primary label="Sign In" />
</FormWrapper>
\`\`\``,
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS class names",
    },
    id: {
      control: "text",
      description: "HTML id attribute",
    },
    style: {
      control: "object",
      description: "Custom inline styles",
    },
  },
} satisfies Meta<typeof FormWrapper>;

type Story = StoryObj<ComponentProps<typeof FormWrapper>>;

export default meta;

export const Default: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    children: (
      <div className={styles.demoContent}>
        <h3>Welcome</h3>
        <p>This is a basic form wrapper example</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic form wrapper with simple content to demonstrate the container styling.",
      },
      source: {
        code: `<FormWrapper>
  <h3>Welcome</h3>
  <p>This is a basic form wrapper example</p>
</FormWrapper>`,
      },
    },
  },
};

export const WithLoginForm: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    children: (
      <form className={styles.demoForm}>
        <input className={styles.demoInput} type="email" placeholder="Email" />
        <input
          className={styles.demoInput}
          type="password"
          placeholder="Password"
        />
        <button className={styles.demoButton} type="button">
          Sign In
        </button>
      </form>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form wrapper containing a typical login form with email and password fields.",
      },
      source: {
        code: `<FormWrapper>
  <form>
    <Input type="email" placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Button primary label="Sign In" />
  </form>
</FormWrapper>`,
      },
    },
  },
};

export const WithRegistrationForm: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    children: (
      <form className={styles.demoForm}>
        <input
          className={styles.demoInput}
          type="text"
          placeholder="Full Name"
        />
        <input className={styles.demoInput} type="email" placeholder="Email" />
        <input
          className={styles.demoInput}
          type="password"
          placeholder="Password"
        />
        <input
          className={styles.demoInput}
          type="password"
          placeholder="Confirm Password"
        />
        <button className={styles.demoButton} type="button">
          Create Account
        </button>
      </form>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form wrapper containing a registration form with name, email, and password fields.",
      },
      source: {
        code: `<FormWrapper>
  <form>
    <Input type="text" placeholder="Full Name" />
    <Input type="email" placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Input type="password" placeholder="Confirm Password" />
    <Button primary label="Create Account" />
  </form>
</FormWrapper>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--form-wrapper-bg": "#1e1b4b",
          "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
          "--form-wrapper-radius": "24px",
          "--form-wrapper-padding": "40px",
          "--form-wrapper-max-width": "400px",
          "--form-wrapper-min-width": "400px",
        } as CSSProperties
      }
    >
      <FormWrapper>
        <div className={styles.demoContent}>
          <h3 style={{ color: "#e0e7ff", margin: 0 }}>Custom Styled Form</h3>
          <p style={{ color: "#a78bfa", margin: "8px 0 0" }}>
            Customized with CSS variables
          </p>
        </div>
      </FormWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--form-wrapper-bg\` | Background color | theme token |
| \`--form-wrapper-shadow\` | Box shadow | theme token |
| \`--form-wrapper-radius\` | Border radius | \`12px\` |
| \`--form-wrapper-padding\` | Inner padding | \`32px\` |
| \`--form-wrapper-max-width\` | Maximum width | \`320px\` |
| \`--form-wrapper-min-width\` | Minimum width | \`320px\` |`,
      },
    },
  },
};
