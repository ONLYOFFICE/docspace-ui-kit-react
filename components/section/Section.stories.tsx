import type { ComponentProps } from "react";
import { useRef } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";
import { DeviceType, FilterGroups, SortByFieldName } from "../../enums";
import Filter from "../filter";
import Navigation from "../navigation/Navigation";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "../table";
import { Tabs } from "../tabs";
import { Text } from "../text";
import type { Operation } from "../operations-progress-button/OperationsProgressButton.types";

import Section from "./index";

const meta = {
  title: "UI/Layout/Section",
  component: Section,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  args: {
    onDrop: fn(),
    onDragOverEmpty: fn(),
    onDragLeaveEmpty: fn(),
    setIsInfoPanelVisible: fn(),
    setIsChatPanelVisible: fn(),
    setChatPanelWidth: fn(),
    onOpenUploadPanel: fn(),
    cancelUpload: fn(),
    clearSecondaryProgressData: fn(),
    clearPrimaryProgressData: fn(),
    cancelSecondaryOperationById: fn(),
    clearDropPreviewLocation: fn(),
  },
  argTypes: {
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description:
        "Which layout to render: where the header and the filter go, whether the body scrolls itself and whether the info panel sits beside the body or covers the page. Nothing measures the window, so the host passes the value that fits it",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description:
        "Gives the body a scroller of its own under the pinned header; off, the page scrolls instead and the section takes a 20px inline-start padding. On a phone the page always scrolls",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    settingsStudio: {
      control: "boolean",
      description: "Applies the settings pages' narrower body padding",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    viewAs: {
      control: "select",
      options: [
        "row",
        "table",
        "tile",
        "tileDynamicHeight",
        "settings",
        "profile",
      ],
      description:
        "Which listing the body holds. `settings` and `profile` drop the body's top padding",
    },
    isInfoPanelAvailable: {
      control: "boolean",
      description:
        "Whether the info panel region exists at all; off, it is never rendered whatever `isInfoPanelVisible` says",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel is open. It shows only while `canDisplay` is set as well",
    },
    canDisplay: {
      control: "boolean",
      description:
        "Allows the info panel to be shown. Without it the panel stays hidden even while `isInfoPanelVisible` is set",
    },
    setIsInfoPanelVisible: {
      control: false,
      description:
        "Called with `false` when the info panel closes itself on a device below desktop: a click on the dimmed page around it, or the browser going back",
    },
    isMobileHidden: {
      control: "boolean",
      description: "Hides the info panel on any device below desktop",
    },
    anotherDialogOpen: {
      control: "boolean",
      description:
        "Hides the info panel below desktop while another dialog is open, so the two do not stack",
    },
    infoPanelWithoutScroll: {
      control: "boolean",
      description:
        "Removes the info panel body's own scroller, for panel content that scrolls its own regions",
    },
    isInfoPanelScrollLocked: {
      control: "boolean",
      description:
        "Freezes the info panel's scroller, for a drag or a menu that must not scroll the panel under it",
    },
    isChatPanelAvailable: {
      control: "boolean",
      description:
        "Whether the chat panel region exists at all; off, it is never rendered",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isChatPanelVisible: {
      control: "boolean",
      description:
        "Whether the chat panel is open. On tablet and phone it covers the whole page",
    },
    setIsChatPanelVisible: {
      control: false,
      description:
        "Called with `false` when the browser goes back while the chat panel is open on a device below desktop",
    },
    chatPanelDropTargetLabel: {
      control: "text",
      description:
        'Text of a dashed "drop here" frame drawn over the chat panel; set it while the host drags its own items over the panel and clear it afterwards',
    },
    isChatPanelResizable: {
      control: "boolean",
      description:
        "Adds a drag handle on the chat panel's inner edge that changes its width, on desktop only",
    },
    chatPanelWidth: {
      control: "number",
      description:
        "Width of the docked chat panel in pixels while the handle is on; without it the panel is 400px wide",
    },
    setChatPanelWidth: {
      control: false,
      description:
        "Called once per handle drag, when the mouse is released, with the new width in pixels",
    },
    setChatPanelFullscreen: {
      control: false,
      description:
        "Called when the handle is dragged past the widest width the page allows; the host is expected to turn fullscreen on. Without it the drag stops at that width",
    },
    unsetChatPanelFullscreen: {
      control: false,
      description:
        "Called when the handle is dragged back inwards in fullscreen; the host turns fullscreen off and the same drag goes on resizing the panel",
    },
    isChatPanelFullscreen: {
      control: "boolean",
      description:
        "Whether the host renders the chat panel fullscreen right now; the handle then only listens for the drag back inwards",
    },
    scrollableBanner: {
      control: "boolean",
      description:
        "Puts the banner at the top of the scrolling body, so it scrolls away under the header, instead of pinning it above the scroller",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stickyTableHeader: {
      control: "boolean",
      description:
        "Moves the desktop filter into the scrolling body, where it sticks under the header, and lets a table header stick under the filter instead of being fixed. The host gives the resting offsets in CSS variables",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inert: {
      control: "boolean",
      description:
        "Makes the whole section unfocusable and unclickable and hides it from assistive technology, for a section kept mounted behind a fullscreen panel",
    },
    withTabs: {
      control: "boolean",
      description:
        "Marks the filter below desktop as sitting under tabs. No style reads the mark any more, so it changes nothing on screen",
    },
    withoutFooter: {
      control: "boolean",
      description: "Drops the footer slot and the empty space under the body",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fullHeightBody: {
      control: "boolean",
      description:
        "Makes the body fill the height below the header rather than its content's, for a page whose inner regions scroll instead",
    },
    getContextModel: {
      control: false,
      description:
        "Returns the items of the menu that opens on a right click anywhere in the body. Without it no menu is mounted",
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Turns the body's right-click menu off while the listing is being reordered",
    },
    pathname: {
      control: "text",
      description:
        "The current route; changing it asks the body to take the focus again on desktop",
    },
    onDrop: {
      control: false,
      description:
        "Called with the files dropped anywhere on the body. Nothing is filtered and nothing is highlighted",
    },
    onDragOverEmpty: {
      control: false,
      description:
        "Called on every drag over the body, with a flag saying whether a drag was already active",
    },
    onDragLeaveEmpty: {
      control: false,
      description: "Called when a drag leaves the body",
    },
    secondaryActiveOperations: {
      control: "object",
      description:
        "Background operations (copy, move, delete…) shown in the floating progress button. Any non-empty list makes the button appear",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    primaryOperationsArray: {
      control: "object",
      description:
        "Upload operations shown in the progress button's own panel. Any non-empty list makes the button appear",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    pluginOperations: {
      control: "object",
      description:
        "Operations contributed by plugins, listed with the background ones. Any non-empty list makes the button appear",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    secondaryOperationsCompleted: {
      control: "boolean",
      description:
        "Whether the background operations have finished, for the button's completed look",
    },
    primaryOperationsCompleted: {
      control: "boolean",
      description: "Whether the uploads have finished",
    },
    pluginOperationsCompleted: {
      control: "boolean",
      description: "Whether the plugin operations have finished",
    },
    secondaryOperationsStopped: {
      control: "boolean",
      description:
        "Whether the background operations were stopped rather than finished",
    },
    secondaryOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert look for a failed background operation",
    },
    primaryOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert look for a failed upload",
    },
    pluginOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert look for a failed plugin operation",
    },
    primaryOperationsCanceled: {
      control: "boolean",
      description: "Whether the uploads were cancelled",
    },
    needErrorChecking: {
      control: "boolean",
      description:
        "Makes the progress button check its operations for errors before showing them as complete",
    },
    pluginShowCancelButton: {
      control: "boolean",
      description:
        "Shows the progress button's cancel control whatever the operations say",
    },
    mainButtonVisible: {
      control: "boolean",
      description:
        "Whether a main action button is on screen, which moves the progress button clear of it",
    },
    onOpenUploadPanel: {
      control: false,
      description:
        "Called when the progress button asks to open the upload panel",
    },
    cancelUpload: {
      control: false,
      description:
        "Called by the progress button's cancel control while an upload is running",
    },
    clearSecondaryProgressData: {
      control: false,
      description: "Called to clear a finished background operation",
    },
    clearPrimaryProgressData: {
      control: false,
      description: "Called to clear a finished upload",
    },
    cancelSecondaryOperationById: {
      control: false,
      description:
        "Called with an operation type and id to cancel one background operation",
    },
    dragging: {
      control: "boolean",
      description:
        "Whether the host is dragging its own items, which switches the progress button to a drop preview",
    },
    dropTargetPreview: {
      control: "text",
      description:
        "Name of the folder a dragged item would land in, shown by the progress button's drop preview",
    },
    clearDropPreviewLocation: {
      control: false,
      description: "Called to clear that drop preview",
    },
    startDropPreview: {
      control: false,
      description:
        "Passing it at all makes the progress button appear even with no operations, so a drag can show its drop preview",
    },
  },
} satisfies Meta<typeof Section>;

type Story = StoryObj<ComponentProps<typeof Section>>;

export default meta;

const COLUMN_STORAGE_NAME = "section-story-columns";
const COLUMN_INFO_PANEL_STORAGE_NAME = "section-story-columns-info";

const noop = () => {};

const mockNavigationItems = [
  { id: "1", title: "Documents", isRootRoom: false },
  { id: "2", title: "Shared with me", isRootRoom: false },
  { id: "3", title: "Project files", isRootRoom: true },
];

const mockSortData = [
  {
    key: "name",
    label: "Name",
    isSelected: false,
    id: "1",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
  {
    key: "modified",
    label: "Modified",
    isSelected: false,
    id: "2",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
  {
    key: "size",
    label: "Size",
    isSelected: false,
    id: "3",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
];

const mockViewSettings = [
  { id: "1", label: "Grid", value: "tile", icon: <ViewTilesReactSvg /> },
  { id: "2", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
];

const mockColumns = [
  {
    key: "name",
    title: "Name",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: noop,
    onClick: noop,
  },
  {
    key: "type",
    title: "Type",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: noop,
    onClick: noop,
  },
  {
    key: "tags",
    title: "Tags",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: noop,
    onClick: noop,
  },
];

const mockFiles = [
  { name: "Annual Report 2025.docx", type: "Document", tags: "Finance" },
  { name: "Q4 Budget.xlsx", type: "Spreadsheet", tags: "Finance" },
  { name: "Team Presentation.pptx", type: "Presentation", tags: "Marketing" },
  { name: "Logo Design.png", type: "Image", tags: "Design" },
  { name: "Meeting Notes.docx", type: "Document", tags: "General" },
  { name: "Product Roadmap.pdf", type: "PDF", tags: "Product" },
  { name: "User Research.docx", type: "Document", tags: "UX" },
  { name: "Sprint Backlog.xlsx", type: "Spreadsheet", tags: "Engineering" },
  { name: "Brand Guidelines.pdf", type: "PDF", tags: "Marketing" },
  { name: "Architecture Diagram.png", type: "Image", tags: "Engineering" },
];

const NavigationHeader = ({
  device = DeviceType.desktop,
}: {
  device?: DeviceType;
}) => (
  <Navigation
    title="My Documents"
    isRootFolder={false}
    canCreate
    showText
    isDesktop={device === DeviceType.desktop}
    isRoom={false}
    withMenu
    showTitle
    showRootFolderTitle
    showNavigationButton={false}
    isInfoPanelVisible={false}
    isCurrentFolderInfo={false}
    currentDeviceType={device}
    navigationItems={mockNavigationItems}
    onClickFolder={noop}
    onBackToParentFolder={noop}
    clearTrash={noop}
    getContextOptionsFolder={() => [
      { key: "rename", label: "Rename" },
      { key: "delete", label: "Delete" },
    ]}
    getContextOptionsPlus={() => [
      { key: "upload", label: "Upload file" },
      { key: "create", label: "Create folder" },
    ]}
    toggleInfoPanel={noop}
    hideInfoPanel={noop}
    showFolderInfo={noop}
    onPlusClick={noop}
    withLogo={false}
    burgerLogo=""
    titleIcon=""
    rootRoomTitle=""
  />
);

const FilterContent = ({
  device = DeviceType.desktop,
}: {
  device?: DeviceType;
}) => (
  <Filter
    viewAs="row"
    view="row"
    placeholder="Search..."
    filterTitle="Filter"
    sortByTitle="Sort by"
    filterHeader="Filter"
    selectorLabel="Select"
    userId="1"
    currentDeviceType={device}
    viewSelectorVisible
    isRooms={false}
    isContactsPage={false}
    isContactsPeoplePage={false}
    isContactsGroupsPage={false}
    isContactsInsideGroupPage={false}
    isContactsGuestsPage={false}
    isIndexing={false}
    isIndexEditingMode={false}
    isRecentFolder={false}
    clearSearch={false}
    setClearSearch={noop}
    onSearch={noop}
    onClearFilter={noop}
    onChangeViewAs={noop}
    onSort={noop}
    onFilter={noop}
    onSortButtonClick={noop}
    removeSelectedItem={noop}
    clearAll={noop}
    getSelectedInputValue={() => ""}
    getSortData={() => mockSortData}
    getSelectedSortData={() => ({ sortDirection: "asc", sortId: "AZ" })}
    getViewSettingsData={() => mockViewSettings}
    getFilterData={() =>
      Promise.resolve([
        {
          key: FilterGroups.filterType,
          group: FilterGroups.filterType,
          label: "Type",
          isHeader: true,
          isLast: true,
        },
        {
          id: "filter_type-documents",
          key: "documents",
          group: FilterGroups.filterType,
          label: "Documents",
        },
        {
          id: "filter_type-spreadsheets",
          key: "spreadsheets",
          group: FilterGroups.filterType,
          label: "Spreadsheets",
        },
      ])
    }
    getSelectedFilterData={() => Promise.resolve([])}
  />
);

const TableContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = mockFiles.map((file) => (
    <TableRow key={`row-${file.name}`}>
      <TableCell>{file.name}</TableCell>
      <TableCell>{file.type}</TableCell>
      <TableCell>{file.tags}</TableCell>
    </TableRow>
  ));

  return (
    <TableContainer forwardedRef={containerRef} useReactWindow={false}>
      <TableHeader
        containerRef={containerRef}
        columns={mockColumns}
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        sectionWidth={800}
        useReactWindow={false}
        showSettings
        sortingVisible
        sorted
      />
      <TableBody
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        fetchMoreFiles={async () => {}}
        filesLength={mockFiles.length}
        hasMoreFiles={false}
        itemCount={mockFiles.length}
        itemHeight={50}
        useReactWindow={false}
      >
        {rows}
      </TableBody>
    </TableContainer>
  );
};

const sectionLabelStyle: React.CSSProperties = {
  position: "absolute",
  top: "2px",
  insetInlineEnd: "4px",
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "1px 6px",
  borderRadius: "3px",
  zIndex: 300,
  pointerEvents: "none",
};

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "100%", height: "600px" }}>
      <Section {...args}>
        <Section.SectionHeader>
          <div
            style={{
              paddingBottom: "12px",
              border: "2px dashed #2196F3",
              borderRadius: "4px",
              position: "relative",
              background: "white",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#2196F3",
                backgroundColor: "#E3F2FD",
              }}
            >
              Header
            </span>
            <NavigationHeader />
          </div>
        </Section.SectionHeader>
        <Section.SectionFilter>
          <div
            style={{
              padding: "8px 0",
              border: "2px dashed #FF9800",
              borderRadius: "4px",
              position: "relative",
              background: "white",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#FF9800",
                backgroundColor: "#FFF3E0",
              }}
            >
              Filter
            </span>
            <FilterContent />
          </div>
        </Section.SectionFilter>
        <Section.SectionBody>
          <div
            style={{
              marginLeft: "-20px",
              marginTop: "8px",
              border: "2px dashed #4CAF50",
              borderRadius: "4px",
              position: "relative",
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#4CAF50",
                backgroundColor: "#E8F5E9",
              }}
            >
              Body
            </span>
            <TableContent />
          </div>
        </Section.SectionBody>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isInfoPanelAvailable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A whole page: breadcrumbs in the header, a search and filter bar under it and a table in the body, each outlined and labelled so you can see where the section puts its slots. Scroll the table to see the header and the filter stay pinned; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Section currentDeviceType={DeviceType.desktop} withBodyScroll settingsStudio={false}>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
  <Section.SectionFooter>{null}</Section.SectionFooter>
</Section>`,
      },
    },
  },
};

// The side panels sit beside the section only inside a row, as on a real page.
const PageFrame = ({
  children,
  height = 600,
}: {
  children: React.ReactNode;
  height?: number;
}) => <div style={{ display: "flex", width: "100%", height }}>{children}</div>;

// Docs ignores the viewport preset; give the story a window of its own there.
const withFrame =
  (width: number, height: number): Decorator =>
  (Story, context) => {
    if (context.viewMode !== "docs") return <Story />;

    return (
      <iframe
        title={context.name}
        src={`iframe.html?viewMode=story&id=${context.id}`}
        style={{ width, height, border: 0 }}
      />
    );
  };

// The table switches to its own narrow layout below desktop; a plain list reads better there.
const ListContent = () => (
  <div>
    {mockFiles.map((file) => (
      <div key={file.name} style={{ padding: "12px 0" }}>
        <Text fontWeight={600}>{file.name}</Text>
        <Text fontSize="12px">{file.type}</Text>
      </div>
    ))}
  </div>
);

const infoPanelSlots = [
  <Section.InfoPanelHeader key="info-header">
    <div style={{ padding: "20px" }}>
      <Text fontSize="16px" fontWeight={700}>
        Annual Report 2025.docx
      </Text>
    </div>
  </Section.InfoPanelHeader>,
  <Section.InfoPanelBody key="info-body">
    <div style={{ padding: "0 20px" }}>
      <Text>Document · 42 KB · modified yesterday</Text>
    </div>
  </Section.InfoPanelBody>,
];

const runningOperation: Operation[] = [
  {
    id: "op-1",
    operation: "copy",
    label: "Copying 3 items",
    alert: false,
    completed: false,
    percent: 40,
  },
];

export const WithInfoPanel: Story = {
  render: (args) => (
    <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        {infoPanelSlots}
      </Section>
    </PageFrame>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    canDisplay: true,
    isInfoPanelVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A details panel beside the listing, for the properties of the selected item without leaving the page. It shows only while both `canDisplay` and `isInfoPanelVisible` are on; switch either off in the Controls panel below to close it.",
      },
      source: {
        code: `<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.InfoPanelHeader>
      <Text fontSize="16px" fontWeight={700}>Annual Report 2025.docx</Text>
    </Section.InfoPanelHeader>
    <Section.InfoPanelBody>
      <Text>Document · 42 KB · modified yesterday</Text>
    </Section.InfoPanelBody>
  </Section>
</div>`,
      },
    },
  },
};

// A resize drag writes its width back into the control.
const renderChatPanel = (args: ComponentProps<typeof Section>) => {
  const [, updateArgs] = useArgs();

  return (
    <PageFrame>
      <Section
        {...args}
        setChatPanelWidth={(value) => {
          args.setChatPanelWidth?.(value);
          updateArgs({ chatPanelWidth: value });
        }}
      >
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        <Section.ChatPanel>
          <div style={{ padding: "20px" }}>
            <Text fontSize="16px" fontWeight={700}>
              Chat
            </Text>
            <Text>Ask a question about the files on the left.</Text>
          </div>
        </Section.ChatPanel>
      </Section>
    </PageFrame>
  );
};

export const WithChatPanel: Story = {
  render: renderChatPanel,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isChatPanelAvailable: true,
    isChatPanelVisible: true,
    isChatPanelResizable: true,
    chatPanelWidth: 400,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A chat docked beside the listing, so a conversation about the files stays open while you work with them. Drag its inner edge to make it wider or narrower (`isChatPanelResizable`); the new width arrives when you release the mouse (`setChatPanelWidth`).",
      },
      source: {
        code: `const [width, setWidth] = useState(400);

<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    isChatPanelAvailable
    isChatPanelVisible
    isChatPanelResizable
    chatPanelWidth={width}
    setChatPanelWidth={setWidth}
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.ChatPanel>
      <ChatContent />
    </Section.ChatPanel>
  </Section>
</div>`,
      },
    },
  },
};

export const WithBanner: Story = {
  render: (args) => (
    <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBanner>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "6px",
              backgroundColor: "rgba(66, 133, 244, 0.12)",
            }}
          >
            <Text>Scheduled maintenance tonight from 22:00 to 23:00.</Text>
          </div>
        </Section.SectionBanner>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    scrollableBanner: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A notice above the header that stays in view while the table scrolls (`Section.SectionBanner`). Switch `scrollableBanner` on in the Controls panel below to put it at the top of the listing instead, where it scrolls away under the header.",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBanner>
    <Text>Scheduled maintenance tonight from 22:00 to 23:00.</Text>
  </Section.SectionBanner>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

const submenuItems = [
  { id: "all", name: "All files", content: null },
  { id: "recent", name: "Recent", content: null },
  { id: "favorites", name: "Favorites", content: null },
];

export const WithSubmenu: Story = {
  render: (args) => (
    <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionSubmenu>
          <Tabs items={submenuItems} selectedItemId="all" />
        </Section.SectionSubmenu>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tabs under the header that switch between views of the same page and stay pinned with it while the listing scrolls (`Section.SectionSubmenu`).",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionSubmenu>
    <Tabs items={tabs} selectedItemId="all" />
  </Section.SectionSubmenu>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

export const WithOperationsProgress: Story = {
  render: (args) => (
    <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    secondaryActiveOperations: runningOperation,
    secondaryOperationsCompleted: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A round progress button in the bottom corner, so a long copy or upload stays visible while the user goes on working (`secondaryActiveOperations`). Hover it to read what is running; an empty list hides it again.",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  secondaryActiveOperations={[
    { id: "op-1", operation: "copy", label: "Copying 3 items", alert: false, completed: false, percent: 40 },
  ]}
  secondaryOperationsCompleted={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

const getBodyContextModel = () => [
  { key: "upload", label: "Upload file", onClick: fn() },
  { key: "create", label: "New folder", onClick: fn() },
];

export const WithContextMenu: Story = {
  render: (args) => (
    <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    getContextModel: getBodyContextModel,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because the menu listens for right clicks on the whole document.
      story: { inline: false, height: "626px" },
      description: {
        story:
          "A menu of page-wide actions on a right click anywhere in the body, for what applies to the folder rather than to one file (`getContextModel`). Right click the list to open it.",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  getContextModel={() => [
    { key: "upload", label: "Upload file", onClick: onUpload },
    { key: "create", label: "New folder", onClick: onCreate },
  ]}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

export const OnTablet: Story = {
  render: (args) => (
    <PageFrame height={640}>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader device={DeviceType.tablet} />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent device={DeviceType.tablet} />
        </Section.SectionFilter>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  decorators: [withFrame(834, 680)],
  globals: { viewport: { value: "tablet", isRotated: false } },
  args: {
    currentDeviceType: DeviceType.tablet,
    withBodyScroll: true,
    settingsStudio: false,
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The page in a tablet-width window: the header stays pinned, while the filter bar moves into the listing and scrolls with it, leaving more room for the rows (`currentDeviceType`).",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.tablet}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

export const OnPhone: Story = {
  render: (args) => (
    <PageFrame height={640}>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader device={DeviceType.mobile} />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent device={DeviceType.mobile} />
        </Section.SectionFilter>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>
  ),
  decorators: [withFrame(414, 680)],
  globals: { viewport: { value: "mobile2", isRotated: false } },
  args: {
    currentDeviceType: DeviceType.mobile,
    withBodyScroll: true,
    settingsStudio: false,
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The page on a phone: the header and the filter bar both move into the listing and the whole page scrolls, so the rows get the full height of the screen (`currentDeviceType`).",
      },
      source: {
        code: `<Section
  currentDeviceType={DeviceType.mobile}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <PageFrame>
        <Section {...args}>
          <Section.SectionHeader>
            <NavigationHeader />
          </Section.SectionHeader>
          <Section.SectionBody>
            <TableContent />
          </Section.SectionBody>
          <Section.InfoPanelHeader>
            <div style={{ padding: "20px" }}>
              <Text fontSize="16px" fontWeight={700}>
                تقرير سنوي
              </Text>
            </div>
          </Section.InfoPanelHeader>
          <Section.InfoPanelBody>
            <div style={{ padding: "0 20px" }}>
              <Text>مستند</Text>
            </div>
          </Section.InfoPanelBody>
        </Section>
      </PageFrame>
    </div>
  ),
  globals: { direction: "rtl" },
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    canDisplay: true,
    isInfoPanelVisible: true,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "626px" },
      description: {
        story:
          "The page in a right-to-left interface: the info panel opens on the left, its border moves to its right edge, and the table's columns run from the right.",
      },
      source: {
        code: `<div dir="rtl">
  <div style={{ display: "flex", height: 600 }}>
    <Section
      currentDeviceType={DeviceType.desktop}
      withBodyScroll
      settingsStudio={false}
      canDisplay
      isInfoPanelVisible
    >
      <Section.SectionHeader>
        <Navigation title="My Documents" />
      </Section.SectionHeader>
      <Section.SectionBody>
        <TableContent />
      </Section.SectionBody>
      <Section.InfoPanelHeader>
        <Text fontSize="16px" fontWeight={700}>تقرير سنوي</Text>
      </Section.InfoPanelHeader>
      <Section.InfoPanelBody>
        <Text>مستند</Text>
      </Section.InfoPanelBody>
    </Section>
  </div>
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          display: "flex",
          width: "100%",
          height: "600px",
          // === Section — pinned header strip ===
          "--section-bg": "#e6f3fb",
          "--section-header-size": "56px",
          "--section-footer-margin": "24px",
          // === Info panel ===
          "--info-panel-background": "#f5fbff",
          "--info-panel-border-color": "#0082c9",
          "--info-panel-width": "300px",
          // === Chat panel ===
          "--chat-panel-background": "#fff8e6",
          "--chat-panel-border-color": "#c98a00",
          "--chat-panel-width": "300px",
          "--chat-panel-drop-overlay-background": "#fff1cc",
          "--chat-panel-drop-border-color": "#c98a00",
          "--chat-panel-drop-inset-top": "72px",
        } as React.CSSProperties
      }
    >
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent />
        </Section.SectionFilter>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        {infoPanelSlots}
        <Section.ChatPanel>
          <div style={{ padding: "20px" }}>
            <Text fontSize="16px" fontWeight={700}>
              Chat
            </Text>
          </div>
        </Section.ChatPanel>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isInfoPanelAvailable: true,
    canDisplay: true,
    isInfoPanelVisible: true,
    isChatPanelAvailable: true,
    isChatPanelVisible: true,
    chatPanelDropTargetLabel: "Drop here to attach",
  },
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. The example sets every desktop one on a wrapper around one section with both panels open: the blue strip is the pinned header, the pale blue column is the info panel and the yellow one is the chat panel, with its drop frame on. Navigation, Filter and the table have variables of their own, documented in their stories and set on the same wrapper.`,
      },
      source: {
        code: `<div
  style={{
    display: "flex",
    height: 600,
    "--section-bg": "#e6f3fb",
    "--section-header-size": "56px",
    "--section-footer-margin": "24px",
    "--info-panel-background": "#f5fbff",
    "--info-panel-border-color": "#0082c9",
    "--info-panel-width": "300px",
    "--chat-panel-background": "#fff8e6",
    "--chat-panel-border-color": "#c98a00",
    "--chat-panel-width": "300px",
    "--chat-panel-drop-overlay-background": "#fff1cc",
    "--chat-panel-drop-border-color": "#c98a00",
    "--chat-panel-drop-inset-top": "72px",
  }}
>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
    isChatPanelAvailable
    isChatPanelVisible
    chatPanelDropTargetLabel="Drop here to attach"
  >
    {/* header, filter, body, info panel and chat panel slots */}
  </Section>
</div>`,
      },
    },
  },
};
