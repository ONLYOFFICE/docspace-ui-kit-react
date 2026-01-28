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

import { Aside } from ".";
import type { AsideProps } from "./Aside.types";

const meta: Meta<typeof Aside> = {
  title: "Base UI Components/Aside",
  component: Aside,
  parameters: {
    docs: {
      description: {
        component:
          "Sliding panel component for displaying side content like settings, details, or forms.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "60vh" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    visible: {
      control: "boolean",
      description: "Controls panel visibility",
    },
    scale: {
      control: "boolean",
      description: "Full-width scaling mode",
    },
    zIndex: {
      control: { type: "number", min: 0 },
      description: "CSS z-index value",
    },
    withoutHeader: {
      control: "boolean",
      description: "Hide the header section",
    },
    withoutBodyScroll: {
      control: "boolean",
      description: "Disable body scroll when open",
    },
    header: {
      control: "text",
      description: "Header content",
    },
    isBackButton: {
      control: "boolean",
      description: "Show back button in header",
    },
    isCloseable: {
      control: "boolean",
      description: "Show close button in header",
    },
    onClose: {
      action: "closed",
      description: "Callback when panel closes",
    },
    onBackClick: {
      action: "back clicked",
      description: "Back button click handler",
    },
  },
};

export default meta;
type Story = StoryObj<AsideProps>;

const ExampleContent = () => (
  <div style={{ padding: "20px" }}>
    <h3>Panel Content</h3>
    <p>This is example content inside the Aside panel.</p>
    <ul>
      <li>Slides in from the right</li>
      <li>Can include any content</li>
      <li>Supports header customization</li>
      <li>RTL-aware positioning</li>
    </ul>
  </div>
);

export const Default: Story = {
  args: {
    visible: true,
    header: "Panel Title",
    children: <ExampleContent />,
  },
};

export const WithBackButton: Story = {
  args: {
    visible: true,
    header: "Details",
    isBackButton: true,
    children: <ExampleContent />,
  },
};

export const WithoutHeader: Story = {
  args: {
    visible: true,
    withoutHeader: true,
    children: (
      <div style={{ padding: "20px" }}>
        <h3>Custom Header Area</h3>
        <p>This panel has no built-in header.</p>
      </div>
    ),
  },
};

export const Scaled: Story = {
  args: {
    visible: true,
    scale: true,
    header: "Full Width Panel",
    children: <ExampleContent />,
  },
};

export const WithCustomZIndex: Story = {
  args: {
    visible: true,
    header: "High Z-Index Panel",
    zIndex: 1000,
    children: <ExampleContent />,
  },
};

export const WithHeaderIcons: Story = {
  args: {
    visible: true,
    header: "Document Settings",
    headerIcons: [
      {
        key: "settings",
        url: "/static/images/settings.react.svg",
        onClick: () => console.log("Settings clicked"),
      },
    ],
    children: <ExampleContent />,
  },
};
