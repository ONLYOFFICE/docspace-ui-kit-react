import { useMemo, useState } from "react";

import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";
import CatalogRoomsReactSvg from "../../../assets/icons/16/catalog.rooms.react.svg";
import CatalogTrashReactSvg from "../../../assets/icons/16/catalog.trash.react.svg";
import CatalogFavoritesReactSvg from "../../../assets/icons/16/catalog.favorites.react.svg";
import DownloadReactSvgUrl from "../../../assets/icons/16/download.react.svg?url";
import MoveReactSvgUrl from "../../../assets/icons/16/move.react.svg?url";
import TrashReactSvgUrl from "../../../assets/icons/16/trash.react.svg?url";
import ViewRowsReactSvg from "../../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../../assets/view-tiles.react.svg";
import Article from "../../../components/article";
import { ArticleItem } from "../../../components/article/item";
import { Badge } from "../../../components/badge";
import { Button, ButtonSize } from "../../../components/button";
import { FieldContainer } from "../../../components/field-container";
import Filter from "../../../components/filter";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { MainButton } from "../../../components/main-button";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import Navigation from "../../../components/navigation";
import { DropDownItem } from "../../../components/drop-down-item";
import { Row, RowContainer, RowContent } from "../../../components/rows";
import Section from "../../../components/section";
import { TableGroupMenu } from "../../../components/table";
import type { TGroupMenuItem } from "../../../components/table";
import { Text } from "../../../components/text";
import { InputType, TextInput } from "../../../components/text-input";
import {
  FileTile,
  FolderTile,
  TileContainer,
  TileContent,
} from "../../../components/tiles";
import { Toast, toastr } from "../../../components/toast";
import { DeviceType, FileType, FilterGroups } from "../../../enums";
import { useDebounce } from "../../../hooks";
import {
  formatSampleDate,
  sampleFiles,
  sampleFolders,
  type SampleFile,
} from "../sample-data";
import { FileIcon } from "../file-icon";
import styles from "./FilesApp.module.scss";

const noop = () => {};

const fileTypeByExst: Record<string, FileType> = {
  ".docx": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".pdf": FileType.PDF,
  ".png": FileType.Image,
};

const sections = [
  { id: "rooms", title: "Rooms", Icon: CatalogRoomsReactSvg },
  { id: "documents", title: "Documents", Icon: CatalogFolderReactSvg },
  { id: "favorites", title: "Favorites", Icon: CatalogFavoritesReactSvg },
  { id: "trash", title: "Trash", Icon: CatalogTrashReactSvg },
];

/**
 * `Article.Body` takes exactly one element -- Article clones it to inject its
 * own props -- so a list of entries has to live inside a component of its own.
 * Handing `Article.Body` an array is the single most common way to get a blank
 * sidebar.
 */
const SidebarSections = ({
  activeSection,
  showText,
  fileCount,
  onSelect,
}: {
  activeSection: string;
  showText: boolean;
  fileCount: number;
  onSelect: (id: string) => void;
}) => (
  <>
    {sections.map(({ id, title, Icon }) => (
      <ArticleItem
        key={id}
        text={title}
        showText={showText}
        iconNode={<Icon />}
        // Required, because a portal renders every sidebar entry as a router
        // link. With no router, the path is enough.
        linkData={{ path: `/${id}`, state: {} }}
        isActive={activeSection === id}
        showBadge={id === "documents"}
        labelBadge={id === "documents" ? fileCount : undefined}
        onClick={() => onSelect(id)}
      />
    ))}
  </>
);

/**
 * Everything from the previous nine samples, wired into one screen: the
 * sidebar, the breadcrumb header, the filter bar, both views, the selection
 * toolbar, a dialog and the toasts.
 *
 * The lesson of this file is the division of labour. `Article` and `Section`
 * own the layout -- the sticky header, the scrolling body, the collapsing
 * sidebar, the breakpoints. Everything below the header owns the data. The two
 * never negotiate, which is why the same `Section` carries a table on one
 * screen and a tile grid on the next.
 *
 * Both layout components are written for a portal, so they ask for the things
 * a portal knows: the device type, whether the sidebar is open, the URLs of
 * the desktop apps. A standalone application answers with constants, as here.
 */
