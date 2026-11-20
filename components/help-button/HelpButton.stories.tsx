import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Text } from "../text";
import { RootTooltip } from "../tooltip";

import { HelpButton } from ".";

const meta = {
  title: "UI/Interactive elements/HelpButton",
  component: HelpButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    tooltipContent: {
      description:
        "Content of the tooltip. A string is shown by the shared tooltip, which needs `RootTooltip` mounted; any other node makes the component render its own `Tooltip` instead.",
      control: false,
    },
    getContent: {
      description:
        "Builds the tooltip's content. Returning a string routes the text through the shared tooltip; returning a node makes the component render one of its own.",
      control: false,
    },
    children: {
      description:
        "Anchor to use instead of the info icon. The whole element becomes the thing the tooltip opens from.",
      control: false,
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Side of the anchor the tooltip prefers.",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    size: {
      control: { type: "number", min: 8, max: 48 },
      description:
        "Width and height of the info icon; same forms as `IconButton`'s `size`.",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    color: {
      control: "color",
      description:
        'Colour of the info icon: any CSS colour, `"accent"` for the theme accent, or the name of a custom property starting with `--`',
    },
    iconName: {
      control: "text",
      description:
        "URL of an SVG to draw instead of the info icon, fetched by the browser at runtime",
    },
    iconNode: {
      control: false,
      description: "Icon to draw instead of the kit's info glyph.",
    },
    offset: {
      control: "number",
      description: "Distance between the anchor and the tooltip, in pixels.",
    },
    openOnClick: {
      control: "boolean",
      description: "Whether the tooltip opens on click rather than on hover.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isClickable: {
      control: "boolean",
      description: "Shows the pointer cursor over the info icon.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isOpen: {
      control: "boolean",
      description:
        "Forces the tooltip open or closed. Only for a tooltip rendered by this component.",
    },
    afterShow: {
      action: "afterShow",
      description:
        "Called after the tooltip has been shown. Not called for a string tooltip.",
    },
    afterHide: {
      action: "afterHide",
      description:
        "Called after the tooltip has been hidden. Not called for a string tooltip.",
    },
    tooltipMaxWidth: {
      control: "text",
      description: "Maximum width of the tooltip as a CSS length.",
      table: {
        defaultValue: { summary: "320px" },
      },
    },
    tooltipStyle: {
      control: "object",
      description: "Applied to the tooltip itself.",
    },
    noUserSelect: {
      control: "boolean",
      description: "Stops the tooltip's text being selected.",
    },
    id: {
      control: "text",
      description:
        "Id of the anchor element, which the tooltip is matched against by a CSS selector. Without it a fresh id is generated on **every** render, so pass one for a button that re-renders.",
    },
    className: {
      control: "text",
      description:
        "Class of the info icon, or of the element around `children`.",
      table: {
        defaultValue: { summary: "icon-button" },
      },
    },
    style: {
      control: "object",
      description: "Applied to the wrapper around the anchor.",
    },
    dataTip: {
      control: "text",
      description: "Value of the legacy `data-tip` attribute on the info icon.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the wrapper.",
      table: {
        defaultValue: { summary: "help-button" },
      },
    },
    tooltipId: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    tooltipProps: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    offsetTop: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    offsetRight: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    offsetBottom: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    offsetLeft: {
      control: false,
      description: "Ignored. Nothing reads this prop.",
    },
    hoverColor: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    clickColor: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isDisabled: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isFill: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    isStroke: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    iconHoverName: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    iconClickName: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onClick: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseEnter: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseLeave: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseDown: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onMouseUp: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    tabIndex: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    onKeyDown: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
    title: {
      control: false,
      description:
        "Accepted by the type but not passed on to the icon, so it has no effect",
    },
  },
} satisfies Meta<typeof HelpButton>;

type Story = StoryObj<ComponentProps<typeof HelpButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {props.children}
    </div>
  );
};

type Canvas = { getByTestId: (id: string) => HTMLElement };

// The info glyph the tooltip anchors to; the tooltip renders in a portal.
const icon = (canvas: Canvas) =>
  canvas.getByTestId("help-button").querySelector("svg") as SVGElement;

const tooltipShows = (text: string) =>
  waitFor(() => expect(screen.getByText(text)).toBeVisible());

const icons = (canvas: { getAllByTestId: (id: string) => HTMLElement[] }) =>
  canvas
    .getAllByTestId("help-button")
    .map((button) => button.querySelector("svg") as SVGElement);

const tooltipOf = (text: string) =>
  screen.getByText(text).closest("[role='tooltip']") as HTMLElement;

const rect = (element: Element) => element.getBoundingClientRect();

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(icon(canvas));
    await tooltipShows("This is a help tooltip");

    // Escape closes it, and the keyboard opens it again.
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("This is a help tooltip")).toBeNull(),
    );
    canvas.getByRole("button", { name: "Info" }).focus();
    await userEvent.keyboard("{Enter}");
    await tooltipShows("This is a help tooltip");
  },
  render: (args) => (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton {...args} />
    </div>
  ),
  args: {
    tooltipContent: <div>This is a help tooltip</div>,
    place: "right",
    offset: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The info icon with a short explanation, which opens beside it on click.",
      },
      source: {
        code: `<HelpButton
  tooltipContent={<div>This is a help tooltip</div>}
  place="right"
  offset={8}
/>`,
      },
    },
  },
};

