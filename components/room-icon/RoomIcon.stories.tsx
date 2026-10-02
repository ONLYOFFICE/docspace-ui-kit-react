import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
        "Name the initials are taken from: the first letter of its first word and of its last",
    },
    color: {
      control: "text",
      description:
        "Colour of the tile, as six hex digits without a leading `#`; the initials turn white or black to stay readable on it",
    },
    size: {
      control: "text",
      description:
        "Side of the square, as a px string such as `48px`; at `96px` the corner badge grows to match",
      table: {
        defaultValue: { summary: "32px" },
      },
    },
    radius: {
      control: "text",
      description: "Corner radius of the tile and of the image inside it",
      table: {
        defaultValue: { summary: "6px" },
      },
    },
    showDefault: {
      control: "boolean",
      description: "Draws the initials even when a logo is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    logo: {
      control: "text",
      description:
        "Logo drawn instead of the initials: an image URL, or an object whose `cover` SVG is inlined and painted in the initials' colour, or whose `medium` URL is shown as it is",
    },
    imgClassName: {
      control: "text",
      description: "Class added to the `<img>` the logo is drawn in",
    },
    className: {
      control: "text",
      description: "Class added to the outer element",
    },
    isArchive: {
      control: "boolean",
      description:
        "Greys the tile out whatever `color` holds, and switches the hover image off",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTemplate: {
      control: "boolean",
      description:
        "Draws the tile as an outline in its colour, with the initials or a 24px logo inside",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withEditing: {
      control: "boolean",
      description:
        "Adds a pencil button in the corner that opens the logo menu; the tile becomes at least 64px wide and the badge is not drawn",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEmptyIcon: {
      control: "boolean",
      description:
        "Replaces the whole tile with a dashed frame, a camera glyph and a plus button that opens the logo menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "Entries of the logo menu, each with a label, an icon and a click handler; the upload entry is handed the hidden file input",
    },
    dropDownManualX: {
      control: "text",
      description: "Horizontal offset of the logo menu from its button",
      table: {
        defaultValue: { summary: "-10px" },
      },
    },
    onChangeFile: {
      action: "onChangeFile",
      description:
        "Called when a file is picked in the hidden file input; the input is rendered only when this is set",
    },
    hoverSrc: {
      control: "text",
      description:
        "Image that slides in over the tile while the pointer is on it, replacing the initials",
    },
    badgeUrl: {
      control: "text",
      description: "URL of the glyph drawn in the bottom corner of the tile",
    },
    badgeIconNode: {
      control: false,
      description:
        "Glyph drawn in the bottom corner, as a node instead of a URL",
    },
    badgeIconColor: {
      control: "text",
      description:
        "When set, the badge glyph keeps its own colours instead of being filled white (black in the dark theme)",
    },
    onBadgeClick: {
      action: "onBadgeClick",
      description:
        "Called when the badge is clicked; the click also reaches the tile and toggles the logo menu",
    },
    tooltipContent: {
      control: "text",
      description:
        "Text shown under the badge while the pointer is on it; needs `tooltipId`",
    },
    tooltipId: {
      control: "text",
      description: "Id that ties the badge to its tooltip",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
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
  parameters: {
    docs: {
      description: {
        story:
          "A room with no logo is shown by its initials on its colour. Change the name, the colour or the size live in the Controls panel below.",
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
  render: () => <SizesTemplate />,
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
  render: () => <ColorsTemplate />,
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
  parameters: {
    docs: {
      description: {
        story:
          "Lets the reader change the logo: click the pencil in the corner, or anywhere on the tile, to open the logo menu (`withEditing`, `model`); picking an entry shows up in the Actions panel.",
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
  parameters: {
    docs: {
      description: {
        story:
          "For a room that has no logo yet: a dashed frame with a camera glyph, and a plus button in the bottom-right corner that opens the logo menu (`isEmptyIcon`, `model`). The button takes its background from the host's accent colour, which Storybook does not define, so here only a click on that corner finds it.",
      },
      source: {
        code: `<RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />`,
      },
    },
  },
};

export const Archive: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "Marks something about the room with a glyph in the bottom corner (`badgeUrl`); clicking it calls `onBadgeClick`, shown in the Actions panel.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Explains the badge in words: hover it to read the text (`tooltipContent`), which the badge finds through `tooltipId`.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Hints that the tile can be clicked: hover it, and the initials slide away while a second image fades in (`hoverSrc`); a click opens the logo menu (`model`).",
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
  render: (args: RoomIconProps) => <WithLogoTemplate {...args} />,
  args: {
    title: "Project files",
    color: "2DB482",
    size: "48px",
  },
  parameters: {
    docs: {
      description: {
        story: `A room with a logo of its own shows it instead of the initials (\`logo\`):

- **Image** — a URL, drawn as it is
- **Cover** — an object with a \`cover\` SVG, inlined and painted in the initials' colour on the tile
- **Broken URL** — the image fails to load, so the tile falls back to the initials`,
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
  render: (args: RoomIconProps) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  args: {
    title: "ملفات المشروع",
    color: "4781D1",
    size: "48px",
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "90px" },
      description: {
        story:
          'The tile under a right-to-left interface: the pencil button and the badge move to the bottom-left corner. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. It covers two instances:

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
