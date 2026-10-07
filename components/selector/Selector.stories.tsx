// @ts-nocheck

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import type { SelectorProps, TSelectorItem } from "./Selector.types";

import React from "react";
import { EmployeeStatus, EmployeeType } from "@onlyoffice/docspace-api-sdk";
import FolderSvgUrl from "../../assets/icons/32/folder.svg?url";
import EmptyScreenFilter from "../../assets/emptyFilter/empty.filter.rooms.light.svg?url";
import { globalColors } from "../../providers/theme";
import { AvatarRole } from "../avatar";
import { Selector } from "./Selector";
import { SelectorAccessRightsMode } from "./Selector.enums";
import {
  BreadCrumbsLoader,
  RowLoader,
  SearchLoader,
} from "./sub-components/loaders";

// Seeded rather than random, so every render and every screenshot shows the same labels.
function makeName(seed: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let state = (seed + 1) * 2654435761;

  for (let i = 0; i < 15; i += 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    result += characters.charAt(state % characters.length);
  }

  return result;
}

// The rows are built once at module level, so their handlers are too.
const onCreateNewItem = fn();
const onAcceptNewName = fn();
const onCancelNewName = fn();

const getItems = (count: number) => {
  const items: TSelectorItem[] = [];

  items.push({
    key: "create_new",
    id: "create_new_item",
    label: "New folder",
    isCreateNewItem: true,
    onCreateClick: onCreateNewItem,
    onBackClick: fn(),
  });

  items.push({
    key: "input_item",
    id: "input_item",
    label: "",
    isInputItem: true,
    icon: FolderSvgUrl,
    defaultInputValue: "New folder",
    onAcceptInput: onAcceptNewName,
    onCancelInput: onCancelNewName,
  });

  for (let i = 0; i < count; i += 1) {
    const label = makeName(i);
    items.push({
      key: `${label} ${i}`,
      id: `${label} ${i}`,
      label: `${label} ${i}`,
      email: "name@example.com",
      isOwner: false,
      isAdmin: false,
      isVisitor: false,
      isCollaborator: false,
      isRoomAdmin: false,
      avatar: "",
      role: AvatarRole.user,
      hasAvatar: false,
      userType: EmployeeType.User,
      status: EmployeeStatus.Active,
    });
  }

  return items;
};

const getAccessRights = () => {
  const accesses = [
    {
      key: "editor",
      label: "Editor",
      description: "Can change the content",
      access: 1,
    },
    {
      key: "reviewer",
      label: "Reviewer",
      description: "Can suggest changes",
      access: 3,
    },
    {
      key: "commentator",
      label: "Commentator",
      description: "Can leave comments",
      access: 4,
    },
    {
      key: "viewer",
      label: "Viewer",
      description: "Can only read",
      access: 5,
    },
  ];

  return accesses;
};

const items = getItems(100000);

const selectedItems = [items[0], items[3], items[7]];

const accessRights = getAccessRights();

const selectedAccessRight = accessRights[0];

const renderedItems = items.slice(0, 100);
const totalItems = items.length;

// The same rows without the "create new" and inline name rows at the top.
const people = items.slice(2);

const frameStyle: React.CSSProperties = {
  width: "480px",
  height: "485px",
  border: `1px solid ${globalColors.grayLightMid}`,
  margin: "auto",
  overflow: "hidden",
  boxSizing: "border-box",
};

const noop = async () => {};

