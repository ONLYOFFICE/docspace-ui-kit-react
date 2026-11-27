import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import { Badge } from "../badge";
import { Button, ButtonSize } from "../button";
import { RectangleSkeleton } from "../rectangle";
import { Tabs } from ".";
import { data } from "./data";
import { TabsTypes } from "./Tabs.enums";
import type { TabsProps, TTabItem } from "./Tabs.types";

const meta = {
  title: "UI/Navigation/Tabs",
  component: Tabs,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    items: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The tabs, in the order they are drawn. Each carries its own content.",
    },
    selectedItemId: {
      control: "text",
      description:
        "`id` of the selected tab, set from `onSelect`; the component keeps no selection of its own. An empty value selects the first tab.",
    },
    type: {
      control: "select",
      options: Object.values(TabsTypes),
      description:
        "Which of the two tab bars is drawn: an underlined row, or a segmented control.",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the whole tab object when a different tab is chosen by a click, Enter or Space, or a segmented arrow.",
    },
    scaled: {
      control: "boolean",
      description:
        "Whether the tabs share the container's width equally instead of being measured from the longest label. Secondary tabs only.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Holds off sizing the tabs until the labels are final, and hides a bar that is not `scaled` meanwhile. It draws no loader. Secondary tabs only.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAnimation: {
      control: "boolean",
      description:
        "Whether selecting a tab grows its underline and keeps the old content, dimmed, until the item's `onClick` settles. Primary tabs only.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stickyTop: {
      control: "text",
      description:
        "`top` of the sticky tab bar, as a CSS length. Without it the bar sticks to the top of the scrolling ancestor.",
    },
    stickyHeader: {
      control: false,
      description:
        "Rendered in its own sticky strip above the tab bar, which the bar then sticks below. Primary tabs only.",
    },
    withoutStickyIntend: {
      control: "boolean",
      description:
        "Whether the gap between the tab bar and the selected tab's content is left out.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hotkeysId: {
      control: "text",
      description:
        "Suffix of the class `secondary-tabs-scroll-<hotkeysId>` put on the tab scroller, for a caller that queries it. Keyboard navigation does not need it. Secondary tabs only.",
    },
    layoutId: {
      control: "text",
      description:
        "Shared `layoutId` of the sliding background, and the `id` of the tab list. Secondary tabs only.",
    },
    id: {
      control: "text",
      description:
        "Applied to the tab list on primary tabs, and to the outermost element on secondary ones.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    style: {
      control: "object",
      description: "Applied to the outermost element as inline style.",
    },
  },
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<ComponentProps<typeof Tabs>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const tab = (canvas: PlayContext["canvas"], id: string) =>
  canvas.getAllByTestId(`${id}_subtab`)[0];

const width = (element: Element) => element.getBoundingClientRect().width;

