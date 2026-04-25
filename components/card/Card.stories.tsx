// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import PeopleIcon from "../../assets/icons/16/people.react.svg";

import { Card } from "./Card";

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
import { Card } from "@docspace/ui-kit/components/card";

<Card
  title="Card title"
  extra={<span style={{ color: "#2db482" }}>✓ Connected</span>}
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
    extra: (
      <span style={{ color: "#2db482", fontSize: "12px", fontWeight: 600 }}>
        ✓ Connected
      </span>
    ),
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
      <span style={{ color: "#2db482", fontSize: "12px", fontWeight: 600 }}>
        ✓ Connected
      </span>
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
