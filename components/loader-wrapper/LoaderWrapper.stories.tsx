import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Heading, HeadingSize, Text } from "../";
import { LoaderWrapper } from ".";

const meta = {
  title: "UI/Status components/LoaderWrapper",
  component: LoaderWrapper,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
        story: `Both opacities and the transition set on one wrapper -- the variables are listed under CSS variables on this page. The first card is loading and shows \`--loader-wrapper-loading-opacity\`; the second is idle and shows \`--loader-wrapper-idle-opacity\`. \`--loader-wrapper-transition\` takes effect only when \`isLoading\` changes on an instance, which these two cards never do.`,
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