const Template = ({
  source = items,
  ...args
}: SelectorProps & { source?: TSelectorItem[] }) => {
  const [rendItems, setRendItems] = React.useState(() => source.slice(0, 100));
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const loadNextPage = React.useCallback(
    async (index: number) => {
      setRendItems((val) => [...val, ...source.slice(index, index + 100)]);
    },
    [source],
  );

  React.useEffect(() => {
    // Ensure initial scroll is at top with minimal interference and no jumps.
    const raf = requestAnimationFrame(() => {
      const root = wrapperRef.current;
      if (!root) return;

      const setTop = (node: unknown) => {
        try {
          if (
            node &&
            typeof node.scrollTop === "number" &&
            node.scrollTop > 0
          ) {
            node.scrollTo?.(0, 0);
            node.scrollTop = 0;
          }
        } catch (e) {
          console.log(e);
        }
      };

      const pageEl = (document.scrollingElement ||
        document.documentElement) as unknown as HTMLElement;
      setTop(pageEl);

      // Story-local scroll containers
      const scrollRoot = root.querySelector(
        ".selector-body-scroll",
      ) as HTMLElement | null;
      const scrollContent = root.querySelector(
        ".selector-body-scroll .scrollbar__content",
      ) as HTMLElement | null;
      [scrollRoot, scrollContent].forEach(setTop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapperRef} style={frameStyle}>
      <Selector
        {...args}
        items={rendItems}
        totalItems={source.length}
        loadNextPage={loadNextPage}
        searchLoader={<div />}
        rowLoader={<div />}
      />
    </div>
  );
};

// Renders `items` exactly as given, for stories whose list never pages.
// A row of the list, by its label.
const row = (root: HTMLElement, label: string) => {
  const found = Array.from(
    root.querySelectorAll<HTMLElement>('[data-testid^="selector-item-"]'),
  ).find((item) => item.textContent?.includes(label));
  if (!found) throw new Error(`No row labelled ${label}`);
  return found;
};

const selector = (canvas: { getByTestId: (id: string) => HTMLElement }) =>
  canvas.getByTestId("selector");

const StaticTemplate = (args: SelectorProps) => (
  <div style={frameStyle}>
    <Selector {...args} />
  </div>
);

const meta = {
  title: "UI/Overlays/Selector",
  component: Selector,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    id: {
      control: "text",
      description: "`id` attribute of the outermost element",
    },
    className: {
      control: "text",
      description: "Class added to the outermost element",
    },
    style: {
      control: "object",
      description: "Inline styles of the outermost element",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element",
      table: { defaultValue: { summary: "selector" } },
    },
    withHeader: {
      control: "boolean",
      description:
        "Draws a header bar with a title and a closing cross at the top of the panel; it only accepts `true`",
    },
    headerProps: {
      control: "object",
      description:
        "What the header shows: `headerLabel` as the title, `onCloseClick` for the cross, and a back arrow when `withoutBackButton` is literally `false` with `onBackClick`",
    },
    items: {
      control: false,
      description:
        "The rows loaded so far, in the order they are shown. A row marked `isCreateNewItem` must come first and one marked `isInputItem` second",
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called with the clicked row and whether it was a double click, before Selector updates its own selection; the third argument submits that one row",
    },
    isMultiSelect: {
      control: "boolean",
      description:
        "Puts a checkbox on every row and lets more than one be ticked; the submit button then shows the count",
      table: { defaultValue: { summary: "false" } },
    },
    forceIsMultiSelect: {
      control: "boolean",
      description:
        "Gives a checkbox to the rows that ask for single selection with their own `disableMultiSelect`",
      table: { defaultValue: { summary: "false" } },
    },
    selectedItems: {
      control: false,
      description:
        "Rows to start out ticked in multi-select, matched by `id`. Selector copies them once; later ticks come back through `onSubmit`",
    },
    selectedItem: {
      control: false,
      description:
        "The one row to start out highlighted outside multi-select, matched by `id`",
    },
    maxSelectedItems: {
      control: "number",
      description:
        "Largest number of rows that may be ticked at once; past it the unticked rows go grey and stop responding",
    },
    renderCustomItem: {
      control: false,
      description:
        "Replaces the text of every row with what it returns, keeping the row's avatar, checkbox and height",
    },
    displayFileExtension: {
      control: "boolean",
      description: "Draws a file's extension after its name in a dimmer colour",
      table: { defaultValue: { summary: "false" } },
    },
    loadNextPage: {
      control: false,
      description:
        "Called with the index to continue from as the list nears its end, and once with 0 on mount; append the next page to `items`",
    },
    disableFirstFetch: {
      control: "boolean",
      description:
        "Skips the `loadNextPage(0)` call on mount, for a list whose first page is already in `items`",
      table: { defaultValue: { summary: "false" } },
    },
    hasNextPage: {
      control: "boolean",
      description: "Indicates more items are available for infinite scrolling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isNextPageLoading: {
      control: "boolean",
      description:
        "Marks a page request as in flight, so scrolling further asks for no other page",
      table: { defaultValue: { summary: "false" } },
    },
    totalItems: {
      control: "number",
      description:
        "How many items exist in total, which sets how far the list can be scrolled",
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the list with `rowLoader` for the initial load, and hides the tinted note meanwhile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isContentLoading: {
      control: "boolean",
      description:
        "Keeps the current list on screen, dimmed and not clickable, while new content loads; wins over `isLoading`",
      table: { defaultValue: { summary: "false" } },
    },
    rowLoader: {
      control: false,
      description:
        "Skeleton shown for a row that has not arrived yet and for the whole list during `isLoading`",
    },
    isSSR: {
      control: "boolean",
      description:
        "Renders every row as plain markup until the panel has a measured height, for server rendering",
      table: { defaultValue: { summary: "false" } },
    },
    withPadding: {
      control: "boolean",
      description: "Keeps 16px of space above the first part of the body",
      table: { defaultValue: { summary: "true" } },
    },
    descriptionText: {
      control: "text",
      description: "A line of bold text above the list",
    },
    injectedElement: {
      control: false,
      description:
        "An element of your own, drawn between the breadcrumbs and the search box; the list is shortened by its height",
    },
    withSearch: {
      control: "boolean",
      description:
        "Shows a search box above the list; it hides itself while the list is empty and no search is running",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    searchValue: {
      control: "text",
      description:
        "Text shown in the search box; searching itself is yours to do in `onSearch`",
    },
    isSearchLoading: {
      control: "boolean",
      description: "Replaces the search box with `searchLoader`",
      table: { defaultValue: { summary: "false" } },
    },
    searchLoader: {
      control: false,
      description: "Skeleton shown in place of the search box while it loads",
    },
    onSearch: {
      action: "onSearch",
      description:
        "Called with the trimmed query once typing stops; call its callback to show the search empty screen when nothing matches. An empty query calls `onClearSearch` instead",
    },
    onClearSearch: {
      action: "onClearSearch",
      description:
        "Called by the search box's cross and the empty screen's \"Clear filter\" link; call its callback to leave the searching state",
    },
    withSelectAll: {
      control: "boolean",
      description:
        'Shows a "select all" row above the list that ticks or unticks every enabled loaded row, in multi-select while no search is running',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    selectAllLabel: {
      control: "text",
      description: 'Text of the "select all" row',
    },
    selectAllIcon: {
      control: "text",
      description:
        'URL of the avatar beside the "select all" text; an empty string draws the default one',
    },
    onSelectAll: {
      action: "onSelectAll",
      description:
        'Called when the "select all" row is clicked; Selector ticks and unticks the rows itself',
    },
    withBreadCrumbs: {
      control: "boolean",
      description:
        "Shows the folder trail above the list, outermost folder first",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    breadCrumbs: {
      control: "object",
      description:
        "The trail, outermost first; the last entry is the current folder and is not clickable",
    },
    onSelectBreadCrumb: {
      action: "onSelectBreadCrumb",
      description:
        'Called with the clicked crumb, and by the empty screen\'s "Back" link with the one before the last; load that folder yourself',
    },
    isBreadCrumbsLoading: {
      control: "boolean",
      description: "Replaces the trail with `breadCrumbsLoader`",
      table: { defaultValue: { summary: "false" } },
    },
    breadCrumbsLoader: {
      control: false,
      description: "Skeleton shown in place of the trail while it loads",
    },
    withTabs: {
      control: false,
      description:
        "Shows a tab strip above the list; Selector keeps a separate selection for each tab and adds them up",
    },
    tabsData: {
      control: false,
      description:
        "The tabs, in order; switch `activeTabId` from each tab's `onClick`",
    },
    activeTabId: {
      control: "text",
      description: "`id` of the open tab",
    },
    withInfo: {
      control: "boolean",
      description:
        "Shows a tinted note between the search box and the list, hidden during the initial load",
      table: { defaultValue: { summary: "false" } },
    },
    infoText: {
      control: "text",
      description: "Text of the tinted note",
    },
    withInfoBadge: {
      control: "boolean",
      description: "Draws an info icon before the note's text",
      table: { defaultValue: { summary: "false" } },
    },
    withInfoBar: {
      control: "boolean",
      description:
        "Shows a bar with a bold title and a description above the list",
      table: { defaultValue: { summary: "false" } },
    },
    infoBarData: {
      control: "object",
      description:
        "What that bar says: a `title`, a `description`, an optional icon, and an `onClose` that adds a closing cross",
    },
    emptyScreenImage: {
      control: false,
      description:
        "Picture shown when the folder is empty: an image URL, or an element drawn as it is",
    },
    emptyScreenHeader: {
      control: "text",
      description: "Heading shown when the folder is empty",
    },
    emptyScreenDescription: {
      control: "text",
      description: "Paragraph under that heading",
    },
    searchEmptyScreenImage: {
      control: false,
      description: "Picture shown when a search finds nothing",
    },
    searchEmptyScreenHeader: {
      control: "text",
      description: "Heading shown when a search finds nothing",
    },
    searchEmptyScreenDescription: {
      control: "text",
      description: "Paragraph under that heading",
    },
    hideBackButton: {
      control: "boolean",
      description:
        'Hides the "Back" link on the empty screen of an empty folder',
      table: { defaultValue: { summary: "false" } },
    },
    alwaysShowFooter: {
      control: "boolean",
      description:
        "Shows the footer from the start instead of only once the selection has changed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    submitButtonLabel: {
      control: "text",
      description:
        'Text of the primary button; in multi-select the count is added in brackets, so pass "Add", not "Add (3)"',
    },
    submitButtonId: {
      control: "text",
      description: "`id` attribute of the primary button",
    },
    disableSubmitButton: {
      control: "boolean",
      description:
        "Disables the primary button and Enter; with a footer input an empty name disables it too",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSubmit: {
      action: "onSubmit",
      description:
        "Called by the primary button and by Enter with the ticked rows, the chosen access, the file name and the checkbox state; a returned promise shows a spinner on the button until it settles",
    },
    withCancelButton: {
      control: "boolean",
      description: "Shows a second, non-primary button in the footer",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    cancelButtonLabel: {
      control: "text",
      description: "Text of the cancel button",
    },
    cancelButtonId: {
      control: "text",
      description: "`id` attribute of the cancel button",
    },
    onCancel: {
      action: "onCancel",
      description:
        "Called by the cancel button, and by Escape anywhere on the page whether or not the button is shown",
    },
    withAccessRights: {
      control: "boolean",
      description:
        "Adds a drop-down of access levels beside the primary button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accessRights: {
      control: "object",
      description: "The access levels in that drop-down",
    },
    selectedAccessRight: {
      control: "object",
      description:
        "The access level chosen at the start, and whenever this changes",
    },
    onAccessRightsChange: {
      action: "onAccessRightsChange",
      description: "Called with the access level picked in the drop-down",
    },
    accessRightsMode: {
      control: "select",
      options: Object.values(SelectorAccessRightsMode),
      description:
        "`compact` opens a menu sized to its entries; `detailed` opens one as wide as the footer. Both show each level's description under its label",
      table: { defaultValue: { summary: "compact" } },
    },
    withFooterInput: {
      control: "boolean",
      description:
        "Adds a text field above the footer buttons, for the name to save under",
      table: { defaultValue: { summary: "false" } },
    },
    footerInputHeader: {
      control: "text",
      description: "Label above the footer text field",
    },
    currentFooterInputValue: {
      control: "text",
      description:
        "Text the footer field starts with; Selector keeps the edited value and hands it to `onSubmit`",
    },
    folderFormValidation: {
      control: false,
      description:
        "A pattern of forbidden characters; a name that matches it marks the field red and shows a warning under it",
    },
    withFooterCheckbox: {
      control: "boolean",
      description: "Adds a checkbox above the footer buttons",
      table: { defaultValue: { summary: "false" } },
    },
    footerCheckboxLabel: {
      control: "text",
      description: "Label beside the footer checkbox",
    },
    isChecked: {
      control: "boolean",
      description:
        "Whether the footer checkbox starts out ticked; Selector keeps its state and hands it to `onSubmit`",
      table: { defaultValue: { summary: "false" } },
    },
    useAside: {
      control: false,
      description:
        "Wraps the panel in a backdrop and a side panel sliding in from the edge of the window",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by a click on the backdrop and by the side panel's own close; required with `useAside`",
    },
    withoutBackground: {
      control: "boolean",
      description: "Makes the backdrop behind the side panel transparent",
      table: { defaultValue: { summary: "false" } },
    },
    withBlur: {
      control: false,
      description: "Ignored; nothing reads this prop",
    },
  },
} satisfies Meta<typeof Selector>;

type Story = StoryObj<ComponentProps<typeof Selector>>;

export default meta;

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    searchPlaceholder: "Search",
    searchValue: "",
    items: renderedItems,
    onSelect: fn(),
    isMultiSelect: false,
    selectedItems,
    submitButtonLabel: "Add",
    onSubmit: fn(),
    withSelectAll: false,
    selectAllLabel: "All items",
    selectAllIcon: "",
    onSelectAll: fn(),
    withAccessRights: false,
    accessRights,
    selectedAccessRight,
    onAccessRightsChange: fn(),
    withCancelButton: false,
    cancelButtonLabel: "Cancel",
    onCancel: fn(),
    emptyScreenImage: EmptyScreenFilter,
    emptyScreenHeader: "This folder is empty",
    emptyScreenDescription: "Items you add to this folder will appear here.",
    searchEmptyScreenImage: EmptyScreenFilter,
    searchEmptyScreenHeader: "Nothing found",
    searchEmptyScreenDescription:
      "No item matches your search. Try another word or clear the filter.",
    totalItems,
    hasNextPage: true,
    isNextPageLoading: false,
    isLoading: false,
    disableFirstFetch: true,
    withBreadCrumbs: false,
    breadCrumbs: [],
    onSelectBreadCrumb: fn(),
    breadCrumbsLoader: <div />,
    withSearch: false,
    isBreadCrumbsLoading: false,
    alwaysShowFooter: false,
    disableSubmitButton: false,
    descriptionText: "",
  },
  beforeEach: () => {
    onAcceptNewName.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    // The inline name row accepts its value.
    const name = await waitFor(() =>
      within(root).getByTestId("selector_input_item"),
    );
    await expect(name).toHaveValue("New folder");
    await userEvent.click(within(root).getByTestId("selector_new_item_accept"));
    await expect(onAcceptNewName).toHaveBeenCalledWith("New folder");

    // Picking a row reports it and brings the footer.
    await userEvent.click(row(root, people[0].label));
    const [picked, isDoubleClick] = (args.onSelect as ReturnType<typeof fn>)
      .mock.calls[0] as [TSelectorItem, boolean];
    await expect(picked.id).toBe(people[0].id);
    await expect(isDoubleClick).toBe(false);
    const submit = await waitFor(() =>
      within(root).getByTestId("selector_submit_button"),
    );
    await userEvent.click(submit);
    await expect(args.onSubmit).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'A long list that loads 100 rows at a time as you scroll, with one row picked at a time. The first row opens a "New folder" entry and the second is the inline name field for it (`isCreateNewItem`, `isInputItem`); change any other prop live in the Controls panel below.',
      },
      source: {
        code: `<Selector
  searchPlaceholder="Search"
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`,
      },
    },
  },
};

export const ContentLoading: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    isContentLoading: true,
  },
  play: async ({ args, canvas }) => {
    // The list stays, dimmed, and takes no clicks.
    const root = selector(canvas);
    const first = await waitFor(() => row(root, people[0].label));
    await expect(first).toBeVisible();
    await expect(
      getComputedStyle(
        first.closest('[class*="bodyContentDimmed"]') as HTMLElement,
      ).pointerEvents,
    ).toBe("none");
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content refresh state: while new data is loading (search, tab change or folder navigation), the current list stays on screen dimmed and non-interactive instead of being replaced with a skeleton.",
      },
      source: {
        code: `<Selector
  items={items}
  isContentLoading
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  loadNextPage={loadNextPage}
/>`,
      },
    },
  },
};

