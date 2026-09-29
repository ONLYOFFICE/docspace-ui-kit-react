import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import { Badge } from "../badge";
import { Tabs } from ".";
import { data } from "./data";
import { TabsTypes } from "./Tabs.enums";
import type { TabsProps, TTabItem } from "./Tabs.types";

const meta = {
  title: "UI/Navigation/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Tabs organize content into multiple sections, allowing users to switch between views.

### Features

- **Two Types**: Draws either an underlined row of tabs or a segmented control whose selected background slides to the clicked tab
- **Keyboard Navigation**: Lets the segmented control be operated from the keyboard, with a highlight that moves from tab to tab before one is selected
- **Sticky Positioning**: Keeps the tab bar stuck to the top of its scrolling container, at an adjustable offset and optionally below a sticky header
- **Scaled Mode**: Stretches segmented tabs to share the container's width equally
- **Animation**: Grows the underline of a newly selected tab and dims the content while that tab's click handler is still running
- **Overflow**: Scrolls a bar too wide for its container sideways behind faded edges, and adds previous and next arrows to the segmented control
- **Badges and Icons**: Shows a badge after the label of an underlined tab, or an icon before the label of a segmented tab
- **Disabled State**: Individual tabs can be greyed out and made unclickable on either type

### Accessibility

The segmented control handles keys of its own; the underlined row handles none.

- **Tab**: moves focus to the segmented tab list and switches its arrow-key mode on; pressing it again switches the mode off and leaves focus on the list
- **Arrow Right / Arrow Left**: move the highlight to the next or previous tab, wrapping around at either end
- **Home / End**: move the highlight to the first or last tab
- **Enter / Space**: select the highlighted tab

### Usage

\`\`\`tsx
import { Tabs, TabsTypes } from "@onlyoffice/apps-ui-kit/components/tabs";

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

// Segmented tabs spanning the container
<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  scaled
  onSelect={(item) => setSelectedId(item.id)}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    items: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The tabs, in the order they are drawn. Each carries its id, its label, the content shown while it is selected, and optionally a disabled flag, a click handler, a badge or an icon",
    },
    selectedItemId: {
      control: "text",
      description:
        "`id` of the selected tab. The component is controlled: set it from `onSelect`. An empty value selects the first tab",
    },
    type: {
      control: "select",
      options: Object.values(TabsTypes),
      description:
        "Which of the two tab bars is drawn: an underlined row, or a segmented control",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the whole tab object when a different tab is clicked, when a segmented arrow is clicked, or when a highlighted segmented tab is chosen with Enter or Space",
    },
    scaled: {
      control: "boolean",
      description:
        "Makes the segmented tabs share the container's width equally instead of taking the width of the widest label. Secondary tabs only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Keeps the segmented bar hidden and unmeasured while the labels are still changing, then sizes every tab to the widest label once it is turned off. Draws no loader of its own. Secondary tabs only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAnimation: {
      control: "boolean",
      description:
        "Grows the underline of a newly selected tab and dims the content until that tab's `onClick` promise settles. Primary tabs only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stickyTop: {
      control: "text",
      description:
        "Distance from the top of the scrolling container at which the tab bar sticks, as a CSS length. Without it the bar sticks at the very top",
    },
    stickyHeader: {
      control: false,
      description:
        "Content drawn in its own sticky strip above the tab bar; the bar then sticks directly below it. Primary tabs only",
    },
    withoutStickyIntend: {
      control: "boolean",
      description:
        "Leaves out the 20px gap between the tab bar and the selected tab's content",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hotkeysId: {
      control: "text",
      description:
        "Name that keeps several segmented bars on one page apart, so clicking one turns on the arrow keys of that bar only. Secondary tabs only",
    },
    layoutId: {
      control: "text",
      description:
        "Shared name that lets the selected background slide between two segmented bars; also becomes the `id` of the tab list. Secondary tabs only",
    },
    id: {
      control: "text",
      description:
        "`id` of the tab list on primary tabs, and of the outermost element on secondary ones",
    },
    className: {
      control: "text",
      description: "Class added to the outermost element",
    },
    style: {
      control: "object",
      description: "Inline style of the outermost element",
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
        Selected tab: {rest.items.find((item) => item.id === selectedId)?.name}
      </div>
    </Wrapper>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The underlined row, for splitting one page into sections the reader switches between: click a tab to show its content below the bar. **Contacts** is greyed out and ignores clicks (`isDisabled`). Change any other prop live in the Controls panel below.",
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
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "240px" },
      description: {
        story:
          "The segmented control (`type={TabsTypes.Secondary}`), for switching between views of the same content; every tab takes the width of the widest label and the selected background slides to the clicked tab. Click a tab, then press Tab and use the arrow keys, Home, End and Enter to pick one from the keyboard.",
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

export const Scaled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    scaled: true,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "240px" },
      description: {
        story:
          "The segmented control spread across the whole width of its container, every tab an equal share (`scaled`) — for a bar that should line up with the edges of the panel it sits in. The underlined row ignores `scaled`.",
      },
      source: {
        code: `<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  scaled
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

export const Loading: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    isLoading: true,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "240px" },
      description: {
        story:
          "While the labels are still arriving, the segmented bar is kept hidden so that it is not sized to placeholder text (`isLoading`); only the selected tab's content shows. Turn `isLoading` off in the Controls panel below and the bar appears, every tab as wide as the widest label. The component draws no loader of its own, and the underlined row ignores `isLoading`.",
      },
      source: {
        code: `<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  isLoading={labelsLoading}
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

const badgeItems: TTabItem[] = data.map((item, index) =>
  index < 2 ? { ...item, badge: <Badge label={index + 3} /> } : item,
);

export const WithBadges: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: badgeItems,
    selectedItemId: badgeItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A count after the label of **Overview** and **Documents** (the item's `badge`) — for telling the reader how many new entries wait behind a tab. The segmented control does not draw badges.",
      },
      source: {
        code: `const tabItems = [
  { id: "overview", name: "Overview", badge: <Badge label={3} />, content: <p>Overview</p> },
  { id: "documents", name: "Documents", badge: <Badge label={4} />, content: <p>Documents</p> },
  { id: "time", name: "Time", content: <p>Time</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

const iconItems: TTabItem[] = data.map((item) => ({
  ...item,
  iconName: CatalogFolderReactSvgUrl,
}));

export const WithIcons: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: iconItems,
    type: TabsTypes.Secondary,
    selectedItemId: iconItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "240px" },
      description: {
        story:
          "An icon before every label of the segmented control (the item's `iconName`, an SVG URL), recoloured with the label as a tab is selected or hovered — for tabs that are recognised faster by a picture. The underlined row does not draw icons.",
      },
      source: {
        code: `const tabItems = [
  { id: "overview", name: "Overview", iconName: FolderIconUrl, content: <p>Overview</p> },
  { id: "documents", name: "Documents", iconName: FolderIconUrl, content: <p>Documents</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 1500));

const animatedItems: TTabItem[] = data.map((item) => ({
  ...item,
  onClick: wait,
}));

export const AnimatedSelection: Story = {
  render: (args) => <Template {...args} />,
  args: {
    items: animatedItems,
    withAnimation: true,
    selectedItemId: animatedItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the animation ends on a window event that every animated bar on the page receives.
      story: { inline: false, height: "240px" },
      description: {
        story:
          "Click **Documents**: its underline grows and the old content stays dimmed for the second and a half the tab's `onClick` promise takes, then the new content replaces it (`withAnimation`) — for tabs whose content is fetched when they are selected. The segmented control ignores `withAnimation`.",
      },
      source: {
        code: `const tabItems = [
  { id: "overview", name: "Overview", onClick: loadOverview, content: <Overview /> },
  { id: "documents", name: "Documents", onClick: loadDocuments, content: <Documents /> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  withAnimation
  onSelect={(item) => setSelectedId(item.id)}
/>`,
      },
    },
  },
};

const longItems: TTabItem[] = data.map((item) => ({
  ...item,
  content: (
    <div>
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index}>
          {item.id} entry {index + 1}
        </p>
      ))}
    </div>
  ),
}));

export const WithStickyHeader: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState(args.selectedItemId);
    return (
      <div style={{ height: "260px", overflowY: "auto" }}>
        <Tabs
          {...args}
          selectedItemId={selectedId}
          onSelect={(item) => {
            setSelectedId(item.id);
            args.onSelect?.(item);
          }}
        />
      </div>
    );
  },
  args: {
    items: longItems,
    selectedItemId: longItems[0].id,
    stickyHeader: <strong>Project files</strong>,
    stickyTop: "0px",
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scroll the box: the heading and the tab bar stay at its top while the content moves under them (`stickyHeader`) — for a section title that should stay in view together with the bar. The heading sticks only with `stickyTop` set, here to `0px`; a larger value moves both further down. The segmented control does not draw a sticky header.",
      },
      source: {
        code: `<div style={{ height: "260px", overflowY: "auto" }}>
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    stickyHeader={<strong>Project files</strong>}
    stickyTop="0px"
    onSelect={(item) => setSelectedId(item.id)}
  />
</div>`,
      },
    },
  },
};

const manyItems: TTabItem[] = [
  "Overview",
  "Documents",
  "Spreadsheets",
  "Presentations",
  "Forms",
  "Media",
  "Archives",
  "Templates",
].map((name) => ({ id: name, name, content: null }));

const OverflowTemplate = (args: TabsProps) => {
  const [primaryId, setPrimaryId] = useState(args.selectedItemId);
  const [secondaryId, setSecondaryId] = useState(args.selectedItemId);

  return (
    <div style={{ width: "360px", display: "grid", gap: "16px" }}>
      <Tabs
        {...args}
        withoutStickyIntend
        selectedItemId={primaryId}
        onSelect={(item) => {
          setPrimaryId(item.id);
          args.onSelect?.(item);
        }}
      />
      <Tabs
        {...args}
        type={TabsTypes.Secondary}
        withoutStickyIntend
        selectedItemId={secondaryId}
        onSelect={(item) => {
          setSecondaryId(item.id);
          args.onSelect?.(item);
        }}
      />
    </div>
  );
};

export const OverflowingTabs: Story = {
  render: (args) => <OverflowTemplate {...args} />,
  args: {
    items: manyItems,
    selectedItemId: manyItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "155px" },
      description: {
        story: `More tabs than a 360px column holds, for a bar whose tabs cannot be cut down:

- **Underlined row** — scrolls sideways; the edge that hides more tabs fades out
- **Segmented control** — adds an arrow at each end that selects the previous or next tab, not only scrolls to it (the arrows are left out on phones)`,
      },
      source: {
        code: `<div style={{ width: "360px" }}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <OverflowTemplate {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    items: manyItems,
    selectedItemId: manyItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "112px" },
      description: {
        story:
          'The overflowing bars in a right-to-left layout: the first tab sits at the right-hand end, the fade moves to the left edge, and the segmented arrows swap sides so the right one selects the previous tab. The wrapper carries `dir="rtl"` for the layout; the fade direction and the scroll correction come from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const [primaryId, setPrimaryId] = useState(data[0].id);
  const [secondaryId, setSecondaryId] = useState(data[0].id);

  return (
    <div
      style={
        {
          display: "grid",
          gap: "24px",
          "--tabs-primary-height": "36px",
          "--tabs-primary-gap": "28px",
          "--tabs-text-weight": "700",
          "--tabs-underline-thickness": "3px",
          "--tabs-underline-radius": "3px",
          "--tabs-underline": "#c4b5fd",
          "--tabs-primary-bg": "#faf5ff",
          "--tabs-primary-text": "#a78bfa",
          "--tabs-primary-active-text": "#5b21b6",
          "--tabs-primary-hover-text": "#7c3aed",
          "--tabs-secondary-height": "40px",
          "--tabs-secondary-gap": "8px",
          "--tabs-secondary-padding": "6px",
          "--tabs-secondary-radius": "20px",
          "--tabs-secondary-tab-radius": "16px",
          "--tabs-secondary-bg": "#f5f3ff",
          "--tabs-secondary-active-bg": "#7c3aed",
          "--tabs-secondary-active-text": "#ffffff",
          "--tabs-secondary-text": "#6d28d9",
          "--tabs-secondary-hover-bg": "#a78bfa",
        } as CSSProperties
      }
    >
      <Tabs
        items={data}
        selectedItemId={primaryId}
        withoutStickyIntend
        onSelect={(item) => setPrimaryId(item.id)}
      />
      <Tabs
        items={data}
        selectedItemId={secondaryId}
        type={TabsTypes.Secondary}
        scaled
        withoutStickyIntend
        onSelect={(item) => setSecondaryId(item.id)}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: { inline: false, height: "260px" },
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tabs-primary-height\` | Height of the underlined row | \`32px\` |
| \`--tabs-primary-gap\` | Gap between underlined tabs | \`20px\` |
| \`--tabs-text-weight\` | Font weight of the labels, underlined row only; segmented labels stay at 600 | \`600\` |
| \`--tabs-underline-thickness\` | Thickness of the selected tab's underline | \`4px\` |
| \`--tabs-underline-radius\` | Corner radius of the selected tab's underline | \`4px 4px 0 0\` |
| \`--tabs-underline\` | Colour of the line under the whole underlined row | theme-based |
| \`--tabs-primary-bg\` | Background behind either tab bar and behind the sticky header | theme-based |
| \`--tabs-primary-text\` | Label colour, underlined row | theme-based |
| \`--tabs-primary-active-text\` | Label colour of the selected tab, underlined row | theme-based |
| \`--tabs-primary-hover-text\` | Label colour of a hovered tab, underlined row | theme-based |
| \`--tabs-secondary-height\` | Height of the segmented control | \`36px\` |
| \`--tabs-secondary-gap\` | Gap between segmented tabs | \`4px\` |
| \`--tabs-secondary-padding\` | Padding between the track and the tabs inside it | \`4px\` |
| \`--tabs-secondary-radius\` | Corner radius of the track | \`5px\` |
| \`--tabs-secondary-tab-radius\` | Corner radius of one segmented tab and of the selected background | \`3px\` |
| \`--tabs-secondary-bg\` | Background of the track and of its arrows | theme-based |
| \`--tabs-secondary-active-bg\` | Background of the selected segmented tab | theme-based |
| \`--tabs-secondary-text\` | Label and icon colour, segmented control | theme-based |
| \`--tabs-secondary-active-text\` | Label and icon colour of the selected, hovered or keyboard-highlighted segmented tab | theme-based |
| \`--tabs-secondary-hover-bg\` | Background of a hovered or keyboard-highlighted segmented tab, and of a hovered arrow | theme-based |
| \`--tabs-secondary-hover-icon\` | Colour of a hovered arrow; only while the segmented tabs overflow (see Overflowing Tabs) | theme-based |
| \`--tabs-fade\` | Colour the scrolled-away edge fades to; only while the tabs overflow (see Overflowing Tabs) | theme-based |

The wrapper sets every variable either bar can show without overflowing. The first instance is the underlined row, for the \`--tabs-primary-*\`, underline and weight variables; the second is the segmented control (\`type={TabsTypes.Secondary}\`), for the \`--tabs-secondary-*\` ones. Hover the tabs to see the hover colours.`,
      },
      source: {
        code: `<div style={{
  "--tabs-primary-height": "36px",
  "--tabs-primary-gap": "28px",
  "--tabs-text-weight": "700",
  "--tabs-underline-thickness": "3px",
  "--tabs-underline-radius": "3px",
  "--tabs-underline": "#c4b5fd",
  "--tabs-primary-bg": "#faf5ff",
  "--tabs-primary-text": "#a78bfa",
  "--tabs-primary-active-text": "#5b21b6",
  "--tabs-primary-hover-text": "#7c3aed",
  "--tabs-secondary-height": "40px",
  "--tabs-secondary-gap": "8px",
  "--tabs-secondary-padding": "6px",
  "--tabs-secondary-radius": "20px",
  "--tabs-secondary-tab-radius": "16px",
  "--tabs-secondary-bg": "#f5f3ff",
  "--tabs-secondary-active-bg": "#7c3aed",
  "--tabs-secondary-active-text": "#ffffff",
  "--tabs-secondary-text": "#6d28d9",
  "--tabs-secondary-hover-bg": "#a78bfa",
}}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    scaled
    onSelect={handleSelect}
  />
</div>`,
      },
    },
  },
};