// The segmented control's arrows, in the order they appear on screen.
const arrowsOnScreen = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[class*="arrowIcon"]')).sort(
    (a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x,
  );

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
  name: "Underlined row",
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Selected tab: Overview")).toBeVisible();

    await userEvent.click(canvas.getByTestId("Documents_tab"));
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "Documents" }),
    );
    await expect(canvas.getByText("Selected tab: Documents")).toBeVisible();

    // The disabled tab is kept from the pointer by its stylesheet, and the
    // click handler refuses it as well: a click that gets through (here a
    // DOM click, which ignores pointer-events) selects nothing.
    const contacts = canvas.getByTestId("Contacts_tab");
    await expect(getComputedStyle(contacts).pointerEvents).toBe("none");
    contacts.click();
    await expect(args.onSelect).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: "Contacts" }),
    );
    await expect(canvas.getByText("Selected tab: Documents")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The underlined row, for splitting one page into sections. A click on a tab shows its content below the bar. **Contacts** is greyed out and ignores clicks (`isDisabled`).",
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
  name: "Segmented control",
  render: (args) => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const tablist = canvas.getByRole("tablist");
    const overview = canvas.getByRole("tab", { name: "Overview" });
    const documents = canvas.getByRole("tab", { name: "Documents" });
    await expect(overview).toHaveAttribute("aria-selected", "true");

    // The keys the README promises: Tab lands on the selected tab, an
    // arrow moves the focus to Documents, Enter picks it.
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(documents).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Documents" }),
    );
    await expect(documents).toHaveAttribute("aria-selected", "true");

    // Tab leaves the bar again: nothing on the page takes the key.
    await userEvent.tab();
    await expect(tablist).not.toContainElement(
      document.activeElement as HTMLElement,
    );

    // Without hotkeysId the scroller gets no "...-undefined" class that a
    // second bar would share.
    await expect(
      canvasElement.querySelector('[class*="secondary-tabs-scroll-"]'),
    ).toBeNull();

    await userEvent.click(canvas.getByTestId("Milestones_subtab"));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Milestones" }),
    );
    await expect(canvas.getByText("Selected tab: Milestones")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The segmented control (`type={TabsTypes.Secondary}`), for switching between views of the same content. Every tab takes the width of the widest label, and the selected background slides to the chosen tab.",
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
  name: "Segmented, full width",
  render: (args) => <Template {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    // Every tab an equal share of the row.
    const widths = ["Overview", "Documents", "Milestones", "Time"].map((id) =>
      Math.round(width(tab(canvas, id))),
    );
    await expect(new Set(widths).size).toBe(1);
    await userEvent.click(tab(canvas, "Time"));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Time" }),
    );
  },
  args: {
    items: data,
    type: TabsTypes.Secondary,
    scaled: true,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The segmented control across the whole width of its container, every tab an equal share (`scaled`). It lines up with the edges of the panel it sits in. The underlined row ignores `scaled`.",
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

const LoadingDemo = (args: TabsProps) => {
  const [isLoading, setIsLoading] = useState(args.isLoading);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <Button
          size={ButtonSize.small}
          label={isLoading ? "Labels arrived" : "Load again"}
          onClick={() => setIsLoading((value) => !value)}
        />
      </div>
      {isLoading ? (
        <RectangleSkeleton width="360px" height="32px" title="Loading tabs" />
      ) : null}
      <Template {...args} isLoading={isLoading} />
    </div>
  );
};

