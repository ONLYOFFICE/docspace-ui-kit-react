import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Paging } from "./Paging";
import type { PagingProps } from "./Paging.types";

const meta = {
  title: "UI/Navigation/Paging",
  component: Paging,
  parameters: {
    docs: {
      description: {
        component: `Paging provides page navigation controls with previous/next buttons and page/count selectors.

### Features

- **Previous/Next Buttons**: Navigate between pages with customizable labels
- **Page Selector**: Dropdown to jump to a specific page
- **Count Selector**: Dropdown to change items per page
- **Disabled States**: Independently disable previous or next buttons
- **Open Direction**: Control dropdown direction (top, bottom, or both)

### Usage

\`\`\`tsx
import { Paging } from "@docspace/ui-kit/components/paging";

<Paging
  previousLabel="Previous"
  nextLabel="Next"
  previousAction={handlePrev}
  nextAction={handleNext}
  pageItems={pageItems}
  countItems={countItems}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
  onSelectPage={handlePageSelect}
  onSelectCount={handleCountSelect}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    previousLabel: {
      control: "text",
      description: "Label for the previous button",
    },
    nextLabel: {
      control: "text",
      description: "Label for the next button",
    },
    disablePrevious: {
      control: "boolean",
      description: "Disables the previous button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableNext: {
      control: "boolean",
      description: "Disables the next button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    openDirection: {
      control: "select",
      options: ["bottom", "top", "both"],
      description: "Direction the dropdown menus open",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    showCountItem: {
      control: "boolean",
      description: "Shows the items-per-page selector",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof Paging>;

type Story = StoryObj<ComponentProps<typeof Paging>>;

export default meta;

const createPageItems = (count: number) => {
  const pageItems = [];
  for (let i = 1; i <= count; i += 1) {
    pageItems.push({
      key: i,
      label: `${i} of ${count}`,
    });
  }
  return pageItems;
};

const countItems = [
  { key: 25, label: "25 per page" },
  { key: 50, label: "50 per page" },
  { key: 100, label: "100 per page" },
];

const pageItems = createPageItems(200);

const Template = ({
  nextAction,
  previousAction,
  onSelectPage,
  onSelectCount,
  ...args
}: PagingProps) => {
  const [selectedPageItem, setSelectedPageItems] = useState(pageItems[0]);

  useEffect(() => {
    setSelectedPageItems(pageItems[0]);
  }, []);

  const onSelectPageNextHandler = () => {
    const currentPage = pageItems.filter(
      (item) => item.key === selectedPageItem.key + 1,
    );
    if (currentPage[0]) setSelectedPageItems(currentPage[0]);
  };

  const onSelectPagePrevHandler = () => {
    const currentPage = pageItems.filter(
      (item) => item.key === selectedPageItem.key - 1,
    );
    if (currentPage[0]) setSelectedPageItems(currentPage[0]);
  };

  return (
    <div style={{ height: "100%" }}>
      <Paging
        {...args}
        pageItems={pageItems}
        style={{ justifyContent: "center", alignItems: "center" }}
        countItems={countItems}
        previousAction={async () => {
          previousAction();
          onSelectPagePrevHandler();
        }}
        nextAction={async () => {
          onSelectPageNextHandler();
          nextAction();
        }}
        onSelectPage={(a) => onSelectPage?.(a)}
        onSelectCount={(a) => onSelectCount?.(a)}
        selectedPageItem={selectedPageItem}
        selectedCountItem={countItems[0]}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    previousLabel: "Previous",
    nextLabel: "Next",
    disablePrevious: false,
    disableNext: false,
    openDirection: "bottom",
    selectedCountItem: { key: 25, label: "25 per page" },
    selectedPageItem: { key: 1, label: "1 of 200" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default paging with previous/next buttons and page/count selectors. Navigate through 200 pages.",
      },
      source: {
        code: `<Paging
  previousLabel="Previous"
  nextLabel="Next"
  pageItems={pageItems}
  countItems={countItems}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
  previousAction={handlePrev}
  nextAction={handleNext}
/>`,
      },
    },
  },
};

const DisabledPreviousTemplate = () => {
  return (
    <Paging
      previousLabel="Previous"
      nextLabel="Next"
      disablePrevious
      pageItems={pageItems}
      countItems={countItems}
      selectedPageItem={pageItems[0]}
      selectedCountItem={countItems[0]}
      previousAction={async () => {}}
      nextAction={async () => {}}
      style={{ justifyContent: "center", alignItems: "center" }}
    />
  );
};

export const DisabledPrevious: Story = {
  render: () => <DisabledPreviousTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Paging with the previous button disabled. Typically used when on the first page.",
      },
      source: {
        code: `<Paging previousLabel="Previous" nextLabel="Next" disablePrevious />`,
      },
    },
  },
};

const DisabledNextTemplate = () => {
  return (
    <Paging
      previousLabel="Previous"
      nextLabel="Next"
      disableNext
      pageItems={pageItems}
      countItems={countItems}
      selectedPageItem={pageItems[pageItems.length - 1]}
      selectedCountItem={countItems[0]}
      previousAction={async () => {}}
      nextAction={async () => {}}
      style={{ justifyContent: "center", alignItems: "center" }}
    />
  );
};

export const DisabledNext: Story = {
  render: () => <DisabledNextTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Paging with the next button disabled. Typically used when on the last page.",
      },
      source: {
        code: `<Paging previousLabel="Previous" nextLabel="Next" disableNext />`,
      },
    },
  },
};

const WithoutCountTemplate = () => {
  return (
    <Paging
      previousLabel="Previous"
      nextLabel="Next"
      showCountItem={false}
      pageItems={pageItems}
      countItems={countItems}
      selectedPageItem={pageItems[0]}
      selectedCountItem={countItems[0]}
      previousAction={async () => {}}
      nextAction={async () => {}}
      style={{ justifyContent: "center", alignItems: "center" }}
    />
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--paging-gap": "16px",
          "--paging-button-gap": "12px",
          "--paging-font-size": "14px",
          "--paging-button-padding": "8px 32px",
        } as CSSProperties
      }
    >
      <Paging
        previousLabel="Previous"
        nextLabel="Next"
        disablePrevious={false}
        disableNext={false}
        openDirection="bottom"
        pageItems={createPageItems(10)}
        countItems={countItems}
        selectedCountItem={{ key: 25, label: "25 per page" }}
        selectedPageItem={{ key: 1, label: "1 of 10" }}
        previousAction={() => {}}
        nextAction={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--paging-gap\` | Gap between paging elements | \`8px\` |
| \`--paging-button-gap\` | Gap between prev/next buttons | \`8px\` |
| \`--paging-font-size\` | Font size of nav buttons | \`13px\` |
| \`--paging-button-padding\` | Padding of nav buttons | \`6px 28px\` |`,
      },
    },
  },
};

export const WithoutCountSelector: Story = {
  render: () => <WithoutCountTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Paging without the items-per-page selector. Only shows previous/next buttons and page selector.",
      },
      source: {
        code: `<Paging previousLabel="Previous" nextLabel="Next" showCountItem={false} />`,
      },
    },
  },
};
