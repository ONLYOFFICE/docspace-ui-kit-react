// @ts-nocheck

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SelectorProps, TSelectorItem } from "./Selector.types";

import React from "react";
import { EmployeeStatus, EmployeeType } from "@onlyoffice/docspace-api-sdk";
import FolderSvgUrl from "../../assets/icons/32/folder.svg?url";
import EmptyScreenFilter from "../../assets/emptyFilter/empty.filter.rooms.light.svg?url";
import { globalColors } from "../../providers/theme";
import { AvatarRole } from "../avatar";
import { Selector } from "./Selector";

// Deterministic on purpose. This used to call Math.random(), which gave every
// item a different label on every render -- fine to look at, impossible to
// screenshot, so the visual-regression spec for Selector could never match its
// own baseline. A simple index-seeded sequence keeps the labels looking varied
// while making the story reproducible.
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

const getItems = (count: number) => {
  const items: TSelectorItem[] = [];

  items.push({
    key: "create_new",
    id: "create_new_item",
    label: "New folder",
    isCreateNewItem: true,
    onCreateClick: () => {},
    onBackClick: () => {},
  });

  items.push({
    key: "input_item",
    id: "input_item",
    label: "",
    isInputItem: true,
    icon: FolderSvgUrl,
    defaultInputValue: "New folder",
    onAcceptInput: () => {},
    onCancelInput: () => {},
  });

  for (let i = 0; i < count; i += 1) {
    const label = makeName(i);
    items.push({
      key: `${label} ${i}`,
      id: `${label} ${i}`,
      label: `${label} ${i}`,
      email: "test",
      isOwner: false,
      isAdmin: false,
      isVisitor: false,
      isCollaborator: false,
      isRoomAdmin: false,
      avatar: "",
      role: AvatarRole.owner,
      hasAvatar: false,
      userType: EmployeeType.Admin,
      status: EmployeeStatus.Active,
    });
  }

  return items;
};

const getAccessRights = () => {
  const accesses = [
    {
      key: "roomManager",
      label: "Room manager",
      access: 0,
    },
    {
      key: "editor",
      label: "Editor",
      access: 1,
    },
    {
      key: "formFiller",
      label: "Form filler",
      access: 2,
    },
    {
      key: "reviewer",
      label: "Reviewer",
      access: 3,
    },
    {
      key: "commentator",
      label: "Commentator",
      access: 4,
    },
    {
      key: "viewer",
      label: "Viewer",
      access: 5,
    },
  ];

  return accesses;
};

const items = getItems(100000);

const selectedItems = [items[0], items[3], items[7]];

const accessRights = getAccessRights();

const selectedAccessRight = accessRights[1];

const renderedItems = items.slice(0, 100);
const totalItems = items.length;

