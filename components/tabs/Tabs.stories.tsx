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

import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from ".";
import { data } from "./data";
import { TabsTypes } from "./Tabs.enums";
import type { TabsProps, TTabItem } from "./Tabs.types";

const meta = {
  title: "UI/Data display/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Tabs organize content into multiple sections, allowing users to switch between views.

### Features

- **Two Types**: Primary and Secondary visual styles
- **Keyboard Navigation**: Navigate between tabs using keyboard
- **Sticky Positioning**: Optional sticky top positioning
- **Scaled Mode**: Tabs can scale to fill container width
- **Animation**: Optional animated tab transitions
- **Badges**: Primary tabs can display badges
- **Icons**: Secondary tabs support icon display
- **Disabled State**: Individual tabs can be disabled (secondary type only)

### Accessibility

The Tabs component supports keyboard navigation for switching between tabs using arrow keys.

### Usage

\`\`\`tsx
import { Tabs } from "@docspace/ui-kit/components/tabs";
import { TabsTypes } from "@docspace/ui-kit/components/tabs/Tabs.enums";

// Primary tabs
<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>

// Secondary tabs
<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>

// Scaled tabs
<Tabs items={tabItems} selectedItemId={selectedId} scaled />
\`\`\``,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(TabsTypes),
      description: "Theme for displaying tabs",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    scaled: {
      control: "boolean",
      description: "Scales tabs to container width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAnimation: {
      control: "boolean",
      description: "Enables animation for tab transitions",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stickyTop: {
      control: "text",
      description: "Tab indentation for sticky positioning",
    },
  },
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<ComponentProps<typeof Tabs>>;

export default meta;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: "170px" }}>{children}</div>
);

const Template = (args: TabsProps) => {
  const { onSelect, selectedItemId, ...rest } = args;
  const [selectedId, setSelectedId] = useState(selectedItemId);

  const handleSelect = (item: TTabItem) => {
    setSelectedId(item.id);
    onSelect?.(item);
  };

  return (
    <Wrapper>
      <Tabs {...rest} selectedItemId={selectedId} onSelect={handleSelect} />
      <div style={{ marginTop: "20px" }}>
        Selected tab: {data.find((item) => item.id === selectedId)?.name}
      </div>
    </Wrapper>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    selectedItemId: data[0].id,
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default primary style tabs. Click on any tab to switch between content sections.",
      },
      source: {
        code: `<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

export const Secondary: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    selectedItemId: data[0].id,
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary style tabs with alternative visual appearance. Uses a different color scheme and styling. Best used for nested or secondary content sections.",
      },
      source: {
        code: `<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

const ScaledTemplate = () => {
  const [selectedId, setSelectedId] = useState(data[0].id);

  return (
    <Wrapper>
      <Tabs
        items={data}
        selectedItemId={selectedId}
        scaled
        onSelect={(item) => setSelectedId(item.id)}
      />
    </Wrapper>
  );
};

export const Scaled: Story = {
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Scaled tabs expand to fill the full width of their container. Useful for mobile or narrow layouts.",
      },
      source: {
        code: `<Tabs items={tabItems} selectedItemId={selectedId} scaled onSelect={handleSelect} />`,
      },
    },
  },
};

const LoadingTemplate = () => {
  return (
    <Wrapper>
      <Tabs
        items={data}
        selectedItemId={data[0].id}
        isLoading
        onSelect={() => {}}
      />
    </Wrapper>
  );
};

export const Loading: Story = {
  render: () => <LoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading state displays placeholder content while tab data is being fetched.",
      },
      source: {
        code: `<Tabs items={tabItems} selectedItemId={selectedId} isLoading />`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const [selectedId, setSelectedId] = useState(data[0].id);

  return (
    <Wrapper>
      <div
        style={
          {
            "--tabs-secondary-radius": "20px",
            "--tabs-secondary-tab-radius": "16px",
            "--tabs-secondary-bg": "#f5f3ff",
            "--tabs-secondary-active-bg": "#7c3aed",
            "--tabs-secondary-active-text": "#ffffff",
            "--tabs-secondary-text": "#6d28d9",
            "--tabs-secondary-hover-bg": "#ede9fe",
          } as CSSProperties
        }
      >
        <Tabs
          items={data}
          selectedItemId={selectedId}
          type={TabsTypes.Secondary}
          scaled
          onSelect={(item) => setSelectedId(item.id)}
        />
      </div>
    </Wrapper>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization. Pass via a wrapper element:

\`\`\`css
--tabs-primary-height       /* primary tabs height (default: 32px) */
--tabs-secondary-height     /* secondary tabs height (default: 36px) */
--tabs-primary-gap          /* gap between primary tabs (default: 20px) */
--tabs-secondary-gap        /* gap between secondary tabs (default: 4px) */
--tabs-secondary-padding    /* secondary tabs container padding (default: 4px) */
--tabs-secondary-radius     /* secondary tabs container radius (default: 5px) */
--tabs-secondary-tab-radius /* individual secondary tab radius (default: 3px) */
--tabs-text-weight          /* font weight (default: 600) */
--tabs-underline-thickness  /* primary indicator height (default: 4px) */
--tabs-underline-radius     /* primary indicator border-radius (default: 4px 4px 0 0) */
--tabs-fade                 /* gradient fade color override */
--tabs-underline            /* primary border-bottom color override */
--tabs-primary-bg           /* primary tabs background */
--tabs-primary-text         /* primary tab text color */
--tabs-primary-active-text  /* primary selected tab text color */
--tabs-primary-hover-text   /* primary hovered tab text color */
--tabs-secondary-bg         /* secondary tabs container background */
--tabs-secondary-active-bg  /* secondary selected tab background */
--tabs-secondary-text       /* secondary tab text color */
--tabs-secondary-active-text /* secondary selected tab text color */
--tabs-secondary-hover-bg   /* secondary hovered tab background */
--tabs-secondary-hover-icon /* secondary hovered arrow icon color */
\`\`\``,
      },
      source: {
        code: `<div style={{
  "--tabs-secondary-radius": "20px",
  "--tabs-secondary-tab-radius": "16px",
  "--tabs-secondary-bg": "#f5f3ff",
  "--tabs-secondary-active-bg": "#7c3aed",
  "--tabs-secondary-active-text": "#ffffff",
}}>
  <Tabs items={tabItems} type={TabsTypes.Secondary} scaled />
</div>`,
      },
    },
  },
};
