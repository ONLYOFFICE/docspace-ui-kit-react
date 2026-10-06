import type { ComponentProps, CSSProperties } from "react";
import { useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TooltipRefProps } from "react-tooltip";
import { expect, fn, screen, waitFor } from "storybook/test";

import { globalColors } from "../../providers/theme";
import { Button, ButtonSize } from "../button";
import { Link } from "../link";
import { Text } from "../text";
import { Tooltip } from ".";

const meta = {
  title: "UI/Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=649%3A4458&mode=dev",
    },
  },
  argTypes: {
    place: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ],
      description:
        "Preferred side of the anchor; the tooltip moves to another side when this one has no room in the viewport",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    color: {
      control: "color",
      description:
        "Background colour of the tooltip, in place of the theme's; removing it later keeps the last colour",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the tooltip",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    maxWidth: {
      control: "text",
      description:
        "Maximum width as a CSS length; longer text wraps onto further lines",
      table: {
        defaultValue: { summary: "320px" },
      },
    },
    noArrow: {
      control: "boolean",
      description:
        "Hides the arrow that points from the tooltip at its anchor; set it to false to show the arrow",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    openOnClick: {
      control: "boolean",
      description:
        "Opens the tooltip on a click instead of on hover, and closes it on the next click",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    float: {
      control: "boolean",
      description:
        "Makes the tooltip follow the pointer instead of sitting at a fixed side of the anchor",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description:
        "Identifier the anchors point at with data-tooltip-id; without it, or anchorSelect, the tooltip has nothing to attach to",
    },
    anchorSelect: {
      control: "text",
      description:
        "CSS selector for the anchors, used instead of data-tooltip-id; it matches elements anywhere in the document",
    },
    children: {
      control: "text",
      description:
        "Fixed content, shown for every anchor that has no data-tooltip-content of its own",
    },
    getContent: {
      control: false,
      description:
        "Function that receives the anchor's text and element and returns the content to show; it replaces both the anchor's text and children",
    },
    offset: {
      control: "number",
      description: "Gap between the anchor and the tooltip, in pixels",
      table: {
        defaultValue: { summary: "4" },
      },
    },
    fallbackAxisSideDirection: {
      control: "select",
      options: ["none", "start", "end"],
      description:
        "Whether the tooltip may move to a side on the other axis when the preferred side and its opposite both have no room, and which one it tries first",
    },
    delayShow: {
      control: "number",
      description:
        "Time the pointer has to rest on the anchor before the tooltip appears, in milliseconds",
    },
    clickable: {
      control: "boolean",
      description:
        "Keeps the tooltip open while the pointer is over it, so a link inside it can be clicked",
    },
    isOpen: {
      control: "boolean",
      description:
        "Holds the tooltip open or closed; while it is set, hover and click no longer open or close it",
    },
    imperativeModeOnly: {
      control: "boolean",
      description:
        "Stops the anchors opening the tooltip, so it opens only when code calls open() on its ref",
    },
    ref: {
      control: false,
      description:
        "Handle with open() and close() methods for opening the tooltip from code",
    },
    afterShow: {
      action: "afterShow",
      description: "Called after the tooltip has appeared",
    },
    afterHide: {
      action: "afterHide",
      description: "Called after the tooltip has disappeared",
    },
    noUserSelect: {
      control: "boolean",
      description:
        "Stops the text inside the tooltip being selected with the pointer",
    },
    zIndex: {
      control: "number",
      description:
        "Stacking order of the wrapper around the tooltip, for placing it above or below other layers",
    },
    className: {
      control: "text",
      description:
        "Class added to the wrapper around the tooltip, not to the tooltip itself",
    },
    style: {
      control: "object",
      description:
        "Inline style of the wrapper around the tooltip; CSS variables set here reach the tooltip",
    },
    tooltipStyle: {
      control: "object",
      description: "Inline style of the tooltip itself",
    },
    dataTestId: {
      control: "text",
      description: "Value of data-testid on the wrapper around the tooltip",
      table: {
        defaultValue: { summary: "tooltip" },
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<ComponentProps<typeof Tooltip>>;

export default meta;

const bodyStyle = { marginTop: 100, marginInlineStart: 200 };

// The tooltip renders in a portal and fades in.
const shownTooltip = async (options?: { timeout: number }) => {
  const tooltip = await screen.findByRole("tooltip", undefined, options);
  await waitFor(() => expect(tooltip).toBeVisible(), options);
  return tooltip;
};

const tooltipGone = () =>
  waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());

// Nothing opens within this time.
const staysClosed = async (ms = 300) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  const tooltip = screen.queryByRole("tooltip");
  if (tooltip) await expect(tooltip).not.toBeVisible();
};

export const Default: Story = {
  render: (args) => {
    return (
      <div style={{ height: "240px" }}>
        <div style={{ ...bodyStyle, position: "absolute" as const }}>
          <Link
            data-tooltip-id="default-tooltip"
            data-tooltip-content="Simple tooltip"
          >
            Hover me
          </Link>
        </div>
        <Tooltip {...args} id="default-tooltip" />
      </div>
    );
  },
  args: {
    float: true,
    place: "top",
    afterShow: fn(),
    afterHide: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const anchor = canvas.getByText("Hover me");
    await userEvent.hover(anchor);
    const tooltip = await shownTooltip();
    await expect(tooltip).toHaveTextContent("Simple tooltip");
    await waitFor(() => expect(args.afterShow).toHaveBeenCalled());
    // The arrow is rendered but hidden by default.
    await expect(
      tooltip.querySelector(".react-tooltip-arrow"),
    ).not.toBeVisible();

    await userEvent.unhover(anchor);
    await tooltipGone();
    await waitFor(() => expect(args.afterHide).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "The basic setup: the anchor names the tooltip with `data-tooltip-id` and carries its text in `data-tooltip-content`. Hover the link to see the tooltip follow the pointer (`float`); change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Link data-tooltip-id="my-tooltip" data-tooltip-content="Simple tooltip">
  Hover me
</Link>
<Tooltip id="my-tooltip" float place="top" />`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="styled-tooltip"
          data-tooltip-content="Styled tooltip"
        >
          Hover for styled tooltip
        </Link>
      </div>
      <Tooltip
        id="styled-tooltip"
        opacity={0.9}
        maxWidth="200px"
        noArrow={false}
      />
    </div>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover for styled tooltip"));
    const tooltip = await shownTooltip();
    await expect(getComputedStyle(tooltip).maxWidth).toBe("200px");
    await waitFor(() => expect(getComputedStyle(tooltip).opacity).toBe("0.9"));
    await expect(tooltip.querySelector(".react-tooltip-arrow")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a tooltip that has to stand out from the theme: hover the link to see slight transparency (`opacity`), a narrower width limit (`maxWidth`) and the arrow pointing at the link (`noArrow={false}`).",
      },
      source: {
        code: `<Link data-tooltip-id="styled" data-tooltip-content="Styled tooltip">
  Hover for styled tooltip
</Link>
<Tooltip
  id="styled"
  opacity={0.9}
  maxWidth="200px"
  noArrow={false}
/>`,
      },
    },
  },
};

const ClickToShowTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="click-tooltip"
          data-tooltip-content="Click-triggered tooltip"
        >
          Click me
        </Link>
      </div>
      <Tooltip id="click-tooltip" openOnClick place="right" />
    </div>
  );
};

export const ClickToShow: Story = {
  render: () => <ClickToShowTemplate />,
  play: async ({ canvas, userEvent }) => {
    const anchor = canvas.getByText("Click me");
    await userEvent.hover(anchor);
    await staysClosed();

    await userEvent.click(anchor);
    const tooltip = await shownTooltip();
    await expect(tooltip).toHaveTextContent("Click-triggered tooltip");
    // Placed on the right of the link.
    await expect(tooltip.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      anchor.getBoundingClientRect().right,
    );
    await userEvent.click(anchor);
    await tooltipGone();

    // Escape closes it too.
    await userEvent.click(anchor);
    await shownTooltip();
    await userEvent.keyboard("{Escape}");
    await tooltipGone();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For touch screens and hints the user asks for: click the link to open the tooltip on its right and click again to close it; hovering does nothing (`openOnClick`).",
      },
      source: {
        code: `<Link data-tooltip-id="click" data-tooltip-content="Click-triggered tooltip">
  Click me
</Link>
<Tooltip id="click" openOnClick place="right" />`,
      },
    },
  },
};

const RichContentTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link data-tooltip-id="rich-tooltip" data-tooltip-content="Team member">
          Hover for rich content
        </Link>
      </div>
      <Tooltip
        id="rich-tooltip"
        float
        place="top"
        maxWidth="250px"
        getContent={({ content }) => (
          <div>
            <Text isBold fontSize="16px">
              {content}
            </Text>
            <Text color={globalColors.gray} fontSize="13px">
              name@example.com
            </Text>
            <Text fontSize="13px">Developer</Text>
          </div>
        )}
      />
    </div>
  );
};

export const RichContent: Story = {
  render: () => <RichContentTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover for rich content"));
    const tooltip = await shownTooltip();
    // The title comes from the anchor's data-tooltip-content.
    await expect(tooltip).toHaveTextContent("Team member");
    await expect(tooltip).toHaveTextContent("name@example.com");
    await expect(tooltip).toHaveTextContent("Developer");
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a hint that needs more than one line of plain text: hover the link to see a bold title taken from the anchor's text, with an address and a title below it (`getContent`).",
      },
      source: {
        code: `<Link data-tooltip-id="rich" data-tooltip-content="Team member">
  Hover for rich content
</Link>
<Tooltip
  id="rich"
  float
  maxWidth="250px"
  getContent={({ content }) => (
    <div>
      <Text isBold>{content}</Text>
      <Text>name@example.com</Text>
      <Text>Developer</Text>
    </div>
  )}
/>`,
      },
    },
  },
};

const DynamicGroupTemplate = () => {
  const users = [
    { name: "Member A", email: "a@example.com", position: "Developer" },
    { name: "Member B", email: "b@example.com", position: "Designer" },
    { name: "Member C", email: "c@example.com", position: "Manager" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Text>Group of tooltips:</Text>
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        {users.map((user, index) => (
          <Link
            key={user.name}
            data-tooltip-id="group-tooltip"
            data-tooltip-content={index}
          >
            {user.name}
          </Link>
        ))}
      </div>
      <Tooltip
        id="group-tooltip"
        getContent={({ content }) => {
          const user = users[Number(content)];
          return user ? (
            <div>
              <Text isBold fontSize="16px">
                {user.name}
              </Text>
              <Text color={globalColors.gray} fontSize="13px">
                {user.email}
              </Text>
              <Text fontSize="13px">{user.position}</Text>
            </div>
          ) : null;
        }}
      />
    </div>
  );
};

export const SharedByManyAnchors: Story = {
  render: () => <DynamicGroupTemplate />,
  play: async ({ canvas, userEvent }) => {
    // One tooltip, a different member for each anchor.
    await userEvent.hover(canvas.getByText("Member B"));
    await expect(await shownTooltip()).toHaveTextContent("b@example.com");
    await userEvent.hover(canvas.getByText("Member C"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("Manager"),
    );
    await expect(screen.getByRole("tooltip")).not.toHaveTextContent(
      "b@example.com",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a list where every row needs its own hint: hover each name to see one tooltip show that member's details, looked up from the index the anchor carries (`getContent`).",
      },
      source: {
        code: `{users.map((user, index) => (
  <Link data-tooltip-id="group" data-tooltip-content={index}>
    {user.name}
  </Link>
))}
<Tooltip
  id="group"
  getContent={({ content }) => {
    const user = users[Number(content)];
    return <div><Text isBold>{user.name}</Text></div>;
  }}
/>`,
      },
    },
  },
};

const FixedContentTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link data-tooltip-id="fixed-content-tooltip">Hover me</Link>
      </div>
      <Tooltip id="fixed-content-tooltip">
        <Text fontSize="12px">
          Shown for every anchor without text of its own
        </Text>
      </Tooltip>
    </div>
  );
};

export const FixedContent: Story = {
  render: () => <FixedContentTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover me"));
    await expect(await shownTooltip()).toHaveTextContent(
      "Shown for every anchor without text of its own",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For content written once in the markup rather than on each anchor: hover the link, which has no `data-tooltip-content`, to see the tooltip's own children.",
      },
      source: {
        code: `<Link data-tooltip-id="fixed">Hover me</Link>
<Tooltip id="fixed">
  <Text>Shown for every anchor without text of its own</Text>
</Tooltip>`,
      },
    },
  },
};

const AnchoredBySelectorTemplate = () => {
  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <Link className="selector-anchor" data-tooltip-content="First file">
        First
      </Link>
      <Link className="selector-anchor" data-tooltip-content="Second file">
        Second
      </Link>
      <Tooltip anchorSelect=".selector-anchor" place="bottom" />
    </div>
  );
};

export const AnchoredBySelector: Story = {
  render: () => <AnchoredBySelectorTemplate />,
  play: async ({ canvas, userEvent }) => {
    const second = canvas.getByText("Second");
    await userEvent.hover(second);
    const tooltip = await shownTooltip();
    await expect(tooltip).toHaveTextContent("Second file");
    // Placed below the link.
    await expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      second.getBoundingClientRect().bottom,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For anchors that cannot carry a `data-tooltip-id`: hover either link to see the tooltip below it; both are found by their class (`anchorSelect`). The selector is matched across the whole page.",
      },
      source: {
        code: `<Link className="file-link" data-tooltip-content="First file">
  First
</Link>
<Link className="file-link" data-tooltip-content="Second file">
  Second
</Link>
<Tooltip anchorSelect=".file-link" place="bottom" />`,
      },
    },
  },
};

const ClickableContentTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link data-tooltip-id="clickable-tooltip">Hover me</Link>
      </div>
      <Tooltip id="clickable-tooltip" clickable place="bottom">
        <Text fontSize="12px">
          Move the pointer here and <Link href="#">follow the link</Link>
        </Text>
      </Tooltip>
    </div>
  );
};

export const ClickableContent: Story = {
  render: () => <ClickableContentTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover me"));
    const tooltip = await shownTooltip();
    // Moving into the tooltip keeps it open, so its link can be reached.
    await userEvent.hover(tooltip);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(screen.getByRole("tooltip")).toBeVisible();
    await expect(screen.getByText("follow the link")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a tooltip with a link inside: hover the anchor, then move the pointer into the tooltip; it stays open, so the link can be clicked (`clickable`).",
      },
      source: {
        code: `<Link data-tooltip-id="clickable">Hover me</Link>
<Tooltip id="clickable" clickable place="bottom">
  <Text>
    Move the pointer here and <Link href="#">follow the link</Link>
  </Text>
</Tooltip>`,
      },
    },
  },
};

const DelayedAppearanceTemplate = () => {
  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <Link
          data-tooltip-id="delayed-tooltip"
          data-tooltip-content="Appears after one second"
        >
          Rest the pointer here
        </Link>
      </div>
      <Tooltip id="delayed-tooltip" delayShow={1000} />
    </div>
  );
};

export const DelayedAppearance: Story = {
  render: () => <DelayedAppearanceTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Rest the pointer here"));
    // Nothing during the first half second, the tooltip after the delay.
    await staysClosed(500);
    await expect(await shownTooltip({ timeout: 2000 })).toHaveTextContent(
      "Appears after one second",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For anchors the pointer often crosses on its way elsewhere: rest the pointer on the link for a second before the tooltip appears; passing over it shows nothing (`delayShow`).",
      },
      source: {
        code: `<Link data-tooltip-id="delayed" data-tooltip-content="Appears after one second">
  Rest the pointer here
</Link>
<Tooltip id="delayed" delayShow={1000} />`,
      },
    },
  },
};

const ControlledOpenTemplate = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ height: "240px" }}>
      <div style={{ ...bodyStyle, position: "absolute" as const }}>
        <span
          data-tooltip-id="controlled-tooltip"
          data-tooltip-content="Opened by the button, not by hover"
        >
          <Button
            label={open ? "Hide tooltip" : "Show tooltip"}
            size={ButtonSize.small}
            onClick={() => setOpen(!open)}
          />
        </span>
      </div>
      <Tooltip id="controlled-tooltip" place="right" isOpen={open} />
    </div>
  );
};

export const ControlledOpen: Story = {
  render: () => <ControlledOpenTemplate />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Show tooltip" });
    await userEvent.hover(button);
    await staysClosed();

    await userEvent.click(button);
    await expect(await shownTooltip()).toHaveTextContent(
      "Opened by the button, not by hover",
    );
    await expect(button).toHaveTextContent("Hide tooltip");
    await userEvent.click(button);
    await tooltipGone();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a tooltip the host decides to show, such as after a failed action: click the button to open the tooltip and again to close it; hovering no longer does either (`isOpen`).",
      },
      source: {
        code: `const [open, setOpen] = useState(false);

<span
  data-tooltip-id="controlled"
  data-tooltip-content="Opened by the button, not by hover"
>
  <Button
    label={open ? "Hide tooltip" : "Show tooltip"}
    onClick={() => setOpen(!open)}
  />
</span>
<Tooltip id="controlled" place="right" isOpen={open} />`,
      },
    },
  },
};

const OpenedFromCodeTemplate = () => {
  const tooltipRef = useRef<TooltipRefProps | null>(null);

  return (
    <div style={{ height: "240px" }}>
      <div
        style={{
          ...bodyStyle,
          position: "absolute" as const,
          display: "flex",
          gap: "12px",
        }}
      >
        <Button
          id="imperative-anchor"
          label="Open"
          size={ButtonSize.small}
          onClick={() =>
            tooltipRef.current?.open({
              anchorSelect: "#imperative-anchor",
              content: "Opened from code",
            })
          }
        />
        <Button
          label="Close"
          size={ButtonSize.small}
          onClick={() => tooltipRef.current?.close()}
        />
      </div>
      <Tooltip
        ref={tooltipRef}
        id="imperative-tooltip"
        place="bottom"
        imperativeModeOnly
      />
    </div>
  );
};

export const OpenedFromCode: Story = {
  render: () => <OpenedFromCodeTemplate />,
  play: async ({ canvas, userEvent }) => {
    const open = canvas.getByRole("button", { name: "Open" });
    await userEvent.hover(open);
    await staysClosed();

    await userEvent.click(open);
    const tooltip = await shownTooltip();
    await expect(tooltip).toHaveTextContent("Opened from code");
    await expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      open.getBoundingClientRect().bottom,
    );
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await tooltipGone();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a tooltip shown at a moment only the code knows: click **Open** to see the tooltip below it and **Close** to hide it; hovering either button shows nothing (`imperativeModeOnly` with `ref`).",
      },
      source: {
        code: `const tooltipRef = useRef<TooltipRefProps | null>(null);

<Button
  id="open"
  label="Open"
  onClick={() =>
    tooltipRef.current?.open({
      anchorSelect: "#open",
      content: "Opened from code",
    })
  }
/>
<Button label="Close" onClick={() => tooltipRef.current?.close()} />
<Tooltip ref={tooltipRef} id="imperative" place="bottom" imperativeModeOnly />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div style={{ height: "200px", position: "relative" }}>
      <div style={{ position: "absolute", top: 80, left: 100 }}>
        <Link
          data-tooltip-id="css-customization-tooltip"
          data-tooltip-content="Custom tooltip with a narrower width that wraps"
        >
          Hover to see custom tooltip
        </Link>
      </div>
      <Tooltip
        id="css-customization-tooltip"
        place="top"
        style={
          {
            "--tooltip-radius": "16px",
            "--tooltip-inner-padding": "12px 20px",
            "--tooltip-bg": "#1e1b4b",
            "--tooltip-color": "#e0e7ff",
            "--tooltip-shadow": "0 4px 16px rgba(0,0,0,0.4)",
            "--tooltip-text-size": "14px",
            "--tooltip-max-width-value": "180px",
            "--tooltip-layer": "1000",
          } as CSSProperties
        }
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover to see custom tooltip"));
    const tooltip = getComputedStyle(await shownTooltip());
    await expect(tooltip.backgroundColor).toBe("rgb(30, 27, 75)");
    await expect(tooltip.color).toBe("rgb(224, 231, 255)");
    await expect(tooltip.borderTopLeftRadius).toBe("16px");
    await expect(tooltip.maxWidth).toBe("180px");
    await expect(tooltip.fontSize).toBe("14px");
    await expect(tooltip.paddingLeft).toBe("20px");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one tooltip -- the variables are listed under CSS variables on this page. The tooltip renders in a portal outside the story's markup, so the variables go on its own \`style\` prop, which lands on the wrapper around it. Hover the link to see all of them at once; the stacking order has no visible effect here.`,
      },
      source: {
        code: `<Tooltip
  id="custom"
  style={{
    "--tooltip-radius": "16px",
    "--tooltip-inner-padding": "12px 20px",
    "--tooltip-bg": "#1e1b4b",
    "--tooltip-color": "#e0e7ff",
    "--tooltip-shadow": "0 4px 16px rgba(0,0,0,0.4)",
    "--tooltip-text-size": "14px",
    "--tooltip-max-width-value": "180px",
    "--tooltip-layer": "1000",
  }}
/>`,
      },
    },
  },
};
