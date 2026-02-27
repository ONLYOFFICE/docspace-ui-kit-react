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

import { ThemeProviderComponent } from ".";

const lightTheme = {
  isBase: true,
  interfaceDirection: "ltr" as const,
  fontFamily: "Open Sans, sans-serif, Arial",
};

const darkTheme = {
  isBase: false,
  interfaceDirection: "ltr" as const,
  fontFamily: "Open Sans, sans-serif, Arial",
};

const meta = {
  title: "UI/Layout/ThemeProvider",
  component: ThemeProviderComponent,
  parameters: {
    docs: {
      description: {
        component: `Provides theming context to all child components using styled-components.

### Features

- **Light/Dark Themes**: Toggles between light and dark modes via \`theme.isBase\`
- **Interface Direction**: Supports LTR and RTL layout directions
- **Color Scheme**: Applies custom color schemes for accent and button colors
- **CSS Variables**: Sets theme-related CSS custom properties on document root
- **Nested Providers**: Wraps styled-components ThemeProvider with direction and color scheme contexts

### Usage

\`\`\`tsx
import { ThemeProviderComponent } from "@docspace/ui-kit/components/theme-provider";

<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "ltr" }}>
  <App />
</ThemeProviderComponent>
\`\`\``,
      },
    },
  },
  argTypes: {
    theme: {
      control: "object",
      description:
        "Theme configuration object with isBase, interfaceDirection, and fontFamily",
    },
    currentColorScheme: {
      control: "object",
      description:
        "Color scheme with main and text accent/button colors",
    },
    children: {
      control: false,
      description: "Child components that receive the theme context",
    },
  },
} satisfies Meta<typeof ThemeProviderComponent>;

type Story = StoryObj<ComponentProps<typeof ThemeProviderComponent>>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <ThemeProviderComponent {...args}>
      <div style={{ padding: "20px", fontFamily: "Open Sans, sans-serif" }}>
        <h3>Themed Content</h3>
        <p>
          This content is wrapped in the ThemeProvider with a light theme.
        </p>
      </div>
    </ThemeProviderComponent>
  ),
  args: {
    theme: lightTheme,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default ThemeProvider with light theme applied to child content.",
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "ltr" }}>
  <div>Themed Content</div>
</ThemeProviderComponent>`,
      },
    },
  },
};

export const DarkTheme: Story = {
  render: (args) => (
    <ThemeProviderComponent {...args}>
      <div style={{ padding: "20px", fontFamily: "Open Sans, sans-serif" }}>
        <h3>Dark Themed Content</h3>
        <p>This content uses the dark theme variant.</p>
      </div>
    </ThemeProviderComponent>
  ),
  args: {
    theme: darkTheme,
  },
  parameters: {
    docs: {
      description: {
        story: "ThemeProvider with dark theme applied.",
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: false, interfaceDirection: "ltr" }}>
  <div>Dark Themed Content</div>
</ThemeProviderComponent>`,
      },
    },
  },
};

export const RTLDirection: Story = {
  render: (args) => (
    <ThemeProviderComponent {...args}>
      <div style={{ padding: "20px", fontFamily: "Open Sans, sans-serif" }}>
        <h3>RTL Content</h3>
        <p>
          This content uses right-to-left interface direction.
        </p>
      </div>
    </ThemeProviderComponent>
  ),
  args: {
    theme: { ...lightTheme, interfaceDirection: "rtl" as const },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ThemeProvider with RTL interface direction for right-to-left language support.",
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "rtl" }}>
  <div>RTL Content</div>
</ThemeProviderComponent>`,
      },
    },
  },
};
