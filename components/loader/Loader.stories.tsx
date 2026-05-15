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

import { Loader } from ".";
import { LoaderTypes } from "./Loader.enums";
import { globalColors } from "../../providers/theme";

const meta = {
  title: "UI/Status components/Loader",
  component: Loader,
  parameters: {
    docs: {
      description: {
        component: `Loader component for displaying loading states and progress indicators with multiple animation types.

### Features

- **Five Animation Types**: Base (text), Oval, DualRing, Rombs, and Track
- **Customizable Color**: Apply any CSS color to the loader
- **Flexible Sizing**: Set size using px, rem, or other CSS units
- **Accessibility**: Supports label text for screen readers

### Usage

\`\`\`tsx
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";

// Oval loader
<Loader type={LoaderTypes.oval} size="40px" color="#333" />

// Rombs loader
<Loader type={LoaderTypes.rombs} size="65px" />

// Base text loader
<Loader type={LoaderTypes.base} label="Loading content..." />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=419-1989&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(LoaderTypes),
      description: "Type of the loader animation",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    color: {
      control: "color",
      description: "Color of the loader",
    },
    size: {
      control: "text",
      description: "Size of the loader (in px, rem, or other CSS units)",
      table: {
        defaultValue: { summary: "40px" },
      },
    },
    label: {
      control: "text",
      description: "Accessibility label for screen readers",
      table: {
        defaultValue: { summary: "Loading content, please wait." },
      },
    },
  },
} satisfies Meta<typeof Loader>;

type Story = StoryObj<ComponentProps<typeof Loader>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

const LabeledItem = (props: { label: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        minWidth: "100px",
        textAlign: "center",
      }}
    >
      {props.children}
      <span style={{ fontSize: "12px", color: "#666" }}>{props.label}</span>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.base,
    size: "18px",
    label: "Loading content, please wait...",
  },
};

export const Oval: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.oval,
    size: "40px",
    color: globalColors.loaderLight,
    label: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story: "Oval spinner animation, commonly used for inline loading states.",
      },
      source: {
        code: `<Loader type={LoaderTypes.oval} size="40px" color={globalColors.loaderLight} />`,
      },
    },
  },
};

export const DualRing: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.dualRing,
    size: "40px",
    color: "#333333",
    label: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story: "Dual ring animation with two concentric spinning rings.",
      },
      source: {
        code: `<Loader type={LoaderTypes.dualRing} size="40px" color="#333333" />`,
      },
    },
  },
};

export const Rombs: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "150px",
        minWidth: "150px",
        padding: "20px",
      }}
    >
      <Loader type={LoaderTypes.rombs} size="65px" label="Loading..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Rombs (diamond) animation, used as the main application loader.",
      },
      source: {
        code: `<Loader type={LoaderTypes.rombs} size="65px" />`,
      },
    },
  },
};

export const Track: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.track,
    size: "30px",
    label: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story: "Track animation for compact loading indicators.",
      },
      source: {
        code: `<Loader type={LoaderTypes.track} size="30px" />`,
      },
    },
  },
};

const AllTypesTemplate = () => {
  return (
    <Wrapper>
      <LabeledItem label="Base">
        <Loader type={LoaderTypes.base} size="18px" label="Base loader" />
      </LabeledItem>
      <LabeledItem label="Oval">
        <Loader
          type={LoaderTypes.oval}
          size="40px"
          color={globalColors.loaderLight}
          label="Oval loader"
        />
      </LabeledItem>
      <LabeledItem label="Dual Ring">
        <Loader
          type={LoaderTypes.dualRing}
          size="40px"
          label="Dual ring loader"
        />
      </LabeledItem>
      <LabeledItem label="Rombs">
        <Loader type={LoaderTypes.rombs} size="65px" label="Rombs loader" />
      </LabeledItem>
      <LabeledItem label="Track">
        <Loader type={LoaderTypes.track} size="30px" label="Track loader" />
      </LabeledItem>
    </Wrapper>
  );
};

export const AllTypes: Story = {
  render: () => <AllTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of all five loader animation types: Base, Oval, DualRing, Rombs, and Track.",
      },
      source: {
        code: `<Loader type={LoaderTypes.base} size="18px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.dualRing} size="40px" />
<Loader type={LoaderTypes.rombs} size="65px" />
<Loader type={LoaderTypes.track} size="30px" />`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <Loader
        type={LoaderTypes.dualRing}
        color="#FF5722"
        size="40px"
        label="Orange loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#2196F3"
        size="40px"
        label="Blue loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#4CAF50"
        size="40px"
        label="Green loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#9C27B0"
        size="40px"
        label="Purple loader"
      />
    </Wrapper>
  );
};

export const CustomColors: Story = {
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "DualRing loaders with different custom colors applied via the color prop.",
      },
      source: {
        code: `<Loader type={LoaderTypes.dualRing} color="#FF5722" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#2196F3" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#4CAF50" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#9C27B0" size="40px" />`,
      },
    },
  },
};

const DifferentSizesTemplate = () => {
  return (
    <Wrapper>
      <LabeledItem label="24px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="24px"
          label="Small loader"
        />
      </LabeledItem>
      <LabeledItem label="40px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="40px"
          label="Medium loader"
        />
      </LabeledItem>
      <LabeledItem label="60px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="60px"
          label="Large loader"
        />
      </LabeledItem>
    </Wrapper>
  );
};

export const DifferentSizes: Story = {
  render: () => <DifferentSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Oval loaders at three different sizes to demonstrate scalability.",
      },
      source: {
        code: `<Loader type={LoaderTypes.oval} size="24px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.oval} size="60px" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--loader-stroke": "#7c3aed",
          "--loader-size": "50px",
        } as CSSProperties
      }
    >
      <Loader type={LoaderTypes.oval} label="Custom loader" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--loader-stroke\` | Stroke color of the oval/dualRing loader | theme loader color |
| \`--loader-size\` | Width and height of the loader | \`40px\` |
| \`--loader-track-primary\` | Track loader spinning arc color | white |
| \`--loader-track-base\` | Track loader track (background ring) color | accent |`,
      },
      source: {
        code: `// Customize track loader colors via CSS variables
<div style={{
  "--loader-track-primary": "#cccccc",
  "--loader-track-base": "#444444",
}}>
  <Loader type={LoaderTypes.track} size="30px" />
</div>`,
      },
    },
  },
};
