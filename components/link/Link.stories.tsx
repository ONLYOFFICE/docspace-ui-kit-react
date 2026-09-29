import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { RootTooltip } from "../tooltip";

import { Link, LinkType, LinkTarget } from ".";

const meta = {
  title: "UI/Navigation/Link",
  component: Link,
  parameters: {
    docs: {
      description: {
        component: `Link component with two types: page links for navigation and action links for triggering behavior.

### Features

- **Two Types**: A \`page\` link navigates to its \`href\`, an \`action\` link runs its click handler in place
- **Bold Text**: Emphasize links with bold font weight
- **Hover States**: Underlines a page link with a solid line and an action link with a dashed one on hover, or keeps that underline on while \`isHovered\` marks the surrounding row as hovered
- **Semitransparent**: Halves the opacity to mark a pending or inactive entity
- **Text Overflow**: Keeps a long label within its container's width, and ends it with an ellipsis once \`truncate\` is set as well
- **User Selection**: Control whether link text can be selected
- **Tooltip Support**: Shows the \`title\` text in the shared tooltip on hover, where the app mounts \`RootTooltip\`
- **Custom Colour**: Paints the label in any CSS colour, or in the portal's accent colour with \`color="accent"\`, which appears only where the portal defines that colour

### Accessibility

The Link renders a native \`<a>\`, so a page link gets its keyboard support from the platform; an action link needs more from you:

- \`aria-label\`: set to the text of a string child, or to \`ariaLabel\` when given; a node child gets none, and the anchor is named by its content
- A page link with an \`href\` is focusable with Tab and followed with Enter, as any native link is
- An action link has no \`href\`, so it has no role and is not in the tab order: give it \`role="button"\`, \`tabIndex={0}\` and an \`onKeyDown\` that runs the action on Enter and Space

### Usage

\`\`\`tsx
import { Link, LinkType, LinkTarget } from "@onlyoffice/apps-ui-kit/components/link";

// Page link
<Link type={LinkType.page} href="https://example.com" target={LinkTarget.blank}>
  Visit Example
</Link>

// Action link
<Link type={LinkType.action} onClick={handleClick}>
  Click to filter
</Link>

// Bold link
<Link type={LinkType.page} href="/profile" isBold>
  View Profile
</Link>
\`\`\``,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(LinkType),
      description:
        "`page` for a link that navigates to its `href`, with a solid underline on hover; `action` for a link that runs `onClick`, with a dashed underline on hover",
      table: {
        defaultValue: { summary: "page" },
      },
    },
    href: {
      control: "text",
      description: "Address the link navigates to, as the anchor's `href`",
    },
    target: {
      control: "select",
      options: Object.values(LinkTarget),
      description:
        "Where the address opens: a new tab (`_blank`), the same frame (`_self`), the parent frame or the whole window",
    },
    rel: {
      control: "text",
      description:
        "Relationship to the linked page, as the anchor's `rel`, e.g. `noopener noreferrer` for a new tab",
    },
    fontSize: {
      control: "text",
      description: "Font size of the label; unset, it is 13px",
    },
    fontWeight: {
      control: "text",
      description: "Font weight of the label; ignored while `isBold` is set",
    },
    lineHeight: {
      control: "text",
      description: "Line height of the label; unset, the font size plus 6px",
    },
    color: {
      control: "color",
      description:
        "Colour of the label: any CSS colour, or `accent` for the portal's accent colour, which leaves the label in its default colour where the portal does not define one",
    },
    textDecoration: {
      control: "select",
      options: [
        "none",
        "underline",
        "line-through",
        "overline",
        "underline dotted",
        "underline dashed",
      ],
      description:
        "Line drawn under, over or through the label at all times; while set, it also replaces the underline shown on hover",
    },
    isBold: {
      control: "boolean",
      description: "Renders the label at weight 700",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description:
        "Shows the hover underline without a pointer over the link, for a row that highlights its link while the whole row is hovered",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description: "Halves the opacity, to mark a pending or inactive entity",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description:
        "Keeps the link within the width of its container; add `truncate` to end a long label with an ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Removes the underline the link shows on hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableUserSelect: {
      control: "boolean",
      description: "Whether the label can be selected with the mouse",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    truncate: {
      control: "boolean",
      description:
        "Holds the label on one line and ends it with an ellipsis; needs `isTextOverflow` or a parent of bounded width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    title: {
      control: "text",
      description:
        "Text of the tooltip shown on hover; it appears only where the app mounts `RootTooltip`",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible name of the link; unset, a string label is used as the name",
    },
    role: {
      control: "text",
      description:
        "ARIA role of the anchor; an action link needs `button`, since an anchor without `href` has no role",
    },
    tabIndex: {
      control: "number",
      description:
        "Position in the Tab order; an action link needs `0` to be reachable from the keyboard",
    },
    onClick: {
      description: "Called with the event when the link is clicked",
    },
    onKeyDown: {
      description:
        "Called with the event on a key press while the link has focus; an action link runs its action from Enter and Space here",
    },
    id: {
      control: "text",
      description: "`id` of the anchor",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the anchor",
      table: {
        defaultValue: { summary: "link" },
      },
    },
    label: {
      control: false,
      description:
        "Ignored: the label comes from `children`, and this prop reaches the anchor as an unknown attribute",
    },
  },
} satisfies Meta<typeof Link>;

type Story = StoryObj<ComponentProps<typeof Link>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Link {...args}>Simple link</Link>,
  args: {
    href: "https://example.com",
    type: LinkType.page,
    fontSize: "13px",
    target: LinkTarget.blank,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A page link that opens its address in a new tab. Hover it to see the underline, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Link
  type={LinkType.page}
  href="https://example.com"
  fontSize="13px"
  target={LinkTarget.blank}
>
  Simple link
</Link>`,
      },
    },
  },
};

const PageLinksTemplate = () => {
  return (
    <Wrapper>
      <Link type={LinkType.page} href="https://example.com" isBold>
        Bold page link
      </Link>
      <Link type={LinkType.page} href="https://example.com">
        Regular page link
      </Link>
      <Link type={LinkType.page} href="https://example.com" isHovered>
        Hovered page link
      </Link>
      <Link type={LinkType.page} href="https://example.com" isSemitransparent>
        Semitransparent page link
      </Link>
    </Wrapper>
  );
};

const ActionLinksTemplate = () => {
  return (
    <Wrapper>
      <Link type={LinkType.action} onClick={() => {}} isBold>
        Bold action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}}>
        Regular action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}} isHovered>
        Hovered action link
      </Link>
      <Link type={LinkType.action} onClick={() => {}} isSemitransparent>
        Semitransparent action link
      </Link>
    </Wrapper>
  );
};

const AllVariantsTemplate = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <strong>Page links:</strong>
        <Wrapper>
          <Link type={LinkType.page} href="https://example.com" isBold>
            Bold page link
          </Link>
          <Link type={LinkType.page} href="https://example.com">
            Regular page link
          </Link>
          <Link type={LinkType.page} href="https://example.com" isHovered>
            Hovered page link
          </Link>
          <Link
            type={LinkType.page}
            href="https://example.com"
            isSemitransparent
          >
            Semitransparent page link
          </Link>
        </Wrapper>
      </div>
      <div>
        <strong>Action links:</strong>
        <Wrapper>
          <Link type={LinkType.action} onClick={() => {}} isBold>
            Bold action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}}>
            Regular action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}} isHovered>
            Hovered action link
          </Link>
          <Link type={LinkType.action} onClick={() => {}} isSemitransparent>
            Semitransparent action link
          </Link>
        </Wrapper>
      </div>
    </div>
  );
};

const HoveredTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://example.com" isHovered>
      Hovered link
    </Link>
  );
};

const SemitransparentTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://example.com" isSemitransparent>
      Semitransparent link
    </Link>
  );
};

const TextOverflowTemplate = () => {
  return (
    <div style={{ width: 200 }}>
      <Link
        type={LinkType.page}
        href="https://example.com"
        isTextOverflow
        truncate
      >
        This is a very long link that should demonstrate text overflow behavior
      </Link>
    </div>
  );
};

const NoHoverTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://example.com" noHover>
      No hover effect link
    </Link>
  );
};

export const PageLinks: Story = {
  render: () => <PageLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Page links navigate to another address; hover the regular one to see the solid underline a page link grows. **Bold page link** (`isBold`), **Hovered page link** keeps the underline on without a pointer (`isHovered`), **Semitransparent page link** is drawn at half opacity (`isSemitransparent`).",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" isBold>Bold page link</Link>
<Link type={LinkType.page} href="https://example.com">Regular page link</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered page link</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent page link</Link>`,
      },
    },
  },
};