export const BreadCrumbs: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "My documents" },
      { id: 2, label: "Projects" },
      { id: 3, label: "Reports" },
      { id: 4, label: "Quarterly summaries for the whole year" },
      { id: 5, label: "Drafts" },
    ],
  },
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    await expect(within(root).getByText("Drafts")).toBeVisible();
    // The middle folders collapse behind the dots.
    await expect(within(root).queryByText("Projects")).toBeNull();
    await userEvent.click(within(root).getByText("My documents"));
    await expect(args.onSelectBreadCrumb).toHaveBeenCalledWith(
      expect.objectContaining({ label: "My documents" }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use a folder trail when the list is one level of a folder tree. With more than three folders, the ones between the first and the last two collapse into a menu behind the dots; click an earlier folder and `onSelectBreadCrumb` reports it, so you can load that folder and pass new `items` and `breadCrumbs`.",
      },
      source: {
        code: `<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={[
    { id: 1, label: "My documents" },
    { id: 2, label: "Projects" },
    { id: 3, label: "Reports" },
  ]}
  onSelectBreadCrumb={handleBreadCrumb}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>`,
      },
    },
  },
};

export const NewName: Story = {
  render: (args) => <Template {...args} />,
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "My documents" },
      { id: 2, label: "Projects" },
      { id: 3, label: "Reports" },
    ],
    withFooterInput: true,
    footerInputHeader: "File name",
    currentFooterInputValue: "Report.docx",
    withFooterCheckbox: true,
    footerCheckboxLabel: "Open saved document in new tab",
    isChecked: false,
  },
  play: async ({ canvas, userEvent }) => {
    const root = selector(canvas);
    const input = within(root).getByTestId("selector_footer_input");
    await expect(input).toHaveValue("Report.docx");
    await expect(
      within(root).getByText("Open saved document in new tab"),
    ).toBeVisible();
    // An empty name disables the button.
    await userEvent.clear(input);
    await expect(
      within(root).getByTestId("selector_submit_button"),
    ).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use a name field in the footer for a "save as" or copy flow, where the reader picks the destination folder and names the file in one step. The checkbox under the field is a second choice handed to `onSubmit` with the name (`withFooterCheckbox`); clear the field and the Add button goes dead.',
      },
      source: {
        code: `<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={breadCrumbs}
  withFooterInput
  footerInputHeader="File name"
  currentFooterInputValue="Report.docx"
  withFooterCheckbox
  footerCheckboxLabel="Open saved document in new tab"
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>`,
      },
    },
  },
};

