import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { globalColors } from "../../providers/theme";

import { Badge } from ".";

const meta = {
  title: "UI/Data display/Badge",
  component: Badge,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=6057-171831&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    label: {
      control: "text",
      description:
        'What the badge says, a number or a short text. `0`, `"0"` and an empty string hide the badge',
      table: {
        defaultValue: { summary: "0" },
      },
    },
    type: {
      control: "select",
      options: [undefined, "high"],
      description:
        "`high` switches to the emphasised preset: 6px corners and 3px 10px padding around the label",
    },
    backgroundColor: {
      control: "color",
      description: "Colour of the pill. Ignored while `isMutedBadge` is set",
      table: {
        defaultValue: { summary: "accent colour" },
      },
    },
    color: {
      control: "color",
      description: "Colour of the label. Ignored while `isPaidBadge` is set",
      table: {
        defaultValue: { summary: "white" },
      },
    },
    fontSize: {
      control: "text",
      description: "Size of the label text, in every type including `high`",
      table: {
        defaultValue: { summary: "11px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Weight of the label text, in every type including `high`",
      table: {
        defaultValue: { summary: "800" },
      },
    },
    borderRadius: {
      control: "text",
      description:
        "Corner radius of the badge and its pill. The pill keeps 6px corners while `type` is `high`",
      table: {
        defaultValue: { summary: "11px" },
      },
    },
    padding: {
      control: "text",
      description:
        "Space inside the pill around the label. Replaced by 3px 10px while `type` is `high`",
      table: {
        defaultValue: { summary: "0px 5px" },
      },
    },
    maxWidth: {
      control: "text",
      description:
        "Widest the pill may be; a longer label is cut off without an ellipsis. Not applied while `isPaidBadge` is set",
      table: {
        defaultValue: { summary: "50px" },
      },
    },
    height: {
      control: "text",
      description:
        "Height of the badge. Without it the badge is as tall as its label",
    },
    border: {
      control: "text",
      description:
        "CSS `border` shorthand drawn around the badge. The badge draws no border of its own",
    },
    noHover: {
      control: "boolean",
      description:
        "Keeps the arrow cursor and a fixed colour on hover and press, for a badge that is only a marker",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description:
        "Shows the pointer cursor and makes a `border` transparent without the pointer being there. It does not draw the hover colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isVersionBadge: {
      control: "boolean",
      description:
        "On tablet-width screens and narrower, lets the badge fill the width of its container; the pill stays centred at its own width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isPaidBadge: {
      control: "boolean",
      description:
        "Keeps the label white whatever `color` says and lifts `maxWidth`, so a long label is never cut off",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMutedBadge: {
      control: "boolean",
      description:
        "Paints the pill grey over `backgroundColor`, for something inactive",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      control: false,
      description:
        "Called with the click event. The badge prevents the event's default action first",
    },
    onMouseOver: {
      control: false,
      description: "Called when the pointer enters the badge or moves over it",
    },
    onMouseLeave: {
      control: false,
      description: "Called when the pointer leaves the badge",
    },
    className: {
      control: "text",
      description: "Extra class name on the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: "badge" },
      },
    },
  },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<ComponentProps<typeof Badge>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Badge {...args} />,
  args: {
    label: 24,
    onClick: fn(),
    onMouseOver: fn(),
    onMouseLeave: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const badge = canvas.getByRole("status", { name: "24" });
    await expect(badge).toHaveAttribute("data-hidden", "false");

    await userEvent.hover(badge);
    await expect(args.onMouseOver).toHaveBeenCalled();
    await userEvent.click(badge);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.unhover(badge);
    await expect(args.onMouseLeave).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The badge as it usually appears: a count on the accent colour. Change any prop live in the Controls panel below, and set the label to 0 to see the badge disappear.",
      },
      source: {
        code: `<Badge label={24} />`,
      },
    },
  },
};

const BadgeTypesTemplate = () => {
  return (
    <Wrapper>
      <Badge label={3} />
      <Badge label="New" />
      <Badge label="99+" />
      <Badge type="high" label="High" backgroundColor={globalColors.mainRed} />
    </Wrapper>
  );
};

const SpecialBadgesTemplate = () => {
  return (
    <Wrapper>
      <Badge label="v1.2.3" isVersionBadge />
      <Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
      <Badge label="Muted" isMutedBadge />
    </Wrapper>
  );
};

const HoverStatesTemplate = () => {
  return (
    <Wrapper>
      <Badge label="Default" />
      <Badge label="Hovered" isHovered />
      <Badge label="No Hover" noHover />
    </Wrapper>
  );
};

