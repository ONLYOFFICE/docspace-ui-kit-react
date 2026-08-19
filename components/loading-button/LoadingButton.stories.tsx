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

import { LoadingButton } from ".";

const meta = {
  title: "UI/Feedback/LoadingButton",
  component: LoadingButton,
  parameters: {
    docs: {
      description: {
        component: `Loading button that displays a circular progress indicator. Used to show file conversion or processing progress.

### Features

- **Progress Indicator**: Circular loading animation with percentage
- **Conversion Mode**: Special state for file conversion operations
- **Default Mode**: Alternative display mode
- **Color Customization**: Configurable loader and background colors
- **Clickable**: Supports click handler for cancel/action operations

### Usage

\`\`\`tsx
import { LoadingButton } from "@docspace/ui-kit/components/loading-button";

// Basic loading button
<LoadingButton percent={45} />

// In conversion mode
<LoadingButton percent={60} inConversion />

// With custom colors
<LoadingButton percent={30} loaderColor="#2DA7DB" backgroundColor="#f5f5f5" />
\`\`\``,
      },
    },
  },
  argTypes: {
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description: "Progress value in percent (0-100)",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    inConversion: {
      control: "boolean",
      description: "Indicates whether conversion is in progress",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description: "Indicates whether the component is in default mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    loaderColor: {
      control: "color",
      description: "Color of the loading indicator",
    },
    backgroundColor: {
      control: "color",
      description: "Background color of the component",
    },
    onClick: {
      action: "onClick",
      description: "Function called when the button is clicked",
    },
  },
} satisfies Meta<typeof LoadingButton>;

type Story = StoryObj<ComponentProps<typeof LoadingButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <LoadingButton {...args} />,
  args: {
    percent: 0,
    inConversion: false,
    isDefaultMode: false,
  },
};

const ProgressStagesTemplate = () => {
  const stages = [0, 25, 50, 75, 100];
  return (
    <Wrapper>
      {stages.map((percent) => (
        <div
          key={percent}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LoadingButton percent={percent} />
          <span style={{ fontSize: "11px", color: "#666" }}>{percent}%</span>
        </div>
      ))}
    </Wrapper>
  );
};

export const ProgressStages: Story = {
  render: () => <ProgressStagesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading buttons at various progress stages from 0% to 100%. Shows how the circular indicator fills as progress increases.",
      },
      source: {
        code: `<LoadingButton percent={0} />
<LoadingButton percent={25} />
<LoadingButton percent={50} />
<LoadingButton percent={75} />
<LoadingButton percent={100} />`,
      },
    },
  },
};

const InConversionTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={0} inConversion />
      <LoadingButton percent={50} inConversion />
      <LoadingButton percent={100} inConversion />
    </Wrapper>
  );
};

export const InConversion: Story = {
  render: () => <InConversionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading buttons in conversion mode. Used when a file is being converted to a different format.",
      },
      source: {
        code: `<LoadingButton percent={0} inConversion />
<LoadingButton percent={50} inConversion />
<LoadingButton percent={100} inConversion />`,
      },
    },
  },
};

const DefaultModeTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={45} isDefaultMode />
    </Wrapper>
  );
};

export const DefaultMode: Story = {
  render: () => <DefaultModeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading button in default mode. Provides an alternative visual display for the loading indicator.",
      },
      source: {
        code: `<LoadingButton percent={45} isDefaultMode />`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={60} loaderColor="#2DA7DB" />
      <LoadingButton percent={60} loaderColor="#4CAF50" />
      <LoadingButton percent={60} loaderColor="#FF5722" />
    </Wrapper>
  );
};

export const CustomColors: Story = {
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading buttons with custom loader colors. Useful for matching the loading indicator to your application theme.",
      },
      source: {
        code: `<LoadingButton percent={60} loaderColor="#2DA7DB" />
<LoadingButton percent={60} loaderColor="#4CAF50" />
<LoadingButton percent={60} loaderColor="#FF5722" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "16px",
          alignItems: "center",
          "--loading-button-accent": "#7c3aed",
          "--loading-button-idle": "#a78bfa",
          "--loading-button-hover-fill": "#4c1d95",
          "--loading-button-custom-bg": "#ede9fe",
        } as CSSProperties
      }
    >
      <LoadingButton percent={60} />
      <LoadingButton percent={30} />
      <LoadingButton percent={0} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--loading-button-accent\` | Progress fill color | \`--accent-main\` |
| \`--loading-button-idle\` | Default mode fill color | theme token |
| \`--loading-button-hover-fill\` | Hover fill color | theme token |
| \`--loading-button-custom-bg\` | Center circle background | theme token |`,
      },
    },
  },
};
