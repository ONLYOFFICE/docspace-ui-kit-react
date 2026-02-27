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

import type { Meta, StoryFn } from "@storybook/react-vite";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";

import { PublicRoomBar } from "./index";
import type { PublicRoomBarProps } from "./PublicRoomBar.types";

export default {
  title: "Components/UI/PublicRoomBar",
  component: PublicRoomBar,
  parameters: {
    docs: {
      description: {
        component: `
A notification bar component for displaying information about public rooms.

## Features
- Customizable header and body text
- Optional custom icon support
- Close button with callback
- Visibility control
- Support for custom React components
- Responsive design
`,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "Header text or component to be displayed",
    },
    bodyText: {
      control: "text",
      description: "Body text or component to be displayed",
    },
    iconName: {
      control: "text",
      description: "Custom icon path (optional)",
    },
    barIsVisible: {
      control: "boolean",
      description: "Controls the visibility of the bar",
    },
    onClose: {
      action: "clicked",
      description: "Callback function when close button is clicked",
    },
  },
} as Meta;

const Template: StoryFn<PublicRoomBarProps> = (args) => (
  <PublicRoomBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  headerText: "Public Room",
  bodyText: "This room is accessible to anyone with the link",
  barIsVisible: false,
};
Default.parameters = {
  docs: {
    description: {
      story: "Basic configuration showing header, body text, and visibility control.",
    },
  },
};

export const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
  ...Default.args,
  iconName: PlanetIcon,
};
WithCustomIcon.parameters = {
  docs: {
    description: {
      story: "Shows the bar with a custom planet icon. Useful for indicating public or global access.",
    },
  },
};

export const WithoutCloseButton = Template.bind({});
WithoutCloseButton.args = {
  ...Default.args,
  onClose: undefined,
};
WithoutCloseButton.parameters = {
  docs: {
    description: {
      story: "Bar without a close button. The bar cannot be dismissed by the user and serves as a persistent notification.",
    },
  },
};

export const WithCustomComponents = Template.bind({});
WithCustomComponents.args = {
  headerText: (
    <div style={{ color: "var(--accent-main)" }}>Custom Header Component</div>
  ),
  bodyText: <div style={{ fontStyle: "italic" }}>Custom Body Component</div>,
  barIsVisible: true,
};
WithCustomComponents.parameters = {
  docs: {
    description: {
      story: "Demonstrates passing React components for header and body text instead of plain strings. This allows for more complex layouts and styling.",
    },
  },
};
