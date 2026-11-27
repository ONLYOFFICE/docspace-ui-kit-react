import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, within } from "storybook/test";

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
        "Label of the previous-page button. Nothing here is translated, so pass the string already localised.",
    },
    nextLabel: {
      control: "text",
      description:
        "Label of the next-page button. Nothing here is translated, so pass the string already localised.",
    },
    disablePrevious: {
      control: "boolean",
      description:
        "Disables the previous button. The page selector is disabled only when `disableNext` is set as well.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableNext: {
      control: "boolean",
      description: "Disables the next button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    openDirection: {
      control: "select",
      options: ["bottom", "top", "both"],
      description:
        "Which way both drop-downs open; `both` lets each one choose by the room under it.",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    showCountItem: {
      control: "boolean",
      description: "Whether the per-page selector is rendered at all.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    pageItems: {
      control: false,
      description:
        "One `{ key, label }` per page. Typed as required, but passing nothing simply leaves the page selector out.",
    },
    countItems: {
      control: false,
      description:
        "One `{ key, label }` per page size. Typed as required, but passing nothing simply leaves the per-page selector out.",
    },
    selectedPageItem: {
      control: false,
      description:
        "The option the page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectPage`.",
    },
    selectedCountItem: {
      control: false,
      description:
        "The option the per-page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectCount`.",
    },
    previousAction: {
      description:
        "Called when the previous button is clicked. A promise it returns is not awaited: the component has no loading state of its own.",
    },
    nextAction: {
      description:
        "Called when the next button is clicked. A promise it returns is not awaited: the component has no loading state of its own.",
    },
    onSelectPage: {
      description:
        "Called with the option that was picked in the page selector. Nothing moves until you update `selectedPageItem` yourself.",
    },
    onSelectCount: {
      description:
        "Called with the option that was picked in the per-page selector. Nothing changes until you update `selectedCountItem` yourself.",
    },
    id: {
      control: "text",
      description: "Value of `id` on the outer element.",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own class on the outer element.",
    },
    style: {
      control: false,
      description:
        "Inline style of the outer element, and where the `--paging-*` custom properties go.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
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

type Canvas = {
  getByTestId: (id: string) => HTMLElement;
  queryByTestId: (id: string) => HTMLElement | null;
};

// The two buttons, and the button of each selector.
const previous = (canvas: Canvas) =>
  canvas.getByTestId("paging_previous_button");
const next = (canvas: Canvas) => canvas.getByTestId("paging_next_button");
const pageSelector = (canvas: Canvas) =>
  within(canvas.getByTestId("paging_page_items_combobox")).getByRole("button");
const countSelector = (canvas: Canvas) =>
  within(canvas.getByTestId("paging_count_items_combobox")).getByRole("button");

export const Default: Story = {
  name: "Full strip",
  play: async ({ args, canvas, userEvent }) => {
    await expect(pageSelector(canvas)).toHaveTextContent("1 of 200");

    await userEvent.click(next(canvas));
    await expect(args.nextAction).toHaveBeenCalledTimes(1);
    await expect(pageSelector(canvas)).toHaveTextContent("2 of 200");
    await userEvent.click(previous(canvas));
    await expect(pageSelector(canvas)).toHaveTextContent("1 of 200");

    // A page picked from the list.
    await userEvent.click(pageSelector(canvas));
    await userEvent.click(screen.getByRole("option", { name: "3 of 200" }));
    await expect(args.onSelectPage).toHaveBeenCalledWith(
      expect.objectContaining({ key: 3 }),
    );
    await expect(pageSelector(canvas)).toHaveTextContent("3 of 200");

    // A page size picked from the other list.
    await userEvent.click(countSelector(canvas));
    await userEvent.click(screen.getByRole("option", { name: "50 per page" }));
    await expect(args.onSelectCount).toHaveBeenCalledWith(
      expect.objectContaining({ key: 50 }),
    );
    await expect(countSelector(canvas)).toHaveTextContent("50 per page");
  },
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
          "The full strip under a list of 200 pages: Previous and Next, the page selector and the page-size selector. The story holds the current page and size itself, as your code must.",
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
  name: "First page",
  render: () => <DisabledPreviousTemplate />,
  play: async ({ canvas }) => {
    await expect(previous(canvas)).toBeDisabled();
    await expect(next(canvas)).toBeEnabled();
    // The page selector is disabled only when both buttons are.
    await expect(pageSelector(canvas)).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The first page: the Previous button is greyed out and ignores clicks (`disablePrevious`). The component does not work this out; you set it.",
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
  name: "Last page",
  render: () => <DisabledNextTemplate />,
  play: async ({ canvas }) => {
    await expect(next(canvas)).toBeDisabled();
    await expect(previous(canvas)).toBeEnabled();
  },
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
  name: "Without page size",
  render: () => <WithoutCountTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByTestId("paging_count_items_combobox"),
    ).toBeNull();
    await expect(
      canvas.getByTestId("paging_page_items_combobox"),
    ).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The two buttons and the page selector, without the page-size selector (`showCountItem={false}`). It suits a list whose page size is fixed.",
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
  name: "Single page",
  render: () => <SinglePageTemplate />,
  play: async ({ canvas }) => {
    await expect(previous(canvas)).toBeDisabled();
    await expect(next(canvas)).toBeDisabled();
    await expect(pageSelector(canvas)).toHaveAttribute("aria-disabled", "true");
    // The page size can still be changed.
    await expect(countSelector(canvas)).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A list that fits on one page: both buttons and the page selector are disabled (`disablePrevious` and `disableNext` together). The page size can still be changed.",
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
  name: "Buttons only",
  render: () => <ButtonsOnlyTemplate />,
  play: async ({ canvas }) => {
    await expect(previous(canvas)).toBeInTheDocument();
    await expect(next(canvas)).toBeInTheDocument();
    await expect(canvas.queryByTestId("paging_page_items_combobox")).toBeNull();
    await expect(
      canvas.queryByTestId("paging_count_items_combobox"),
    ).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Only the Previous and Next buttons, with `pageItems` and `countItems` left out. It suits a list whose length is not known.",
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
  name: "CSS variables",
  play: async ({ canvas }) => {
    await expect(previous(canvas)).toHaveStyle({
      maxWidth: "140px",
      fontSize: "14px",
      padding: "8px 32px",
    });
    await expect(next(canvas)).toHaveStyle({ maxWidth: "120px" });
    await expect(
      Math.round(
        canvas
          .getByTestId("paging_count_items_combobox")
          .getBoundingClientRect().width,
      ),
    ).toBe(160);
  },
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
        story: `Every overridable variable set on one wrapper, as listed under CSS variables. Both buttons get a higher width cap and the page-size selector is wider. Below 1024px the buttons are taller.`,
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