export const WithHeader: Story = {
  render: (args) => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    withHeader: true,
    headerProps: {
      headerLabel: "Choose a folder",
      onCloseClick: fn(),
      onBackClick: fn(),
      withoutBackButton: false,
      withoutBorder: false,
    },
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
  },
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    await expect(within(root).getByText("Choose a folder")).toBeVisible();
    await userEvent.click(
      within(root).getByTestId("aside_header_close_icon_button"),
    );
    await expect(args.headerProps?.onCloseClick).toHaveBeenCalled();
    await userEvent.click(
      within(root).getByTestId("aside_header_back_icon_button"),
    );
    await expect(args.headerProps?.onBackClick).toHaveBeenCalled();
    await userEvent.click(within(root).getByTestId("selector_cancel_button"));
    await expect(args.onCancel).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Give the panel a header when it stands on its own, in a dialog or a side panel. The title comes with a closing cross and, here, a back arrow for a step-by-step flow (`headerProps.withoutBackButton: false`); the footer gets a second button that calls `onCancel`, as Escape does.",
      },
      source: {
        code: `<Selector
  withHeader
  headerProps={{
    headerLabel: "Choose a folder",
    onCloseClick: handleClose,
    onBackClick: handleBack,
    withoutBackButton: false,
    withoutBorder: false,
  }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`,
      },
    },
  },
};

