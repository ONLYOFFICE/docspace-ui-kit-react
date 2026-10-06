import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Heading, HeadingLevel, HeadingSize } from ".";

const HEADING_LEVELS = Object.values(HeadingLevel).filter(
  (value): value is HeadingLevel => typeof value === "number",
);

const meta = {
  title: "UI/Data display/Heading",
  component: Heading,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    level: {
      // Numeric options labelled h1-h6, not `mapping: HeadingLevel`: a numeric
      // enum maps both ways (`HeadingLevel[1] === "h1"`), so the mapping
      // turned the default `level: 1` into "h1" and the element into <hh1>.
      control: {
        type: "select",
        labels: Object.fromEntries(
          HEADING_LEVELS.map((level) => [level, HeadingLevel[level]]),
        ),
      },
      options: HEADING_LEVELS,
      description:
        "Which heading element is rendered, `h1` through `h6`. It changes only the element, not the size: an `h3` can be the largest text on the page",
      table: {
        defaultValue: { summary: "h1" },
      },
    },
    size: {
      control: "select",
      options: Object.values(HeadingSize),
      description:
        "One of five preset sizes, from 15px (`xsmall`) to 27px (`xlarge`). Has no effect while `type` is set",
      table: {
        defaultValue: { summary: "medium" },
      },
    },
    type: {
      control: "select",
      options: ["header", "menu", "content"],
      description:
        "Bold preset that replaces `size`: `content` 18px, `menu` 23px, `header` 28px, each with a 50px line height. Unset, the heading follows `size`",
    },
    color: {
      control: "color",
      description:
        "Text colour, as an inline style. Any CSS colour; unset, the heading is black, or white in the dark theme",
    },
    truncate: {
      control: "boolean",
      description:
        "Holds the heading on one line and ends it with an ellipsis. It needs a parent of bounded width; on its own the heading grows instead",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description:
        "Renders the heading inline, so it sits in the same line as the text around it instead of on a line of its own",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fontSize: {
      control: "text",
      description:
        "Font size, as an inline style, in any CSS unit. Wins over both `size` and `type`",
    },
    fontWeight: {
      control: "text",
      description:
        "Font weight, as an inline style. Wins over the 600 of the plain heading and the bold of `type`",
    },
    lineHeight: {
      control: "text",
      description:
        "Line height, as an inline style. Wins over the 50px line height of `type`",
    },
    as: {
      control: false,
      description:
        "Element or component to render instead of the `h1`-`h6` tag; `level` is then ignored",
    },
    title: {
      control: "text",
      description:
        "Native tooltip text, shown by the browser on hover. `HeadingWithTooltip` shows it in the shared tooltip instead",
    },
    children: {
      control: "text",
      description: "Heading text",
    },
    id: {
      control: "text",
      description: "`id` of the rendered element",
    },
    className: {
      control: "text",
      description: "Added after the component's own classes",
    },
    style: {
      control: "object",
      description:
        "Inline style of the element. Its `color`, `fontSize`, `fontWeight` and `lineHeight` are replaced by the props of the same name",
    },
  },
} satisfies Meta<typeof Heading>;

type Story = StoryObj<ComponentProps<typeof Heading>>;

export default meta;

const styleOf = (el: HTMLElement) => getComputedStyle(el);

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Heading {...args} />,
  args: {
    level: HeadingLevel.h1,
    size: HeadingSize.large,
    children: "Default Heading",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Default Heading" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A large `h1`, the title of a page or panel; change the level, size, type or any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1} size={HeadingSize.large}>
  Default Heading
</Heading>`,
      },
    },
  },
};

const LevelsTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1}>H1 Heading</Heading>
      <Heading level={HeadingLevel.h2}>H2 Heading</Heading>
      <Heading level={HeadingLevel.h3}>H3 Heading</Heading>
      <Heading level={HeadingLevel.h4}>H4 Heading</Heading>
      <Heading level={HeadingLevel.h5}>H5 Heading</Heading>
      <Heading level={HeadingLevel.h6}>H6 Heading</Heading>
    </Wrapper>
  );
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>
        XSmall Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.small}>
        Small Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.medium}>
        Medium Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.large}>
        Large Heading
      </Heading>
      <Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>
        XLarge Heading
      </Heading>
    </Wrapper>
  );
};

const TypesTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1}>Default Type</Heading>
      <Heading level={HeadingLevel.h1} type="header">
        Header Type
      </Heading>
      <Heading level={HeadingLevel.h1} type="menu">
        Menu Type
      </Heading>
      <Heading level={HeadingLevel.h1} type="content">
        Content Type
      </Heading>
    </Wrapper>
  );
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: 250 }}>
      <Heading level={HeadingLevel.h2} truncate>
        This is a very long heading that will be truncated when it exceeds the
        container width
      </Heading>
    </div>
  );
};

const CustomStyledTemplate = () => {
  return (
    <Wrapper>
      <Heading level={HeadingLevel.h1} color="blue">
        Blue Heading
      </Heading>
      <Heading level={HeadingLevel.h1} style={{ fontStyle: "italic" }}>
        Italic Heading
      </Heading>
      <Heading level={HeadingLevel.h1} style={{ textDecoration: "underline" }}>
        Underlined Heading
      </Heading>
    </Wrapper>
  );
};

export const Levels: Story = {
  render: () => <LevelsTemplate />,
  play: async ({ canvas }) => {
    // Each level is its own element, all at the same size.
    const sizes = [1, 2, 3, 4, 5, 6].map((level) => {
      const heading = canvas.getByRole("heading", { level });
      return styleOf(heading).fontSize;
    });
    await expect(new Set(sizes).size).toBe(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Six headings, `h1` through `h6`, all at the same medium size: the level decides the element a screen reader builds the page outline from, not how large the text looks (`level`).",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1}>H1 Heading</Heading>
<Heading level={HeadingLevel.h2}>H2 Heading</Heading>
<Heading level={HeadingLevel.h3}>H3 Heading</Heading>
<Heading level={HeadingLevel.h4}>H4 Heading</Heading>
<Heading level={HeadingLevel.h5}>H5 Heading</Heading>
<Heading level={HeadingLevel.h6}>H6 Heading</Heading>`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    // 15px to 27px, growing with each step.
    const sizes = canvas
      .getAllByRole("heading")
      .map((heading) => Number.parseFloat(styleOf(heading).fontSize));
    await expect(sizes[0]).toBe(15);
    await expect(sizes[4]).toBe(27);
    await expect([...sizes].sort((a, b) => a - b)).toEqual(sizes);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five `h1` headings from 15px to 27px: pick the size for the visual weight the layout needs, whatever level the heading has (`size`).",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>XSmall Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.small}>Small Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.medium}>Medium Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.large}>Large Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>XLarge Heading</Heading>`,
      },
    },
  },
};