const CustomStyledTemplate = () => {
  return (
    <Wrapper>
      <Badge
        label="Custom"
        backgroundColor="#335EA3"
        color="#FFFFFF"
        fontSize="14px"
        fontWeight={600}
        borderRadius="8px"
        padding="4px 12px"
      />
      <Badge
        label="Bordered"
        border="2px solid #333"
        backgroundColor="transparent"
        color="#333"
      />
      <Badge label="Large" maxWidth="80px" padding="4px 16px" fontSize="14px" />
    </Wrapper>
  );
};

export const BadgeTypes: Story = {
  render: () => <BadgeTypesTemplate />,
  play: async ({ canvas }) => {
    // The name is the label followed by the type, when there is one.
    for (const name of ["3", "New", "99+", "High high"]) {
      await expect(canvas.getByRole("status", { name })).toBeInTheDocument();
    }
  },
  parameters: {
    docs: {
      description: {
        story: `The two looks a badge can take:

- **3**, **New**, **99+** — the usual round pill, as wide as its label, for a count or a short word
- **High** — the emphasised preset (\`type="high"\`), with squarer corners and more padding, for a marker that should stand out`,
      },
      source: {
        code: `<Badge label={3} />
<Badge label="New" />
<Badge label="99+" />
<Badge type="high" label="High" backgroundColor={globalColors.mainRed} />`,
      },
    },
  },
};

export const SpecialBadges: Story = {
  render: () => <SpecialBadgesTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Markers with a meaning of their own:

- **v1.2.3** — a version number (\`isVersionBadge\`); on tablet-width screens and narrower it fills the width of its container
- **PRO** — a paid-feature marker (\`isPaidBadge\`): the text stays white and the label is never cut off
- **Muted** — a grey pill for something inactive (\`isMutedBadge\`)`,
      },
      source: {
        code: `<Badge label="v1.2.3" isVersionBadge />
<Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
<Badge label="Muted" isMutedBadge />`,
      },
    },
  },
};

export const HoverStates: Story = {
  render: () => <HoverStatesTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("status", { name: "Hovered" }),
    ).toHaveAttribute("data-is-hovered", "true");
    await expect(
      canvas.getByRole("status", { name: "No Hover" }),
    ).toHaveAttribute("data-no-hover", "true");
  },
  parameters: {
    docs: {
      description: {
        story: `Hover and press each badge to compare:

- **Default** — the pill lightens on hover and darkens while pressed
- **Hovered** — shows the pointer cursor before the pointer arrives (\`isHovered\`); the colour still changes only under the real pointer
- **No Hover** — keeps the arrow cursor and its colour, for a badge that is only a marker (\`noHover\`)`,
      },
      source: {
        code: `<Badge label="Default" />
<Badge label="Hovered" isHovered />
<Badge label="No Hover" noHover />`,
      },
    },
  },
};

export const CustomStyled: Story = {
  render: () => <CustomStyledTemplate />,
  parameters: {
    docs: {
      description: {
        story: `For a place where the theme's pill does not fit:

- **Custom** — its own background, text colour, text size and weight, corners and padding
- **Bordered** — a transparent pill with a border around it (\`border\`)
- **Large** — a wider cap (\`maxWidth\`) and more padding for a longer label`,
      },
      source: {
        code: `<Badge label="Custom" backgroundColor="#335EA3" color="#FFFFFF" fontSize="14px" fontWeight={600} borderRadius="8px" padding="4px 12px" />
<Badge label="Bordered" border="2px solid #333" backgroundColor="transparent" color="#333" />
<Badge label="Large" maxWidth="80px" padding="4px 16px" fontSize="14px" />`,
      },
    },
  },
};

export const InteractiveBadge: Story = {
  render: (args) => <Badge {...args} />,
  args: {
    label: "Click me",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A badge that opens something when clicked: click it and watch the Actions panel (`onClick`). It takes no keyboard focus, so offer the same action somewhere a keyboard user can reach it.",
      },
      source: {
        code: `<Badge label="Click me" onClick={onOpen} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--badge-bg": "#7B4FBF",
          "--badge-radius": "12px",
          "--badge-high-padding": "3px 14px",
        } as CSSProperties
      }
    >
      <Badge type="high" label="Premium" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. The example is one \`high\` badge, because two of the three variables apply only to that type.`,
      },
      source: {
        code: `<div
  style={{
    "--badge-bg": "#7B4FBF",
    "--badge-radius": "12px",
    "--badge-high-padding": "3px 14px",
  }}
>
  <Badge type="high" label="Premium" />
</div>`,
      },
    },
  },
};
