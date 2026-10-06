import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { LoadingButton } from ".";

const meta = {
  title: "UI/Feedback/LoadingButton",
  component: LoadingButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    id: {
      control: false,
      description:
        "Ignored: nothing reads this prop, and the element carries no `id`",
    },
    className: {
      control: false,
      description:
        "Ignored: nothing reads this prop; style the ring through the CSS custom properties",
    },
    style: {
      control: false,
      description: "Ignored: nothing reads this prop",
    },
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description:
        "How much of the ring is filled, 0-100; at 0 a half ring spins instead of showing an arc",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    inConversion: {
      control: "boolean",
      description:
        "Whether the cross in the middle is dropped, leaving the ring on its own",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether the ring and the cross are drawn in the theme's grey instead of the accent colour, with the cross changing colour on hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    loaderColor: {
      control: "color",
      description:
        "CSS colour of the ring and of the cross; overrides the accent colour",
    },
    backgroundColor: {
      control: "color",
      description: "CSS colour of the disc behind the cross",
    },
    onClick: {
      action: "onClick",
      description:
        "Called with no arguments when anything inside the 16px square is clicked, including the cross",
    },
  },
} satisfies Meta<typeof LoadingButton>;

type Story = StoryObj<ComponentProps<typeof LoadingButton>>;

export default meta;

const ringsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      "[data-testid='loading-button-container']",
    ),
  );

// The progress is handed to the stylesheet as a custom property.
const percentOf = (container: HTMLElement) =>
  (container.firstElementChild as HTMLElement).style.getPropertyValue(
    "--loading-button-percent",
  );

// The cross is the only SVG inside a ring.
const hasCross = (container: HTMLElement) =>
  container.querySelector("svg") !== null;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <LoadingButton {...args} />,
  args: {
    percent: 0,
    inConversion: false,
    isDefaultMode: false,
    onClick: fn(),
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const [ring] = ringsOf(canvasElement);
    await expect(percentOf(ring)).toBe("0");
    await expect(hasCross(ring)).toBe(true);
    // A click anywhere in the square, the cross included, cancels.
    await userEvent.click(canvas.getByTestId("loading-button-container"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The ring as it first appears, before any progress is known: at the default `percent` of 0 a half ring spins. Change the percentage, drop the cross or pick colours live in the Controls panel below.",
      },
      source: {
        code: `<LoadingButton percent={0} onClick={() => cancelUpload()} />`,
      },
    },
  },
};

const ProgressStagesTemplate = () => {
  const stages = [0, 25, 50, 75, 100];
  return (
    <Wrapper>
      {stages.map((percent) => (
        <div
          key={percent}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LoadingButton percent={percent} />
          <span style={{ fontSize: "11px", color: "#666" }}>{percent}%</span>
        </div>
      ))}
    </Wrapper>
  );
};

export const ProgressStages: Story = {
  render: () => <ProgressStagesTemplate />,
  play: async ({ canvasElement }) => {
    await expect(ringsOf(canvasElement).map(percentOf)).toEqual([
      "0",
      "25",
      "50",
      "75",
      "100",
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five rings labelled with their `percent`, to show how far the arc reaches at each stage: at 0% a half ring spins, the look for an operation whose size is not known yet, and from 25% on the arc grows clockwise until it closes at 100%.",
      },
      source: {
        code: `<LoadingButton percent={0} />
<LoadingButton percent={25} />
<LoadingButton percent={50} />
<LoadingButton percent={75} />
<LoadingButton percent={100} />`,
      },
    },
  },
};

const InConversionTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={0} inConversion />
      <LoadingButton percent={50} inConversion />
      <LoadingButton percent={100} inConversion />
    </Wrapper>
  );
};