const searchable = people.slice(0, 30);

const SearchTemplate = (args: SelectorProps) => {
  const [query, setQuery] = React.useState("");

  const found = query
    ? searchable.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      )
    : searchable;

  return (
    <StaticTemplate
      {...args}
      items={found}
      totalItems={found.length}
      searchValue={query}
      onSearch={(value, callback) => {
        setQuery(value);
        callback?.();
      }}
      onClearSearch={(callback) => {
        setQuery("");
        callback?.();
      }}
    />
  );
};

export const WithSearch: Story = {
  render: (args) => <SearchTemplate {...args} />,
  args: {
    ...Default.args,
    withSearch: true,
    searchPlaceholder: "Search",
    searchLoader: <SearchLoader />,
    isSearchLoading: false,
    hasNextPage: false,
    loadNextPage: noop,
  },
  play: async ({ canvas, userEvent }) => {
    const root = selector(canvas);
    const search = within(root)
      .getByTestId("selector_search_input")
      .querySelector("input") as HTMLInputElement;
    // Nothing matches, then the whole list comes back.
    // The search box hands the query over after a pause.
    await userEvent.type(search, "zzz");
    await waitFor(
      () => expect(within(root).getByText("Nothing found")).toBeVisible(),
      { timeout: 3000 },
    );
    await userEvent.clear(search);
    await waitFor(
      () => expect(within(root).getByText(searchable[0].label)).toBeVisible(),
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Add a search box when the reader knows the name they are looking for. Type part of a label to narrow the list; type something no label contains, such as `zzz`, to see the search empty screen (`searchEmptyScreenHeader`), and clear the box with its cross to get the whole list back. The filtering is the story's own: Selector hands over the query in `onSearch` and shows what `items` you give back.",
      },
      source: {
        code: `const [query, setQuery] = useState("");

<Selector
  withSearch
  searchPlaceholder="Search"
  searchValue={query}
  searchLoader={<SearchLoader />}
  isSearchLoading={false}
  onSearch={(value, callback) => {
    setQuery(value);
    callback();
  }}
  onClearSearch={(callback) => {
    setQuery("");
    callback();
  }}
  items={filter(items, query)}
  searchEmptyScreenHeader="Nothing found"
  {...otherProps}
/>`,
      },
    },
  },
};

export const MultiSelect: Story = {
  render: (args) => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    isMultiSelect: true,
    withSelectAll: true,
    selectAllLabel: "All items",
    selectedItems: [people[1], people[3]],
  },
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    // The footer appears with the first change; its button counts the
    // ticked rows, the two given ones included.
    await expect(
      within(root).queryByTestId("selector_submit_button"),
    ).toBeNull();
    await userEvent.click(row(root, people[0].label));
    await waitFor(() =>
      expect(
        within(root).getByTestId("selector_submit_button"),
      ).toHaveTextContent("Add (3)"),
    );
    await userEvent.click(within(root).getByText("All items"));
    await expect(args.onSelectAll).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use multi-select when the reader adds several items in one go, such as people to a share. Every row gets a checkbox, the footer appears with the first tick and its Add button shows how many are ticked, and the "All items" row above the list ticks or unticks every loaded row (`withSelectAll`). Two rows start out ticked (`selectedItems`).',
      },
      source: {
        code: `<Selector
  isMultiSelect
  withSelectAll
  selectAllLabel="All items"
  onSelectAll={handleSelectAll}
  selectedItems={alreadyChosen}
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`,
      },
    },
  },
};

const limitItems = people.slice(0, 8);