const CustomStyleTemplate = () => {
  return (
    <Wrapper>
      <HelpButton
        tooltipContent={<div>Default size</div>}
        place="top"
        offset={8}
      />
      <HelpButton
        tooltipContent={<div>Large blue help button</div>}
        size={24}
        color="#2DA7DB"
        place="top"
        offset={12}
      />
      <HelpButton
        tooltipContent={<div>Large green help button</div>}
        size={20}
        color="#4CAF50"
        place="top"
        offset={12}
      />
    </Wrapper>
  );
};

export const CustomStyle: Story = {
  name: "Size and colour",
  render: () => <CustomStyleTemplate />,
  play: async ({ canvas }) => {
    const [plain, blue, green] = icons(canvas);
    await expect(Math.round(rect(blue).width)).toBe(24);
    await expect(Math.round(rect(green).width)).toBe(20);
    await expect(rect(plain).width).toBeLessThan(rect(green).width);
    const fill = (svg: SVGElement) =>
      getComputedStyle(svg.querySelector("path") as Element).fill;
    await expect(fill(blue)).toBe("rgb(45, 167, 219)");
    await expect(fill(green)).toBe("rgb(76, 175, 80)");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Icons larger or in another colour, which stand out next to a heading rather than a field label (`size`, `color`).",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Default size</div>} place="top" />
<HelpButton tooltipContent={<div>Large blue</div>} size={24} color="#2DA7DB" place="top" />
<HelpButton tooltipContent={<div>Large green</div>} size={20} color="#4CAF50" place="top" />`,
      },
    },
  },
};

const WithCustomContentTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        tooltipContent={
          <div style={{ padding: "8px" }}>
            <Text fontSize="14px" fontWeight="bold">
              Help Information
            </Text>
            <ul style={{ margin: "8px 0" }}>
              <li>First instruction</li>
              <li>Second instruction</li>
              <li>Third instruction</li>
            </ul>
            <Text fontSize="12px" color="gray">
              Click for more details
            </Text>
          </div>
        }
        place="right"
        offset={8}
      />
    </div>
  );
};

export const WithCustomContent: Story = {
  name: "Rich content",
  render: () => <WithCustomContentTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(icon(canvas));
    await tooltipShows("Help Information");
    for (const item of [
      "First instruction",
      "Second instruction",
      "Third instruction",
    ]) {
      await expect(screen.getByText(item)).toBeVisible();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "An explanation with a heading and a list, passed as a React node. It opens in the component's own tooltip, with no shared tooltip mounted.",
      },
      source: {
        code: `<HelpButton
  tooltipContent={
    <div>
      <Text fontWeight="bold">Help Information</Text>
      <ul>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ul>
    </div>
  }
  place="right"
/>`,
      },
    },
  },
};

const TooltipPositionsTemplate = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "48px",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((place) => (
        <div
          key={place}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <HelpButton
            tooltipContent={<div>Tooltip appears at {place}</div>}
            place={place}
            offset={8}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>{place}</span>
        </div>
      ))}
    </div>
  );
};

export const TooltipPositions: Story = {
  name: "Tooltip sides",
  render: () => <TooltipPositionsTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Each tooltip opens on its own side of the icon.
    const places = ["top", "right", "bottom", "left"] as const;
    const svgs = icons(canvas);
    for (const [index, place] of places.entries()) {
      await userEvent.click(svgs[index]);
      const text = `Tooltip appears at ${place}`;
      await tooltipShows(text);
      const tip = rect(tooltipOf(text));
      const anchor = rect(svgs[index]);
      if (place === "top")
        await expect(tip.bottom).toBeLessThanOrEqual(anchor.top);
      if (place === "bottom")
        await expect(tip.top).toBeGreaterThanOrEqual(anchor.bottom);
      if (place === "left")
        await expect(tip.right).toBeLessThanOrEqual(anchor.left);
      if (place === "right")
        await expect(tip.left).toBeGreaterThanOrEqual(anchor.right);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Four icons, each opening its tooltip on the side written under it (`place`). The side matters at the edge of a form or next to other controls.",
      },
      source: {
        code: `<HelpButton tooltipContent={<div>Top</div>} place="top" />
<HelpButton tooltipContent={<div>Right</div>} place="right" />
<HelpButton tooltipContent={<div>Bottom</div>} place="bottom" />
<HelpButton tooltipContent={<div>Left</div>} place="left" />`,
      },
    },
  },
};

const TextContentTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <RootTooltip />
      <HelpButton
        id="text-content-help"
        tooltipContent="Plain text opens in the shared tooltip"
        place="right"
      />
    </div>
  );
};

export const WithTextContent: Story = {
  name: "Plain text",
  render: () => <TextContentTemplate />,
  play: async ({ canvas, userEvent }) => {
    // A string goes to the shared tooltip RootTooltip renders, anchored to
    // the button element that carries data-tooltip-id.
    const anchor = canvas
      .getByTestId("help-button")
      .querySelector("[data-tooltip-id='info-tooltip']") as HTMLElement;
    await expect(anchor).toHaveAttribute(
      "data-tooltip-content",
      "Plain text opens in the shared tooltip",
    );
    // RootTooltip's info tooltip opens on a click, not on hover.
    await userEvent.click(anchor);
    await tooltipShows("Plain text opens in the shared tooltip");

    // Escape closes it, and the keyboard opens it again.
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByText("Plain text opens in the shared tooltip"),
      ).toBeNull(),
    );
    anchor.focus();
    await userEvent.keyboard("{Enter}");
    await tooltipShows("Plain text opens in the shared tooltip");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Plain text, shown by the application's shared tooltip rather than one of the component's own. It appears only where `RootTooltip` is mounted, as it is here.",
      },
      source: {
        code: `<RootTooltip />
<HelpButton
  id="text-content-help"
  tooltipContent="Plain text opens in the shared tooltip"
  place="right"
/>`,
      },
    },
  },
};

const CustomAnchorTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        id="custom-anchor-help"
        place="right"
        tooltipMaxWidth="240px"
        tooltipContent={
          <Text fontSize="12px">Storage is counted across all your rooms.</Text>
        }
      >
        <Text as="span" style={{ textDecoration: "underline dotted" }}>
          Storage
        </Text>
      </HelpButton>
    </div>
  );
};

export const WithCustomAnchor: Story = {
  name: "Word as the anchor",
  render: () => <CustomAnchorTemplate />,
  play: async ({ canvas, userEvent }) => {
    // The children are the anchor in place of the glyph.
    await userEvent.click(canvas.getByText("Storage"));
    await tooltipShows("Storage is counted across all your rooms.");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The word **Storage** in place of the icon, passed as children, so the label itself opens the explanation. Its tooltip is no wider than 240px (`tooltipMaxWidth`).",
      },
      source: {
        code: `<HelpButton
  id="custom-anchor-help"
  place="right"
  tooltipMaxWidth="240px"
  tooltipContent={<Text fontSize="12px">Storage is counted across all your rooms.</Text>}
>
  <Text as="span" style={{ textDecoration: "underline dotted" }}>Storage</Text>
</HelpButton>`,
      },
    },
  },
};

const OpensOnHoverTemplate = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <HelpButton
        id="hover-help"
        openOnClick={false}
        place="right"
        tooltipContent={<div>Opens while the pointer is over the icon</div>}
      />
    </div>
  );
};

export const OpensOnHover: Story = {
  name: "Opens on hover",
  render: () => <OpensOnHoverTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(icon(canvas));
    await tooltipShows("Opens while the pointer is over the icon");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A one-line hint with nothing to click inside, which opens on hover instead (`openOnClick={false}`). The tooltip closes when the pointer leaves.",
      },
      source: {
        code: `<HelpButton
  openOnClick={false}
  place="right"
  tooltipContent={<div>Opens while the pointer is over the icon</div>}
/>`,
      },
    },
  },
};

// The tooltip renders in a portal outside the wrapper, so the variables go through tooltipStyle.
const cssTooltipStyle = {
  "--tooltip-bg": "#1e3a5f",
  "--tooltip-color": "#e6f3fb",
  "--tooltip-max-width-value": "180px",
} as React.CSSProperties;

export const CssCustomization: Story = {
  name: "CSS customization",
  play: async ({ canvas, userEvent }) => {
    const [first, second] = icons(canvas);
    await userEvent.click(first);
    await tooltipShows("Customized tooltip");
    await expect(tooltipOf("Customized tooltip")).toHaveStyle({
      backgroundColor: "rgb(30, 58, 95)",
      color: "rgb(230, 243, 251)",
    });
    await userEvent.click(second);
    const text = "Another tooltip, wrapped at the custom maximum width";
    await tooltipShows(text);
    await expect(rect(tooltipOf(text)).width).toBeLessThanOrEqual(180);
  },
  render: () => (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        gap: "32px",
        alignItems: "center",
      }}
    >
      <HelpButton
        tooltipContent={<div>Customized tooltip</div>}
        place="right"
        offset={8}
        tooltipStyle={cssTooltipStyle}
      />
      <HelpButton
        tooltipContent={
          <div>Another tooltip, wrapped at the custom maximum width</div>
        }
        size={20}
        place="right"
        offset={8}
        tooltipStyle={cssTooltipStyle}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Two tooltips in custom colours, set by passing the tooltip's variables through \`tooltipStyle\`. The second tooltip's longer text wraps at 180px.`,
      },
      source: {
        code: `<HelpButton
  tooltipContent={<div>Customized tooltip</div>}
  tooltipStyle={{
    "--tooltip-bg": "#1e3a5f",
    "--tooltip-color": "#e6f3fb",
    "--tooltip-max-width-value": "180px",
  }}
/>`,
      },
    },
  },
};
