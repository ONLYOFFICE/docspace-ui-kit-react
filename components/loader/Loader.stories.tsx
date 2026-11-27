import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, waitFor } from "storybook/test";

import { Loader } from ".";
import { LoaderTypes } from "./Loader.enums";
import { globalColors } from "../../providers/theme";

const meta = {
  title: "UI/Status components/Loader",
  component: Loader,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=419-1989&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(LoaderTypes),
      description:
        "Which animation to render: `oval`, `dualRing`, `rombs` or `track`. Without it the loader is an `oval`. `base` is not an animation: it renders `label` as plain text and nothing else.",
      table: {
        defaultValue: { summary: "oval" },
      },
    },
    color: {
      control: "color",
      description:
        "Any CSS colour, applied as the stroke of the animation and the colour of the `base` type's text.",
    },
    size: {
      control: "text",
      description:
        "Size of the animation as a CSS length, applied to both axes. The stylesheet falls back to 40px for most types and 20px for `track`. For the `base` type this is the font size of the text instead.",
      table: {
        defaultValue: { summary: "40px (20px for track)" },
      },
    },
    label: {
      control: "text",
      description:
        'What assistive technology reads: the visually hidden text of the loader\'s `role="status"` region, under the decorative animation. For the `base` type it is the visible content instead. Defaults to the translated `Common:LoadingProcessing` ("Loading...").',
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    primary: {
      control: "boolean",
      description:
        "Uses the primary button's track colour, for a loader drawn on top of a primary button. Read by the `track` type only.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Dims the animation to the disabled opacity. Read by the `track` type only.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description:
        "Applied to the wrapper around the animation, not to the animation.",
    },
    id: {
      control: "text",
      description: "Applied to the wrapper.",
    },
    style: {
      control: "object",
      description:
        "Applied to the wrapper, and again to the inner span of the `base` type.",
    },
    ref: {
      control: false,
      description:
        "Reaches the `<svg>` of the `track` type; the other types ignore it.",
    },
  },
} satisfies Meta<typeof Loader>;

type Story = StoryObj<ComponentProps<typeof Loader>>;

export default meta;

const widthOf = (el: Element) => Math.round(el.getBoundingClientRect().width);

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

const LabeledItem = (props: { label: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        minWidth: "100px",
        textAlign: "center",
      }}
    >
      {props.children}
      <span style={{ fontSize: "12px", color: "#666" }}>{props.label}</span>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.base,
    size: "18px",
    label: "Loading content, please wait...",
  },
  play: async ({ canvas }) => {
    // base renders the label as text at `size`, inside a status region.
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(
        "Loading content, please wait...",
      ),
    );
    const text = canvas.getByText("Loading content, please wait...");
    await expect(getComputedStyle(text).fontSize).toBe("18px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A line of plain text instead of an animation (`type` set to `base`), for a place where a spinner would distract. Without `type` the loader draws the oval.",
      },
      source: {
        code: `<Loader type={LoaderTypes.base} size="18px" label="Loading content, please wait..." />`,
      },
    },
  },
};

export const Oval: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.oval,
    size: "40px",
    color: globalColors.loaderLight,
    label: "Loading...",
  },
  play: async ({ canvas }) => {
    // The animation is decorative; the label is the status region's text.
    const oval = canvas.getByTestId("oval-loader");
    await expect(oval).toHaveAttribute("aria-hidden", "true");
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Loading..."),
    );
    await expect(widthOf(oval)).toBe(40);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The oval: a ring with one spinning arc, for inline loading states.",
      },
      source: {
        code: `<Loader type={LoaderTypes.oval} size="40px" color={globalColors.loaderLight} />`,
      },
    },
  },
};

export const DualRing: Story = {
  name: "Dual ring",
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.dualRing,
    size: "40px",
    label: "Loading...",
  },
  play: async ({ canvas }) => {
    // No built-in "dual ring" title: the label is what is read.
    const ring = canvas.getByTestId("dual-ring-loader");
    await expect(ring).toHaveAttribute("aria-hidden", "true");
    await expect(ring.querySelector("title")).toBeNull();
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Loading..."),
    );
    await expect(widthOf(ring)).toBe(40);
  },
  parameters: {
    docs: {
      description: {
        story: "Dual ring animation with two concentric spinning rings.",
      },
      source: {
        code: `<Loader type={LoaderTypes.dualRing} size="40px" />`,
      },
    },
  },
};

