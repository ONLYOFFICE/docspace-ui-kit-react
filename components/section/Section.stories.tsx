import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";
import FileCells, { storyFiles } from "../../.storybook/utils/FileCells";
import { DeviceType, FilterGroups, SortByFieldName } from "../../enums";
import {
  deviceFor,
  useWindowDevice,
} from "../../.storybook/utils/useWindowDevice";
import Filter from "../filter";
import Navigation from "../navigation/Navigation";
import { TableBody, TableContainer, TableHeader, TableRow } from "../table";
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
    setInfoPanelWidth: fn(),
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
        "Which layout to render. It places the header and the filter, decides whether the body scrolls, and puts the info panel inline or over the page. Nothing here measures the viewport.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description:
        "Whether the section scrolls its own body. With `false` the page scrolls instead and the section takes a 20px inline-start padding. On a phone the page always scrolls.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    settingsStudio: {
      control: "boolean",
      description: "Applies the settings pages' narrower body padding.",
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
        "Which listing the body holds. It changes the body's padding, and in `row` view it lets a click beside the info panel close it.",
    },
    isInfoPanelAvailable: {
      control: "boolean",
      description:
        "Whether the info panel region exists at all. It defaults to `true`, so the panel's markup is mounted unless you turn it off.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel is open. It narrows the section and is one of the two conditions for the panel being rendered at all — `canDisplay` is the other.",
    },
    canDisplay: {
      control: "boolean",
      description:
        "**The info panel is not rendered without this.** `isInfoPanelVisible` alone is not enough: both must be true.",
    },
    setIsInfoPanelVisible: {
      control: false,
      description:
        "Called with `false` when the info panel closes itself — a click beside it, or the browser going back below the desktop breakpoint.",
    },
    isMobileHidden: {
      control: "boolean",
      description:
        "Hides the info panel on anything narrower than a desktop, where it would otherwise cover the page.",
    },
    anotherDialogOpen: {
      control: "boolean",
      description:
        "Suppresses the info panel below the desktop breakpoint while a dialog of yours is open, so the two do not stack.",
    },
    infoPanelWithoutScroll: {
      control: "boolean",
      description:
        "Removes the info panel body's scroller and the aside's, for a body that scrolls its own regions.",
    },
    isInfoPanelScrollLocked: {
      control: "boolean",
      description:
        "Freezes the info panel's own scroller, for a drag or a menu that must not scroll the panel under it.",
    },
    isInfoPanelResizable: {
      control: "boolean",
      description:
        "Opt-in edge resizer for the info panel (desktop only), from `INFO_PANEL_WIDTH` to `INFO_PANEL_MAX_WIDTH`. Pass the width the host stores plus a setter; leave unset for a fixed-width panel.",
    },
    infoPanelWidth: {
      control: "number",
      description:
        "Width of the info panel in px while `isInfoPanelResizable` is on. Without the resizer it is ignored and the panel keeps its stylesheet width.",
    },
    setInfoPanelWidth: {
      control: false,
      description:
        "Called with the committed width: once per drag, on release, and on the double click that restores the default. A width narrowed to fit the window is never committed.",
    },
    isChatPanelAvailable: {
      control: "boolean",
      description:
        "Whether the AI chat region exists at all. It defaults to `false`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isChatPanelVisible: {
      control: "boolean",
      description:
        "Opens the AI chat panel, docked on a desktop and covering the page below it. It needs `isChatPanelAvailable`.",
    },
    setIsChatPanelVisible: {
      control: false,
      description:
        "Called with `false` when the browser goes back while the chat panel is open below the desktop breakpoint.",
    },
    chatPanelDropTargetLabel: {
      control: "text",
      description:
        'Text of a dashed "drop here" frame over the chat panel. Set it while the host drags its own items over the panel, and clear it afterwards.',
    },
    isChatPanelResizable: {
      control: "boolean",
      description:
        "Opt-in edge resizer for the docked chat panel (desktop only). Pass the width the host stores plus a setter; leave unset for a fixed-width panel.",
    },
    chatPanelWidth: {
      control: "number",
      description: "Current width of the docked chat panel in pixels.",
    },
    setChatPanelWidth: {
      control: false,
      description:
        "Called once per resize drag, when the pointer is released, with the committed width.",
    },
    setChatPanelFullscreen: {
      control: false,
      description:
        "Turns the chat panel fullscreen on. Called when the edge resizer is dragged past the widest docked width; leave unset to keep that drag clamped at the limit.",
    },
    unsetChatPanelFullscreen: {
      control: false,
      description:
        "Turns the chat panel fullscreen off. Called when the resizer is dragged back inwards in fullscreen, which then continues as a normal resize.",
    },
    isChatPanelFullscreen: {
      control: "boolean",
      description:
        "Whether the host renders the chat panel fullscreen right now.",
    },
    scrollableBanner: {
      control: "boolean",
      description:
        "Puts the banner at the top of the scrolling body, so it scrolls away under the header. Off, the banner stays pinned above the scroller.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    stickyTableHeader: {
      control: "boolean",
      description:
        "Moves the desktop filter into the scrolling body, where it sticks under the header. A table header then sticks under the filter instead of being fixed.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inert: {
      control: "boolean",
      description:
        "Makes the whole section unfocusable and unclickable, and hides it from assistive technology. It suits a section kept mounted behind a fullscreen panel.",
    },
    withTabs: {
      control: "boolean",
      description:
        "Marks the filter below the desktop breakpoint as sitting under tabs. No style reads the mark, so it changes nothing on screen.",
    },
    withoutFooter: {
      control: "boolean",
      description: "Drops both the footer slot and the spacer under the body.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fullHeightBody: {
      control: "boolean",
      description:
        "Makes the body fill the section's height rather than its content's, for a chat-like page whose inner regions scroll instead.",
    },
    getContextModel: {
      control: false,
      description:
        "Returns the model for the body's own right-click menu. Without it no menu is mounted; it is also suppressed while `isIndexEditingMode` is set.",
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Suppresses the body's right-click menu while the listing is being reordered.",
    },
    pathname: {
      control: "text",
      description:
        "The current route. Changing it re-focuses the body on a desktop, which is how the portal restores keyboard scrolling after a navigation.",
    },
    onDrop: {
      control: false,
      description:
        "Called with the files dropped anywhere on the body, which is itself a drop target. Nothing is filtered and nothing is highlighted — see `DragAndDrop`.",
    },
    onDragOverEmpty: {
      control: false,
      description:
        "Called on every drag-over of the body, with a drag-active flag that is one render behind.",
    },
    onDragLeaveEmpty: {
      control: false,
      description: "Called when a drag leaves the body.",
    },
    secondaryActiveOperations: {
      control: "object",
      description:
        "Background operations shown in the progress button. Its length is one of the three that decide whether the button appears.",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    primaryOperationsArray: {
      control: "object",
      description:
        "Upload operations shown in the progress button's own panel.",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    pluginOperations: {
      control: "object",
      description:
        "Operations contributed by plugins, merged into the background operations of the progress button.",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    secondaryOperationsCompleted: {
      control: "boolean",
      description:
        "Whether the background operations have finished, for the progress button's completed state.",
    },
    primaryOperationsCompleted: {
      control: "boolean",
      description: "Whether the panel operations — uploads — have finished.",
    },
    pluginOperationsCompleted: {
      control: "boolean",
      description:
        "Whether the plugin operations have finished, for the progress button's completed state.",
    },
    secondaryOperationsStopped: {
      control: "boolean",
      description:
        "Whether the background operations were stopped rather than finished.",
    },
    secondaryOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert state for a failed background operation.",
    },
    primaryOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert state for a failed upload.",
    },
    pluginOperationsAlert: {
      control: "boolean",
      description:
        "Puts the progress button in its alert state for a failed plugin operation.",
    },
    primaryOperationsCanceled: {
      control: "boolean",
      description: "Whether the uploads were cancelled.",
    },
    needErrorChecking: {
      control: "boolean",
      description:
        "Makes the progress button check its operations for errors before reporting them complete.",
    },
    pluginShowCancelButton: {
      control: "boolean",
      description:
        "Forces the progress button's cancel control on, whatever the operations say.",
    },
    mainButtonVisible: {
      control: "boolean",
      description:
        "Whether the main button is on screen, which moves the progress button clear of it.",
    },
    onOpenUploadPanel: {
      control: false,
      description:
        "Called when the operations button asks to open the upload panel.",
    },
    cancelUpload: {
      control: false,
      description:
        "Called by the progress button's cancel control while an upload is running.",
    },
    clearSecondaryProgressData: {
      control: false,
      description: "Clears a finished background operation.",
    },
    clearPrimaryProgressData: {
      control: false,
      description: "Clears a finished upload operation.",
    },
    cancelSecondaryOperationById: {
      control: false,
      description: "Cancels one background operation by id.",
    },
    dragging: {
      control: "boolean",
      description:
        "Whether a drag of the host's own items is in progress, which the progress button uses for its drop-preview state.",
    },
    dropTargetPreview: {
      control: "text",
      description:
        "Name of the folder a dragged item would land in, shown by the progress button.",
    },
    clearDropPreviewLocation: {
      control: false,
      description:
        "Called by the progress button when its drop preview ends, so the host can forget the target folder.",
    },
    startDropPreview: {
      control: false,
      description:
        "Its mere presence makes the progress button appear, even with no operations, so that a drag can show its drop preview.",
    },
  },
} satisfies Meta<typeof Section>;

