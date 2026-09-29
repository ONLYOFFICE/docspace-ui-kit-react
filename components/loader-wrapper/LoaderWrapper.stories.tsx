import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Heading, HeadingSize, Text } from "../";
import { LoaderWrapper } from ".";

const meta = {
  title: "UI/Status components/LoaderWrapper",
  component: LoaderWrapper,
  parameters: {
    docs: {
      description: {
        component: `A wrapper component that dims its children and disables pointer events during loading states.

### Features

- **Dimmed Content**: Fades the children to half opacity while \`isLoading\` is set, keeping them on screen instead of hiding them
- **Pointer Lock**: Stops mouse clicks, hovers and wheel scrolling from reaching the children while loading
- **Keyboard Left Alone**: Keeps keyboard focus and key presses working inside the dimmed content, so controls that must not be used need their own disabled state
- **Smooth Transition**: Animates the fade in and out over 0.3 seconds
- **No Indicator Of Its Own**: Draws no spinner, overlay or text, so a loader or a skeleton has to be placed beside it
- **Mounted Children**: Keeps the children mounted while dimmed, so their state and effects survive the loading phase
- **Flex Column Layout**: Lays the children out in a column that grows to fill a flex parent and can shrink below its content height
- **Customizable Look**: Takes the dimmed opacity, the idle opacity and the transition from CSS variables

### Usage

\`\`\`tsx
import { LoaderWrapper } from "@onlyoffice/apps-ui-kit/components/loader-wrapper";

<LoaderWrapper isLoading={isLoading}>
  <SectionContent />
</LoaderWrapper>
\`\`\`

\`\`\`tsx
import { Loader } from "@onlyoffice/apps-ui-kit/components/loader";

<>
  {isSaving ? <Loader /> : null}
  <LoaderWrapper isLoading={isSaving}>
    <SettingsForm />
  </LoaderWrapper>
</>
\`\`\``,
      },
    },
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
      description:
        "The content that is dimmed and made unclickable while loading. It is laid out in a flex column",
    },
    isLoading: {
      control: "boolean",
      description:
        "Whether the content is busy: fades the content to half opacity and stops the mouse reaching it. Shows no spinner and does not block the keyboard",
    },
    testId: {
      control: "text",
      description: "Replaces the wrapper's `data-testid`",
      table: {
        defaultValue: { summary: "loader-wrapper" },
      },
    },
  },
} satisfies Meta<typeof LoaderWrapper>;

type Story = StoryObj<ComponentProps<typeof LoaderWrapper>>;

export default meta;

const cardContent = (
  <div
    style={{
      padding: "24px 32px",
      borderRadius: "16px",
      border: "1px solid var(--stroke-light, #e1e6eb)",
      background: "var(--background-surface, #fff)",
      minWidth: 320,
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <Heading size={HeadingSize.medium}>Lorem ipsum</Heading>
    <Text color="var(--text-secondary, #4f5d75)" lineHeight="22px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </Text>
    <Button primary label="Lorem ipsum" />
  </div>
);

export const Default: Story = {
  render: (args) => <LoaderWrapper {...args} />,
  args: {
    isLoading: false,
    children: cardContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content as it looks when nothing is loading: fully opaque and clickable. Switch `isLoading` in the Controls panel below to watch it fade and back.",
      },
      source: {
        code: `<LoaderWrapper isLoading={false}>
  <CardContent />
</LoaderWrapper>`,
      },
    },
  },
};

export const LoadingContent: Story = {
  render: (args) => <LoaderWrapper {...args} />,
  args: {
    isLoading: true,
    children: cardContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same card while loading: it stays on screen at half opacity so the reader keeps their place, and the button no longer answers the mouse (`isLoading`). Place a loader beside it to say why.",
      },
      source: {
        code: `<LoaderWrapper isLoading>
  <CardContent />
</LoaderWrapper>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--loader-wrapper-loading-opacity": "0.3",
          "--loader-wrapper-idle-opacity": "0.8",
          "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        } as CSSProperties
      }
    >
      <LoaderWrapper isLoading>{cardContent}</LoaderWrapper>
      <LoaderWrapper isLoading={false}>{cardContent}</LoaderWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--loader-wrapper-loading-opacity\` | Opacity when in loading state | \`0.5\` |
| \`--loader-wrapper-idle-opacity\` | Opacity when idle | \`1\` |
| \`--loader-wrapper-transition\` | CSS transition for opacity | \`opacity 0.3s ease-in-out\` |

The first card is loading and shows \`--loader-wrapper-loading-opacity\`; the second is idle and shows \`--loader-wrapper-idle-opacity\`. \`--loader-wrapper-transition\` takes effect only when \`isLoading\` changes on an instance, which these two cards never do.`,
      },
      source: {
        code: `<div
  style={{
    "--loader-wrapper-loading-opacity": "0.3",
    "--loader-wrapper-idle-opacity": "0.8",
    "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
  }}
>
  <LoaderWrapper isLoading>
    <CardContent />
  </LoaderWrapper>
  <LoaderWrapper isLoading={false}>
    <CardContent />
  </LoaderWrapper>
</div>`,
      },
    },
  },
};
