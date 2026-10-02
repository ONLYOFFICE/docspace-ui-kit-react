import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import FolderIcon from "../../assets/icons/16/catalog.folder.react.svg";

import { Card } from "./Card";
import styles from "./Card.module.scss";

const meta = {
  title: "UI/Data display/Card",
  component: Card,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "Content on the leading side of the header row, in bold. The header row is left out when both this and `extra` are unset",
      table: { type: { summary: "React.ReactNode" } },
    },
    extra: {
      control: "text",
      description:
        "Content on the trailing side of the header row, kept on one line at its natural width, such as a status or a badge",
      table: { type: { summary: "React.ReactNode" } },
    },
    children: {
      control: "text",
      description:
        "Body of the card, in smaller secondary text. Nothing is rendered for it when it is empty",
      table: { type: { summary: "React.ReactNode" } },
    },
    footer: {
      control: "text",
      description:
        "Content of a footer below the body, with no styling of its own beyond the card's 12px spacing",
      table: { type: { summary: "React.ReactNode" } },
    },
    className: {
      control: "text",
      description: "Class added after the component's own on the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: { defaultValue: { summary: '"card"' } },
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
      description: {
        story:
          "The common case: a heading over a short block of text (`title`, `children`). Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Card title="Card title">Card body content goes here.</Card>`,
      },
    },
  },
};

export const WithExtra: Story = {
  args: {
    title: "Backup storage",
    extra: <span className={styles.connectedStatus}>Connected</span>,
    children: "Copies of your documents are saved every night.",
  },
  parameters: {
    docs: {
      description: {
        story:
          'A short status belongs next to the heading: "Connected" sits on the trailing edge of the header row, on one line however long the title is (`extra`).',
      },
      source: {
        code: `<Card title="Backup storage" extra={<span>Connected</span>}>
  Copies of your documents are saved every night.
</Card>`,
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
      description: {
        story:
          "A heading alone labels a block that has no details yet; no empty body is left below it (`title` without `children`).",
      },
      source: {
        code: `<Card title="Title without body" />`,
      },
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
          "Text alone, for a note that needs no heading: with neither `title` nor `extra` set, the header row is left out and the text starts at the top of the card.",
      },
      source: {
        code: `<Card>Body content without a header row.</Card>`,
      },
    },
  },
};

const WithIconInTitleTemplate = () => (
  <Card
    title={
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FolderIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
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
          "An icon before the heading marks what the card is about; the card lays out nothing inside the title, so the icon and the text are wrapped in a flex span of the consumer's own (`title`).",
      },
      source: {
        code: `<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
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
        <FolderIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
        {"Backup storage"}
      </span>
    }
    extra={<span className={styles.connectedStatus}>Connected</span>}
    footer={<button type="button">Open settings</button>}
  >
    <p style={{ margin: 0 }}>
      {"Copies of your documents are saved every night and kept for 30 days."}
    </p>
  </Card>
);

export const FullExample: Story = {
  render: () => <FullExampleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'Every slot at once, for a block that states something and offers the next step: an icon and a heading (`title`), "Connected" on the trailing edge (`extra`), a paragraph (`children`) and an "Open settings" button below it (`footer`).',
      },
      source: {
        code: `<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
      Backup storage
    </span>
  }
  extra={<span>Connected</span>}
  footer={<button type="button">Open settings</button>}
>
  <p style={{ margin: 0 }}>
    Copies of your documents are saved every night and kept for 30 days.
  </p>
</Card>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => (
  <Card
    title="Custom colours"
    style={
      {
        "--info-block-background": "#e8f1fb",
        "--card-title-color": "#0b3d91",
        "--card-body-color": "#3a5a80",
      } as CSSProperties
    }
  >
    {"The background, the title and the body text use the values set here."}
  </Card>
);

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on the card itself -- the variables are listed under CSS variables on this page. They are set through the \`style\` prop, because a value on a wrapper never reaches the card.`,
      },
      source: {
        code: `<Card
  title="Custom colours"
  style={{
    "--info-block-background": "#e8f1fb",
    "--card-title-color": "#0b3d91",
    "--card-body-color": "#3a5a80",
  }}
>
  The background, the title and the body text use the values set here.
</Card>`,
      },
    },
  },
};