type Story = StoryObj<ComponentProps<typeof Section>>;

export default meta;

const COLUMN_STORAGE_NAME = "section-story-columns";
const COLUMN_INFO_PANEL_STORAGE_NAME = "section-story-columns-info";

const noop = () => {};

const part = (root: HTMLElement, selector: string) =>
  root.querySelector<HTMLElement>(selector);

const rect = (root: HTMLElement, selector: string) =>
  (part(root, selector) as HTMLElement).getBoundingClientRect();

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

const mockFiles = storyFiles;

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
    hideInfoPanel
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
      <FileCells file={file} />
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

const DefaultPage = (args: ComponentProps<typeof Section>) => {
  const device = useWindowDevice();
  const isDesktop = device === DeviceType.desktop;

  return (
    <div style={{ display: "flex", width: "100%", height: "600px" }}>
      <Section
        {...args}
        currentDeviceType={isDesktop ? args.currentDeviceType : device}
      >
        <Section.SectionHeader>
          <div
            style={{
              paddingBottom: "12px",
              border: "2px dashed #2196F3",
              borderRadius: "4px",
              position: "relative",
              background: "var(--background-color)",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#2196F3",
                backgroundColor: "light-dark(#E3F2FD, #132a3d)",
              }}
            >
              Header
            </span>
            <NavigationHeader device={device} />
          </div>
        </Section.SectionHeader>
        <Section.SectionFilter>
          <div
            style={{
              padding: "8px 0",
              border: "2px dashed #FF9800",
              borderRadius: "4px",
              position: "relative",
              background: "var(--background-color)",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#FF9800",
                backgroundColor: "light-dark(#FFF3E0, #3d2a14)",
              }}
            >
              Filter
            </span>
            <FilterContent device={device} />
          </div>
        </Section.SectionFilter>
        <Section.SectionBody>
          <div
            style={{
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
                backgroundColor: "light-dark(#E8F5E9, #1b3320)",
              }}
            >
              Body
            </span>
            {isDesktop ? <TableContent /> : <ListContent />}
          </div>
        </Section.SectionBody>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DefaultPage {...args} />,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isInfoPanelAvailable: false,
  },
  play: async ({ canvasElement }) => {
    if (deviceFor(window.innerWidth) !== DeviceType.desktop) {
      const body = part(canvasElement, ".section-body") as HTMLElement;
      await expect(within(body).getByText("My Documents")).toBeVisible();
      await expect(part(body, ".section-body_filter")).not.toBeNull();
      return;
    }
    const sticky = part(
      canvasElement,
      ".section-sticky-container",
    ) as HTMLElement;
    // Header and filter are pinned above the scrolling body.
    const header = part(sticky, ".section-header_header") as HTMLElement;
    await expect(within(header).getByText("My Documents")).toBeVisible();
    const filter = part(sticky, ".section-header_filter") as HTMLElement;
    await expect(
      within(filter).getByPlaceholderText("Search..."),
    ).toBeVisible();
    await expect(getComputedStyle(sticky).position).toBe("sticky");
    const scroll = part(canvasElement, ".section-scroll") as HTMLElement;
    await expect(within(scroll).getByText("Annual Report 2025")).toBeVisible();
    await expect(part(canvasElement, "#InfoPanelWrapper")).toBeNull();
  },
  parameters: {
    layout: "fullscreen",
    noPadding: true,
    docs: {
      description: {
        story:
          "A whole page with each slot outlined and labelled: breadcrumbs in the header, a filter bar under it, a table in the body. The header and the filter stay pinned while the table scrolls.",
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

const renderInfoPanel = (args: ComponentProps<typeof Section>) => {
  const [, updateArgs] = useArgs();

  return (
    <PageFrame>
      <Section
        {...args}
        setInfoPanelWidth={(value) => {
          args.setInfoPanelWidth?.(value);
          updateArgs({ infoPanelWidth: value });
        }}
      >
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        {infoPanelSlots}
      </Section>
    </PageFrame>
  );
};

export const WithInfoPanel: Story = {
  name: "With info panel",
  render: renderInfoPanel,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    canDisplay: true,
    isInfoPanelVisible: true,
    isInfoPanelResizable: true,
    infoPanelWidth: 400,
  },
  play: async ({ canvasElement }) => {
    const panel = part(canvasElement, "#InfoPanelWrapper") as HTMLElement;
    await expect(panel).toBeVisible();
    await expect(
      within(panel).getByText("Document · 42 KB · modified yesterday"),
    ).toBeVisible();
    // Beside the section, on its right.
    await expect(panel.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      rect(canvasElement, "#section").right - 1,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A details panel beside the listing, for the properties of the selected item without leaving the page. It shows only while both `canDisplay` and `isInfoPanelVisible` are on. Its inner edge drags it wider or narrower (`isInfoPanelResizable`), and a double click restores 400px.",
      },
      source: {
        code: `const [width, setWidth] = useState(400);

<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
    isInfoPanelResizable
    infoPanelWidth={width}
    setInfoPanelWidth={setWidth}
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

// A resize drag keeps its width in the story's own state: writing it into the
// args re-renders the story, which clears the spies a play is checking.
const ChatPanelStory = (args: ComponentProps<typeof Section>) => {
  const [width, setWidth] = useState(args.chatPanelWidth);

  useEffect(() => {
    setWidth(args.chatPanelWidth);
  }, [args.chatPanelWidth]);

  return (
    <PageFrame>
      <Section
        {...args}
        chatPanelWidth={width}
        setChatPanelWidth={(value) => {
          args.setChatPanelWidth?.(value);
          setWidth(value);
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
  name: "With chat panel",
  render: (args) => <ChatPanelStory {...args} />,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isChatPanelAvailable: true,
    isChatPanelVisible: true,
    isChatPanelResizable: true,
    chatPanelWidth: 400,
  },
  play: async ({ args, canvasElement }) => {
    const panel = part(canvasElement, "#ChatPanelWrapper") as HTMLElement;
    await expect(within(panel).getByText("Chat")).toBeVisible();
    await expect(getComputedStyle(panel).width).toBe("400px");

    // Dragging the inner edge to the left widens the panel; the width is
    // reported once, on release. The drag measures the panel's content box,
    // not its rect with the 1px border, so it lands on exactly 440.
    const resizer = within(panel).getByTestId("chat-panel-resizer");
    const x = resizer.getBoundingClientRect().left + 2;
    fireEvent.pointerDown(resizer, { button: 0, clientX: x });
    fireEvent.pointerMove(window, { clientX: x - 40 });
    await expect(getComputedStyle(panel).width).toBe("440px");
    await expect(args.setChatPanelWidth).not.toHaveBeenCalled();
    fireEvent.pointerUp(window);
    await expect(args.setChatPanelWidth).toHaveBeenCalledTimes(1);
    await expect(args.setChatPanelWidth).toHaveBeenLastCalledWith(440);

    // A grab released without moving commits nothing.
    const x2 = resizer.getBoundingClientRect().left + 2;
    fireEvent.pointerDown(resizer, { button: 0, clientX: x2 });
    fireEvent.pointerUp(window);
    await expect(args.setChatPanelWidth).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A chat docked beside the listing, so a conversation about the files stays open beside them. Its inner edge drags it wider or narrower (`isChatPanelResizable`), and `setChatPanelWidth` gets the width on release.",
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
  name: "With banner",
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
  play: async ({ canvasElement }) => {
    const banner = part(canvasElement, ".section-banner") as HTMLElement;
    await expect(
      within(banner).getByText(
        "Scheduled maintenance tonight from 22:00 to 23:00.",
      ),
    ).toBeVisible();
    // Above the header and outside the scrolling body.
    await expect(banner.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      rect(canvasElement, ".section-header_header").top + 1,
    );
    await expect(
      (part(canvasElement, ".section-scroll") as HTMLElement).contains(banner),
    ).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A notice above the header that stays in view while the table scrolls (`Section.SectionBanner`). With `scrollableBanner` it sits at the top of the listing instead and scrolls away under the header.",
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
  name: "With submenu",
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
  play: async ({ canvasElement }) => {
    // Pinned with the header, under it.
    const sticky = part(
      canvasElement,
      ".section-sticky-container",
    ) as HTMLElement;
    const tabs = part(sticky, ".section-tabs") as HTMLElement;
    await expect(within(tabs).getByText("Recent")).toBeVisible();
    await expect(tabs.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      rect(sticky, ".section-header_header").bottom - 1,
    );
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
  name: "With operations progress",
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
  play: async ({ canvasElement, userEvent }) => {
    const button = part(canvasElement, ".layout-progress-bar") as HTMLElement;
    await expect(button).toBeVisible();
    // Hovering it lists what is running.
    await userEvent.hover(button);
    await waitFor(() =>
      expect(screen.getByText("Copying 3 items")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A round progress button in the bottom corner, so a long copy or upload stays visible while the user works on (`secondaryActiveOperations`). On hover it says what is running; an empty list hides it.",
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

const onBodyUpload = fn();
const onBodyCreate = fn();

const getBodyContextModel = () => [
  { key: "upload", label: "Upload file", onClick: onBodyUpload },
  { key: "create", label: "New folder", onClick: onBodyCreate },
];

export const WithContextMenu: Story = {
  name: "With context menu",
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
  beforeEach: () => {
    onBodyUpload.mockClear();
    onBodyCreate.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    // A right click outside the body opens nothing.
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: canvas.getByText("My Documents"),
    });
    await expect(
      screen.queryByRole("menuitem", { name: "Upload file" }),
    ).toBeNull();

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: canvas.getByText("Meeting Notes.docx"),
    });
    const upload = await screen.findByRole("menuitem", { name: "Upload file" });
    await waitFor(() => expect(upload).toBeVisible());
    await expect(
      screen.getByRole("menuitem", { name: "New folder" }),
    ).toBeVisible();
    await userEvent.click(upload);
    await expect(onBodyUpload).toHaveBeenCalledTimes(1);
    await expect(onBodyCreate).not.toHaveBeenCalled();
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because the menu listens for right clicks on the whole document.
      story: { inline: false, height: "626px" },
      description: {
        story:
          "A menu of page-wide actions on a right click anywhere in the body, for what applies to the folder rather than to one file (`getContextModel`).",
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
  name: "On a tablet",
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
  play: async ({ canvasElement }) => {
    // The header stays pinned; the filter moves into the scrolling body.
    const sticky = part(
      canvasElement,
      ".section-sticky-container",
    ) as HTMLElement;
    await expect(part(sticky, ".section-header_header")).not.toBeNull();
    await expect(part(sticky, ".section-header_filter")).toBeNull();
    const filter = part(canvasElement, ".section-body_filter") as HTMLElement;
    await expect(
      (part(canvasElement, ".section-body") as HTMLElement).contains(filter),
    ).toBe(true);
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The page in a tablet-width window (`currentDeviceType`). The header stays pinned, and the filter bar moves into the listing and scrolls with it.",
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
  name: "On a phone",
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
  play: async ({ canvasElement }) => {
    // Nothing is pinned: header and filter both scroll with the body.
    await expect(part(canvasElement, ".section-sticky-container")).toBeNull();
    const body = part(canvasElement, ".section-body") as HTMLElement;
    const header = part(body, ".section-body_header") as HTMLElement;
    await expect(within(header).getByText("My Documents")).toBeVisible();
    await expect(part(body, ".section-body_filter")).not.toBeNull();
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The page on a phone (`currentDeviceType`). The header and the filter bar move into the listing, and the whole page scrolls, so the rows get the full height.",
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
  name: "Right to left",
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
  play: async ({ canvasElement }) => {
    // The info panel opens on the left of the section.
    const panel = rect(canvasElement, "#InfoPanelWrapper");
    await expect(panel.right).toBeLessThanOrEqual(
      rect(canvasElement, "#section").left + 1,
    );
  },
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
          "The page in a right-to-left interface. The info panel opens on the left with its border on its right edge, and the table's columns run from the right.",
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
  name: "CSS variables",
  render: (args) => (
    <div
      style={
        {
          display: "flex",
          width: "100%",
          height: "600px",
          // === Section — pinned header strip ===
          "--section-bg": "light-dark(#e6f3fb, #16303e)",
          "--section-header-size": "56px",
          "--section-footer-margin": "24px",
          // === Info panel ===
          "--info-panel-background": "light-dark(#f5fbff, #132530)",
          "--info-panel-border-color": "#0082c9",
          "--info-panel-width": "300px",
          // === Chat panel ===
          "--chat-panel-background": "light-dark(#fff8e6, #3a2f12)",
          "--chat-panel-border-color": "#c98a00",
          "--chat-panel-width": "300px",
          "--chat-panel-drop-overlay-background":
            "light-dark(#fff1cc, #4a3a12)",
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
  play: async ({ canvasElement }) => {
    const info = part(canvasElement, "#InfoPanelWrapper") as HTMLElement;
    // The width goes to the panel inside the wrapper.
    const infoPanel = info.firstElementChild as HTMLElement;
    await expect(getComputedStyle(infoPanel).width).toBe("300px");
    await expect(getComputedStyle(infoPanel).backgroundColor).toBe(
      "rgb(245, 251, 255)",
    );
    const chat = part(canvasElement, "#ChatPanelWrapper") as HTMLElement;
    await expect(getComputedStyle(chat).width).toBe("300px");
    await expect(getComputedStyle(chat).backgroundColor).toBe(
      "rgb(255, 248, 230)",
    );
    await expect(within(chat).getByText("Drop here to attach")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: `Both panels styled from a wrapper: a blue header strip, a pale blue info panel, and a yellow chat panel with its drop frame. Both panels are 300px wide. Navigation, Filter and the table have variables of their own, documented on their pages.`,
      },
      source: {
        code: `<div
  style={{
    display: "flex",
    height: 600,
    "--section-bg": "light-dark(#e6f3fb, #16303e)",
    "--section-header-size": "56px",
    "--section-footer-margin": "24px",
    "--info-panel-background": "light-dark(#f5fbff, #132530)",
    "--info-panel-border-color": "#0082c9",
    "--info-panel-width": "300px",
    "--chat-panel-background": "light-dark(#fff8e6, #3a2f12)",
    "--chat-panel-border-color": "#c98a00",
    "--chat-panel-width": "300px",
    "--chat-panel-drop-overlay-background": "light-dark(#fff1cc, #4a3a12)",
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