export const Rombs: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "150px",
        minWidth: "150px",
        padding: "20px",
      }}
    >
      <Loader {...args} />
    </div>
  ),
  args: {
    type: LoaderTypes.rombs,
    size: "65px",
    label: "Loading...",
  },
  play: async ({ canvas }) => {
    // Three decorative diamonds; the label is read like any other type's.
    const rombs = canvas.getByTestId("rombs-loader");
    await expect(rombs).toHaveAttribute("aria-hidden", "true");
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Loading..."),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The rombs: three diamonds that bounce in turn, the application loader's animation.",
      },
      source: {
        code: `<Loader type={LoaderTypes.rombs} size="65px" />`,
      },
    },
  },
};

export const Track: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.track,
    size: "30px",
    label: "Loading...",
  },
  play: async ({ canvas }) => {
    const track = canvas.getByTestId("track-loader");
    await expect(track).toHaveAttribute("aria-hidden", "true");
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Loading..."),
    );
    await expect(widthOf(track)).toBe(30);
  },
  parameters: {
    docs: {
      description: {
        story: "Track animation for compact loading indicators.",
      },
      source: {
        code: `<Loader type={LoaderTypes.track} size="30px" />`,
      },
    },
  },
};

const AllTypesTemplate = () => {
  return (
    <Wrapper>
      <LabeledItem label="Base">
        <Loader type={LoaderTypes.base} size="18px" label="Base loader" />
      </LabeledItem>
      <LabeledItem label="Oval">
        <Loader
          type={LoaderTypes.oval}
          size="40px"
          color={globalColors.loaderLight}
          label="Oval loader"
        />
      </LabeledItem>
      <LabeledItem label="Dual Ring">
        <Loader
          type={LoaderTypes.dualRing}
          size="40px"
          label="Dual ring loader"
        />
      </LabeledItem>
      <LabeledItem label="Rombs">
        {/* The diamonds are positioned absolutely and bounce by 120px */}
        <div
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: "130px",
            height: "190px",
            paddingInlineStart: "33px",
          }}
        >
          <Loader type={LoaderTypes.rombs} size="65px" label="Rombs loader" />
        </div>
      </LabeledItem>
      <LabeledItem label="Track">
        <Loader type={LoaderTypes.track} size="30px" label="Track loader" />
      </LabeledItem>
    </Wrapper>
  );
};

export const AllTypes: Story = {
  name: "All types",
  render: () => <AllTypesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByTestId("loader")).toHaveLength(5);
    for (const id of [
      "oval-loader",
      "dual-ring-loader",
      "rombs-loader",
      "track-loader",
    ]) {
      await expect(canvas.getByTestId(id)).toBeInTheDocument();
    }
    await expect(canvas.getByText("Base loader")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The text fallback (Base) beside the four animations: Oval, DualRing, Rombs and Track.",
      },
      source: {
        code: `<Loader type={LoaderTypes.base} size="18px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.dualRing} size="40px" />
<Loader type={LoaderTypes.rombs} size="65px" />
<Loader type={LoaderTypes.track} size="30px" />`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <Loader
        type={LoaderTypes.dualRing}
        color="#FF5722"
        size="40px"
        label="Orange loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#2196F3"
        size="40px"
        label="Blue loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#4CAF50"
        size="40px"
        label="Green loader"
      />
      <Loader
        type={LoaderTypes.dualRing}
        color="#9C27B0"
        size="40px"
        label="Purple loader"
      />
    </Wrapper>
  );
};

export const CustomColors: Story = {
  name: "Custom colours",
  render: () => <CustomColorsTemplate />,
  play: async ({ canvas }) => {
    // color reaches the ring strokes.
    const [orange] = canvas.getAllByTestId("dual-ring-loader");
    const stroked = orange.querySelector("[stroke]") as Element;
    await expect(getComputedStyle(stroked).stroke).toBe("rgb(255, 87, 34)");
  },
  parameters: {
    docs: {
      description: {
        story: "Dual rings in four colours of their own (`color`).",
      },
      source: {
        code: `<Loader type={LoaderTypes.dualRing} color="#FF5722" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#2196F3" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#4CAF50" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#9C27B0" size="40px" />`,
      },
    },
  },
};

const DifferentSizesTemplate = () => {
  return (
    <Wrapper>
      <LabeledItem label="24px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="24px"
          label="Small loader"
        />
      </LabeledItem>
      <LabeledItem label="40px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="40px"
          label="Medium loader"
        />
      </LabeledItem>
      <LabeledItem label="60px">
        <Loader
          type={LoaderTypes.oval}
          color={globalColors.loaderLight}
          size="60px"
          label="Large loader"
        />
      </LabeledItem>
    </Wrapper>
  );
};

