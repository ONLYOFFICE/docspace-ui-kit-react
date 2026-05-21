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

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TwoStateToggle } from ".";

const meta = {
  title: "UI/Navigation/TwoStateToggle",
  component: TwoStateToggle,
  parameters: {
    docs: {
      description: {
        component: `HomeViewToggle is a pill-shaped toggle that switches between the new Dashboard view and the classic DocSpace view.

The current state is persisted in \`localStorage\` under the key \`useDocSpace\` (\`"new"\` | \`"old"\`).

### Behavior

- **NEW → OLD**: opens a confirmation modal before switching
- **OLD → NEW**: switches immediately (no full page reload when \`onNavigate\` is provided)
- **First visit** (\`null\` in localStorage): \`DefaultPageRedirect\` redirects to \`/dashboard?design=new\` to write the explicit value

### Usage

\`\`\`tsx
import { HomeViewToggle } from "@docspace/ui-kit/components/home-view-toggle";

// In a React Router context — pass navigate to avoid a full reload
<HomeViewToggle onNavigate={(url) => navigate(url)} />

// Standalone (falls back to window.location.href)
<HomeViewToggle />
\`\`\`

### CSS Custom Properties

| Variable | Description |
|----------|-------------|
| \`--color-scheme-main-accent\` | Pill background / active label color |
| \`--button-root-border-radius\` | Border radius of the pill and thumb |
| \`--text-color\` | Color of the title label |`,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Text label shown to the left of the toggle",
      table: { defaultValue: { summary: "DocSpace design" } },
    },
    labelOld: {
      control: "text",
      description: "Label for the classic DocSpace view (left side of pill)",
      table: { defaultValue: { summary: "OLD" } },
    },
    labelNew: {
      control: "text",
      description: "Label for the new Dashboard view (right side of pill)",
      table: { defaultValue: { summary: "NEW" } },
    },
    confirmTitle: {
      control: "text",
      description: "Confirmation modal title (shown when switching NEW → OLD)",
      table: { defaultValue: { summary: "Switch to Old Design" } },
    },
    confirmBody: {
      control: "text",
      description: "Confirmation modal main body text",
    },
    confirmHint: {
      control: "text",
      description: "Hint shown below the body — e.g. how to return to new view",
    },
    confirmOk: {
      control: "text",
      description: 'Confirmation modal "proceed" button label',
      table: { defaultValue: { summary: "Switch" } },
    },
    confirmCancel: {
      control: "text",
      description: 'Confirmation modal "cancel" button label',
      table: { defaultValue: { summary: "Cancel" } },
    },
    onNavigate: {
      action: "onNavigate",
      description:
        "Called instead of `window.location.href` when switching to NEW. Pass React Router `navigate` here.",
    },
    className: {
      control: "text",
      description: "Additional CSS class applied to the wrapper",
    },
  },
  decorators: [
    (Story) => {
      localStorage.setItem("useDocSpace", "new");
      return <Story />;
    },
  ],
} satisfies Meta<typeof TwoStateToggle>;

type Story = StoryObj<ComponentProps<typeof TwoStateToggle>>;

export default meta;

export const Default: Story = {
  args: {
    title: "DocSpace design",
    labelOld: "OLD",
    labelNew: "NEW",
  },
};

export const ShowingOldState: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem("useDocSpace", "old");
      return <Story />;
    },
  ],
  args: {
    title: "DocSpace design",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle in the OLD position. Clicking it switches to NEW immediately (calls `onNavigate("/dashboard")`).',
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    title: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Toggle without the text label — only the pill is rendered.",
      },
      source: {
        code: `<HomeViewToggle title="" onNavigate={(url) => navigate(url)} />`,
      },
    },
  },
};

export const CustomLabels: Story = {
  args: {
    title: "Interface",
    labelOld: "v1",
    labelNew: "v2",
    confirmTitle: "Switch to v1?",
    confirmBody: "You will be taken back to the classic interface.",
    confirmHint: "Return to v2 anytime via /dashboard.",
    confirmOk: "Yes, switch",
    confirmCancel: "Stay on v2",
  },
  parameters: {
    docs: {
      description: {
        story:
          "All text strings are customizable — useful when the toggle is reused in other contexts.",
      },
    },
  },
};