export const ActionLinks: Story = {
  render: () => <ActionLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Action links run code in place instead of navigating, for filtering a list or opening a menu; hover the regular one to see the dashed underline that sets them apart from page links. The four links show the same states as the page links above.",
      },
      source: {
        code: `<Link type={LinkType.action} onClick={handleClick} isBold>Bold action link</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular action link</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered action link</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent action link</Link>`,
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Page and action links side by side, to compare the two underlines and the states each type shares: bold, hovered and semitransparent.",
      },
      source: {
        code: `// Page links
<Link type={LinkType.page} href="https://example.com" isBold>Bold</Link>
<Link type={LinkType.page} href="https://example.com">Regular</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent</Link>

// Action links
<Link type={LinkType.action} onClick={handleClick} isBold>Bold</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent</Link>`,
      },
    },
  },
};

export const HoveredState: Story = {
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The link shows its hover underline with no pointer over it, as it should inside a row that highlights its link while the whole row is hovered (`isHovered`).",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" isHovered>Hovered link</Link>`,
      },
    },
  },
};

export const SemitransparentState: Story = {
  render: () => <SemitransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The link at half opacity, to mark an entity that is pending or inactive while keeping it clickable (`isSemitransparent`).",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent link</Link>`,
      },
    },
  },
};

