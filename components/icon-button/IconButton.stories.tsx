import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CrossReactSvgUrl from "../../assets/icons/12/cross.react.svg?url";
import EyeReactSvgUrl from "../../assets/eye.react.svg?url";
import InfoReactSvgUrl from "../../assets/info.react.svg?url";
import MailReactSvgUrl from "../../assets/mail.react.svg?url";
import PersonReactSvgUrl from "../../assets/person.react.svg?url";
import CatalogPinReactSvgUrl from "../../assets/pin.react.svg?url";
import QuestionReactSvgUrl from "../../assets/question.react.svg?url";
import SearchReactSvgUrl from "../../assets/search.react.svg?url";
import SettingsReactSvgUrl from "../../assets/settings.react.svg?url";

import { IconButton } from ".";

const iconOptions = [
  SearchReactSvgUrl,
  EyeReactSvgUrl,
  InfoReactSvgUrl,
  MailReactSvgUrl,
  CatalogPinReactSvgUrl,
  CrossReactSvgUrl,
  PersonReactSvgUrl,
  QuestionReactSvgUrl,
  SettingsReactSvgUrl,
];

const meta = {
  title: "UI/Interactive elements/IconButton",
  component: IconButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    iconName: {
      control: "select",
      options: iconOptions,
      description:
        "URL of the icon, fetched at runtime and inlined as SVG. Ignored when `iconNode` is set",
    },
    iconHoverName: {
      control: "select",
      options: iconOptions,
      description:
        "URL of the icon shown while the pointer is over the button; ignored on touch devices",
    },
    iconClickName: {
      control: "select",
      options: iconOptions,
      description:
        "URL of the icon shown from the moment the button is pressed until the pointer leaves it; ignored on touch devices",
    },
    size: {
      control: { type: "number", min: 12, max: 50 },
      description:
        "Width and height of the button. A number is pixels; `extraSmall`, `small`, `medium` and `big` are 8, 12, 16 and 24px; `base`, `middle` and `large` are 15px; any other string is used as a CSS length",
      table: {
        defaultValue: { summary: "20" },
      },
    },
    color: {
      control: "color",
      description:
        "Colour of the icon: any CSS colour, `accent` for the theme accent, or a custom property name starting with `--`",
    },
    hoverColor: {
      control: "color",
      description:
        "Colour of the icon while the pointer is over the button; same forms as `color`",
    },
    clickColor: {
      control: "color",
      description:
        "Colour of the icon from the moment the button is pressed until the pointer leaves it; same forms as `color`",
    },
    isFill: {
      control: "boolean",
      description:
        "Colours the icon by filling its shapes; ignored when `isStroke` is on",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isStroke: {
      control: "boolean",
      description:
        "Colours the outlines of the icon's shapes and leaves their own fill as drawn",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Ignores every mouse handler and the icon and colour swaps, sets `aria-disabled` and shows the arrow cursor",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "onClick",
      description: "Called when the button is clicked, unless it is disabled",
    },
    isClickable: {
      control: "boolean",
      description:
        "Shows the pointer cursor without an `onClick`, for a button whose click is handled by an ancestor",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    iconNode: {
      control: false,
      description:
        "The icon as JSX, rendered inline in place of the icon at `iconName`",
    },
    title: {
      control: "text",
      description:
        "Tooltip text, shown by the application's shared tooltip; it never becomes a native `title` attribute",
    },
    tooltipId: {
      control: "text",
      description:
        "Id of a tooltip the button renders itself, next to the pointer on desktop; needs `tooltipContent`",
    },
    tooltipContent: {
      control: "text",
      description: "Text of that tooltip; does nothing without `tooltipId`",
    },
    dataTip: {
      control: "text",
      description:
        "Value of the legacy `data-tip` attribute; use `tooltipId` with `tooltipContent`, or `title`",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    onMouseEnter: {
      action: "onMouseEnter",
      description:
        "Called when the pointer enters the button, unless it is disabled",
    },
    onMouseLeave: {
      action: "onMouseLeave",
      description:
        "Called when the pointer leaves the button, unless it is disabled",
    },
    onMouseDown: {
      action: "onMouseDown",
      description:
        "Called when a mouse button is pressed, unless it is disabled",
    },
    onMouseUp: {
      action: "onMouseUp",
      description:
        "Called when the middle or right mouse button is released, never the left one; use `onClick` for that",
    },
    tabIndex: {
      control: "number",
      description:
        "Puts the button in the tab order; without it the keyboard cannot reach it",
    },
    onKeyDown: {
      action: "onKeyDown",
      description:
        "Called on a key press while the button has focus; Enter and Space do nothing unless it implements them",
    },
    id: {
      control: "text",
      description: "Id of the button element",
    },
    className: {
      control: "text",
      description: "Class added to the button element",
    },
    style: {
      control: "object",
      description:
        "Inline style of the button element, applied after the size and colour the component sets, so it overrides them",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the button",
      table: {
        defaultValue: { summary: '"icon-button"' },
      },
    },
  },
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<ComponentProps<typeof IconButton>>;

export default meta;

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
  render: (args) => <IconButton {...args} />,
  args: {
    size: 25,
    iconName: SearchReactSvgUrl,
    isFill: true,
    isDisabled: false,
  },
};

const WithHoverStateTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        iconHoverName={EyeReactSvgUrl}
        hoverColor="#333"
        isFill
      />
      <IconButton
        size={25}
        iconName={MailReactSvgUrl}
        iconHoverName={InfoReactSvgUrl}
        hoverColor="#2DA7DB"
        isFill
      />
    </Wrapper>
  );
};

