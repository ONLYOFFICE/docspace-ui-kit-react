import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { RootTooltip } from "../tooltip";

import { Link, LinkType, LinkTarget } from ".";

const meta = {
  title: "UI/Navigation/Link",
  component: Link,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(LinkType),
      description:
        "`page` for navigation, `action` for a link that runs code. With an `onClick` and no `href`, an action link is a keyboard button by itself. `role`, `onKeyDown` or a negative `tabIndex` leave the keyboard to you.",
      table: {
        defaultValue: { summary: "page" },
      },
    },
    href: {
      control: "text",
      description:
        "Address the link navigates to. Without it the anchor is a link only when it has an `onClick`.",
    },
    target: {
      control: "select",
      options: Object.values(LinkTarget),
      description: "Where the address opens, such as `_blank` for a new tab.",
    },
    rel: {
      control: "text",
      description:
        "Relation to the target page, such as `noopener noreferrer` for a new tab.",
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
        'Any CSS colour, or the literal `"accent"`, which resolves to the theme\'s `--accent-main`.',
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
        "Line drawn under the label at rest, over the stylesheet's `none`.",
    },
    isBold: {
      control: "boolean",
      description: "Renders the label at weight 700.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description:
        "Paints the link as if the pointer were over it, for a row that highlights its link on hover of the whole row.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description:
        "Halves the opacity, the kit's convention for a pending or inactive entity.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description:
        "Constrains the link to the width of its container (`display: inline-block; max-width: 100%`). It does **not** add the ellipsis by itself — that comes from `truncate`, inherited from `Text`. Set both to clip a long label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Removes the underline the link grows on hover.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableUserSelect: {
      control: "boolean",
      description: "Whether the label can be selected with the mouse.",
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
        "Tooltip text. Consumed by the `withTooltip` wrapper the folder exports, so it becomes the tooltip's content and never reaches the DOM as a `title` attribute.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Value of `aria-label`. Without it a string `children` is used, so the visible text is the name; a node child sets none.",
    },
    role: {
      control: "text",
      description:
        "ARIA role. Without `href`, a link with an `onClick` takes one by itself; a role passed here leaves the keyboard to you.",
    },
    tabIndex: {
      control: "number",
      description:
        "Position in the tab order. `-1` keeps a link with no `href` out of the keyboard's reach.",
    },
    onClick: {
      description:
        "Called on a click. Without `href` it is also called on Enter, and on Space for an action link.",
    },
    onKeyDown: {
      description:
        "Called with the event on a key press while the link has focus; an action link runs its action from Enter and Space here",
    },
    id: {
      control: "text",
      description: "`id` of the anchor.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the anchor.",
      table: {
        defaultValue: { summary: "link" },
      },
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
  // No click: it would open example.com in a new tab.
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole("link", { name: "Simple link" });
    await expect(link).toHaveAttribute("href", "https://example.com");
    await expect(link).toHaveAttribute("target", "_blank");

    // A page link has an href, so it is a tab stop of its own.
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A page link that opens its address in a new tab, and grows an underline on hover.",
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

type TextQueries = { getByText: (text: string) => HTMLElement };

// The <a> that carries the link's styles, found by its label.
const link = (canvas: TextQueries, label: string) =>
  canvas.getByText(label).closest("a") as HTMLAnchorElement;

const decoration = (element: Element) => {
  const { textDecorationLine, textDecorationStyle } = getComputedStyle(element);
  return `${textDecorationLine} ${textDecorationStyle}`;
};

// The four states every link type shares, read off one rendered column.
const statesOf = async (canvas: TextQueries, kind: "page" | "action") => {
  const bold = link(canvas, `Bold ${kind} link`);
  const regular = link(canvas, `Regular ${kind} link`);
  await expect(Number(getComputedStyle(bold).fontWeight)).toBeGreaterThan(
    Number(getComputedStyle(regular).fontWeight),
  );
  await expect(decoration(regular)).toMatch(/^none/);
  await expect(decoration(link(canvas, `Hovered ${kind} link`))).toBe(
    kind === "page" ? "underline solid" : "underline dashed",
  );
  await expect(link(canvas, `Semitransparent ${kind} link`)).toHaveStyle({
    opacity: "0.5",
  });
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
  name: "Page links",
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(4);
    for (const link of links) {
      await expect(link).toHaveAttribute("href", "https://example.com");
    }
  },
  render: () => <PageLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Page links, which navigate and grow a solid underline on hover. **Bold page link** (`isBold`), **Hovered page link** keeps the underline on (`isHovered`), **Semitransparent page link** is at half opacity (`isSemitransparent`).",
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
  name: "Action links",
  render: () => <ActionLinksTemplate />,
  play: async ({ canvas }) => {
    await statesOf(canvas, "action");
    // Action links run code; none of them navigates.
    await expect(link(canvas, "Regular action link")).not.toHaveAttribute(
      "href",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Action links, which run code in place and grow a dashed underline on hover. The four links show the same states as the page links.",
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
  name: "All variants",
  render: () => <AllVariantsTemplate />,
  play: async ({ canvas }) => {
    await statesOf(canvas, "page");
    await statesOf(canvas, "action");
  },
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
  name: "Hovered",
  render: () => <HoveredTemplate />,
  play: async ({ canvas }) => {
    await expect(decoration(link(canvas, "Hovered link"))).toBe(
      "underline solid",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A link holding its hover underline with no pointer over it (`isHovered`), as inside a row that highlights its link on hover.",
      },
      source: {
        code: `<Link type={LinkType.page} href="https://example.com" isHovered>Hovered link</Link>`,
      },
    },
  },
};

export const SemitransparentState: Story = {
  name: "Semitransparent",
  render: () => <SemitransparentTemplate />,
  play: async ({ canvas }) => {
    await expect(link(canvas, "Semitransparent link")).toHaveStyle({
      opacity: "0.5",
    });
  },
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
  name: "Truncated label",
  render: () => <TextOverflowTemplate />,
  play: async ({ canvas }) => {
    const element = link(
      canvas,
      "This is a very long link that should demonstrate text overflow behavior",
    );
    // One line, cut with an ellipsis inside the 200px box.
    await expect(element.getBoundingClientRect().width).toBeLessThanOrEqual(
      200,
    );
    await expect(element.scrollWidth).toBeGreaterThan(element.clientWidth);
    await expect(element).toHaveStyle({
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "A label longer than its 200px container, held on one line and cut with an ellipsis (`isTextOverflow` with `truncate`).",
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
  name: "No hover underline",
  render: () => <NoHoverTemplate />,
  play: async ({ canvas }) => {
    // The hover underline is switched off by a class; CSS :hover itself
    // cannot be produced from a play function.
    const element = link(canvas, "No hover effect link");
    await expect(element.className).toMatch(/noHover/);
    await expect(decoration(element)).toMatch(/^none/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A link that grows no underline on hover (`noHover`), for surroundings that already show it is clickable.",
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
  name: "With tooltip",
  render: () => <WithTooltipTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("link", { name: "Shared folder" }));
    // RootTooltip renders outside the story root.
    await waitFor(() =>
      expect(screen.getByText("Opens the shared folder")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A link whose tooltip says what it opens (`title`). The text appears in the app's shared tooltip, which shows only where the app mounts `RootTooltip`.",
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

// The recipe the source below shows: Enter and Space run the same action a
// click does.
const KeyboardActionTemplate = ({ onAction }: { onAction?: () => void }) => {
  return (
    <Link type={LinkType.action} onClick={() => onAction?.()}>
      Move to archive
    </Link>
  );
};

export const KeyboardAccessibleAction: Story = {
  name: "Action from the keyboard",
  // args.onClick is the fn() spy below; the template calls it with no event.
  render: (args) => (
    <KeyboardActionTemplate onAction={args.onClick as () => void} />
  ),
  args: { onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole("button", { name: "Move to archive" });

    await userEvent.tab();
    await expect(link).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An action link with an `onClick` and no address, which the component makes a keyboard button by itself. It is a tab stop, announced as a button, and Enter and Space press it.",
      },
      source: {
        code: `<Link type={LinkType.action} onClick={handleClick}>
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
  name: "Custom colour",
  render: () => <CustomColorTemplate />,
  play: async ({ canvas }) => {
    await expect(link(canvas, "Custom colour link")).toHaveStyle({
      color: "rgb(46, 125, 50)",
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "A link in a CSS colour of its own (`color`). The value `accent` uses the portal's accent colour, which this Storybook does not define.",
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
  name: "Underlined at rest",
  render: () => <TextDecorationsTemplate />,
  play: async ({ canvas }) => {
    await expect(decoration(link(canvas, "Underlined link"))).toBe(
      "underline solid",
    );
    await expect(decoration(link(canvas, "Dashed action link"))).toBe(
      "underline dashed",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Links underlined at rest (`textDecoration`): **Underlined link** solid, **Dashed action link** dashed. The line stays the same on hover.",
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
  name: "CSS variables",
  play: async ({ canvas }) => {
    await expect(link(canvas, "Custom color link")).toHaveStyle({
      color: "rgb(156, 39, 176)",
    });
    const action = link(canvas, "Custom action link");
    await expect(decoration(action)).toBe("underline dotted");
    await expect(action).toHaveStyle({ lineHeight: "32px" });
  },
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
        story: `Variables set on a wrapper and on the link itself:

- **Custom color link** — a page link in the wrapper's colour, with no underline on hover
- **Custom action link** — a dotted underline and a taller line at rest, through its \`style\`; a wavy underline on hover`,
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