export const FilesApp = () => {
  const [activeSection, setActiveSection] = useState("documents");
  const [showText, setShowText] = useState(true);
  const [articleOpen, setArticleOpen] = useState(false);

  const [viewAs, setViewAs] = useState<"row" | "tile">("row");
  const [query, setQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [folders, setFolders] = useState(sampleFolders);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("Untitled folder");

  // Typing in the filter is cheap here, but a portal would fetch -- so the
  // query is debounced exactly where a request would go.
  const onSearchDebounced = useDebounce(
    (value: string) => setQuery(value),
    300,
  );

  const files = useMemo(() => {
    const matched = query
      ? sampleFiles.filter((file) =>
          file.title.toLowerCase().includes(query.toLowerCase()),
        )
      : sampleFiles;

    const sorted = [...matched].sort((a, b) => a.title.localeCompare(b.title));

    return sortAscending ? sorted : sorted.reverse();
  }, [query, sortAscending]);

  const selectedCount = selectedIds.length;

  const toggle = (file: SampleFile, checked: boolean) =>
    setSelectedIds((current) =>
      checked ? [...current, file.id] : current.filter((id) => id !== file.id),
    );

  const contextOptions = (file: SampleFile) => [
    {
      key: "open",
      label: "Open",
      onClick: () => toastr.info(`Opening ${file.title}`),
    },
    {
      key: "link",
      label: "Copy link",
      onClick: () => toastr.success("Link copied"),
    },
    { key: "separator", isSeparator: true },
    {
      key: "delete",
      label: "Move to Trash",
      onClick: () => toastr.success(`${file.title} moved to Trash`),
    },
  ];

  const groupMenu: TGroupMenuItem[] = [
    {
      id: "download",
      label: "Download",
      title: "Download",
      iconUrl: DownloadReactSvgUrl,
      disabled: false,
      onClick: () => toastr.info(`Preparing ${selectedCount} files...`),
    },
    {
      id: "move",
      label: "Move to",
      title: "Move to",
      iconUrl: MoveReactSvgUrl,
      disabled: false,
      onClick: () => toastr.info("Pick a destination"),
    },
    {
      id: "delete",
      label: "Delete",
      title: "Delete",
      iconUrl: TrashReactSvgUrl,
      disabled: false,
      onClick: () => {
        toastr.success(`${selectedCount} files moved to Trash`);
        setSelectedIds([]);
      },
    },
  ];

  // What the arrow next to the checkbox offers. The portal lists the same
  // three: everything, only the files, only the folders.
  const selectAllOptions = (
    <>
      <DropDownItem
        label="All"
        onClick={() => setSelectedIds(files.map((file) => file.id))}
      />
      <DropDownItem
        label="Files"
        onClick={() => setSelectedIds(files.map((file) => file.id))}
      />
      <DropDownItem label="Folders" onClick={() => setSelectedIds([])} />
    </>
  );

  const mainButtonModel = [
    {
      key: "document",
      label: "New document",
      onClick: () => toastr.info("A new document would open in the editor"),
    },
    {
      key: "spreadsheet",
      label: "New spreadsheet",
      onClick: () => toastr.info("A new spreadsheet would open in the editor"),
    },
    { key: "separator", isSeparator: true },
    {
      key: "folder",
      label: "New folder",
      onClick: () => setIsCreateVisible(true),
    },
    {
      key: "upload",
      label: "Upload files",
      onClick: () => toastr.info("The file picker would open here"),
    },
  ];

  const onCreateFolder = () => {
    const title = newFolderName.trim() || "Untitled folder";

    setFolders((current) => [
      ...current,
      { id: Date.now(), title, filesCount: 0 },
    ]);
    setIsCreateVisible(false);
    setNewFolderName("Untitled folder");
    toastr.success(`${title} created`);
  };

  const folderContextOptions = (title: string) => [
    {
      key: "open",
      label: "Open",
      onClick: () => toastr.info(`Opening ${title}`),
    },
    {
      key: "rename",
      label: "Rename",
      onClick: () => toastr.info(`Renaming ${title}`),
    },
  ];

  const rows = (
    <RowContainer useReactWindow={false} itemHeight={56}>
      {folders.map((folder) => (
        <Row
          key={`folder-${folder.id}`}
          element={<FileIcon fileExst="folder" />}
          contextTitle={folder.title}
          contextOptions={folderContextOptions(folder.title)}
        >
          <RowContent>
            <Link type={LinkType.page} isTextOverflow fontSize="13px" isBold>
              {folder.title}
            </Link>
            <div />
            <Text as="span" fontSize="12px" containerMinWidth="120px">
              {`${folder.filesCount} files`}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="100px">
              Folder
            </Text>
          </RowContent>
        </Row>
      ))}
      {files.map((file) => (
        <Row
          key={file.id}
          checked={selectedIds.includes(file.id)}
          element={<FileIcon fileExst={file.fileExst} />}
          contextTitle={file.title}
          contextOptions={contextOptions(file)}
          onSelect={(checked) => toggle(file, checked)}
        >
          <RowContent>
            <Link type={LinkType.page} isTextOverflow fontSize="13px" isBold>
              {file.title}
            </Link>
            <div>
              {file.isFavorite ? <Badge label="Favorite" isMutedBadge /> : null}
            </div>
            <Text as="span" fontSize="12px" containerMinWidth="120px">
              {file.author}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="100px">
              {formatSampleDate(file.modified)}
            </Text>
          </RowContent>
        </Row>
      ))}
    </RowContainer>
  );

  const tiles = (
    <TileContainer>
      {folders.map((folder) => (
        <FolderTile
          key={`folder-${folder.id}`}
          item={{ id: folder.id, title: folder.title, isFolder: true }}
          element={<FileIcon fileExst="folder" />}
          temporaryIcon={<FileIcon fileExst="folder" size={96} />}
          contextOptions={folderContextOptions(folder.title)}
        >
          <TileContent>
            <Link type={LinkType.page} isTextOverflow fontSize="13px">
              {folder.title}
            </Link>
          </TileContent>
        </FolderTile>
      ))}
      {files.map((file) => (
        <FileTile
          key={file.id}
          item={{
            id: file.id,
            title: file.title,
            fileExst: file.fileExst,
            fileType: fileTypeByExst[file.fileExst],
          }}
          checked={selectedIds.includes(file.id)}
          element={<FileIcon fileExst={file.fileExst} />}
          temporaryIcon={<FileIcon fileExst={file.fileExst} size={96} />}
          contextOptions={contextOptions(file)}
          onSelect={(checked) => toggle(file, checked)}
        >
          <TileContent>
            <Link type={LinkType.page} isTextOverflow fontSize="13px">
              {file.title}
            </Link>
          </TileContent>
        </FileTile>
      ))}
    </TileContainer>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "640px",
        overflow: "hidden",
      }}
    >
      <Toast />

      <Article
        showText={showText}
        setShowText={setShowText}
        toggleShowText={() => setShowText((current) => !current)}
        articleOpen={articleOpen}
        setArticleOpen={setArticleOpen}
        toggleArticleOpen={() => setArticleOpen((current) => !current)}
        setIsMobileArticle={noop}
        isMobileArticle={false}
        currentDeviceType={DeviceType.desktop}
        // Three flags that turn portal chrome off. Without the first one the
        // header renders the portal's white-label logo instead of the children
        // below; the last one hides the Developer Tools entry, which belongs
        // to the portal and not to an application embedding the kit.
        withCustomArticleHeader
        // Without this the Article.MainButton slot is dropped on desktop.
        withMainButton
        hideProfileBlock
        hideAppsBlock
        limitedAccessDevToolsForUsers
        withCustomSlot={false}
        isBurgerLoading={false}
        showBackButton={false}
        withSendAgain={false}
        mainBarVisible={false}
        isAdmin={false}
        isLiveChatAvailable={false}
        isShowLiveChat={false}
        showProgress={false}
        logoText="Apps UI Kit"
        languageBaseName="en"
        zendeskEmail=""
        chatDisplayName=""
        zendeskKey=""
        downloaddesktopUrl=""
        officeforandroidUrl=""
        officeforiosUrl=""
      >
        <Article.Header key="header">
          <Heading level={HeadingLevel.h3} size={HeadingSize.small}>
            Files
          </Heading>
        </Article.Header>

        <Article.MainButton key="main-button">
          <MainButton
            isDropdown
            text="Create"
            model={mainButtonModel}
            onAction={noop}
          />
        </Article.MainButton>

        <Article.Body key="body">
          <SidebarSections
            activeSection={activeSection}
            showText={showText}
            fileCount={files.length}
            onSelect={(id) => {
              setActiveSection(id);
              setSelectedIds([]);
            }}
          />
        </Article.Body>
      </Article>

      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <Section
          currentDeviceType={DeviceType.desktop}
          withBodyScroll
          isHeaderVisible
          viewAs={viewAs}
          settingsStudio={false}
        >
          <Section.SectionHeader>
            {selectedCount > 0 ? (
              // The portal's own group menu, prop for prop: a checkbox with
              // the select-all drop-down beside it, then the actions. No
              // label and no close button -- clearing the checkbox empties
              // the selection, which is what makes the bar disappear.
              <div className={styles.headerSlot}>
                <TableGroupMenu
                  isChecked={selectedCount === files.length}
                  isIndeterminate={
                    selectedCount > 0 && selectedCount !== files.length
                  }
                  headerMenu={groupMenu}
                  checkboxOptions={selectAllOptions}
                  withoutInfoPanelToggler
                  onChange={(checked) =>
                    setSelectedIds(checked ? files.map((file) => file.id) : [])
                  }
                />
              </div>
            ) : (
              <Navigation
                title="Documents"
                isRootFolder={false}
                canCreate
                showText
                isDesktop
                isRoom={false}
                withMenu
                showTitle
                showRootFolderTitle
                showNavigationButton={false}
                isInfoPanelVisible={false}
                isCurrentFolderInfo={false}
                currentDeviceType={DeviceType.desktop}
                // The ancestors, nearest first. The current folder is `title`
                // -- listing it here as well is what gives you the
                // "Documents > Documents" breadcrumb.
                navigationItems={[
                  { id: "1", title: "Finance department", isRootRoom: true },
                ]}
                onClickFolder={() => toastr.info("Navigating up")}
                onBackToParentFolder={() => toastr.info("Back to Rooms")}
                clearTrash={noop}
                getContextOptionsFolder={() => [
                  {
                    key: "rename",
                    label: "Rename",
                    onClick: () => toastr.info("Rename this folder"),
                  },
                  {
                    key: "info",
                    label: "Folder info",
                    onClick: () => toastr.info("8 files • 2 folders"),
                  },
                ]}
                getContextOptionsPlus={() => [
                  {
                    key: "folder",
                    label: "New folder",
                    onClick: () => setIsCreateVisible(true),
                  },
                  {
                    key: "upload",
                    label: "Upload files",
                    onClick: () => toastr.info("The file picker would open"),
                  },
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
            )}
          </Section.SectionHeader>

          <Section.SectionFilter>
            <Filter
              viewAs={viewAs}
              view={viewAs}
              placeholder="Search in Documents"
              filterTitle="Filter"
              sortByTitle="Sort by"
              filterHeader="Filter"
              selectorLabel="Select"
              userId="1"
              currentDeviceType={DeviceType.desktop}
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
              onSearch={(value) => onSearchDebounced(value ?? "")}
              onClearFilter={() => setQuery("")}
              onChangeViewAs={() =>
                setViewAs((current) => (current === "row" ? "tile" : "row"))
              }
              onSort={(_key, direction) =>
                setSortAscending(direction === "asc")
              }
              onFilter={noop}
              onSortButtonClick={noop}
              removeSelectedItem={noop}
              clearAll={() => setQuery("")}
              getSelectedInputValue={() => query}
              getSortData={() => [
                {
                  id: "name",
                  key: "AZ",
                  label: "Name",
                  isSelected: true,
                  sortDirection: sortAscending ? "asc" : "desc",
                  sortId: "AZ",
                },
                {
                  id: "modified",
                  key: "DateAndTime",
                  label: "Last modified",
                  isSelected: false,
                  sortDirection: "desc",
                  sortId: "DateAndTime",
                },
              ]}
              getSelectedSortData={() => ({
                sortDirection: sortAscending ? "asc" : "desc",
                sortId: "AZ",
              })}
              getViewSettingsData={() => [
                {
                  id: "row",
                  label: "List",
                  value: "row",
                  icon: <ViewRowsReactSvg />,
                },
                {
                  id: "tile",
                  label: "Tiles",
                  value: "tile",
                  icon: <ViewTilesReactSvg />,
                },
              ]}
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
          </Section.SectionFilter>

          <Section.SectionBody>
            {files.length === 0 ? (
              <Text fontSize="13px" style={{ padding: "24px 0" }}>
                Nothing matches "{query}".
              </Text>
            ) : (
              <>
                {viewAs === "row" ? (
                  <Text fontSize="12px" isBold style={{ padding: "8px 0 4px" }}>
                    {folders.length} folders • {files.length} files
                  </Text>
                ) : null}
                {viewAs === "row" ? rows : tiles}
              </>
            )}
          </Section.SectionBody>

          <Section.SectionFooter>{null}</Section.SectionFooter>
        </Section>
      </div>

      <ModalDialog
        visible={isCreateVisible}
        displayType={ModalDialogType.modal}
        withForm
        onSubmit={(e) => {
          e.preventDefault();
          onCreateFolder();
        }}
        onClose={() => setIsCreateVisible(false)}
      >
        <ModalDialog.Header>New folder</ModalDialog.Header>
        <ModalDialog.Body>
          <FieldContainer isVertical labelVisible isRequired labelText="Name">
            <TextInput
              scale
              isAutoFocussed
              type={InputType.text}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </FieldContainer>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            primary
            scale
            type="submit"
            label="Create"
            size={ButtonSize.normal}
          />
          <Button
            scale
            label="Cancel"
            size={ButtonSize.normal}
            onClick={() => setIsCreateVisible(false)}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
};