const Template = (args: SelectorProps) => {
  const [rendItems, setRendItems] = React.useState(renderedItems);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const loadNextPage = React.useCallback(async (index: number) => {
    setRendItems((val) => [...val, ...items.slice(index, index + 100)]);
  }, []);

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
    <div
      ref={wrapperRef}
      style={{
        width: "480px",
        height: "485px",
        border: `1px solid ${globalColors.grayLightMid}`,
        margin: "auto",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Selector
        {...args}
        items={rendItems}
        loadNextPage={loadNextPage}
        searchLoader={<div />}
        rowLoader={<div />}
      />
    </div>
  );
};

const meta = {
  title: "UI/Overlays/Selector",
  component: Selector,
  parameters: {
    docs: {
      description: {
        component: `Selector is a versatile panel component for browsing, searching, and selecting items from large lists.

### Features

- **Search**: Built-in search with placeholder text and empty state
- **Multi-select**: Toggle between single and multi-select modes with "Select All" support
- **Breadcrumbs**: Navigate folder hierarchies with breadcrumb trail
- **Access rights**: Assign access levels when selecting users/groups
- **Empty screens**: Customizable empty states for no results and search
- **Virtual scroll**: Efficiently renders large lists with infinite loading
- **Footer input**: Optional input field in the footer for file naming

### Usage

\`\`\`tsx
import { Selector } from "@docspace/ui-kit/components/selector";

<Selector
  headerLabel="Select users"
  searchPlaceholder="Search users"
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    headerLabel: {
      control: "text",
      description: "Label displayed in the selector header",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    isMultiSelect: {
      control: "boolean",
      description: "Enable multi-select mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withSelectAll: {
      control: "boolean",
      description: 'Show a "Select All" option at the top of the list',
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withAccessRights: {
      control: "boolean",
      description: "Show access rights dropdown for selected items",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withCancelButton: {
      control: "boolean",
      description: "Show a cancel button in the footer",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBreadCrumbs: {
      control: "boolean",
      description: "Show breadcrumb navigation for folder hierarchy",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withSearch: {
      control: "boolean",
      description: "Show the search input field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state for the entire selector",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasNextPage: {
      control: "boolean",
      description: "Indicates more items are available for infinite scrolling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    alwaysShowFooter: {
      control: "boolean",
      description: "Always display the footer, even when no items are selected",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableSubmitButton: {
      control: "boolean",
      description: "Disable the submit button in the footer",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Selector>;

type Story = StoryObj<ComponentProps<typeof Selector>>;

export default meta;

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    headerLabel: "Room list",
    onBackClick: () => {},
    searchPlaceholder: "Search",
    searchValue: "",
    items: renderedItems,
    onSelect: () => {},
    isMultiSelect: false,
    selectedItems,
    submitButtonLabel: "Add",
    onSubmit: () => {},
    withSelectAll: false,
    selectAllLabel: "All accounts",
    selectAllIcon: "",
    onSelectAll: () => {},
    withAccessRights: false,
    accessRights,
    selectedAccessRight,
    onAccessRightsChange: () => {},
    withCancelButton: false,
    cancelButtonLabel: "Cancel",
    onCancel: () => {},
    emptyScreenImage: EmptyScreenFilter,
    emptyScreenHeader: "No other accounts here yet",
    emptyScreenDescription:
      "The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    searchEmptyScreenImage: EmptyScreenFilter,
    searchEmptyScreenHeader: "No other accounts here yet search",
    searchEmptyScreenDescription:
      " SEARCH !!! The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    totalItems,
    hasNextPage: true,
    isNextPageLoading: false,
    isLoading: false,
    withBreadCrumbs: false,
    breadCrumbs: [],
    onSelectBreadCrumb: () => {},
    breadCrumbsLoader: <div />,
    withoutBackButton: false,
    withSearch: false,
    isBreadCrumbsLoading: false,
    alwaysShowFooter: false,
    disableSubmitButton: false,
    descriptionText: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default Selector with a flat list of items, single selection mode, and basic configuration.",
      },
      source: {
        code: `<Selector
  headerLabel="Room list"
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
  parameters: {
    docs: {
      description: {
        story:
          "Content refresh state: while new data is loading (search, tab change or folder navigation), the current list stays on screen dimmed and non-interactive instead of being replaced with a skeleton.",
      },
    },
  },
};

export const BreadCrumbs: Story = {
  render: (args) => <Template {...args} />,
  args: {
    headerLabel: "Room list",
    onBackClick: () => {},
    searchPlaceholder: "Search",
    searchValue: "",
    items: renderedItems,
    onSelect: () => {},
    isMultiSelect: false,
    selectedItems,
    submitButtonLabel: "Add",
    onSubmit: () => {},
    withSelectAll: false,
    selectAllLabel: "All accounts",
    selectAllIcon: "",
    onSelectAll: () => {},
    withAccessRights: false,
    accessRights,
    selectedAccessRight,
    onAccessRightsChange: () => {},
    withCancelButton: false,
    cancelButtonLabel: "Cancel",
    onCancel: () => {},
    emptyScreenImage: EmptyScreenFilter,
    emptyScreenHeader: "No other accounts here yet",
    emptyScreenDescription:
      "The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    searchEmptyScreenImage: EmptyScreenFilter,
    searchEmptyScreenHeader: "No other accounts here yet search",
    searchEmptyScreenDescription:
      " SEARCH !!! The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    totalItems,
    hasNextPage: true,
    isNextPageLoading: false,
    isLoading: false,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "DocSpace" },
      { id: 2, label: "1111111" },
      { id: 3, label: "21222222222" },
      { id: 4, label: "32222222222222222222222222222222222222" },
      { id: 5, label: "4222222222222222222222222222222222222" },
    ],
    onSelectBreadCrumb: () => {},
    breadCrumbsLoader: <div />,
    withoutBackButton: false,
    withSearch: false,
    isBreadCrumbsLoading: false,
    withFooterInput: false,
    footerInputHeader: "",
    footerCheckboxLabel: "",
    currentFooterInputValue: "",
    alwaysShowFooter: false,
    disableSubmitButton: false,
    descriptionText: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Selector with breadcrumb navigation enabled, allowing users to traverse folder hierarchies.",
      },
      source: {
        code: `<Selector
  headerLabel="Room list"
  items={items}
  withBreadCrumbs
  breadCrumbs={[
    { id: 1, label: "DocSpace" },
    { id: 2, label: "Folder A" },
    { id: 3, label: "Subfolder B" },
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
    headerLabel: "Room list",
    onBackClick: () => {},
    searchPlaceholder: "Search",
    searchValue: "",
    items: renderedItems,
    onSelect: () => {},
    isMultiSelect: false,
    selectedItems,
    submitButtonLabel: "Add",
    onSubmit: () => {},
    withSelectAll: false,
    selectAllLabel: "All accounts",
    selectAllIcon: "",
    onSelectAll: () => {},
    withAccessRights: false,
    accessRights,
    selectedAccessRight,
    onAccessRightsChange: () => {},
    withCancelButton: false,
    cancelButtonLabel: "Cancel",
    onCancel: () => {},
    emptyScreenImage: EmptyScreenFilter,
    emptyScreenHeader: "No other accounts here yet",
    emptyScreenDescription:
      "The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    searchEmptyScreenImage: EmptyScreenFilter,
    searchEmptyScreenHeader: "No other accounts here yet search",
    searchEmptyScreenDescription:
      " SEARCH !!! The list of users previously invited to DocSpace or separate rooms will appear here. You will be able to invite these users for collaboration at any time.",
    totalItems,
    hasNextPage: true,
    isNextPageLoading: false,
    isLoading: false,
    withBreadCrumbs: true,
    breadCrumbs: [
      { id: 1, label: "DocSpace" },
      { id: 2, label: "1111111" },
      { id: 3, label: "21222222222" },
    ],
    onSelectBreadCrumb: () => {},
    breadCrumbsLoader: <div />,
    withoutBackButton: false,
    withSearch: false,
    isBreadCrumbsLoading: false,
    withFooterInput: true,
    footerInputHeader: "File name",
    footerCheckboxLabel: "Open saved document in new tab",
    currentFooterInputValue: "OldFIleName.docx",
    alwaysShowFooter: false,
    disableSubmitButton: false,
    descriptionText: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Selector with a footer input field for renaming files during the save/copy operation.",
      },
      source: {
        code: `<Selector
  headerLabel="Room list"
  items={items}
  withBreadCrumbs
  breadCrumbs={breadCrumbs}
  withFooterInput
  footerInputHeader="File name"
  footerCheckboxLabel="Open saved document in new tab"
  currentFooterInputValue="OldFileName.docx"
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>`,
      },
    },
  },
};