export const Loading: Story = {
  name: "Labels loading",
  render: (args) => <LoadingDemo {...args} />,
  play: async ({ canvas }) => {
    // The bar waits for its labels; the selected content shows meanwhile.
    await expect(tab(canvas, "Overview")).not.toBeVisible();
    await expect(canvas.getByText("Overview content")).toBeVisible();
  },
  args: {
    items: data,
    type: TabsTypes.Secondary,
    isLoading: true,
    selectedItemId: data[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A skeleton in place of the segmented bar, which stays hidden while its labels load (`isLoading`). The selected tab's content still shows. The component draws no loader, so the page draws the skeleton. The **Labels arrived** button brings the bar back.",
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
  name: "With badges",
  render: (args) => <Template {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("Overview_tab")).toHaveTextContent(
      "Overview3",
    );
    await expect(canvas.getByTestId("Documents_tab")).toHaveTextContent(
      "Documents4",
    );
    await expect(canvas.getByTestId("Time_tab")).toHaveTextContent(/^Time$/);
  },
  args: {
    items: badgeItems,
    selectedItemId: badgeItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A count after the labels of **Overview** and **Documents** (the item's `badge`), for the entries that wait behind a tab. The segmented control does not draw badges.",
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
  name: "With icons",
  render: (args) => <Template {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    // The icons are fetched and inlined after mounting.
    for (const id of ["Overview", "Documents", "Time"]) {
      await waitFor(() =>
        expect(tab(canvas, id).querySelector("svg")).not.toBeNull(),
      );
    }
    await userEvent.click(tab(canvas, "Milestones"));
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Milestones" }),
    );
  },
  args: {
    items: iconItems,
    type: TabsTypes.Secondary,
    selectedItemId: iconItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An icon before every label of the segmented control (the item's `iconName`, an SVG URL). It takes the label's colour when the tab is selected or hovered. The underlined row draws no icons.",
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
  name: "Content fetched on selection",
  render: (args) => <Template {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("Documents_tab"));
    // The old content stays while the tab's onClick promise runs.
    await expect(canvas.getByText("Overview content")).toBeVisible();
    await waitFor(
      () =>
        expect(canvas.getByText("Documents", { selector: "p" })).toBeVisible(),
      { timeout: 4000 },
    );
    await expect(canvas.queryByText("Overview content")).toBeNull();
  },
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
          "The underlined row for tabs whose content is fetched on selection (`withAnimation`). The chosen tab's underline grows, and the old content stays dimmed while the tab's `onClick` runs. The segmented control ignores `withAnimation`.",
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
  name: "With sticky header",
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
  play: async ({ canvas }) => {
    const heading = canvas.getByText("Project files");
    const box = heading.closest<HTMLElement>('[style*="overflow"]');
    if (!box) throw new Error("No scrolling box");
    const top = (el: Element) => el.getBoundingClientRect().top;
    const entry = canvas.getByText("Overview entry 1");
    const before = { heading: top(heading), entry: top(entry) };
    // Scrolled, the heading and the bar stay at the top of the box while the
    // content moves under them.
    box.scrollTop = 200;
    await waitFor(() => expect(top(entry)).toBeLessThan(top(box)));
    const moved = {
      heading: Math.abs(top(heading) - before.heading),
      entry: before.entry - top(entry),
    };
    await expect(moved.entry).toBeGreaterThan(150);
    // Not a pixel-exact compare: the CI runners now and then put the heading
    // 2px off between the two frames, a shift no layout read here reproduces.
    // A heading that does not stick moves with the content, 200px.
    await expect(
      moved.heading,
      `heading ${before.heading} -> ${top(heading)}, box ${top(box)}`,
    ).toBeLessThanOrEqual(2);
    await expect(canvas.getByTestId("Overview_tab")).toBeVisible();
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
          "A heading above the bar (`stickyHeader`) in a scrolling box: both stay at its top while the content scrolls under them. The heading sticks only with `stickyTop` set, here to `0px`. The segmented control draws no sticky header.",
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
  name: "More tabs than fit",
  render: (args) => <OverflowTemplate {...args} />,
  play: async ({ args, canvasElement }) => {
    // The underlined row scrolls sideways.
    const row = canvasElement.querySelector<HTMLElement>(
      '[data-testid="Templates_tab"]',
    )?.parentElement;
    if (!row) throw new Error("No primary row");
    await expect(row.scrollWidth).toBeGreaterThan(row.clientWidth);

    // The scroll track along the bottom of the bar does not take the click
    // under a label: the whole height of the tab belongs to the tab.
    const tab = canvasElement.querySelector<HTMLElement>(
      '[data-testid="Documents_tab"]',
    );
    if (!tab) throw new Error("No Documents tab");
    const box = tab.getBoundingClientRect();
    for (let y = box.top + 1; y < box.bottom; y += 2) {
      await expect(
        tab.contains(document.elementFromPoint(box.left + box.width / 2, y)),
      ).toBe(true);
    }

    // The segmented control's right arrow selects the next tab.
    const [, right] = arrowsOnScreen(canvasElement);
    right.click();
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Documents" }),
    );
  },
  args: {
    items: manyItems,
    selectedItemId: manyItems[0].id,
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `More tabs than a 360px column holds, for a bar whose tabs cannot be cut down:

- **Underlined row** — scrolls sideways; the edge that hides more tabs fades out
- **Segmented control** — adds an arrow at each end that selects the previous or next tab; phones get no arrows`,
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
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <OverflowTemplate {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ args, canvasElement }) => {
    // The arrows swap sides: on screen the left one selects the next tab,
    // and the right one, with the first tab selected, selects nothing.
    const [left, right] = arrowsOnScreen(canvasElement);
    right.click();
    await expect(args.onSelect).not.toHaveBeenCalled();
    left.click();
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "Documents" }),
    );
  },
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
          "The overflowing bars in a right-to-left layout. The first tab sits at the right-hand end and the fade moves to the left edge. The segmented arrows swap sides, so the right one selects the previous tab. The fade and the scroll correction follow the theme's direction.",
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
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const bar = canvas
      .getAllByTestId("Overview_tab")[0]
      .closest("[data-sticky]") as HTMLElement;
    // The bar's own height; its bottom border comes on top.
    await expect(bar).toHaveStyle({ height: "36px" });
    // The selected segment takes the active text colour; its background is
    // the sliding marker behind it.
    await expect(canvas.getAllByText("Overview")[1]).toHaveStyle({
      color: "rgb(255, 255, 255)",
    });
    await expect(canvas.getAllByText("Documents")[1]).toHaveStyle({
      color: "rgb(109, 40, 217)",
    });
  },
  parameters: {
    docs: {
      description: {
        story: `Every variable either bar shows without overflowing, set on one wrapper. The underlined row shows the \`--tabs-primary-*\`, underline and weight variables. The segmented control (\`type={TabsTypes.Secondary}\`) shows the \`--tabs-secondary-*\` ones; the hover colours appear on hover.`,
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