export const DifferentSizes: Story = {
  name: "Sizes",
  render: () => <DifferentSizesTemplate />,
  play: async ({ canvas }) => {
    const widths = canvas.getAllByTestId("oval-loader").map(widthOf);
    await expect(widths).toEqual([24, 40, 60]);
  },
  parameters: {
    docs: {
      description: {
        story: "Ovals at 24px, 40px and 60px (`size`).",
      },
      source: {
        code: `<Loader type={LoaderTypes.oval} size="24px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.oval} size="60px" />`,
      },
    },
  },
};

export const OnPrimaryButton: Story = {
  name: "On a primary button",
  render: (args) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        minWidth: "100px",
        height: "32px",
        padding: "0 28px",
        lineHeight: 0,
        borderRadius: "3px",
        background: "var(--color-scheme-main-buttons)",
      }}
    >
      <Loader {...args} />
    </div>
  ),
  args: {
    type: LoaderTypes.track,
    size: "20px",
    primary: true,
    id: "primary-track",
    label: "Saving",
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Saving"),
    );
    await expect(canvas.getByTestId("loader")).toHaveAttribute(
      "id",
      "primary-track",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A white track on the accent background of a primary button, where the default accent-coloured track would disappear (`primary`).",
      },
      source: {
        code: `<Loader type={LoaderTypes.track} size="20px" primary id="primary-track" label="Saving" />`,
      },
    },
  },
};

const DisabledStateTemplate = () => {
  return (
    <Wrapper>
      <LabeledItem label="Enabled">
        <Loader
          type={LoaderTypes.track}
          size="30px"
          id="enabled-track"
          label="Loading"
        />
      </LabeledItem>
      <LabeledItem label="Disabled">
        <Loader
          type={LoaderTypes.track}
          size="30px"
          id="disabled-track"
          isDisabled
          label="Loading"
        />
      </LabeledItem>
    </Wrapper>
  );
};

export const DisabledState: Story = {
  name: "Disabled",
  render: () => <DisabledStateTemplate />,
  play: async ({ canvas }) => {
    // The disabled track is dimmed to 60%.
    const [enabled, disabled] = canvas.getAllByTestId("track-loader");
    await expect(getComputedStyle(enabled).opacity).toBe("1");
    await expect(getComputedStyle(disabled).opacity).toBe("0.6");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The track dimmed beside a normal one, for a loader inside a control that is currently unavailable (`isDisabled`, read by the track only).",
      },
      source: {
        code: `<Loader type={LoaderTypes.track} size="30px" id="enabled-track" />
<Loader type={LoaderTypes.track} size="30px" id="disabled-track" isDisabled />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "40px",
          alignItems: "center",
          "--loader-stroke": "#7c3aed",
          "--loader-size": "50px",
          "--loader-track-base": "#0f766e",
          "--loader-track-primary": "#b45309",
          "--loader-opacity-disabled": "0.25",
        } as CSSProperties
      }
    >
      <Loader type={LoaderTypes.oval} label="Custom loader" />
      <Loader type={LoaderTypes.track} id="css-track" label="Custom track" />
      <Loader
        type={LoaderTypes.track}
        id="css-track-primary"
        primary
        label="Custom primary track"
      />
      <Loader
        type={LoaderTypes.track}
        id="css-track-disabled"
        isDisabled
        label="Custom disabled track"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    // --loader-size reaches every instance without a size of its own.
    await expect(widthOf(canvas.getByTestId("oval-loader"))).toBe(50);
    const disabled = within(canvas.getAllByTestId("loader")[3]).getByTestId(
      "track-loader",
    );
    await expect(getComputedStyle(disabled).opacity).toBe("0.25");
  },
  parameters: {
    docs: {
      description: {
        story: `Four loaders under a wrapper that sets every variable:

- an oval, for \`--loader-stroke\` and \`--loader-size\`
- a track, for \`--loader-track-base\`
- a track with \`primary\`, for \`--loader-track-primary\`
- a track with \`isDisabled\`, for \`--loader-opacity-disabled\``,
      },
      source: {
        code: `<div style={{
  "--loader-stroke": "#7c3aed",
  "--loader-size": "50px",
  "--loader-track-base": "#0f766e",
  "--loader-track-primary": "#b45309",
  "--loader-opacity-disabled": "0.25",
}}>
  <Loader type={LoaderTypes.oval} />
  <Loader type={LoaderTypes.track} id="css-track" />
  <Loader type={LoaderTypes.track} id="css-track-primary" primary />
  <Loader type={LoaderTypes.track} id="css-track-disabled" isDisabled />
</div>`,
      },
    },
  },
};
