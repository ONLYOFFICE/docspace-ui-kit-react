import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import PlanetIcon from "../../assets/icons/12/planet.react.svg?url";
import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import PlusSvgUrl from "../../assets/icons/16/button.plus.react.svg?url";
import EditPenSvgUrl from "../../assets/pencil.react.svg?url";
import styles from "./RoomIcon.stories.module.scss";

import { RoomIcon } from ".";

const meta = {
  title: "UI/Data display/RoomIcon",
  component: RoomIcon,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Room name. Only its initials are drawn — the first letter of the first word and of the last.",
    },
    color: {
      control: "text",
      description:
        "Background of the tile and the source of the initials' colour, as six hex digits **without** a leading `#`. Unset, the initials sit on no background.",
    },
    size: {
      control: "text",
      description:
        "Side of the square, as a px string. It is also divided to scale the cover glyph, so a value in any other unit gives `NaN`.",
      table: {
        defaultValue: { summary: "32px" },
      },
    },
    radius: {
      control: "text",
      description: "Corner radius of the tile and of the image inside it.",
      table: {
        defaultValue: { summary: "6px" },
      },
    },
    showDefault: {
      control: "boolean",
      description:
        "Draws the initials instead of the logo, whatever `logo` holds.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    logo: {
      control: "text",
      description:
        "The room's logo: a URL, or the portal's logo object. An object with a `cover` is inlined as a base64 SVG and recoloured; otherwise `medium` is used as a URL.",
    },
    imgClassName: {
      control: "text",
      description:
        "Added to the `<img>` the logo renders into, and to the template's 24px image.",
    },
    className: {
      control: "text",
      description:
        "Added to the outer element, before the component's own classes.",
    },
    isArchive: {
      control: "boolean",
      description:
        "Paints the tile in the archive grey instead of `color`, and turns off the hover overlay.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        "Draws the template outline instead of the round tile, with the logo shrunk to 24px inside it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withEditing: {
      control: "boolean",
      description:
        "Adds the pencil button and the menu it opens; the empty state keeps its plus instead. It also makes the tile 64px wide at the least.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEmptyIcon: {
      control: "boolean",
      description:
        "Draws a dashed empty frame with a camera glyph and a plus button, for a room that has no logo yet. It replaces the logo and the initials, and `isTemplate` wins over it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Entries of the logo menu. Without any, clicking the tile, the pencil or the plus opens nothing.",
    },
    dropDownManualX: {
      control: "text",
      description: "Horizontal offset of the logo menu.",
      table: {
        defaultValue: { summary: "-10px" },
      },
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called with the change event of the hidden file input. Passing it is what renders that input at all; its id is generated per instance.",
    },
    hoverSrc: {
      control: "text",
      description:
        "Image faded in over the tile while the pointer is on it. Ignored while `isArchive` is set.",
    },
    badgeUrl: {
      control: "text",
      description:
        "URL of the badge glyph, drawn in the corner. Either this or `badgeIconNode` renders the badge; `withEditing` suppresses it.",
    },
    badgeIconNode: {
      control: false,
      description: "Badge glyph as a node, used instead of `badgeUrl`.",
    },
    badgeIconColor: {
      control: "text",
      description:
        "Any value keeps the badge glyph's own colours; the value itself is not read. Unset, the glyph is filled white, or black in the dark theme.",
    },
    onBadgeClick: {
      action: "onBadgeClick",
      description:
        "Called when the badge is clicked. The click also reaches the tile, which toggles the logo menu when the tile has one.",
    },
    badgeLabel: {
      control: "text",
      description:
        "Accessible name of the badge, which is a button only with `onBadgeClick`. Without it that button is unnamed.",
    },
    tooltipContent: {
      control: "text",
      description:
        "Text of the badge's tooltip. It also needs `tooltipId`, and it is what makes the badge show a pointer cursor.",
    },
    tooltipId: {
      control: "text",
      description:
        "Id the badge's tooltip is registered under. Without it the tooltip has nothing to attach to.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: "room-icon" },
      },
    },
  },
} satisfies Meta<typeof RoomIcon>;

