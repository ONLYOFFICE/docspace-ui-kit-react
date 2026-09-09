import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import PeopleIcon from "../../assets/icons/16/people.react.svg";

import { Card } from "./Card";
import styles from "./Card.module.scss";

const meta = {
  title: "UI/Data display/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `A generic layout card with optional header (title + extra) and body slots.
Inspired by Ant Design Card — all slots accept React nodes, no business logic inside.

### Features

- **title**: left side of the header (text, icon + text, any ReactNode)
- **extra**: right side of the header (badge, status, any ReactNode)
- **children**: body content (text, buttons, links, anything)
- Header row is hidden when both \`title\` and \`extra\` are undefined

### Usage

\`\`\`tsx
import { Card } from "@onlyoffice/apps-ui-kit/components/card";

<Card
  title="Card title"
  extra={<span className="card-connected-status">Connected</span>}
>
  Description text goes here.
</Card>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<ComponentProps<typeof Card>>;

export default meta;

export const Default: Story = {
  args: {
    title: "Card title",
    children: "Card body content goes here.",
  },
  parameters: {
    docs: {
      description: { story: "Basic card with title and body text." },
    },
  },
};

export const WithExtra: Story = {
  args: {
    title: "AI analysis is ready",
    extra: <span className={styles.connectedStatus}>Connected</span>,
    children: "Analyze data with Ask AI, create charts, and uncover insights.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card with a status badge in the extra slot — pushed to the right of the title.",
      },
    },
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Title without body",
  },
  parameters: {
    docs: {
      description: { story: "Card with only a title — body is omitted." },
    },
  },
};

export const BodyOnly: Story = {
  args: {
    children: "Body content without a header row.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card with only body content — header row is hidden when title and extra are both undefined.",
      },
    },
  },
};

const WithIconInTitleTemplate = () => (
  <Card
    title={
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PeopleIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
        {"Title with icon"}
      </span>
    }
  >
    {"Body text below the icon title."}
  </Card>
);

export const WithIconInTitle: Story = {
  render: () => <WithIconInTitleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon placed inside the title slot using a flex span — the card itself has no opinion about icon placement.",
      },
      source: {
        code: `<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <PeopleIcon style={{ width: 16, height: 16 }} />
      Title with icon
    </span>
  }
>
  Body text below the icon title.
</Card>`,
      },
    },
  },
};

const FullExampleTemplate = () => (
  <Card
    title={
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PeopleIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
        {"Analyze responses with AI"}
      </span>
    }
    extra={
      <span className={styles.connectedStatus}>Connected</span>
    }
  >
    <p style={{ margin: 0 }}>
      {"Ask AI to explore responses from this form, generate insights, and visualize the data."}
    </p>
    <div style={{ marginTop: "8px" }}>
      <button type="button">Ask AI</button>
    </div>
  </Card>
);

export const FullExample: Story = {
  render: () => <FullExampleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Full example: icon in title, status badge in extra, description text and action button in body — mirrors the FormRoomInfoBlocks use case.",
      },
    },
  },
};
