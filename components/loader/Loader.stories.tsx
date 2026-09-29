import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loader } from ".";
import { LoaderTypes } from "./Loader.enums";
import { globalColors } from "../../providers/theme";

const meta = {
  title: "UI/Status components/Loader",
  component: Loader,
  parameters: {
    docs: {
      description: {
        component: `Loader component for displaying loading states and progress indicators with multiple animation types.

### Features

- **Four Animations**: Draws an oval spinner, two counter-rotating rings, three bouncing diamonds or a segmented spinning track, chosen with \`type\`
- **Text Fallback**: Renders \`label\` as a line of plain text, with no animation, when \`type\` is \`base\` or not set
- **Customizable Color**: Paints the oval and dual-ring strokes and the text fallback in any CSS colour, while the track and the diamonds keep their own colours
- **Flexible Sizing**: Sets width and height from one CSS length (px, rem or any other unit), and the font size of the text fallback
- **Primary Button Track**: Draws the track in the colour meant for a loader placed on a primary button
- **Disabled Track**: Dims the track to 60% opacity while the action it waits on is unavailable
- **CSS Customization**: Stroke colour, size, track colours and disabled opacity can be overridden with CSS variables

### Accessibility

The Loader marks the loading region and names the animation, and handles no keys:

- \`aria-busy="true"\` on the wrapper tells assistive technology that the region is still loading
- \`aria-label\` on the oval, dual-ring and track animations is set from \`label\`, so that is the name a screen reader announces; without \`label\` it reads the animation's built-in title ("oval", "dual ring", "track")
- The diamonds (\`rombs\`) ignore \`label\`, so give their container an accessible name yourself
- The text fallback is read as its plain text
- The wrapper is no live region, so wrap the loader in one (\`role="status"\`) if its appearance should be announced

### Usage

\`\`\`tsx
import { Loader, LoaderTypes } from "@onlyoffice/apps-ui-kit/components/loader";

// Oval loader
<Loader type={LoaderTypes.oval} size="40px" color="#333" />

// Rombs loader
<Loader type={LoaderTypes.rombs} size="65px" />

// Base text loader
<Loader type={LoaderTypes.base} label="Loading content..." />
\`\`\``,
      },
    },
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
        "Which animation to draw: `oval`, `dual-ring`, `rombs` or `track`; `base` or no value renders `label` as plain text instead",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    color: {
      control: "color",
      description:
        "Any CSS colour for the oval and dual-ring strokes and for the text of `base`; the track and the diamonds ignore it",
    },
    size: {
      control: "text",
      description:
        "Width and height of the animation as one CSS length (px, rem or any other unit); for `base`, the font size of the text",
      table: {
        defaultValue: { summary: "40px (20px for track)" },
      },
    },
    label: {
      control: "text",
      description:
        "Name a screen reader announces for the oval, dual-ring and track animations; for `base`, the text that is shown",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    primary: {
      control: "boolean",
      description:
        "Draws the track in the colour meant for a loader on a primary button, white by default; read by `track` only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Dims the track to 60% opacity; read by `track` only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class name of the wrapper around the animation",
    },
    id: {
      control: "text",
      description:
        "Id of the wrapper; the track also builds its gradient ids from it, so two tracks on one page need different ids",
    },
    style: {
      control: "object",
      description:
        "Inline styles of the wrapper, applied again to the text of `base`",
    },
    ref: {
      control: false,
      description:
        "Reference to the track's SVG element; the other types ignore it",
    },
  },
} satisfies Meta<typeof Loader>;

type Story = StoryObj<ComponentProps<typeof Loader>>;

export default meta;

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
  parameters: {
    docs: {
      description: {
        story:
          "A line of plain text instead of an animation, for a place where a moving spinner would distract: this is what you get with `type` set to `base` or left out, so pick an animation explicitly when you want one. Change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Oval spinner animation, commonly used for inline loading states.",
      },
      source: {
        code: `<Loader type={LoaderTypes.oval} size="40px" color={globalColors.loaderLight} />`,
      },
    },
  },
};

export const DualRing: Story = {
  render: (args) => <Loader {...args} />,
  args: {
    type: LoaderTypes.dualRing,
    size: "40px",
    color: "#333333",
    label: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story: "Dual ring animation with two concentric spinning rings.",
      },
      source: {
        code: `<Loader type={LoaderTypes.dualRing} size="40px" color="#333333" />`,
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
  parameters: {
    docs: {
      description: {
        story:
          "Rombs (diamond) animation, used as the main application loader.",
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
        <div style={{ position: "relative", width: "130px", height: "190px" }}>
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
  render: () => <AllTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of the text fallback (Base) and the four animations (Oval, DualRing, Rombs and Track), to choose the one that fits the space it waits in.",
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
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "DualRing loaders with different custom colors applied via the color prop.",
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
  render: () => <DifferentSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Oval loaders at three different sizes to demonstrate scalability.",
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
  render: (args) => (
    <div
      style={{
        display: "inline-flex",
        padding: "10px 24px",
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
  render: () => <DisabledStateTemplate />,
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--loader-stroke\` | Stroke colour of the oval and dual-ring animations; a \`color\` passed to the dual ring still wins over it | theme-based |
| \`--loader-size\` | Width and height of the oval, dual-ring and track animations when \`size\` is not set; the diamonds always set their own | \`40px\` (\`20px\` for the track) |
| \`--loader-track-base\` | Colour of the track | theme-based |
| \`--loader-track-primary\` | Colour of the track with \`primary\` set | \`#ffffff\` |
| \`--loader-opacity-disabled\` | Opacity of the track with \`isDisabled\` set | \`0.6\` |

The example shows, from left to right: an oval for \`--loader-stroke\` and \`--loader-size\`, which every instance picks up; a track for \`--loader-track-base\`; a track with \`primary\` for \`--loader-track-primary\`; and a track with \`isDisabled\` for \`--loader-opacity-disabled\`.`,
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