type RoomIconProps = ComponentProps<typeof RoomIcon>;
type Story = StoryObj<RoomIconProps>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

// The stories' typed render leaves play without a contextual type.
type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The menu stays mounted when closed, so it is open while an entry shows.
const isMenuOpen = () =>
  screen.queryAllByText("Upload").some((item) => item.checkVisibility());

const initialsOf = (icon: HTMLElement) =>
  icon.querySelector("[data-testid='room-title']")?.textContent;

const mockModel = [
  {
    label: "Upload",
    icon: PlusSvgUrl,
    key: "upload",
    onClick: fn(),
  },
  {
    label: "Edit",
    icon: EditPenSvgUrl,
    key: "edit",
    onClick: fn(),
  },
];

export const Default: Story = {
  name: "Default",
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Test Room",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
  },
  play: async ({ canvas }: PlayContext) => {
    const icon = canvas.getByTestId("room-icon");
    // The first letters of the first and last words, on a 96px tile.
    await expect(initialsOf(icon)).toBe("TR");
    await expect(icon.getBoundingClientRect().width).toBe(96);
  },
  parameters: {
    docs: {
      description: {
        story: "A room with no logo, shown by its initials on its colour.",
      },
      source: {
        code: `<RoomIcon title="Test Room" color="4781D1" size="96px" />`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <RoomIcon title="S" color="4781D1" size="32px" showDefault />
      <RoomIcon title="M" color="4781D1" size="48px" showDefault />
      <RoomIcon title="L" color="4781D1" size="96px" showDefault />
    </Wrapper>
  );
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => <SizesTemplate />,
  play: async ({ canvas }: PlayContext) => {
    const widths = canvas
      .getAllByTestId("room-icon")
      .map((icon) => icon.getBoundingClientRect().width);
    await expect(widths).toEqual([32, 48, 96]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same tile at 32px, 48px and 96px (`size`). Any px value works; the initials stay 14px at every size, so a large tile needs its own text style for them.",
      },
      source: {
        code: `<RoomIcon title="S" color="4781D1" size="32px" showDefault />
<RoomIcon title="M" color="4781D1" size="48px" showDefault />
<RoomIcon title="L" color="4781D1" size="96px" showDefault />`,
      },
    },
  },
};

const ColorsTemplate = () => {
  return (
    <Wrapper>
      <RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
      <RoomIcon title="Green" color="2DB482" size="48px" showDefault />
      <RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
      <RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
      <RoomIcon title="Red" color="F2675A" size="48px" showDefault />
    </Wrapper>
  );
};

export const Colors: Story = {
  name: "Colours",
  render: () => <ColorsTemplate />,
  play: async ({ canvas }: PlayContext) => {
    // Each tile carries its colour as a custom property.
    const colors = canvas
      .getAllByTestId("room-icon")
      .map((icon) => icon.style.getPropertyValue("--room-icon-color"));
    await expect(colors).toEqual([
      "#4781D1",
      "#2DB482",
      "#F97A0B",
      "#533ED1",
      "#F2675A",
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Each room gets its own colour (`color`, six hex digits without `#`), and the initials turn white or black to stay readable on it.",
      },
      source: {
        code: `<RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
<RoomIcon title="Green" color="2DB482" size="48px" showDefault />
<RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
<RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
<RoomIcon title="Red" color="F2675A" size="48px" showDefault />`,
      },
    },
  },
};

export const WithEditing: Story = {
  name: "With editing",
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Editable",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    withEditing: true,
    model: mockModel,
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    const icon = canvas.getByTestId("room-icon");
    await expect(icon).toHaveAttribute("data-has-editing", "true");
    // The pencil toggles the logo menu: one click opens it, the next
    // closes it - the tile does not count the same click twice.
    const pencil = icon.querySelector(".open-edit-logo-icon") as HTMLElement;
    await userEvent.click(pencil);
    await waitFor(() => expect(screen.getByText("Upload")).toBeVisible());
    await userEvent.click(pencil);
    await waitFor(() => expect(isMenuOpen()).toBe(false));

    // A click on the tile opens it too; picking an entry runs it and
    // closes the menu, which stays closed.
    await userEvent.click(icon);
    await waitFor(() => expect(isMenuOpen()).toBe(true));
    await userEvent.click(screen.getByText("Edit"));
    await expect(mockModel[1].onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(isMenuOpen()).toBe(false));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile with a pencil button in the corner (`withEditing`). The pencil, or a click anywhere on the tile, opens the logo menu (`model`).",
      },
      source: {
        code: `<RoomIcon
  title="Editable"
  size="96px"
  color="4781D1"
  withEditing
  model={menuModel}
  showDefault
/>`,
      },
    },
  },
};

