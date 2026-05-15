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

import { Scrollbar } from ".";

const meta = {
  title: "UI/Layout/Scrollbar",
  component: Scrollbar,
  parameters: {
    docs: {
      description: {
        component: `Scrollbar provides a custom scrollbar with auto-hide, fixed sizing, and both vertical and horizontal scrolling support.

### Features

- **Auto-Hide**: Scrollbar fades when not actively scrolling
- **Fixed Size Thumb**: Keep the scrollbar thumb at a fixed size regardless of content length
- **Vertical & Horizontal**: Supports both scroll directions independently
- **Custom Padding**: Configurable padding after the last item and inline-end padding
- **RTL Support**: Works correctly in right-to-left layouts

### Usage

\`\`\`tsx
import { Scrollbar } from "@docspace/ui-kit/components/scrollbar";

<Scrollbar style={{ width: 300, height: 200 }}>
  <p>Scrollable content here...</p>
</Scrollbar>

// With auto-hide
<Scrollbar autoHide style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>
\`\`\``,
      },
    },
  },
  argTypes: {
    autoHide: {
      control: "boolean",
      description: "Automatically hide scrollbar when not in use",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fixedSize: {
      control: "boolean",
      description: "Keep scrollbar thumb size fixed regardless of content",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    paddingAfterLastItem: {
      control: "text",
      description: "Padding added after the last scrollable item",
    },
    paddingInlineEnd: {
      control: "text",
      description: "Padding added to the inline end of the scroll body",
    },
    noScrollY: {
      control: "boolean",
      description: "Disables vertical scrolling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noScrollX: {
      control: "boolean",
      description: "Disables horizontal scrolling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Scrollbar>;

type Story = StoryObj<ComponentProps<typeof Scrollbar>>;

export default meta;

const LongContent = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    </p>
    <p>
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
      fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
      sequi nesciunt.
    </p>
  </>
);

export const Default: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default scrollbar with vertical scrolling enabled and always-visible track.",
      },
      source: {
        code: `<Scrollbar style={{ width: 300, height: 200 }}>
  <p>Scrollable content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithAutoHide: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar that automatically hides when not actively scrolling. Hover or scroll to reveal.",
      },
      source: {
        code: `<Scrollbar autoHide style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithFixedSize: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    fixedSize: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar with a fixed-size thumb that doesn't change size based on content length.",
      },
      source: {
        code: `<Scrollbar fixedSize style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithHorizontalScroll: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <div
        style={{
          whiteSpace: "nowrap",
          padding: "10px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <LongContent />
      </div>
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 100 },
    autoHide: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar with horizontal scrolling for wide content that overflows the container.",
      },
      source: {
        code: `<Scrollbar style={{ width: 300, height: 100 }}>
  <div style={{ whiteSpace: "nowrap" }}>Wide content...</div>
</Scrollbar>`,
      },
    },
  },
};

export const WithBothScrollbars: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <div style={{ width: "500px" }}>
        <LongContent />
      </div>
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar with both vertical and horizontal scrolling when content exceeds both dimensions.",
      },
      source: {
        code: `<Scrollbar style={{ width: 300, height: 200 }}>
  <div style={{ width: "500px" }}>Tall and wide content...</div>
</Scrollbar>`,
      },
    },
  },
};

export const WithPaddingAfterLastItem: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    paddingAfterLastItem: "50px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar with additional padding after the last item, providing extra space at the bottom of scrollable content.",
      },
      source: {
        code: `<Scrollbar paddingAfterLastItem="50px" style={{ width: 300, height: 200 }}>
  <p>Content with padding at bottom...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithPaddingInlineEnd: Story = {
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    paddingInlineEnd: "100px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scrollbar with inline-end padding, adding space on the right (or left in RTL) side of the scroll body.",
      },
      source: {
        code: `<Scrollbar paddingInlineEnd="100px" style={{ width: 300, height: 200 }}>
  <p>Content with inline-end padding...</p>
</Scrollbar>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--scrollbar-bg": "#7c3aed",
          "--scrollbar-bg-hover": "#5b21b6",
          "--scrollbar-bg-active": "#4c1d95",
          "--scrollbar-thumb-size": "6px",
          "--scrollbar-radius": "4px",
        } as CSSProperties
      }
    >
      <Scrollbar style={{ width: 300, height: 200 }} autoHide={false}>
        <LongContent />
      </Scrollbar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--scrollbar-bg\` | Thumb default color | theme token |
| \`--scrollbar-bg-hover\` | Thumb hover color | theme token |
| \`--scrollbar-bg-active\` | Thumb active/pressed color | theme token |
| \`--scrollbar-thumb-size\` | Thumb width (vertical) / height (horizontal) | \`4px\` |
| \`--scrollbar-radius\` | Track border radius | \`8px\` |
| \`--scrollbar-track-padding\` | Track inner padding | \`4px\` |
| \`--scrollbar-padding-end\` | Scroll body inline-end padding | \`17px\` |
| \`--scrollbar-padding-end-mobile\` | Scroll body inline-end padding (mobile) | \`8px\` |
| \`--scrollbar-last-padding\` | Padding after last item | \`unset\` |`,
      },
    },
  },
};
