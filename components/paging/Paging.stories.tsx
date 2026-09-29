import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Paging } from "./Paging";
import type { PagingProps } from "./Paging.types";
import type { TOption } from "../combobox";

const meta = {
  title: "UI/Navigation/Paging",
  component: Paging,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    previousLabel: {
      control: "text",
      description:
        "Label of the previous-page button; nothing is translated, so pass the string already localised",
    },
    nextLabel: {
      control: "text",
      description:
        "Label of the next-page button; nothing is translated, so pass the string already localised",
    },
    disablePrevious: {
      control: "boolean",
      description:
        "Disables the previous button; the page selector is disabled too only when `disableNext` is set as well",
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
      description:
        "Side of the buttons both drop-downs open on: `bottom`, `top`, or `both` to open below and move above when a list does not fit there",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    showCountItem: {
      control: "boolean",
      description: "Whether the page-size selector is rendered at all",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    pageItems: {
      control: false,
      description:
        "One `{ key, label }` per page, listed in the page selector; passing nothing leaves the page selector out",
    },
    countItems: {
      control: false,
      description:
        "One `{ key, label }` per page size, listed in the page-size selector; passing nothing leaves that selector out",
    },
    selectedPageItem: {
      control: false,
      description:
        "The option the page selector shows; hold it in your own state and update it from `onSelectPage`",
    },
    selectedCountItem: {
      control: false,
      description:
        "The option the page-size selector shows; hold it in your own state and update it from `onSelectCount`",
    },
    previousAction: {
      description:
        "Called when the previous button is clicked; a returned promise is not awaited",
    },
    nextAction: {
      description:
        "Called when the next button is clicked; a returned promise is not awaited",
    },
    onSelectPage: {
      description:
        "Called with the option picked in the page selector; nothing moves until you update `selectedPageItem`",
    },
    onSelectCount: {
      description:
        "Called with the option picked in the page-size selector; nothing changes until you update `selectedCountItem`",
    },
    id: {
      control: "text",
      description: "Value of `id` on the outer element",
    },
    className: {
      control: "text",
      description: "Added after the component's own class on the outer element",
    },
    style: {
      control: false,
      description:
        "Inline style of the outer element, and where the `--paging-*` custom properties go",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: "paging" },
      },
    },
  },
  args: {
    previousAction: fn(),
    nextAction: fn(),
    onSelectPage: fn(),
    onSelectCount: fn(),
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
  const [selectedPageItem, setSelectedPageItem] = useState<TOption>(
    pageItems[0],
  );
  const [selectedCountItem, setSelectedCountItem] = useState<TOption>(
    countItems[0],
  );
  const index = pageItems.findIndex(
    (item) => item.key === selectedPageItem.key,
  );

  return (
    <div style={{ height: "100%" }}>
      <Paging
        {...args}
        pageItems={pageItems}
        style={{ justifyContent: "center", alignItems: "center" }}
        countItems={countItems}
        previousAction={(e) => {
          previousAction(e);
          if (pageItems[index - 1]) setSelectedPageItem(pageItems[index - 1]);
        }}
        nextAction={(e) => {
          nextAction(e);
          if (pageItems[index + 1]) setSelectedPageItem(pageItems[index + 1]);
        }}
        onSelectPage={(option) => {
          onSelectPage?.(option);
          setSelectedPageItem(option);
        }}
        onSelectCount={(option) => {
          onSelectCount?.(option);
          setSelectedCountItem(option);
        }}
        selectedPageItem={selectedPageItem}
        selectedCountItem={selectedCountItem}
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
  },
  parameters: {
    docs: {
      description: {
        story:
          "The full strip under a list of 200 pages: step with Previous and Next, jump from the page selector, or change the page size, and watch the calls in the Actions panel. The story holds the current page and size itself, as your code must; change any other prop live in the Controls panel below.",
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
          "On the first page there is nowhere to go back to, so the Previous button is greyed out and ignores clicks (`disablePrevious`); the component does not work this out, you set it.",
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
          "On the last page the Next button is greyed out and ignores clicks (`disableNext`), while the page selector stays open for jumping back.",
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

export const WithoutCountSelector: Story = {
  render: () => <WithoutCountTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a list whose page size is fixed, the page-size selector at the end is left out (`showCountItem={false}`), leaving the two buttons and the page selector.",
      },
      source: {
        code: `<Paging previousLabel="Previous" nextLabel="Next" showCountItem={false} />`,
      },
    },
  },
};

const SinglePageTemplate = () => {
  const singlePage = createPageItems(1);
  return (
    <Paging
      previousLabel="Previous"
      nextLabel="Next"
      disablePrevious
      disableNext
      pageItems={singlePage}
      countItems={countItems}
      selectedPageItem={singlePage[0]}
      selectedCountItem={countItems[0]}
      previousAction={() => {}}
      nextAction={() => {}}
      style={{ justifyContent: "center", alignItems: "center" }}
    />
  );
};

export const SinglePage: Story = {
  render: () => <SinglePageTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "When the whole list fits on one page, both buttons are greyed out and the page selector is disabled with them (`disablePrevious` and `disableNext` together), while the page size can still be changed.",
      },
      source: {
        code: `<Paging
  previousLabel="Previous"
  nextLabel="Next"
  disablePrevious
  disableNext
  pageItems={[{ key: 1, label: "1 of 1" }]}
  countItems={countItems}
  selectedPageItem={{ key: 1, label: "1 of 1" }}
  selectedCountItem={countItems[0]}
  previousAction={handlePrev}
  nextAction={handleNext}
/>`,
      },
    },
  },
};

const ButtonsOnlyTemplate = () => (
  <Paging
    previousLabel="Previous"
    nextLabel="Next"
    // The type requires both lists, but the component leaves out a selector whose list is missing.
    pageItems={undefined as unknown as TOption[]}
    countItems={undefined as unknown as TOption[]}
    selectedPageItem={pageItems[0]}
    selectedCountItem={countItems[0]}
    previousAction={() => {}}
    nextAction={() => {}}
    style={{ justifyContent: "center", alignItems: "center" }}
  />
);

export const ButtonsOnly: Story = {
  render: () => <ButtonsOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a list whose length is not known, only the Previous and Next buttons remain once neither list of options is passed (`pageItems` and `countItems` left out).",
      },
      source: {
        code: `<Paging
  previousLabel="Previous"
  nextLabel="Next"
  previousAction={handlePrev}
  nextAction={handleNext}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
/>`,
      },
    },
  },
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
          "--paging-prev-width": "140px",
          "--paging-next-width": "120px",
          "--paging-count-width": "160px",
          "--paging-nav-height": "48px",
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
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example raises the width cap of both buttons so their larger labels are not cut off, widens the page-size selector, and shows taller controls in a window narrower than 1024px.`,
      },
      source: {
        code: `<div
  style={{
    "--paging-gap": "16px",
    "--paging-button-gap": "12px",
    "--paging-font-size": "14px",
    "--paging-button-padding": "8px 32px",
    "--paging-prev-width": "140px",
    "--paging-next-width": "120px",
    "--paging-count-width": "160px",
    "--paging-nav-height": "48px",
  }}
>
  <Paging previousLabel="Previous" nextLabel="Next" {...props} />
</div>`,
      },
    },
  },
};