export const EmptyState: Story = {
  name: "Empty",
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon {...args} />
    </div>
  ),
  args: {
    title: "",
    size: "96px",
    isEmptyIcon: true,
    model: mockModel,
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    const icon = canvas.getByTestId("room-icon");
    await expect(canvas.getByTestId("empty-icon")).toBeInTheDocument();
    const plus = icon.querySelector(".open-plus-logo-icon") as HTMLElement;
    // The plus circle is the accent colour without the portal too.
    await expect(
      getComputedStyle(plus.parentElement as HTMLElement).backgroundColor,
    ).not.toBe("rgba(0, 0, 0, 0)");
    // The plus button opens the same logo menu.
    await userEvent.click(plus);
    await waitFor(() => expect(isMenuOpen()).toBe(true));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A dashed frame with a camera glyph, for a room with no logo yet (`isEmptyIcon`). Its corner plus button opens the logo menu (`model`) and sits on a circle in the accent colour.",
      },
      source: {
        code: `<RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />`,
      },
    },
  },
};

export const Archive: Story = {
  name: "Archived",
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Archived",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    isArchive: true,
  },
  play: async ({ canvas }: PlayContext) => {
    const icon = canvas.getByTestId("room-icon");
    await expect(icon).toHaveAttribute("data-is-archive", "true");
    await expect(icon.className).toMatch(/isArchive/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An archived room is greyed out whatever its colour: this tile is given the same blue as the others (`isArchive`).",
      },
      source: {
        code: `<RoomIcon title="Archived" size="96px" color="4781D1" isArchive />`,
      },
    },
  },
};

export const WithBadge: Story = {
  name: "With badge",
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Public",
    color: "3B72A7",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: fn(),
    showDefault: true,
  },
  play: async ({ args, canvas, userEvent }: PlayContext) => {
    const badge = canvas.getByTestId("badge-container");
    await userEvent.click(
      badge.querySelector("[data-testid='icon-button']") as HTMLElement,
    );
    await expect(args.onBadgeClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A glyph in the bottom corner marks something about the room (`badgeUrl`). A click on it calls `onBadgeClick`.",
      },
      source: {
        code: `<RoomIcon
  title="Public"
  color="3B72A7"
  size="96px"
  badgeUrl={planetIconUrl}
  onBadgeClick={handleBadgeClick}
  showDefault
/>`,
      },
    },
  },
};

export const WithTooltip: Story = {
  name: "Badge with tooltip",
  render: (args: RoomIconProps) => (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Tooltip",
    color: "2DB482",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: fn(),
    tooltipContent: "Anyone with the link can view",
    tooltipId: "room-tooltip",
    showDefault: true,
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    const badge = canvas
      .getByTestId("badge-container")
      .querySelector("[data-tooltip-id='room-tooltip']") as HTMLElement;
    await userEvent.hover(badge);
    await waitFor(() =>
      expect(screen.getByText("Anyone with the link can view")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A badge with a tooltip that explains it in words (`tooltipContent`). The tooltip is tied to the badge through `tooltipId`.",
      },
      source: {
        code: `<RoomIcon
  title="Tooltip"
  color="2DB482"
  size="96px"
  badgeUrl={planetIconUrl}
  tooltipContent="Anyone with the link can view"
  tooltipId="room-tooltip"
  showDefault
/>`,
      },
    },
  },
};