export const Types: Story = {
  render: () => <TypesTemplate />,
  play: async ({ canvas }) => {
    const [, header, menu, content] = canvas.getAllByRole("heading");
    await expect(styleOf(header).fontSize).toBe("28px");
    await expect(styleOf(menu).fontSize).toBe("23px");
    await expect(styleOf(content).fontSize).toBe("18px");
    for (const heading of [header, menu, content]) {
      await expect(styleOf(heading).lineHeight).toBe("50px");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Default Type** has no `type` and follows `size`; **Header Type** is 28px at weight 600, **Menu Type** 23px bold and **Content Type** 18px bold, all three on a 50px line height, for titles that must line up with a 50px row (`type`).",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1}>Default Type</Heading>
<Heading level={HeadingLevel.h1} type="header">Header Type</Heading>
<Heading level={HeadingLevel.h1} type="menu">Menu Type</Heading>
<Heading level={HeadingLevel.h1} type="content">Content Type</Heading>`,
      },
    },
  },
};

export const TruncatedHeading: Story = {
  render: () => <TruncatedTemplate />,
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 2 });
    await expect(styleOf(heading).textOverflow).toBe("ellipsis");
    await expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A long title in a 250px column stays on one line and ends with an ellipsis, for headers that must not wrap; without a bounded parent the heading grows instead (`truncate`).",
      },
      source: {
        code: `<div style={{ width: 250 }}>
  <Heading level={HeadingLevel.h2} truncate>
    This is a very long heading that will be truncated...
  </Heading>
</div>`,
      },
    },
  },
};

export const CustomStyled: Story = {
  render: () => <CustomStyledTemplate />,
  play: async ({ canvas }) => {
    await expect(styleOf(canvas.getByText("Blue Heading")).color).toBe(
      "rgb(0, 0, 255)",
    );
    await expect(styleOf(canvas.getByText("Italic Heading")).fontStyle).toBe(
      "italic",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "One-off looks without a stylesheet: **Blue Heading** sets the colour through the `color` prop, **Italic Heading** and **Underlined Heading** pass other CSS through `style`.",
      },
      source: {
        code: `<Heading level={HeadingLevel.h1} color="blue">Blue Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ fontStyle: "italic" }}>Italic Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ textDecoration: "underline" }}>Underlined Heading</Heading>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--heading-text-color": "#7B4FBF",
          "--heading-weight": "800",
          "--heading-size-content": "22px",
          "--heading-size-menu": "26px",
          "--heading-size-header": "32px",
          "--heading-lh": "40px",
        } as CSSProperties
      }
    >
      <Heading level={HeadingLevel.h2} type="content">
        Custom Heading
      </Heading>
      <Heading level={HeadingLevel.h2}>Plain Heading</Heading>
      <Heading level={HeadingLevel.h2} type="menu">
        Menu Heading
      </Heading>
      <Heading level={HeadingLevel.h2} type="header">
        Header Heading
      </Heading>
    </div>
  ),
  play: async ({ canvas }) => {
    const custom = styleOf(canvas.getByText("Custom Heading"));
    await expect(custom.color).toBe("rgb(123, 79, 191)");
    await expect(custom.fontSize).toBe("22px");
    await expect(custom.lineHeight).toBe("40px");
    await expect(styleOf(canvas.getByText("Plain Heading")).fontWeight).toBe(
      "800",
    );
    await expect(styleOf(canvas.getByText("Menu Heading")).fontSize).toBe(
      "26px",
    );
    await expect(styleOf(canvas.getByText("Header Heading")).fontSize).toBe(
      "32px",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Custom Heading** (\`type="content"\`) shows the colour, \`--heading-size-content\` and \`--heading-lh\`; **Plain Heading** has no \`type\` and is there for \`--heading-weight\`; **Menu Heading** and **Header Heading** show \`--heading-size-menu\` and \`--heading-size-header\`.`,
      },
      source: {
        code: `<div
  style={{
    "--heading-text-color": "#7B4FBF",
    "--heading-weight": "800",
    "--heading-size-content": "22px",
    "--heading-size-menu": "26px",
    "--heading-size-header": "32px",
    "--heading-lh": "40px",
  }}
>
  <Heading level={HeadingLevel.h2} type="content">
    Custom Heading
  </Heading>
  <Heading level={HeadingLevel.h2}>Plain Heading</Heading>
  <Heading level={HeadingLevel.h2} type="menu">
    Menu Heading
  </Heading>
  <Heading level={HeadingLevel.h2} type="header">
    Header Heading
  </Heading>
</div>`,
      },
    },
  },
};
