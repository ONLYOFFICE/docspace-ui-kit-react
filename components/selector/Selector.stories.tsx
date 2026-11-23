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
      description: "Applied to the outermost element.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    style: {
      control: "object",
      description: "Applied to the outermost element.",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element.",
      table: { defaultValue: { summary: "selector" } },
    },
    withHeader: {
      control: "boolean",
      description:
        "Whether the panel has a header bar. It only accepts `true` — leave it out for a selector with no header of its own.",
    },
    headerProps: {
      control: "object",
      description: "The header's own props. Required once `withHeader` is set.",
    },
    items: {
      control: false,
      description:
        "The page of items loaded so far, in the order they are shown.",
    },
    onSelect: {
      action: "onSelect",
      description:
        "Called when a row is clicked, before Selector updates its own selection. The third argument submits with that one item, which is how a double click confirms a choice.",
    },
    isMultiSelect: {
      control: "boolean",
      description:
        "Whether rows carry checkboxes and more than one can be ticked.",
      table: { defaultValue: { summary: "false" } },
    },
    forceIsMultiSelect: {
      control: "boolean",
      description: "Overrules this row's own `disableMultiSelect`.",
      table: { defaultValue: { summary: "false" } },
    },
    selectedItems: {
      control: false,
      description:
        "Items to start out ticked, matched by `id`. Selector copies them into its own state; it is a starting point, not a controlled value.",
    },
    selectedItem: {
      control: false,
      description: "The one ticked item outside multi-select, matched by `id`.",
    },
    maxSelectedItems: {
      control: "number",
      description:
        "Largest number of items that may be ticked at once. Beyond it the unticked rows go grey and stop responding, with no message of their own.",
    },
    renderCustomItem: {
      control: false,
      description:
        "Replaces the text of a row, keeping its avatar, checkbox and layout.",
    },
    displayFileExtension: {
      control: "boolean",
      description:
        "Whether a file's extension is drawn after its name, in a dimmer colour.",
      table: { defaultValue: { summary: "false" } },
    },
    loadNextPage: {
      control: false,
      description:
        "Called with the index to start from when the list nears its end, and once with 0 on mount unless `disableFirstFetch` is set. Append to `items`.",
    },
    disableFirstFetch: {
      control: "boolean",
      description:
        "Whether to skip the `loadNextPage(0)` call Selector makes on mount.",
      table: { defaultValue: { summary: "false" } },
    },
    hasNextPage: {
      control: "boolean",
      description: "Whether another page can be fetched.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isNextPageLoading: {
      control: "boolean",
      description:
        "Whether a page request is in flight, which suppresses another one.",
      table: { defaultValue: { summary: "false" } },
    },
    totalItems: {
      control: "number",
      description:
        "How many items exist in total, which is what the scrollbar is sized from.",
    },
    isLoading: {
      control: "boolean",
      description: "Initial load: the body is replaced with a skeleton loader",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isContentLoading: {
      control: "boolean",
      description:
        "Content refresh: the current body stays on screen dimmed; wins over isLoading",
      table: { defaultValue: { summary: "false" } },
    },
    rowLoader: {
      control: false,
      description:
        "Skeleton for a row that has not arrived yet, and for the whole body during the initial load. `RowLoader` from this folder fits.",
    },
    isSSR: {
      control: "boolean",
      description:
        "Whether to render every item as plain markup instead of virtualising. The list needs a measured height, which server rendering cannot give it.",
      table: { defaultValue: { summary: "false" } },
    },
    withPadding: {
      control: "boolean",
      description: "Whether the body keeps its 16px of padding at the top.",
      table: { defaultValue: { summary: "true" } },
    },
    descriptionText: {
      control: "text",
      description:
        "A line of bold text above the list. It costs the list 32px of height.",
    },
    injectedElement: {
      control: false,
      description:
        "Rendered between the breadcrumbs and the search box. Selector clones it to attach a ref and subtracts its measured height from the list.",
    },
    withSearch: {
      control: "boolean",
      description:
        "Whether the list can be searched. It only accepts `true`. The box hides while the list is empty and no search runs, so an empty folder shows the empty screen.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    searchPlaceholder: {
      control: "text",
      description: "Grey text in the empty search box.",
    },
    searchValue: {
      control: "text",
      description:
        "Text in the box. Searching is yours to do; this is what is displayed.",
    },
    isSearchLoading: {
      control: "boolean",
      description: "Whether to replace the box with `searchLoader`.",
      table: { defaultValue: { summary: "false" } },
    },
    searchLoader: {
      control: false,
      description: "Shown in place of the box while `isSearchLoading` is set.",
    },
    onSearch: {
      action: "onSearch",
      description:
        "Called with the trimmed query once typing stops. Call the callback to put the selector into its searching state, which is what swaps the empty screen for the search one. An empty query calls `onClearSearch` instead.",
    },
    onClearSearch: {
      action: "onClearSearch",
      description:
        "Called by the box's cross and by the empty screen's \"clear filter\" link. Call the callback to take the selector out of its searching state.",
    },
    withSelectAll: {
      control: "boolean",
      description:
        'Whether the "select all" row sits above the list. It only accepts `true`, and the row appears only with `isMultiSelect` and only while no search is running.',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    selectAllLabel: {
      control: "text",
      description: "Text of that row.",
    },
    selectAllIcon: {
      control: "text",
      description: "URL of the icon beside it.",
    },
    onSelectAll: {
      action: "onSelectAll",
      description:
        "Called when the row is clicked. Selector ticks and unticks the loaded items itself; this is a notification, not the implementation.",
    },
    withBreadCrumbs: {
      control: "boolean",
      description:
        "Whether the folder trail is shown above the list. It only accepts `true`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    breadCrumbs: {
      control: "object",
      description:
        "The trail, outermost first. The last entry is the current folder.",
    },
    onSelectBreadCrumb: {
      action: "onSelectBreadCrumb",
      description:
        "Called with the crumb that was clicked. Navigating is your job: fetch that folder and hand back new `items` and `breadCrumbs`.",
    },
    isBreadCrumbsLoading: {
      control: "boolean",
      description: "Whether to replace the trail with `breadCrumbsLoader`.",
      table: { defaultValue: { summary: "false" } },
    },
    breadCrumbsLoader: {
      control: false,
      description:
        "Shown in place of the trail while it loads; `BreadCrumbsLoader` fits.",
    },
    withTabs: {
      control: false,
      description:
        "Whether a tab strip is shown above the list. It only accepts `true`.",
    },
    tabsData: {
      control: false,
      description:
        "One entry per tab in the strip above the list, left to right.",
    },
    activeTabId: {
      control: "text",
      description:
        "Id of the open tab. Selector keeps one selection per tab id and adds them all up, so switching tabs does not drop what was ticked on the other.",
    },
    withInfo: {
      control: "boolean",
      description:
        "Whether a tinted note sits between the search box and the list. It only accepts `true`, and the note is hidden during the initial load.",
      table: { defaultValue: { summary: "false" } },
    },
    infoText: {
      control: "text",
      description:
        "Text of the tinted note between the search box and the list.",
    },
    withInfoBadge: {
      control: "boolean",
      description: "Whether an icon is drawn beside the text.",
      table: { defaultValue: { summary: "false" } },
    },
    withInfoBar: {
      control: "boolean",
      description: "Whether a dismissable bar is shown above the list.",
      table: { defaultValue: { summary: "false" } },
    },
    infoBarData: {
      control: "object",
      description: "What that bar says. Nothing is drawn without it.",
    },
    emptyScreenImage: {
      control: false,
      description:
        "Picture for the empty folder. A string is used as an `<img>` source, an element is rendered as it is.",
    },
    emptyScreenHeader: {
      control: "text",
      description: "Heading for the empty folder.",
    },
    emptyScreenDescription: {
      control: "text",
      description: "Paragraph under that heading.",
    },
    searchEmptyScreenImage: {
      control: false,
      description: "The same picture, for a search that found nothing.",
    },
    searchEmptyScreenHeader: {
      control: "text",
      description: "Heading for a search that found nothing.",
    },
    searchEmptyScreenDescription: {
      control: "text",
      description: "Paragraph under that heading.",
    },
    hideBackButton: {
      control: "boolean",
      description: 'Whether the empty screen\'s "back" link is hidden.',
      table: { defaultValue: { summary: "false" } },
    },
    alwaysShowFooter: {
      control: "boolean",
      description:
        "Whether the footer stays put instead of appearing with the first tick.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    submitButtonLabel: {
      control: "text",
      description:
        'Text of the primary button. In multi-select the count is appended in brackets, so pass "Add", not "Add (3)".',
    },
    submitButtonId: {
      control: "text",
      description: "`id` attribute of the primary button.",
    },
    disableSubmitButton: {
      control: "boolean",
      description:
        "Whether the primary button is dead. With `withFooterInput` an empty input disables it too, whatever this says.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with everything the footer holds. Return a promise and the button shows its spinner until it settles. Enter fires it as well.",
    },
    withCancelButton: {
      control: "boolean",
      description:
        "Whether a second, non-primary button sits in the footer. It only accepts `true`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    cancelButtonLabel: {
      control: "text",
      description:
        "Text on the footer's second button, the one that calls `onCancel`.",
    },
    cancelButtonId: {
      control: "text",
      description:
        "Placed as the `id` attribute on the footer's second button.",
    },
    onCancel: {
      action: "onCancel",
      description:
        "Called by that button — and by Escape, which Selector listens for on the window whether or not the button is there.",
    },
    withAccessRights: {
      control: "boolean",
      description:
        "Whether the footer carries an access drop-down. It only accepts `true`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    accessRights: {
      control: "object",
      description: "The choices in that drop-down.",
    },
    selectedAccessRight: {
      control: "object",
      description:
        "The chosen access. Selector copies it into its own state on mount and whenever this changes, and hands that copy to `onSubmit`.",
    },
    onAccessRightsChange: {
      action: "onAccessRightsChange",
      description: "Called when the choice changes.",
    },
    accessRightsMode: {
      control: "select",
      options: Object.values(SelectorAccessRightsMode),
      description:
        "How the access list opens: `compact` fits its entries, `detailed` spans the footer, or the screen as a panel on a phone.",
      table: { defaultValue: { summary: "compact" } },
    },
    withFooterInput: {
      control: "boolean",
      description:
        'Whether the footer carries a text field — the "save as" name. It only accepts `true`, and it makes the footer 145px instead of 73px.',
      table: { defaultValue: { summary: "false" } },
    },
    footerInputHeader: {
      control: "text",
      description: "Label above that field.",
    },
    currentFooterInputValue: {
      control: "text",
      description:
        "Initial text of the field. Selector owns the value from then on and hands the edited one to `onSubmit`; changing this prop later does nothing.",
    },
    folderFormValidation: {
      control: false,
      description:
        'Matched against the footer input on every keystroke. A match marks the field as in error under a "contains special characters" line, so the pattern describes what is *forbidden*.',
    },
    withFooterCheckbox: {
      control: "boolean",
      description:
        "Whether the footer carries a checkbox. It only accepts `true`, and it makes the footer 110px, or 181px alongside `withFooterInput`.",
      table: { defaultValue: { summary: "false" } },
    },
    footerCheckboxLabel: {
      control: "text",
      description: "Text shown beside the footer checkbox.",
    },
    isChecked: {
      control: "boolean",
      description:
        "Initial state of the checkbox. Selector owns it from then on and hands the current value to `onSubmit`; changing this prop later does nothing.",
      table: { defaultValue: { summary: "false" } },
    },
    useAside: {
      control: false,
      description:
        "Whether Selector wraps itself in a backdrop and an `Aside`. It is the only way the component becomes a panel; on its own it is a plain box that fills its parent.",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by the backdrop and by the aside. Required once `useAside` is set.",
    },
    withoutBackground: {
      control: "boolean",
      description: "Whether the backdrop behind the aside is transparent.",
      table: { defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof Selector>;

type Story = StoryObj<ComponentProps<typeof Selector>>;

export default meta;

export const Default: Story = {
  name: "Paged list",
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
          'A long list that loads 100 rows at a time, with one row picked at a time. The first row is a "New folder" entry and the second its inline name field (`isCreateNewItem`, `isInputItem`).',
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
  name: "Dimmed while loading",
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
          "The list dimmed while new data loads, for a search, a tab change or a folder change (`isContentLoading`). The rows stay on screen and the pointer cannot reach them.",
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
  name: "Folder trail",
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
          "A folder trail above the list, for one level of a folder tree. With more than three folders, the middle ones collapse into a menu behind the dots. `onSelectBreadCrumb` reports an earlier folder; loading it is yours.",
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
  name: "Save as",
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
          'A name field in the footer, for a "save as" or copy flow that picks a folder and names the file. The checkbox under it is a second choice for `onSubmit` (`withFooterCheckbox`). An empty field disables the Add button.',
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
  name: "With header",
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
          "A header with a title, a closing cross and a back arrow (`headerProps.withoutBackButton: false`), for a panel standing on its own. The footer's second button calls `onCancel`, as Escape does.",
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
  name: "With search",
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
          "A search box above the list, for a reader who knows the name. The story filters the rows itself: Selector hands over the query in `onSearch` and shows the `items` you give back. A query with no match shows the search empty screen.",
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
  name: "Several at once",
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
          'Checkboxes on every row, for adding several items in one go. Two rows start out ticked (`selectedItems`), and the Add button counts them. The "All items" row ticks or unticks every loaded row (`withSelectAll`).',
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
  name: "Selection limit",
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
  play: async ({ args, canvas, userEvent }) => {
    const root = selector(canvas);
    // At the limit, an unticked row is greyed out and ignores clicks.
    const other = row(root, limitItems[1].label);
    await expect(other.className).toMatch(/disabled/);
    other.click();
    await expect(args.onSelect).not.toHaveBeenCalled();

    const list = within(root).getByRole("listbox");
    const active = () =>
      document.getElementById(list.getAttribute("aria-activedescendant") ?? "")
        ?.textContent ?? "";

    // Focused, the list puts the keyboard on the ticked row on screen; the
    // arrows then step over the rows the limit disables.
    list.focus();
    await waitFor(() => expect(active()).toContain(limitItems[0].label));
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(active()).toContain(limitItems[2].label));

    // Space unticks it, and the keyboard stays on that row.
    await userEvent.keyboard(" ");
    await waitFor(() => expect(args.onSelect).toHaveBeenCalled());
    await expect(active()).toContain(limitItems[2].label);

    // Below the limit again, the row between is back within reach.
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(active()).toContain(limitItems[1].label));
  },
  parameters: {
    docs: {
      description: {
        story:
          "A selection capped at two with two rows ticked, so every other row is greyed out and ignores clicks (`maxSelectedItems`). Selector shows no message of its own; say what the limit is near the panel.",
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
  name: "Disabled rows",
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
  name: "With access drop-down",
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
          "An access drop-down beside the Add button, for items that need a permission as well. The choice goes to `onSubmit` with the ticked items. With `accessRightsMode` set to `detailed` the list spans the footer.",
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
  name: "Empty folder",
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
          'An empty folder: the picture, heading and paragraph you pass (`emptyScreenImage`, `emptyScreenHeader`, `emptyScreenDescription`). The "New folder" link is the `isCreateNewItem` row. "Back" goes to the previous folder of the trail, and `hideBackButton` removes it.',
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
  name: "Skeletons",
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
          "Skeletons while the first page is on its way, so the panel keeps its shape. The trail, the search box and the list each have their own, switched on separately (`isBreadCrumbsLoading`, `isSearchLoading`, `isLoading`).",
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
  name: "With tabs",
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
          "A list split into tabs, for items from separate sources. Selector keeps a selection per tab and the Add button counts them all (`withTabs`, `tabsData`, `activeTabId`). Switching tabs is yours, from each tab's `onClick`.",
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
  name: "Note and heading",
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
          "Two ways to say something about the list:\n\n- **Only items you can edit are listed here** — a tinted note with an icon, for what the list holds (`withInfo`, `infoText`, `withInfoBadge`)\n- **Recent items** — a bold line above the rows, for a short heading (`descriptionText`)",
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
  name: "With info bar",
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
  name: "Side panel",
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
          "Selector as a side panel over a dimmed backdrop, for picking as a step of its own (`useAside`). A click on the backdrop calls `onClose`. Without `useAside`, Selector is a plain box that fills its parent.",
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
  name: "Right to left",
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
          "The panel in a right-to-left layout. The folder trail starts at the right edge with its arrows pointing left, and the rows and footer line up from the right.",
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
        "--selector-body-description-text":
          "light-dark(rgb(22, 101, 52), rgb(134, 239, 172))",
        "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
        "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
        "--selector-info-background-color":
          "light-dark(rgb(254, 243, 199), rgb(66, 50, 15))",
        "--selector-info-color":
          "light-dark(rgb(146, 64, 14), rgb(253, 186, 116))",
        "--selector-item-hover-background":
          "light-dark(rgb(219, 234, 254), rgb(30, 41, 70))",
        "--selector-item-selected-background":
          "light-dark(rgb(220, 252, 231), rgb(20, 60, 35))",
        "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
        "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
        "--selector-item-input-button-border-hover":
          "light-dark(rgb(46, 16, 101), rgb(196, 181, 253))",
        "--selector-empty-screen-description-color": "rgb(190, 24, 93)",
        "--selector-empty-screen-pressed-button-color": "rgb(190, 24, 93)",
      } as React.CSSProperties
    }
  >
    <Template {...args} source={cssItems} />
  </div>
);

export const CssCustomization: Story = {
  name: "CSS variables",
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
        story: `Every overridable variable set on one wrapper, as listed under CSS variables. The row hover background and the name field's tick hover colour show on hover. The two empty-screen variables show only while the list is empty.`,
      },
      source: {
        code: `<div
  style={{
    "--selector-border": "2px solid rgb(37, 99, 235)",
    "--selector-body-description-text": "light-dark(rgb(22, 101, 52), rgb(134, 239, 172))",
    "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
    "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
    "--selector-info-background-color": "light-dark(rgb(254, 243, 199), rgb(66, 50, 15))",
    "--selector-info-color": "light-dark(rgb(146, 64, 14), rgb(253, 186, 116))",
    "--selector-item-hover-background": "light-dark(rgb(219, 234, 254), rgb(30, 41, 70))",
    "--selector-item-selected-background": "light-dark(rgb(220, 252, 231), rgb(20, 60, 35))",
    "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
    "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
    "--selector-item-input-button-border-hover": "light-dark(rgb(46, 16, 101), rgb(196, 181, 253))",
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