export const SelectionLimit: Story = {
  render: (args) => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: limitItems,
    totalItems: limitItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    maxSelectedItems: 2,
    selectedItems: [limitItems[0], limitItems[2]],
    alwaysShowFooter: true,
  },
  play: async ({ args, canvas }) => {
    const root = selector(canvas);
    // At the limit, an unticked row is greyed out and ignores clicks.
    const other = row(root, limitItems[1].label);
    await expect(other.className).toMatch(/disabled/);
    other.click();
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cap the selection when the target can take only so many items. Two rows are ticked and the limit is two, so every other row is greyed out and ignores clicks (`maxSelectedItems`); untick one and the rest come back. Selector shows no message of its own, so say what the limit is somewhere near the panel.",
      },
      source: {
        code: `<Selector
  isMultiSelect
  maxSelectedItems={2}
  selectedItems={[first, third]}
  alwaysShowFooter
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  {...otherProps}
/>`,
      },
    },
  },
};

const disabledItems = people
  .slice(0, 8)
  .map((item, index) =>
    index % 3 === 1
      ? { ...item, isDisabled: true, disabledText: "Added" }
      : item,
  );

export const DisabledItems: Story = {
  render: (args) => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: disabledItems,
    totalItems: disabledItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: [],
  },
  play: async ({ args, canvas }) => {
    const root = selector(canvas);
    const disabled = row(root, disabledItems[1].label);
    await expect(within(disabled).getByText("Added")).toBeVisible();
    disabled.click();
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keep an item in the list but out of reach when the reader should see it and know why it cannot be picked. The greyed rows ignore clicks and show a reason in place of their checkbox (`isDisabled`, `disabledText` on the item).",
      },
      source: {
        code: `const items = [
  { id: 1, label: "Report.docx" },
  { id: 2, label: "Budget.xlsx", isDisabled: true, disabledText: "Added" },
];

<Selector isMultiSelect items={items} {...otherProps} />`,
      },
    },
  },
};

const accessItems = people.slice(0, 20);

export const WithAccessRights: Story = {
  render: (args) => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: accessItems,
    totalItems: accessItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: [accessItems[0]],
    alwaysShowFooter: true,
    withAccessRights: true,
    accessRights,
    selectedAccessRight,
    accessRightsMode: SelectorAccessRightsMode.Compact,
  },
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    // The access drop-down beside the button.
    const access = within(root).getByTestId("combobox");
    await expect(access).toHaveTextContent("Editor");
    await userEvent.click(within(access).getByRole("button"));
    const viewer = await waitFor(() => {
      const option = screen
        .getAllByText("Viewer")
        .find((element) => element.checkVisibility());
      expect(option).toBeDefined();
      return option as HTMLElement;
    });
    await userEvent.click(viewer);
    await expect(args.onAccessRightsChange).toHaveBeenCalledWith(
      expect.objectContaining({ key: "viewer" }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Add an access drop-down to the footer when the items being added need a permission as well. Open it beside the Add button to pick one; the choice is handed to `onSubmit` with the ticked items. Switch `accessRightsMode` to `detailed` in the Controls panel below to open the menu as wide as the footer instead.",
      },
      source: {
        code: `<Selector
  isMultiSelect
  withAccessRights
  accessRights={[
    { key: "editor", label: "Editor", description: "Can change the content", access: 1 },
    { key: "viewer", label: "Viewer", description: "Can only read", access: 5 },
  ]}
  selectedAccessRight={editor}
  onAccessRightsChange={handleAccessChange}
  accessRightsMode={SelectorAccessRightsMode.Compact}
  items={items}
  submitButtonLabel="Add"
  onSubmit={(items, access) => share(items, access)}
  {...otherProps}
/>`,
      },
    },
  },
};

export const EmptyFolder: Story = {
  render: (args) => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: [items[0]],
    totalItems: 0,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: [],
  },
  beforeEach: () => {
    onCreateNewItem.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const root = selector(canvas);
    await expect(within(root).getByText("This folder is empty")).toBeVisible();
    // The create row becomes a link.
    await userEvent.click(within(root).getByText("New folder"));
    await expect(onCreateNewItem).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'What the reader sees in a folder with nothing in it: the picture, heading and paragraph you pass (`emptyScreenImage`, `emptyScreenHeader`, `emptyScreenDescription`). The "New folder" link is the list\'s `isCreateNewItem` row turned into a link, and "Back" goes to the previous folder of the trail; `hideBackButton` removes it.',
      },
      source: {
        code: `<Selector
  items={[{ key: "create_new", id: "create_new_item", label: "New folder", isCreateNewItem: true, onCreateClick, onBackClick }]}
  emptyScreenImage={emptyFolderImage}
  emptyScreenHeader="This folder is empty"
  emptyScreenDescription="Items you add to this folder will appear here."
  totalItems={0}
  hasNextPage={false}
  {...otherProps}
/>`,
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: [],
    totalItems: 0,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: [],
    isLoading: true,
    rowLoader: <RowLoader isContainer />,
    withSearch: true,
    isSearchLoading: true,
    searchLoader: <SearchLoader />,
    withBreadCrumbs: true,
    isBreadCrumbsLoading: true,
    breadCrumbsLoader: <BreadCrumbsLoader />,
    breadCrumbs: [{ id: 1, label: "My documents" }],
  },
  play: async ({ canvas }) => {
    const root = selector(canvas);
    await expect(within(root).getByTestId("bread-crumbs-loader")).toBeVisible();
    await expect(within(root).getByTestId("row-loader")).toBeVisible();
    await expect(within(root).queryByPlaceholderText("Search")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Show skeletons while the first page is on its way, so the panel keeps its shape instead of flashing an empty screen. The trail, the search box and the list each have a skeleton of their own, and each is switched on separately (`isBreadCrumbsLoading`, `isSearchLoading`, `isLoading`); the folder exports all three loaders.",
      },
      source: {
        code: `import {
  BreadCrumbsLoader,
  RowLoader,
  SearchLoader,
  Selector,
} from "@onlyoffice/apps-ui-kit/components/selector";

<Selector
  isLoading
  rowLoader={<RowLoader isContainer />}
  withSearch
  isSearchLoading
  searchLoader={<SearchLoader />}
  withBreadCrumbs
  isBreadCrumbsLoading
  breadCrumbsLoader={<BreadCrumbsLoader />}
  {...otherProps}
/>`,
      },
    },
  },
};