export const Template: Story = {
  name: "Template",
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Template",
    color: "533ED1",
    size: "96px",
    radius: "6px",
    isTemplate: true,
    showDefault: true,
  },
  play: async ({ canvas }: PlayContext) => {
    const icon = canvas.getByTestId("room-icon");
    await expect(icon).toHaveAttribute("data-is-template", "true");
    await expect(icon.querySelector(".template-icon-svg svg")).not.toBeNull();
    await expect(initialsOf(icon)).toBe("T");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tells a template apart from a room: an outline in the tile colour instead of a filled square, with the initials inside (`isTemplate`).",
      },
      source: {
        code: `<RoomIcon title="Template" color="533ED1" size="96px" isTemplate />`,
      },
    },
  },
};

export const WithHover: Story = {
  name: "Hover image",
  render: (args: RoomIconProps) => (
    <div style={{ height: "200px" }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>
  ),
  args: {
    title: "Hover",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    hoverSrc: EditPenSvgUrl,
    model: mockModel,
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    await expect(canvas.getByTestId("hover-image")).toBeInTheDocument();
    // A click on the tile opens the logo menu.
    await userEvent.click(canvas.getByTestId("hover-container"));
    await waitFor(() => expect(isMenuOpen()).toBe(true));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A tile that hints it can be clicked (`hoverSrc`). On hover the initials slide away and a second image fades in. A click opens the logo menu.",
      },
      source: {
        code: `<RoomIcon
  title="Hover"
  size="96px"
  color="4781D1"
  hoverSrc={pencilIconUrl}
  model={menuModel}
  showDefault
/>`,
      },
    },
  },
};

export const LongTitle: Story = {
  name: "Long name",
  render: (args: RoomIconProps) => (
    <RoomIcon {...args} className={styles.roomTitle} />
  ),
  args: {
    title: "Very Long Room Name That Should Be Truncated",
    size: "48px",
    color: "F97A0B",
    radius: "6px",
    showDefault: true,
  },
  play: async ({ canvas }: PlayContext) => {
    // Two letters: the first of the first word and of the last.
    await expect(initialsOf(canvas.getByTestId("room-icon"))).toBe("VT");
  },
  parameters: {
    docs: {
      description: {
        story:
          "However long the name, the tile shows two letters: the first of its first word and the first of its last (`title`).",
      },
      source: {
        code: `<RoomIcon
  title="Very Long Room Name That Should Be Truncated"
  size="48px"
  color="F97A0B"
  showDefault
/>`,
      },
    },
  },
};

const coverGlyph = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10 2l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L10 14.4 5 17.2l1.2-5.6L2 7.8l5.6-.6z"/></svg>`;

// The cover path reads only `cover`; the other size URLs are required by TLogo.
const coverLogo = {
  cover: { id: "star", data: coverGlyph },
  original: "",
  large: "",
  medium: "",
  small: "",
};

// A logo that cannot load. A data URI that does not decode fails the same
// way a missing file does -- `onError` fires and the tile falls back to the
// initials -- without a request, so the console shows no 404 for it.
const BROKEN_LOGO_URL = "data:image/png;base64,bm90LWFuLWltYWdl";

const WithLogoTemplate = (args: RoomIconProps) => (
  <Wrapper>
    <RoomIcon {...args} logo={CatalogFolderReactSvgUrl} />
    <RoomIcon {...args} logo={coverLogo} />
    <RoomIcon {...args} logo={BROKEN_LOGO_URL} />
  </Wrapper>
);

export const WithLogo: Story = {
  name: "With logo",
  render: (args: RoomIconProps) => <WithLogoTemplate {...args} />,
  args: {
    title: "Project files",
    color: "2DB482",
    size: "48px",
  },
  play: async ({ canvas }: PlayContext) => {
    const [image, cover, broken] = canvas.getAllByTestId("room-icon");
    // An image URL is drawn as it is.
    await expect(
      image.querySelector("[data-testid='room-icon-image']"),
    ).not.toBeNull();
    // A cover SVG is inlined.
    await expect(
      cover.querySelector("[data-testid='room-icon-cover']"),
    ).not.toBeNull();
    // A logo that fails to load falls back to the initials.
    await waitFor(() => expect(initialsOf(broken)).toBe("PF"));
  },
  parameters: {
    docs: {
      description: {
        story: `Three rooms with a logo of their own, shown instead of the initials (\`logo\`):

- **Image** — a URL, drawn as it is
- **Cover** — an object with a \`cover\` SVG, inlined and painted in the initials' colour
- **Broken URL** — the image fails to load, and the tile falls back to the initials`,
      },
      source: {
        code: `<RoomIcon title="Project files" color="2DB482" size="48px" logo={logoUrl} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={{ cover: { id: "star", data: svgString }, original: "", large: "", medium: "", small: "" }} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={urlThatFailsToLoad} />`,
      },
    },
  },
};