export const WithTextOverflow: Story = {
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A label longer than its 200px container stays on one line and ends with an ellipsis, so it cannot push the layout wider (`isTextOverflow` with `truncate`).",
      },
      source: {
        code: `<div style={{ width: 200 }}>
  <Link type={LinkType.page} href="https://example.com" isTextOverflow truncate>
    Very long link text...
  </Link>
</div>`,
      },
    },
  },
};

export const NoHoverEffect: Story = {
  render: () => <NoHoverTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Hover the link: no underline appears, for a link whose surroundings already show that it is clickable (`noHover`).",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" noHover>No hover effect link</Link>`,
      },
    },
  },
};

const WithTooltipTemplate = () => {
  return (
    <>
      <Link
        type={LinkType.page}
        href="https://example.com"
        title="Opens the shared folder"
      >
        Shared folder
      </Link>
      {/* The shared tooltip renders only where the app mounts RootTooltip, and Storybook does not */}
      <RootTooltip />
    </>
  );
};

export const WithTooltip: Story = {
  render: () => <WithTooltipTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Hover the link to read what it opens, for a label too short to say it (`title`). The text appears in the app's shared tooltip, not the browser's native one, so it shows only where the app mounts `RootTooltip`.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" title="Opens the shared folder">
  Shared folder
</Link>
<RootTooltip />`,
      },
    },
  },
};

const KeyboardActionTemplate = () => {
  return (
    <Link
      type={LinkType.action}
      role="button"
      tabIndex={0}
      onClick={() => {}}
      onKeyDown={() => {}}
    >
      Move to archive
    </Link>
  );
};