const tabLists: Record<string, TSelectorItem[]> = {
  files: people.slice(0, 20),
  shared: people.slice(20, 30),
};

const TabsTemplate = (args: SelectorProps) => {
  const [activeTabId, setActiveTabId] = React.useState("files");

  const tabsData = [
    {
      id: "files",
      name: "My files",
      content: null,
      onClick: () => setActiveTabId("files"),
    },
    {
      id: "shared",
      name: "Shared with me",
      content: null,
      onClick: () => setActiveTabId("shared"),
    },
  ];

  return (
    <StaticTemplate
      {...args}
      withTabs
      tabsData={tabsData}
      activeTabId={activeTabId}
      items={tabLists[activeTabId]}
      totalItems={tabLists[activeTabId].length}
    />
  );
};

export const WithTabs: Story = {
  render: (args) => <TabsTemplate {...args} />,
  args: {
    ...Default.args,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: [],
  },
  play: async ({ canvas, userEvent }) => {
    const root = selector(canvas);
    // A selection on each tab, counted together.
    await userEvent.click(row(root, tabLists.files[0].label));
    await userEvent.click(within(root).getByText("Shared with me"));
    await waitFor(() =>
      expect(within(root).getByText(tabLists.shared[0].label)).toBeVisible(),
    );
    await userEvent.click(row(root, tabLists.shared[0].label));
    await waitFor(() =>
      expect(
        within(root).getByTestId("selector_submit_button"),
      ).toHaveTextContent("Add (2)"),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Split the list into tabs when the items come from separate sources. Tick a row, switch to the other tab and tick another: the Add button counts both, because Selector keeps a selection per tab (`withTabs`, `tabsData`, `activeTabId`). Switching tabs is yours to do from each tab's `onClick`.",
      },
      source: {
        code: `const [activeTabId, setActiveTabId] = useState("files");

<Selector
  withTabs
  tabsData={[
    { id: "files", name: "My files", content: null, onClick: () => setActiveTabId("files") },
    { id: "shared", name: "Shared with me", content: null, onClick: () => setActiveTabId("shared") },
  ]}
  activeTabId={activeTabId}
  items={itemsFor(activeTabId)}
  isMultiSelect
  {...otherProps}
/>`,
      },
    },
  },
};

export const WithInfo: Story = {
  render: (args) => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    descriptionText: "Recent items",
    withInfo: true,
    infoText: "Only items you can edit are listed here.",
    withInfoBadge: true,
  },
  play: async ({ canvas }) => {
    const root = selector(canvas);
    await expect(
      within(root).getByText("Only items you can edit are listed here."),
    ).toBeVisible();
    await expect(within(root).getByText("Recent items")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two ways to say something about the list before the reader picks from it:\n\n- **Only items you can edit are listed here.** — a tinted note with an info icon, for a condition that explains what the list holds (`withInfo`, `infoText`, `withInfoBadge`)\n- **Recent items** — a bold line right above the rows, for a short heading (`descriptionText`)",
      },
      source: {
        code: `<Selector
  withInfo
  infoText="Only items you can edit are listed here."
  withInfoBadge
  descriptionText="Recent items"
  {...otherProps}
/>`,
      },
    },
  },
};

const InfoBarTemplate = (args: SelectorProps) => {
  const [visible, setVisible] = React.useState(true);

  return (
    <Template
      {...args}
      source={people}
      withInfoBar={visible}
      infoBarData={{ ...args.infoBarData, onClose: () => setVisible(false) }}
    />
  );
};

export const WithInfoBar: Story = {
  render: (args) => <InfoBarTemplate {...args} />,
  args: {
    ...Default.args,
    infoBarData: {
      title: "Copies keep their links",
      description:
        "Links to the original file keep working after it is copied.",
    },
  },
  play: async ({ canvas, userEvent }) => {
    const root = selector(canvas);
    const title = within(root).getByText("Copies keep their links");
    await expect(title).toBeVisible();
    // The cross closes the bar.
    let bar = title.parentElement as HTMLElement;
    while (!within(bar).queryByTestId("icon-button")) {
      bar = bar.parentElement as HTMLElement;
    }
    await userEvent.click(within(bar).getByTestId("icon-button"));
    await waitFor(() =>
      expect(within(root).queryByText("Copies keep their links")).toBeNull(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Put a dismissable bar above the list for a notice the reader can read once and close. The cross appears because the bar has an `onClose`; hiding the bar when it is clicked is up to you (`withInfoBar`, `infoBarData`).",
      },
      source: {
        code: `const [visible, setVisible] = useState(true);

<Selector
  withInfoBar={visible}
  infoBarData={{
    title: "Copies keep their links",
    description: "Links to the original file keep working after it is copied.",
    onClose: () => setVisible(false),
  }}
  {...otherProps}
/>`,
      },
    },
  },
};