const RightToLeftTemplate = (args: RoomIconProps) => (
  <div dir="rtl">
    <Wrapper>
      <RoomIcon {...args} withEditing model={mockModel} />
      <RoomIcon {...args} badgeUrl={PlanetIcon} />
    </Wrapper>
  </div>
);

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: (args: RoomIconProps) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  args: {
    title: "ملفات المشروع",
    color: "4781D1",
    size: "48px",
  },
  play: async ({ canvas }: PlayContext) => {
    // Under RTL the pencil sits in the bottom-left corner.
    const [editable] = canvas.getAllByTestId("room-icon");
    const pencil = editable.querySelector(
      ".open-edit-logo-icon",
    ) as HTMLElement;
    const tile = editable.getBoundingClientRect();
    const box = pencil.getBoundingClientRect();
    await expect(box.left - tile.left).toBeLessThan(tile.right - box.right);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "90px" },
      description: {
        story:
          'The tile under a right-to-left interface: the pencil button and the badge move to the bottom-left corner. The pencil follows the theme\'s `interfaceDirection`; the wrapper also carries `dir="rtl"`.',
      },
      source: {
        code: `<div dir="rtl">
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" withEditing model={menuModel} />
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" badgeUrl={iconUrl} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "24px",
          alignItems: "center",
          "--room-icon-bg": "#b45309",
          "--room-icon-bg-opacity": "0.6",
          "--room-icon-edit-bg": "#fde68a",
          "--room-icon-button-icon-color": "#7c3aed",
          "--room-icon-empty-radius": "50%",
          "--room-icon-dashed-border": "2px dashed #7c3aed",
        } as CSSProperties
      }
    >
      <RoomIcon
        title="Design review"
        size="96px"
        color="7c3aed"
        radius="50%"
        withEditing
        model={mockModel}
        className={styles.roomTitle}
      />
      <RoomIcon title="" size="96px" isEmptyIcon model={mockModel} />
    </div>
  ),
  play: async ({ canvas }: PlayContext) => {
    // The dashed frame and its radius belong to the empty tile itself.
    const [, empty] = canvas.getAllByTestId("room-icon");
    const frame = getComputedStyle(empty);
    await expect(frame.borderTopStyle).toBe("dashed");
    await expect(frame.borderTopColor).toBe("rgb(124, 58, 237)");
    await expect(frame.borderTopLeftRadius).toBe("50%");
  },
  parameters: {
    docs: {
      description: {
        story: `Two tiles restyled by every overridable variable, set on a wrapper:

- **Design review** — an editable tile, for \`--room-icon-bg-opacity\` on the tile and \`--room-icon-edit-bg\` on the pencil
- **Empty frame** — for \`--room-icon-bg\` on the plus glyph, \`--room-icon-button-icon-color\` on the camera, and the frame's \`--room-icon-dashed-border\` and \`--room-icon-empty-radius\``,
      },
      source: {
        code: `<div
  style={{
    "--room-icon-bg": "#b45309",
    "--room-icon-bg-opacity": "0.6",
    "--room-icon-edit-bg": "#fde68a",
    "--room-icon-button-icon-color": "#7c3aed",
    "--room-icon-empty-radius": "50%",
    "--room-icon-dashed-border": "2px dashed #7c3aed",
  }}
>
  <RoomIcon title="Design review" size="96px" color="7c3aed" radius="50%" withEditing model={menuModel} />
  <RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />
</div>`,
      },
    },
  },
};