export const InConversion: Story = {
  render: () => <InConversionTemplate />,
  play: async ({ canvasElement }) => {
    // inConversion drops the cross from every ring.
    const rings = ringsOf(canvasElement);
    await expect(rings).toHaveLength(3);
    await expect(rings.some(hasCross)).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same rings with no cross in the middle (`inConversion`), for a marker that shows progress and nothing else: at 0% the ring spins, at 50% it is half filled, at 100% it is closed.",
      },
      source: {
        code: `<LoadingButton percent={0} inConversion />
<LoadingButton percent={50} inConversion />
<LoadingButton percent={100} inConversion />`,
      },
    },
  },
};

const DefaultModeTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={45} isDefaultMode />
    </Wrapper>
  );
};

export const DefaultMode: Story = {
  render: () => <DefaultModeTemplate />,
  play: async ({ canvasElement }) => {
    const [ring] = ringsOf(canvasElement);
    await expect(ring.className).toMatch(/defaultMode/);
    await expect(percentOf(ring)).toBe("45");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The ring and the cross in the theme's grey instead of the accent colour (`isDefaultMode`), for an item that is waiting rather than running. Hover the ring to see the cross change colour.",
      },
      source: {
        code: `<LoadingButton percent={45} isDefaultMode />`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <LoadingButton percent={60} loaderColor="#2DA7DB" />
      <LoadingButton percent={60} loaderColor="#4CAF50" />
      <LoadingButton percent={60} loaderColor="#FF5722" />
      <LoadingButton
        percent={60}
        loaderColor="#FF5722"
        backgroundColor="#FFE0D6"
      />
    </Wrapper>
  );
};

export const CustomColors: Story = {
  render: () => <CustomColorsTemplate />,
  play: async ({ canvasElement }) => {
    // loaderColor is handed to the ring as --circle-fill-color.
    const colors = ringsOf(canvasElement).map((ring) =>
      ring.style.getPropertyValue("--circle-fill-color"),
    );
    await expect(colors).toEqual(["#2DA7DB", "#4CAF50", "#FF5722", "#FF5722"]);
    // backgroundColor tints the disc behind the cross.
    const disc = ringsOf(canvasElement)[3].querySelector(
      ".loading-button",
    ) as HTMLElement;
    await expect(getComputedStyle(disc).backgroundColor).toBe(
      "rgb(255, 224, 214)",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Colours set per instance, for a ring that has to match its surroundings rather than the theme: the first three change the ring and the cross (`loaderColor`), the last also tints the disc behind the cross (`backgroundColor`).",
      },
      source: {
        code: `<LoadingButton percent={60} loaderColor="#2DA7DB" />
<LoadingButton percent={60} loaderColor="#4CAF50" />
<LoadingButton percent={60} loaderColor="#FF5722" />
<LoadingButton percent={60} loaderColor="#FF5722" backgroundColor="#FFE0D6" />`,
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
          gap: "16px",
          alignItems: "center",
          "--loading-button-accent": "#7c3aed",
          "--loading-button-idle": "#a78bfa",
          "--loading-button-hover-fill": "#4c1d95",
          "--loading-button-custom-bg": "#ede9fe",
        } as CSSProperties
      }
    >
      <LoadingButton percent={60} />
      <LoadingButton percent={30} isDefaultMode />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const disc = ringsOf(canvasElement)[0].querySelector(
      ".loading-button",
    ) as HTMLElement;
    await expect(getComputedStyle(disc).backgroundColor).toBe(
      "rgb(237, 233, 254)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first ring shows the accent and the disc colours; the second sets \`isDefaultMode\` to show the idle colour, and hovering it shows the hover colour.`,
      },
      source: {
        code: `<div
  style={{
    "--loading-button-accent": "#7c3aed",
    "--loading-button-idle": "#a78bfa",
    "--loading-button-hover-fill": "#4c1d95",
    "--loading-button-custom-bg": "#ede9fe",
  }}
>
  <LoadingButton percent={60} />
  <LoadingButton percent={30} isDefaultMode />
</div>`,
      },
    },
  },
};