export const KeyboardAccessibleAction: Story = {
  render: () => <KeyboardActionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Press Tab to reach the link: an action link has no address, so without a role and a tab stop the keyboard skips it and a screen reader does not announce it. Here it is announced as a button (`role`), sits in the Tab order (`tabIndex`) and runs its action from the keys the handler checks (`onKeyDown`).",
      },
      source: {
        code: `<Link
  type={LinkType.action}
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick(e);
  }}
>
  Move to archive
</Link>`,
      },
    },
  },
};

const CustomColorTemplate = () => {
  return (
    <Link type={LinkType.page} href="https://example.com" color="#2E7D32">
      Custom colour link
    </Link>
  );
};

export const CustomColor: Story = {
  render: () => <CustomColorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Colour draws the eye to a link inside plain text: the label takes any CSS colour (`color`). The value `accent` uses the accent colour of the portal instead, which this Storybook does not define, so it is not shown here.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" color="#2E7D32">
  Custom colour link
</Link>`,
      },
    },
  },
};

const TextDecorationsTemplate = () => {
  return (
    <Wrapper>
      <Link
        type={LinkType.page}
        href="https://example.com"
        textDecoration="underline"
      >
        Underlined link
      </Link>
      <Link
        type={LinkType.action}
        onClick={() => {}}
        textDecoration="underline dashed"
      >
        Dashed action link
      </Link>
    </Wrapper>
  );
};

export const TextDecorations: Story = {
  render: () => <TextDecorationsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A link inside a paragraph is easier to spot when it is underlined before the pointer reaches it. **Underlined link** keeps a solid underline, **Dashed action link** a dashed one (`textDecoration`); the line stays the same on hover.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" textDecoration="underline">
  Underlined link
</Link>
<Link type={LinkType.action} onClick={handleClick} textDecoration="underline dashed">
  Dashed action link
</Link>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--link-text-color": "#9C27B0",
          "--link-hover-page-text-decoration": "none",
          "--link-hover-text-decoration": "underline wavy",
        } as CSSProperties
      }
    >
      <Wrapper>
        <Link type={LinkType.page} href="https://example.com">
          Custom color link
        </Link>
        <Link
          type={LinkType.action}
          onClick={() => {}}
          style={
            {
              "--link-text-decoration": "underline dotted",
              "--link-line-height": "32px",
            } as CSSProperties
          }
        >
          Custom action link
        </Link>
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--link-text-color\` | Colour of the label; the \`color\` prop wins over it | theme-based |
| \`--link-hover-page-text-decoration\` | Line a page link shows on hover | underline |
| \`--link-hover-text-decoration\` | Line an action link shows on hover | underline dashed |
| \`--link-text-decoration\` | Line the link shows at rest; declared on the link itself, so set it through its \`style\` prop | none |
| \`--link-line-height\` | Line height of the label; declared on the link itself, so set it through its \`style\` prop | calc(100% + 6px) |
| \`--link-display\` | Display of the link while \`isTextOverflow\` is set; declared on the link itself, so set it through its \`style\` prop | inline-block |

**Custom color link** is a page link: it takes the colour from the wrapper, and on hover shows no underline (\`--link-hover-page-text-decoration\`). **Custom action link** is there for the variables an action link reads: hover it for a wavy underline (\`--link-hover-text-decoration\`); at rest it carries a dotted underline and a taller line (\`--link-text-decoration\`, \`--link-line-height\`, through its \`style\` prop). \`--link-display\` is not shown: in a column of links its effect cannot be seen.`,
      },
      source: {
        code: `<div
  style={{
    "--link-text-color": "#9C27B0",
    "--link-hover-page-text-decoration": "none",
    "--link-hover-text-decoration": "underline wavy",
  }}
>
  <Link type={LinkType.page} href="https://example.com">
    Custom color link
  </Link>
  <Link
    type={LinkType.action}
    onClick={handleClick}
    style={{
      "--link-text-decoration": "underline dotted",
      "--link-line-height": "32px",
    }}
  >
    Custom action link
  </Link>
</div>`,
      },
    },
  },
};
