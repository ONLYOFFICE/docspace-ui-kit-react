import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionButton } from ".";

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

const meta = {
  title: "UI/Interactive elements/ActionButton",
  component: ActionButton,
  parameters: {
    docs: {
      description: {
        component: `A lightweight polymorphic action button for a secondary action next to content, such as clearing a filter.

### Features

- **Polymorphic**: Renders as a \`button\` by default, or as an \`a\` or any React component passed in \`as\`, taking that element's props
- **Icon support**: Draws an optional leading icon at 12px, filled with the button's text colour
- **Label as content**: Renders the text from \`label\` and drops anything passed as children
- **Quiet look**: Accent text on a plain background, with no border
- **Hover and press feedback**: Changes the background on hover and again while pressed
- **Disabled state**: Fades to half opacity with a not-allowed cursor when a \`button\` gets \`disabled\`
- **Theme-aware colours**: Switches to dark colours under the dark theme
- **Forwarded props**: Passes every other prop, \`ref\` included, to the rendered element

### Accessibility

The default root is a native \`<button>\`, so its support comes from the platform:

- Focusable with Tab and activated by Enter and Space
- \`disabled\` removes it from the tab order and blocks clicks
- \`label\` is the accessible name; an icon-only button needs an \`aria-label\`
- With \`as="a"\` it is announced as a link and activated by Enter only

### Usage

\`\`\`tsx
import { ActionButton } from "@onlyoffice/apps-ui-kit/components/action-button";

<ActionButton label="Clear filter" onClick={handleClick} />

<ActionButton icon={<FilterIcon />} label="Clear filter" onClick={handleClick} />

<ActionButton as="a" href="/about" label="Go to page" />
\`\`\``,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text of the button; anything passed as children is dropped",
    },
    icon: {
      control: false,
      description:
        "Icon node drawn at 12px before the label and filled with the text colour",
    },
    as: {
      control: false,
      description:
        "Element or component to render instead of a button; its props are then accepted",
      table: {
        defaultValue: { summary: "button" },
      },
    },
    className: {
      control: "text",
      description:
        "Class applied to the rendered element after the component's own",
    },
    disabled: {
      control: "boolean",
      description:
        "Native button attribute: fades the button to half opacity and blocks clicks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: { action: "onClick" },
  },
  args: {
    label: "Clear filter",
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ActionButton {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The plain text button for a secondary action; click it to see \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ActionButton label="Clear filter" onClick={handleClick} />`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FilterIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "An icon before the label makes the action easier to spot in a busy toolbar; the icon takes the text colour (\`icon\`).",
      },
      source: {
        code: `<ActionButton icon={<FilterIcon />} label="Clear filter" />`,
      },
    },
  },
};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "#",
    label: "Go to page",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same look for an action that navigates: the button becomes a link and takes \`href\` (\`as\`).",
      },
      source: {
        code: `<ActionButton as="a" href="/about" label="Go to page" />`,
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    icon: <FilterIcon />,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "An action that is not available yet stays in place but fades and ignores clicks (\`disabled\`); it works only on the default \`button\`.",
      },
      source: {
        code: `<ActionButton icon={<FilterIcon />} label="Clear filter" disabled />`,
      },
    },
  },
};