export const WithHoverState: Story = {
  render: () => <WithHoverStateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the buttons to see the alternate icon and colour, a cue that the button reacts before it is clicked (`iconHoverName`, `hoverColor`).",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} iconHoverName={EyeIcon} hoverColor="#333" isFill />
<IconButton size={25} iconName={MailIcon} iconHoverName={InfoIcon} hoverColor="#2DA7DB" isFill />`,
      },
    },
  },
};

const WithClickStateTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        iconClickName={InfoReactSvgUrl}
        clickColor="green"
        isFill
      />
    </Wrapper>
  );
};

export const WithClickState: Story = {
  render: () => <WithClickStateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Press and hold the button to see the alternate icon and colour that confirm the press (`iconClickName`, `clickColor`); they stay until the pointer leaves the button.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} iconClickName={InfoIcon} clickColor="green" isFill />`,
      },
    },
  },
};

const SizesTemplate = () => {
  const sizes = [16, 20, 25, 32, 40];
  return (
    <Wrapper>
      {sizes.map((size) => (
        <IconButton
          key={size}
          size={size}
          iconName={SearchReactSvgUrl}
          isFill
        />
      ))}
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon buttons at 16, 20, 25, 32 and 40px, so a size can be picked to match the surrounding text or row height (`size`).",
      },
      source: {
        code: `<IconButton size={16} iconName={SearchIcon} isFill />
<IconButton size={20} iconName={SearchIcon} isFill />
<IconButton size={25} iconName={SearchIcon} isFill />
<IconButton size={32} iconName={SearchIcon} isFill />
<IconButton size={40} iconName={SearchIcon} isFill />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <IconButton size={25} iconName={SearchReactSvgUrl} isFill isDisabled />
      <IconButton size={25} iconName={SettingsReactSvgUrl} isFill isDisabled />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled icon buttons ignore clicks and hover and keep their default icon and colour (`isDisabled`). They look the same as enabled ones apart from the arrow cursor, so pair them with a visible reason when the difference matters.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} isFill isDisabled />
<IconButton size={25} iconName={SettingsIcon} isFill isDisabled />`,
      },
    },
  },
};

const WithStrokeTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        isStroke
        isFill={false}
      />
      <IconButton
        size={25}
        iconName={SettingsReactSvgUrl}
        isStroke
        isFill={false}
      />
    </Wrapper>
  );
};

export const WithStroke: Story = {
  render: () => <WithStrokeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Stroke mode colours the outlines of the icon's shapes and leaves their own fill as drawn, which suits outline icons (`isStroke`). The two filled icons here show that: each keeps its fill and gains a grey outline.",
      },
      source: {
        code: `<IconButton size={25} iconName={SearchIcon} isStroke isFill={false} />
<IconButton size={25} iconName={SettingsIcon} isStroke isFill={false} />`,
      },
    },
  },
};

const WithCustomNodeTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        isFill
        iconNode={
          <div
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(135deg, rgba(106,17,203,1) 0%, rgba(37,117,252,1) 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}
            title="Custom node"
          >
            IC
          </div>
        }
      />
    </Wrapper>
  );
};

export const WithCustomNode: Story = {
  render: () => <WithCustomNodeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A square of initials in place of an SVG icon: any React node can be the icon, rendered inline with no network request (`iconNode`).",
      },
      source: {
        code: `<IconButton
  size={25}
  iconName={SearchIcon}
  isFill
  iconNode={<div style={{ ... }}>IC</div>}
/>`,
      },
    },
  },
};

const WithTooltipTemplate = () => {
  return (
    <Wrapper>
      <IconButton
        size={25}
        iconName={SearchReactSvgUrl}
        tooltipId="icon-button-tooltip"
        tooltipContent="Search"
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const WithTooltip: Story = {
  render: () => <WithTooltipTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the button to read what it does: an icon alone rarely says so, and the button renders this tooltip itself, next to the pointer (`tooltipId`, `tooltipContent`).",
      },
      source: {
        code: `<IconButton
  size={25}
  iconName={SearchIcon}
  tooltipId="icon-button-tooltip"
  tooltipContent="Search"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <IconButton
      iconName={SearchReactSvgUrl}
      isFill
      onClick={() => {}}
      style={
        {
          "--icon-button-color": "#9C27B0",
          "--icon-button-hover-color": "#4A148C",
          "--icon-button-size": "32px",
        } as CSSProperties
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page; here all three are set through the \`style\` prop, because a value set on a wrapper never arrives. Hover the button to see the hover colour.`,
      },
      source: {
        code: `<IconButton
  iconName={SearchIcon}
  isFill
  onClick={handleClick}
  style={{
    "--icon-button-color": "#9C27B0",
    "--icon-button-hover-color": "#4A148C",
    "--icon-button-size": "32px",
  }}
/>`,
      },
    },
  },
};