const panelItems = people.slice(0, 30);

export const InSidePanel: Story = {
  render: (args) => <Selector {...args} />,
  args: {
    ...Default.args,
    items: panelItems,
    totalItems: panelItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    useAside: true,
    onClose: fn(),
    withHeader: true,
    headerProps: {
      headerLabel: "Choose a folder",
      onCloseClick: fn(),
    },
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
  },
  play: async ({ args, userEvent }) => {
    // A side panel over a backdrop that closes it.
    await waitFor(() =>
      expect(screen.getByText("Choose a folder")).toBeVisible(),
    );
    const backdrop = screen
      .getAllByTestId("backdrop")
      .find((element) => element.checkVisibility()) as HTMLElement;
    await userEvent.click(backdrop);
    await expect(args.onClose).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      // Framed: the side panel is fixed to the window and would cover the Docs page.
      story: { inline: false, height: "600px" },
      description: {
        story:
          "Open Selector as a side panel over the page when picking is a step on its own. The panel slides in from the edge of the window over a dimmed backdrop, and a click on the backdrop calls `onClose` (`useAside`); without it, Selector is a plain box that fills its parent.",
      },
      source: {
        code: `<Selector
  useAside
  onClose={handleClose}
  withHeader
  headerProps={{ headerLabel: "Choose a folder", onCloseClick: handleClose }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  {...listProps}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Template {...args} source={people} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The trail starts at the right edge.
    const root = selector(canvas);
    const first = within(root).getByText("المستندات").getBoundingClientRect();
    const last = within(root).getByText("التقارير").getBoundingClientRect();
    await expect(first.left).toBeGreaterThan(last.right);
  },
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "المستندات" },
      { id: 2, label: "المشاريع" },
      { id: 3, label: "التقارير" },
    ],
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "511px" },
      description: {
        story:
          "The panel in a right-to-left layout: the folder trail starts at the right edge with its arrows pointing left, and the row labels and the footer button line up from the right.",
      },
      source: {
        code: `<div dir="rtl">
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    onSelectBreadCrumb={openFolder}
    {...listProps}
  />
</div>`,
      },
    },
  },
};

const cssItems: TSelectorItem[] = [
  items[0],
  items[1],
  ...people.slice(0, 2),
  { ...people[3], isDisabled: true, disabledText: "Added" },
  ...people.slice(4, 8),
];

const CustomizationTemplate = (args: SelectorProps) => (
  <div
    style={
      {
        "--selector-border": "2px solid rgb(37, 99, 235)",
        "--selector-body-description-text": "rgb(22, 101, 52)",
        "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
        "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
        "--selector-info-background-color": "rgb(254, 243, 199)",
        "--selector-info-color": "rgb(146, 64, 14)",
        "--selector-item-hover-background": "rgb(219, 234, 254)",
        "--selector-item-selected-background": "rgb(220, 252, 231)",
        "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
        "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
        "--selector-item-input-button-border-hover": "rgb(46, 16, 101)",
        "--selector-empty-screen-description-color": "rgb(190, 24, 93)",
        "--selector-empty-screen-pressed-button-color": "rgb(190, 24, 93)",
      } as React.CSSProperties
    }
  >
    <Template {...args} source={cssItems} />
  </div>
);

export const CssCustomization: Story = {
  render: (args) => <CustomizationTemplate {...args} />,
  args: {
    ...Default.args,
    items: cssItems,
    totalItems: cssItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: [],
    selectedItem: people[1],
    alwaysShowFooter: true,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "My documents" },
      { id: 2, label: "Projects" },
      { id: 3, label: "Reports" },
    ],
    descriptionText: "Recent items",
    withInfo: true,
    infoText: "Only items you can edit are listed here.",
  },
  play: async ({ canvas }) => {
    const root = selector(canvas);
    // The border runs along the top of the footer.
    let footer = within(root).getByTestId("selector_submit_button")
      .parentElement as HTMLElement;
    while (getComputedStyle(footer).borderTopWidth !== "2px") {
      footer = footer.parentElement as HTMLElement;
    }
    await expect(getComputedStyle(footer).borderTopColor).toBe(
      "rgb(37, 99, 235)",
    );
    await expect(
      getComputedStyle(within(root).getByText("Recent items")).color,
    ).toBe("rgb(22, 101, 52)");
    const info = within(root).getByText(
      "Only items you can edit are listed here.",
    );
    await expect(getComputedStyle(info).color).toBe("rgb(146, 64, 14)");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover a row to see the hover background and hover the tick beside the name field to see its hover colour. The two empty-screen variables are set too but show only when the list is empty.`,
      },
      source: {
        code: `<div
  style={{
    "--selector-border": "2px solid rgb(37, 99, 235)",
    "--selector-body-description-text": "rgb(22, 101, 52)",
    "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
    "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
    "--selector-info-background-color": "rgb(254, 243, 199)",
    "--selector-info-color": "rgb(146, 64, 14)",
    "--selector-item-hover-background": "rgb(219, 234, 254)",
    "--selector-item-selected-background": "rgb(220, 252, 231)",
    "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
    "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
    "--selector-item-input-button-border-hover": "rgb(46, 16, 101)",
    "--selector-empty-screen-description-color": "rgb(190, 24, 93)",
    "--selector-empty-screen-pressed-button-color": "rgb(190, 24, 93)",
  }}
>
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    withInfo
    infoText="Only items you can edit are listed here."
    descriptionText="Recent items"
    selectedItem={picked}
    alwaysShowFooter
    {...listProps}
  />
</div>`,
      },
    },
  },
};
