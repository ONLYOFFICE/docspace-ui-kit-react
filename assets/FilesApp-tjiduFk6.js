import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./FilesApp.stories-teBhyfWh.js";var f;function p(){return(p=e((()=>{f=`import { useCallback, useMemo, useState } from "react";

import CatalogDocumentsReactSvg from "../../../assets/icons/16/catalog.documents.react.svg";
import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";
import CatalogRoomsReactSvg from "../../../assets/icons/16/catalog.rooms.react.svg";
import CatalogTrashReactSvg from "../../../assets/icons/16/catalog.trash.react.svg";
import TrashReactSvgUrl from "../../../assets/icons/16/trash.react.svg?url";
import ViewRowsReactSvg from "../../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../../assets/view-tiles.react.svg";
import Article from "../../../components/article";
import { ArticleItem } from "../../../components/article/item";
import { Button, ButtonSize } from "../../../components/button";
import { DropDownItem } from "../../../components/drop-down-item";
import Dropzone from "../../../components/dropzone";
import { FieldContainer } from "../../../components/field-container";
import Filter from "../../../components/filter";
import type { TItem } from "../../../components/filter";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { MainButton } from "../../../components/main-button";
import { MainButtonMobile } from "../../../components/main-button-mobile";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import Navigation from "../../../components/navigation";
import { RoomIcon } from "../../../components/room-icon";
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
import { DeviceType, FilterGroups } from "../../../enums";
import { useDebounce } from "../../../hooks";
import { useApi } from "../../../providers/api";
import { Uploader } from "../../../uploader";
import { FileIcon } from "../file-icon";
import { explainPortalError } from "../legal/explain";
import { demoSource } from "./demo";
import {
  type Entry,
  PLACE_TITLES,
  type Place,
  portalSource,
  type Query,
  type TypeFilter,
} from "./source";
import { useDeviceType } from "./useDeviceType";
import { useListing } from "./useListing";
import styles from "./FilesApp.module.scss";

const noop = () => {};

const PLACES: { id: Place; Icon: React.FC }[] = [
  { id: "rooms", Icon: CatalogRoomsReactSvg },
  { id: "documents", Icon: CatalogFolderReactSvg },
  { id: "trash", Icon: CatalogTrashReactSvg },
];

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "documents", label: "Documents" },
  { key: "spreadsheets", label: "Spreadsheets" },
  { key: "presentations", label: "Presentations" },
  { key: "folders", label: "Folders" },
];

const isTypeFilter = (value: unknown): value is TypeFilter =>
  TYPE_FILTERS.some((filter) => filter.key === value);

const NEW_DOCUMENTS = [
  { key: "document", label: "New document", title: "New document.docx" },
  {
    key: "spreadsheet",
    label: "New spreadsheet",
    title: "New spreadsheet.xlsx",
  },
  {
    key: "presentation",
    label: "New presentation",
    title: "New presentation.pptx",
  },
];

const ACCEPT = ".docx,.xlsx,.pptx,.pdf,.png,.jpg,.jpeg,.txt,.csv,.zip";
const ACCEPT_SHORT = "DOCX, XLSX, PPTX, PDF";
const ACCEPT_FULL = "DOCX, XLSX, PPTX, PDF, PNG, JPG, TXT, CSV, ZIP";

const dateOf = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

/** A file's name without its extension, which the rename dialog keeps for it. */
const baseNameOf = (entry: Entry) =>
  entry.fileExst && entry.title.toLowerCase().endsWith(entry.fileExst)
    ? entry.title.slice(0, -entry.fileExst.length)
    : entry.title;

type Dialog =
  | { kind: "folder" }
  | { kind: "rename"; entry: Entry }
  | { kind: "upload" }
  | null;

/**
 * \`Article.Body\` takes exactly one element -- Article clones it to inject its
 * own props -- so a list of entries has to live inside a component of its own.
 * Handing \`Article.Body\` an array is the single most common way to get a blank
 * sidebar.
 */
const Places = ({
  active,
  showText,
  onSelect,
}: {
  active: Place;
  showText: boolean;
  onSelect: (place: Place) => void;
}) => (
  <>
    {PLACES.map(({ id, Icon }) => (
      <ArticleItem
        key={id}
        text={PLACE_TITLES[id]}
        showText={showText}
        iconNode={<Icon />}
        // Required, because a portal renders every sidebar entry as a router
        // link. With no router, the path is enough.
        linkData={{ path: \`/\${id}\`, state: {} }}
        isActive={active === id}
        onClick={() => onSelect(id)}
      />
    ))}
  </>
);

/**
 * A small Files application on the portal behind the nearest \`ApiProvider\`:
 * rooms, the personal folder and the trash in the sidebar; folders opened
 * in place with a breadcrumb back; search, a type filter and a sort order
 * the portal applies; rows or tiles; a selection toolbar; new folders and
 * documents, renames and deletes; uploads through \`Uploader\`; files opened
 * in ONLYOFFICE.
 *
 * With no portal configured the same screen runs on \`demoSource\`, a tree in
 * memory with the same shape, so every control still does something.
 *
 * The lesson of this file is the division of labour. \`Article\` and \`Section\`
 * own the layout -- the sticky header, the scrolling body, the collapsing
 * sidebar, the breakpoints. \`FilesSource\` owns the data. This component owns
 * the state in between: where the reader is, what they searched for, what
 * they selected. The three never negotiate, which is why the same \`Section\`
 * carries rows on one click and tiles on the next.
 */
export const FilesApp = () => {
  const api = useApi();
  const { baseUrl } = api;

  // No portal, no requests: the demo source answers from memory.
  const demo = useMemo(() => (baseUrl ? null : demoSource()), [baseUrl]);
  const source = useMemo(() => demo ?? portalSource(api), [demo, api]);

  const [query, setQuery] = useState<Query>({
    place: "rooms",
    folderId: null,
    search: "",
    type: "all",
    sortBy: "AZ",
    ascending: true,
  });
  const { listing, loading, error, reload } = useListing(source, query);

  // The device type comes from the viewport, as the portal's does. The
  // Article folds itself on a tablet and becomes a drawer on a phone from
  // this one prop, and tells us through \`setIsMobileArticle\` when the main
  // button has to leave the sidebar.
  const currentDeviceType = useDeviceType();
  const isDesktop = currentDeviceType === DeviceType.desktop;
  const [isMobileArticle, setIsMobileArticle] = useState(false);
  const [showText, setShowText] = useState(true);
  const [articleOpen, setArticleOpen] = useState(false);
  const [viewAs, setViewAs] = useState<"row" | "tile">("row");
  const [clearSearch, setClearSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const entries = listing?.entries ?? [];
  const current = listing?.current ?? {
    id: 0,
    title: PLACE_TITLES[query.place],
    isRoom: false,
  };
  const crumbs = listing?.crumbs ?? [];
  const canCreate = listing?.canCreate ?? false;
  const atRoot = query.folderId === null;
  const inTrash = query.place === "trash";

  // Rooms are opened, not selected: the toolbar's one action is a delete,
  // and a room is archived before it can be deleted.
  const selectable = entries.filter((entry) => entry.kind !== "room");
  const selected = selectable.filter((entry) => selectedIds.includes(entry.id));

  // Typing in the search box is a request to the portal, so the query is
  // debounced exactly where that request is made.
  const onSearchDebounced = useDebounce((value: string) => {
    setQuery((state) => ({ ...state, search: value }));
  }, 300);

  const go = useCallback((folderId: number | null, place?: Place) => {
    setQuery((state) => {
      if (state.search) setClearSearch(true);
      return {
        ...state,
        place: place ?? state.place,
        folderId,
        search: "",
        type: "all",
      };
    });
    setSelectedIds([]);
  }, []);

  const setType = (type: TypeFilter) =>
    setQuery((state) => ({ ...state, type }));

  const open = (entry: Entry) => {
    if (entry.kind !== "file") {
      go(entry.id);
      return;
    }
    if (!baseUrl || !entry.webUrl) {
      toastr.info(\`\${entry.title} would open in the editor.\`);
      return;
    }
    window.open(new URL(entry.webUrl, baseUrl).href, "_blank", "noopener");
  };

  const copyLink = (entry: Entry) =>
    navigator.clipboard.writeText(new URL(entry.webUrl, baseUrl).href).then(
      () => toastr.success("Link copied"),
      () => toastr.error("The browser refused the clipboard."),
    );

  /** One write, one toast, then the folder is read again. */
  const run = async (
    work: () => Promise<void>,
    done: string,
    denied: string,
  ) => {
    setBusy(true);
    try {
      await work();
      toastr.success(done);
      setDialog(null);
      setSelectedIds([]);
      reload();
    } catch (problem) {
      toastr.error(explainPortalError(problem, denied));
    } finally {
      setBusy(false);
    }
  };

  const remove = (targets: Entry[]) => {
    const what =
      targets.length === 1 ? targets[0].title : \`\${targets.length} items\`;
    return run(
      () => source.remove(targets, inTrash),
      inTrash ? \`\${what} deleted\` : \`\${what} moved to Trash\`,
      "delete here",
    );
  };

  const submitName = (event: React.FormEvent) => {
    event.preventDefault();
    const title = name.trim();
    if (!title || !dialog) return;
    if (dialog.kind === "rename") {
      const { entry } = dialog;
      const full = entry.kind === "file" ? title + entry.fileExst : title;
      run(() => source.rename(entry, full), \`Renamed to \${full}\`, "rename");
    } else {
      run(
        () => source.createFolder(current.id, title),
        \`\${title} created\`,
        "create folders here",
      );
    }
  };

  const openDialog = (next: Exclude<Dialog, null>) => {
    setName(
      next.kind === "rename"
        ? baseNameOf(next.entry)
        : next.kind === "folder"
          ? "New folder"
          : "",
    );
    setDialog(next);
  };

  const createDocument = (title: string) =>
    run(
      () => source.createDocument(current.id, title),
      \`\${title} created\`,
      "create documents here",
    );

  const documentOptions = NEW_DOCUMENTS.map(({ key, label, title }) => ({
    key,
    label,
    onClick: () => createDocument(title),
  }));
  const folderOptions = [
    {
      key: "folder",
      label: "New folder",
      onClick: () => openDialog({ kind: "folder" }),
    },
    {
      key: "upload",
      label: "Upload files",
      onClick: () => openDialog({ kind: "upload" }),
    },
  ];
  const createOptions = [
    ...documentOptions,
    { key: "separator", isSeparator: true },
    ...folderOptions,
  ];

  const contextOptions = (entry: Entry) => {
    const options = [
      {
        key: "open",
        label: entry.kind === "file" ? "Open in ONLYOFFICE" : "Open",
        onClick: () => open(entry),
      },
    ];
    if (entry.kind === "file" && baseUrl && entry.webUrl) {
      options.push({
        key: "link",
        label: "Copy link",
        onClick: () => copyLink(entry),
      });
    }
    if (entry.kind === "room") return options;
    if (!inTrash) {
      options.push({
        key: "rename",
        label: "Rename",
        onClick: () => openDialog({ kind: "rename", entry }),
      });
    }
    return [
      ...options,
      { key: "separator", isSeparator: true },
      {
        key: "delete",
        label: inTrash ? "Delete permanently" : "Move to Trash",
        onClick: () => remove([entry]),
      },
    ];
  };

  const groupMenu: TGroupMenuItem[] = [
    {
      id: "delete",
      label: inTrash ? "Delete permanently" : "Move to Trash",
      title: inTrash ? "Delete permanently" : "Move to Trash",
      iconUrl: TrashReactSvgUrl,
      disabled: busy,
      onClick: () => remove(selected),
    },
  ];

  const select = (which: "all" | "files" | "folders" | "none") =>
    setSelectedIds(
      selectable
        .filter(
          (entry) =>
            which === "all" ||
            (which === "files" && entry.kind === "file") ||
            (which === "folders" && entry.kind === "folder"),
        )
        .map((entry) => entry.id),
    );

  const toggle = (entry: Entry, checked: boolean) =>
    setSelectedIds((state) =>
      checked ? [...state, entry.id] : state.filter((id) => id !== entry.id),
    );

  const selectionOf = (entry: Entry) =>
    entry.kind === "room"
      ? {}
      : {
          checked: selectedIds.includes(entry.id),
          onSelect: (checked: boolean) => toggle(entry, checked),
        };

  const iconOf = (entry: Entry, size: 32 | 96 = 32) =>
    entry.kind === "room" ? (
      <RoomIcon
        title={entry.title}
        color={entry.color || "4781D1"}
        showDefault
        size={\`\${size}px\`}
        radius="6px"
      />
    ) : (
      <FileIcon
        fileExst={entry.kind === "folder" ? "folder" : entry.fileExst}
        size={size}
      />
    );

  // The chips under the filter bar. Stable, as the component asks: it is
  // re-read whenever the function changes.
  const selectedFilterData = useCallback((): TItem[] => {
    const filter = TYPE_FILTERS.find((item) => item.key === query.type);
    return filter
      ? [
          {
            id: \`filter_type-\${filter.key}\`,
            key: filter.key,
            group: FilterGroups.filterType,
            label: filter.label,
          },
        ]
      : [];
  }, [query.type]);

  const viewSettings = useMemo(
    () => [
      { id: "row", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
      {
        id: "tile",
        label: "Tiles",
        value: "tile",
        icon: <ViewTilesReactSvg />,
      },
    ],
    [],
  );

  const folderCount = entries.filter((entry) => entry.kind !== "file").length;
  const fileCount = entries.length - folderCount;

  const rows = (
    <RowContainer useReactWindow={false} itemHeight={56}>
      {entries.map((entry) => (
        <Row
          key={\`\${entry.kind}-\${entry.id}\`}
          {...selectionOf(entry)}
          element={iconOf(entry)}
          contextTitle={entry.title}
          contextOptions={contextOptions(entry)}
        >
          <RowContent>
            <Link
              type={LinkType.action}
              isTextOverflow
              fontSize="13px"
              isBold
              onClick={() => open(entry)}
            >
              {entry.title}
            </Link>
            <div />
            <Text as="span" fontSize="12px" containerMinWidth="120px">
              {entry.by}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="100px">
              {dateOf(entry.updated)}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="80px">
              {entry.detail}
            </Text>
          </RowContent>
        </Row>
      ))}
    </RowContainer>
  );

  const tiles = (
    <TileContainer>
      {entries
        .filter((entry) => entry.kind !== "file")
        .map((entry) => (
          <FolderTile
            key={\`\${entry.kind}-\${entry.id}\`}
            item={{ id: entry.id, title: entry.title, isFolder: true }}
            {...selectionOf(entry)}
            element={iconOf(entry)}
            temporaryIcon={iconOf(entry, 96)}
            contextOptions={contextOptions(entry)}
            thumbnailClick={() => open(entry)}
          >
            <TileContent>
              <Link
                type={LinkType.action}
                isTextOverflow
                fontSize="13px"
                onClick={() => open(entry)}
              >
                {entry.title}
              </Link>
            </TileContent>
          </FolderTile>
        ))}
      {entries
        .filter((entry) => entry.kind === "file")
        .map((entry) => (
          <FileTile
            key={\`file-\${entry.id}\`}
            item={{
              id: entry.id,
              title: entry.title,
              fileExst: entry.fileExst,
              fileType: entry.fileType,
            }}
            {...selectionOf(entry)}
            element={iconOf(entry)}
            temporaryIcon={iconOf(entry, 96)}
            contextOptions={contextOptions(entry)}
          >
            <TileContent>
              <Link
                type={LinkType.action}
                isTextOverflow
                fontSize="13px"
                onClick={() => open(entry)}
              >
                {entry.title}
              </Link>
            </TileContent>
          </FileTile>
        ))}
    </TileContainer>
  );

  const body = error ? (
    <div className={styles.state}>
      <Text fontSize="13px">{error}</Text>
      <Button
        label="Try again"
        size={ButtonSize.small}
        onClick={reload}
        isLoading={loading}
      />
    </div>
  ) : !listing ? (
    <Text fontSize="13px" className={styles.state}>
      Loading...
    </Text>
  ) : entries.length === 0 ? (
    <Text fontSize="13px" className={styles.state}>
      {query.search
        ? \`Nothing matches "\${query.search}".\`
        : query.type !== "all"
          ? "Nothing of that type here."
          : "Nothing here yet."}
    </Text>
  ) : (
    <>
      {viewAs === "row" ? (
        <Text fontSize="12px" isBold className={styles.count}>
          {folderCount} folders • {fileCount} files
          {listing.total > entries.length
            ? \` • first \${entries.length} of \${listing.total}\`
            : ""}
        </Text>
      ) : null}
      {viewAs === "row" ? rows : tiles}
    </>
  );

  return (
    <div className={styles.frame}>
      <Toast />

      <Article
        showText={showText}
        setShowText={setShowText}
        toggleShowText={() => setShowText((state) => !state)}
        articleOpen={articleOpen}
        setArticleOpen={setArticleOpen}
        toggleArticleOpen={() => setArticleOpen((state) => !state)}
        setIsMobileArticle={setIsMobileArticle}
        isMobileArticle={isMobileArticle}
        currentDeviceType={currentDeviceType}
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
        zendeskKey=""
        downloaddesktopUrl=""
        officeforandroidUrl=""
        officeforiosUrl=""
      >
        <Article.Header key="header">
          {showText ? (
            <Heading level={HeadingLevel.h3} size={HeadingSize.small}>
              {demo ? "Files (demo)" : "Files"}
            </Heading>
          ) : (
            // Folded to 60px the portal shows its small logo; this is ours.
            <CatalogDocumentsReactSvg className={styles.collapsedMark} />
          )}
        </Article.Header>

        <Article.MainButton key="main-button">
          {isMobileArticle ? (
            // A tablet or a phone keeps no wide button in the sidebar: the
            // portal moves the actions to the floating button at the foot of
            // the screen, and drops it where nothing can be created.
            canCreate ? (
              <MainButtonMobile
                className={styles.floating}
                actionOptions={documentOptions}
                buttonOptions={folderOptions}
                withMenu
              />
            ) : null
          ) : (
            <MainButton
              isDropdown
              text="Create"
              model={createOptions}
              isDisabled={!canCreate || busy}
              onAction={noop}
            />
          )}
        </Article.MainButton>

        <Article.Body key="body">
          <Places
            active={query.place}
            showText={showText}
            onSelect={(place) => go(null, place)}
          />
        </Article.Body>
      </Article>

      <div className={styles.main}>
        <Section
          currentDeviceType={currentDeviceType}
          withBodyScroll
          isHeaderVisible
          viewAs={viewAs}
          settingsStudio={false}
        >
          <Section.SectionHeader>
            {selected.length > 0 ? (
              // The portal's own group menu, prop for prop: a checkbox with
              // the select-all drop-down beside it, then the actions. No
              // label and no close button -- clearing the checkbox empties
              // the selection, which is what makes the bar disappear.
              <div className={styles.headerSlot}>
                <TableGroupMenu
                  isChecked={selected.length === selectable.length}
                  isIndeterminate={selected.length !== selectable.length}
                  headerMenu={groupMenu}
                  checkboxOptions={
                    <>
                      <DropDownItem label="All" onClick={() => select("all")} />
                      <DropDownItem
                        label="Files"
                        onClick={() => select("files")}
                      />
                      <DropDownItem
                        label="Folders"
                        onClick={() => select("folders")}
                      />
                    </>
                  }
                  withoutInfoPanelToggler
                  onChange={(checked) => select(checked ? "all" : "none")}
                />
              </div>
            ) : (
              <Navigation
                title={current.title}
                isRootFolder={atRoot}
                canCreate={canCreate}
                showText
                isDesktop={isDesktop}
                isRoom={current.isRoom}
                withMenu
                showTitle
                showRootFolderTitle
                showNavigationButton={false}
                isInfoPanelVisible={false}
                isCurrentFolderInfo={false}
                currentDeviceType={currentDeviceType}
                // The ancestors, nearest first, the place's root last: the
                // portal's \`pathParts\` without the current folder, reversed.
                navigationItems={crumbs.map((crumb) => ({
                  id: crumb.id,
                  title: crumb.title,
                  isRootRoom: crumb.isRootRoom,
                }))}
                onClickFolder={(id) => {
                  const crumb = crumbs.find(
                    (item) => String(item.id) === String(id),
                  );
                  if (crumb) go(crumb.isRoot ? null : crumb.id);
                }}
                onBackToParentFolder={() => {
                  const parent = crumbs[0];
                  go(parent && !parent.isRoot ? parent.id : null);
                }}
                clearTrash={noop}
                getContextOptionsFolder={() => [
                  { key: "refresh", label: "Refresh", onClick: reload },
                ]}
                getContextOptionsPlus={() => createOptions}
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
              placeholder={\`Search in \${current.title}\`}
              filterTitle="Filter"
              sortByTitle="Sort by"
              filterHeader="Filter"
              selectorLabel="Select"
              userId="1"
              currentDeviceType={currentDeviceType}
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
              clearSearch={clearSearch}
              setClearSearch={setClearSearch}
              onSearch={(value) => onSearchDebounced(value ?? "")}
              onClearFilter={() => onSearchDebounced("")}
              onChangeViewAs={() =>
                setViewAs((state) => (state === "row" ? "tile" : "row"))
              }
              onSort={(key, direction) =>
                setQuery((state) => ({
                  ...state,
                  sortBy: key === "DateAndTime" ? "DateAndTime" : "AZ",
                  ascending: direction === "asc",
                }))
              }
              onFilter={(items) => {
                const chosen = (items as TItem[]).find(
                  (item) => item.group === FilterGroups.filterType,
                );
                setType(isTypeFilter(chosen?.key) ? chosen.key : "all");
              }}
              onSortButtonClick={noop}
              removeSelectedItem={() => setType("all")}
              clearAll={() => setType("all")}
              getSelectedInputValue={() => query.search}
              getSortData={() => [
                {
                  id: "name",
                  key: "AZ",
                  label: "Name",
                  isSelected: query.sortBy === "AZ",
                  sortDirection: query.ascending ? "asc" : "desc",
                  sortId: "AZ",
                },
                {
                  id: "modified",
                  key: "DateAndTime",
                  label: "Last modified",
                  isSelected: query.sortBy === "DateAndTime",
                  sortDirection: query.ascending ? "asc" : "desc",
                  sortId: "DateAndTime",
                },
              ]}
              getSelectedSortData={() => ({
                sortDirection: query.ascending ? "asc" : "desc",
                sortId: query.sortBy,
              })}
              getViewSettingsData={() => viewSettings}
              getFilterData={() =>
                Promise.resolve([
                  {
                    key: FilterGroups.filterType,
                    group: FilterGroups.filterType,
                    label: "Type",
                    isHeader: true,
                    isLast: true,
                  },
                  ...TYPE_FILTERS.map((filter, index) => ({
                    id: \`filter_type-\${filter.key}\`,
                    key: filter.key,
                    group: FilterGroups.filterType,
                    label: filter.label,
                    isSelected: query.type === filter.key,
                    isLast: index === TYPE_FILTERS.length - 1,
                  })),
                ])
              }
              getSelectedFilterData={selectedFilterData}
            />
          </Section.SectionFilter>

          <Section.SectionBody>{body}</Section.SectionBody>

          <Section.SectionFooter>{null}</Section.SectionFooter>
        </Section>
      </div>

      <ModalDialog
        visible={dialog?.kind === "folder" || dialog?.kind === "rename"}
        displayType={ModalDialogType.modal}
        withForm
        onSubmit={submitName}
        onClose={() => setDialog(null)}
      >
        <ModalDialog.Header>
          {dialog?.kind === "rename" ? "Rename" : "New folder"}
        </ModalDialog.Header>
        <ModalDialog.Body>
          <FieldContainer isVertical labelVisible isRequired labelText="Name">
            <TextInput
              scale
              isAutoFocussed
              type={InputType.text}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FieldContainer>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            primary
            scale
            type="submit"
            label={dialog?.kind === "rename" ? "Rename" : "Create"}
            size={ButtonSize.normal}
            isLoading={busy}
            isDisabled={!name.trim()}
          />
          <Button
            scale
            label="Cancel"
            size={ButtonSize.normal}
            onClick={() => setDialog(null)}
          />
        </ModalDialog.Footer>
      </ModalDialog>

      <ModalDialog
        visible={dialog?.kind === "upload"}
        displayType={ModalDialogType.modal}
        onClose={() => setDialog(null)}
      >
        <ModalDialog.Header>Upload to {current.title}</ModalDialog.Header>
        <ModalDialog.Body>
          <div className={styles.uploadBox}>
            {demo ? (
              // No portal, no upload session: the Dropzone the uploader is
              // built on takes the files and the demo tree keeps them.
              <Dropzone
                accept={ACCEPT}
                isLoading={false}
                isMultipleUpload
                linkMainText="Choose files"
                linkSecondaryText="or drop them here"
                exstsText={ACCEPT_SHORT}
                fullExstsText={ACCEPT_FULL}
                formatsPlusBadgeValue={5}
                onDrop={(files) => {
                  demo.addFiles(current.id, files);
                  toastr.success(\`\${files.length} files uploaded\`);
                  setDialog(null);
                  reload();
                }}
                onDropRejected={() =>
                  toastr.error("That kind of file is not accepted.")
                }
              />
            ) : (
              // The kit's uploader: a chunked session against the portal
              // folder, as whoever the nearest provider is.
              <Uploader
                targetId={current.id}
                accept={ACCEPT}
                shortText={ACCEPT_SHORT}
                fullText={ACCEPT_FULL}
                badgeValue={5}
                linkMainText="Choose files"
                secondaryText="or drop them here"
                isMultipleUpload
                maxPerUploadSize="25MB"
                onUploadSuccess={() => {
                  setDialog(null);
                  reload();
                }}
                onUploadError={({ error: message }) => toastr.error(message)}
              />
            )}
          </div>
        </ModalDialog.Body>
      </ModalDialog>
    </div>
  );
};
`;try{FilesApp.displayName=`FilesApp`,FilesApp.__docgenInfo={description:`A small Files application on the portal behind the nearest \`ApiProvider\`:
rooms, the personal folder and the trash in the sidebar; folders opened
in place with a breadcrumb back; search, a type filter and a sort order
the portal applies; rows or tiles; a selection toolbar; new folders and
documents, renames and deletes; uploads through \`Uploader\`; files opened
in ONLYOFFICE.

With no portal configured the same screen runs on \`demoSource\`, a tree in
memory with the same shape, so every control still does something.

The lesson of this file is the division of labour. \`Article\` and \`Section\`
own the layout -- the sticky header, the scrolling body, the collapsing
sidebar, the breakpoints. \`FilesSource\` owns the data. This component owns
the state in between: where the reader is, what they searched for, what
they selected. The three never negotiate, which is why the same \`Section\`
carries rows on one click and tiles on the next.`,displayName:`FilesApp`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/files-app/FilesApp.tsx`,methods:[],props:{},tags:{}}}catch{}})))()}var m;function h(){return(h=e((()=>{m=`import {
  type DeleteBatchRequestDto,
  type FileDtoInteger,
  type FolderContentDtoInteger,
  type FolderDtoInteger,
  FilterType,
  type OperationsApi,
  SearchArea,
  SortOrder,
} from "@onlyoffice/docspace-api-sdk";

import { FileType } from "../../../enums";
import type { TApiContext } from "../../../providers/api";

/**
 * What the Files app reads and writes, and the one shape both of its
 * back ends answer in.
 *
 * The screen never sees the SDK. It asks a \`FilesSource\` for a \`Listing\`
 * and tells it what to create, rename and remove; \`portalSource\` answers
 * with the portal behind \`useApi()\`, \`demoSource\` (in \`demo.ts\`) with a
 * tree in memory. Everything the screen needs to draw a row -- title, kind,
 * who changed it and when, size, where the portal opens it -- is on the
 * \`Entry\`, so the mapping from the wire happens exactly once, here.
 */

/** The three places the sidebar offers. */
export type Place = "rooms" | "documents" | "trash";

export type TypeFilter =
  "all" | "documents" | "spreadsheets" | "presentations" | "folders";

/** What is being asked for: a place, a folder in it, and how to narrow and order it. */
export type Query = {
  place: Place;
  /** A folder inside the place, or null for the place's own root. */
  folderId: number | null;
  search: string;
  type: TypeFilter;
  sortBy: "AZ" | "DateAndTime";
  ascending: boolean;
};

export type Entry = {
  id: number;
  title: string;
  kind: "room" | "folder" | "file";
  /** Extension with the dot for a file; empty otherwise. */
  fileExst: string;
  fileType: FileType;
  /** ISO date of the last change; empty when the portal gave none. */
  updated: string;
  /** Who made that change. */
  by: string;
  /** A file's size as the portal formats it; a folder's item count. */
  detail: string;
  /** Where the portal opens a file; empty for folders and in demo. */
  webUrl: string;
  /** A room's colour, as the portal keeps it: six hex digits without the hash. */
  color: string;
};

/** One ancestor in the breadcrumb. */
export type Crumb = {
  id: number;
  title: string;
  /** The place's own root: Rooms, My documents, Trash. */
  isRoot: boolean;
  /** The room the current folder lives in. */
  isRootRoom: boolean;
};

export type Listing = {
  current: { id: number; title: string; isRoom: boolean };
  /** Whether folders and files can be made here: never at the Rooms root or in Trash. */
  canCreate: boolean;
  /** The ancestors, nearest first, the place's root last. Empty at a root. */
  crumbs: Crumb[];
  entries: Entry[];
  /** How many there are in all; more than \`entries\` when a page was cut. */
  total: number;
};

export type FilesSource = {
  list: (query: Query) => Promise<Listing>;
  createFolder: (parentId: number, title: string) => Promise<void>;
  /** An office document made by the document server; the extension picks the kind. */
  createDocument: (parentId: number, title: string) => Promise<void>;
  rename: (entry: Entry, title: string) => Promise<void>;
  /** To Trash, or gone for good when \`forever\` -- which is what Trash itself offers. */
  remove: (entries: Entry[], forever: boolean) => Promise<void>;
};

export const PLACE_TITLES: Record<Place, string> = {
  rooms: "Rooms",
  documents: "My documents",
  trash: "Trash",
};

const FILE_TYPE_BY_EXST: Record<string, FileType> = {
  ".docx": FileType.Document,
  ".doc": FileType.Document,
  ".odt": FileType.Document,
  ".txt": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".xls": FileType.Spreadsheet,
  ".csv": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".ppt": FileType.Presentation,
  ".pdf": FileType.PDF,
  ".png": FileType.Image,
  ".jpg": FileType.Image,
  ".jpeg": FileType.Image,
  ".gif": FileType.Image,
  ".zip": FileType.Archive,
  ".mp4": FileType.Video,
};

export const extensionOf = (title: string) => {
  const dot = title.lastIndexOf(".");
  return dot > 0 ? title.slice(dot).toLowerCase() : "";
};

export const fileTypeOf = (fileExst: string) =>
  FILE_TYPE_BY_EXST[fileExst] ?? FileType.Unknown;

/** Whether an entry passes the Type filter; the demo and the Rooms root apply it by hand. */
export const matchesType = (entry: Entry, type: TypeFilter) => {
  switch (type) {
    case "all":
      return true;
    case "folders":
      return entry.kind !== "file";
    case "documents":
      return entry.fileType === FileType.Document;
    case "spreadsheets":
      return entry.fileType === FileType.Spreadsheet;
    case "presentations":
      return entry.fileType === FileType.Presentation;
  }
};

/** Sorts folders before files, then by the query's field and direction. */
export const sortEntries = (entries: Entry[], query: Query) => {
  const sign = query.ascending ? 1 : -1;
  const rank = (entry: Entry) => (entry.kind === "file" ? 1 : 0);
  return [...entries].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (query.sortBy === "DateAndTime" && a.updated !== b.updated) {
      return sign * a.updated.localeCompare(b.updated);
    }
    return sign * a.title.localeCompare(b.title);
  });
};

/** \`updated\` is typed as an object and arrives as a string; take either. */
const whenOf = (value: unknown): string =>
  typeof value === "string"
    ? value
    : ((value as { utcTime?: string } | undefined)?.utcTime ?? "");

const authorOf = (entry: FolderDtoInteger | FileDtoInteger) =>
  entry.updatedBy?.displayName ?? entry.createdBy?.displayName ?? "";

/** The wire's \`pathParts\`, typed \`any\` by the SDK: \`{ id, title, roomType? }\` per level. */
type PathPart = { id?: number; title?: string; roomType?: number | null };

const isRoomDto = (folder: FolderDtoInteger | PathPart) =>
  folder.roomType !== undefined && folder.roomType !== null;

const PAGE = 100;

const API_FILTER: Record<TypeFilter, FilterType | undefined> = {
  all: undefined,
  documents: FilterType.DocumentsOnly,
  spreadsheets: FilterType.SpreadsheetsOnly,
  presentations: FilterType.PresentationsOnly,
  folders: FilterType.FoldersOnly,
};

/** Waits for the portal's file operations -- deletes run in the background -- to finish. */
const settled = async (operationsApi: OperationsApi) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const operations =
      (await operationsApi.getOperationStatuses()).data.response ?? [];
    if (operations.every((operation) => operation.finished)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
};

/** The portal behind \`useApi()\`, whoever the nearest provider speaks for. */
export const portalSource = (
  api: Pick<
    TApiContext,
    "roomsApi" | "foldersApi" | "filesApi" | "operationsApi"
  >,
): FilesSource => {
  const fetch = async (query: Query) => {
    const paging = {
      count: PAGE,
      filterValue: query.search || undefined,
      sortBy: query.sortBy,
      sortOrder: query.ascending ? SortOrder.Ascending : SortOrder.Descending,
    };
    const filtered = { ...paging, filterType: API_FILTER[query.type] };

    if (query.folderId !== null) {
      return api.foldersApi.getFolderByFolderId({
        folderId: query.folderId,
        ...filtered,
      });
    }
    if (query.place === "rooms") {
      return api.roomsApi.getRoomsFolder({
        searchArea: SearchArea.Active,
        ...paging,
      });
    }
    if (query.place === "documents") {
      return api.foldersApi.getMyFolder(filtered);
    }
    return api.foldersApi.getTrashFolder(filtered);
  };

  const toListing = (
    content: FolderContentDtoInteger | undefined,
    query: Query,
  ): Listing => {
    const current = content?.current;
    // The wire carries full DTOs where the SDK types promise only the base.
    const folders = (content?.folders ?? []) as FolderDtoInteger[];
    const files = (content?.files ?? []) as FileDtoInteger[];
    const parts = (
      Array.isArray(content?.pathParts) ? content.pathParts : []
    ) as PathPart[];

    const crumbs: Crumb[] = parts
      .slice(0, -1)
      .reverse()
      .map((part, index, all) => ({
        id: part.id ?? 0,
        title: part.title ?? "",
        isRoot: index === all.length - 1,
        isRootRoom: isRoomDto(part),
      }));

    let entries: Entry[] = [
      ...folders.map((folder): Entry => ({
        id: folder.id ?? 0,
        title: folder.title ?? "",
        kind: isRoomDto(folder) ? "room" : "folder",
        fileExst: "",
        fileType: FileType.Unknown,
        updated: whenOf(folder.updated),
        by: authorOf(folder),
        detail: \`\${folder.filesCount ?? 0} files\`,
        webUrl: "",
        color: folder.logo?.color ?? "",
      })),
      ...files.map((file): Entry => ({
        id: file.id ?? 0,
        title: file.title ?? "",
        kind: "file",
        fileExst: file.fileExst ?? extensionOf(file.title ?? ""),
        fileType: (file.fileType ?? FileType.Unknown) as FileType,
        updated: whenOf(file.updated),
        by: authorOf(file),
        detail: file.contentLength ?? "",
        webUrl: file.webUrl ?? "",
        color: "",
      })),
    ];

    // The rooms list takes no type filter, so the page is narrowed here.
    const atRoomsRoot = query.place === "rooms" && query.folderId === null;
    if (atRoomsRoot) {
      entries = entries.filter((entry) => matchesType(entry, query.type));
    }

    return {
      current: {
        id: current?.id ?? 0,
        title: current?.title ?? PLACE_TITLES[query.place],
        isRoom: current ? isRoomDto(current) : false,
      },
      canCreate: query.place !== "trash" && !atRoomsRoot,
      crumbs,
      entries,
      total:
        atRoomsRoot && query.type !== "all"
          ? entries.length
          : (content?.total ?? entries.length),
    };
  };

  return {
    list: async (query) => toListing((await fetch(query)).data.response, query),

    createFolder: async (parentId, title) => {
      await api.foldersApi.createFolder({
        folderId: parentId,
        createFolder: { title },
      });
    },

    createDocument: async (parentId, title) => {
      await api.filesApi.createFile({
        folderId: parentId,
        createFileJsonElement: { title },
      });
    },

    rename: async (entry, title) => {
      if (entry.kind === "file") {
        await api.filesApi.updateFile({
          fileId: entry.id,
          updateFile: { title },
        });
      } else {
        await api.foldersApi.renameFolder({
          folderId: entry.id,
          createFolder: { title },
        });
      }
    },

    remove: async (entries, forever) => {
      // Rooms are not deleted from here: the portal archives them first.
      const request: DeleteBatchRequestDto = {
        folderIds: entries
          .filter((entry) => entry.kind === "folder")
          .map((entry) => entry.id),
        fileIds: entries
          .filter((entry) => entry.kind === "file")
          .map((entry) => entry.id),
        deleteAfter: false,
        immediately: forever,
      };
      await api.operationsApi.deleteBatchItems({
        deleteBatchRequestDto: request,
      });
      await settled(api.operationsApi);
    },
  };
};
`})))()}var g;function _(){return(_=e((()=>{g=`import { FileType } from "../../../enums";
import {
  type Entry,
  extensionOf,
  type FilesSource,
  fileTypeOf,
  type Listing,
  matchesType,
  PLACE_TITLES,
  type Place,
  type Query,
  sortEntries,
} from "./source";

/**
 * The same \`FilesSource\`, answered from memory, for a page opened with no
 * portal behind it. Three rooms, a personal folder, a trash: enough to try
 * every control on the screen. It forgets everything on reload.
 */

/** The three roots. Rooms has no folder of its own, so its id is never an entry's. */
const ROOMS = 0;
const DOCS = 1;
const TRASH = 2;

type Node = Entry & { parentId: number };

const DAY = 864e5;
const ago = (days: number) =>
  new Date(Date.parse("2026-09-28T09:00:00Z") - days * DAY).toISOString();

const node = (
  id: number,
  parentId: number,
  title: string,
  kind: Node["kind"],
  days: number,
  by: string,
  detail = "",
  color = "",
): Node => {
  const fileExst = kind === "file" ? extensionOf(title) : "";
  return {
    id,
    parentId,
    title,
    kind,
    fileExst,
    fileType: kind === "file" ? fileTypeOf(fileExst) : FileType.Unknown,
    updated: ago(days),
    by,
    detail,
    webUrl: "",
    color,
  };
};

const seed = (): Node[] => [
  node(1, ROOMS, PLACE_TITLES.documents, "folder", 0, ""),
  node(2, ROOMS, PLACE_TITLES.trash, "folder", 0, ""),
  node(
    10,
    ROOMS,
    "Finance department",
    "room",
    1,
    "Anna Petrova",
    "",
    "4781D1",
  ),
  node(11, ROOMS, "Marketing", "room", 4, "Ivan Sokolov", "", "F2A93B"),
  node(12, ROOMS, "Board papers", "room", 12, "Elena Volkova", "", "6D4EC2"),
  node(100, 10, "Reports 2026", "folder", 2, "Anna Petrova"),
  node(101, 10, "Invoices", "folder", 6, "Maria Ivanova"),
  node(102, 10, "Q4 budget.xlsx", "file", 1, "Ivan Sokolov", "846 KB"),
  node(103, 10, "Annual report 2025.docx", "file", 3, "Anna Petrova", "2.4 MB"),
  node(104, 10, "Team presentation.pptx", "file", 5, "Maria Ivanova", "5.1 MB"),
  node(110, 100, "Budget overview.xlsx", "file", 2, "Anna Petrova", "312 KB"),
  node(111, 100, "Board summary.pdf", "file", 2, "Anna Petrova", "1.1 MB"),
  node(120, 101, "Invoice 2026-041.pdf", "file", 6, "Maria Ivanova", "98 KB"),
  node(130, 11, "Campaign plan.docx", "file", 4, "Ivan Sokolov", "640 KB"),
  node(131, 11, "Logo drafts.png", "file", 9, "Ivan Sokolov", "3.2 MB"),
  node(140, 12, "Minutes 2026-09.docx", "file", 12, "Elena Volkova", "210 KB"),
  node(200, DOCS, "Templates", "folder", 8, "You"),
  node(201, DOCS, "Notes.docx", "file", 0, "You", "24 KB"),
  node(202, DOCS, "Contract draft.docx", "file", 7, "You", "180 KB"),
  node(203, DOCS, "Holiday photo.png", "file", 20, "You", "3.7 MB"),
  node(210, 200, "Letter.docx", "file", 8, "You", "31 KB"),
  node(300, TRASH, "Old logo.png", "file", 15, "Ivan Sokolov", "1.9 MB"),
];

const rootOf = (place: Place) =>
  place === "documents" ? DOCS : place === "trash" ? TRASH : ROOMS;

export type DemoSource = FilesSource & {
  /** What the drop zone hands over; the uploader would have sent it to the portal. */
  addFiles: (parentId: number, files: File[]) => void;
};

export const demoSource = (): DemoSource => {
  const nodes = new Map(seed().map((entry) => [entry.id, entry]));
  let nextId = 1000;

  const childrenOf = (parentId: number) =>
    [...nodes.values()].filter((entry) => entry.parentId === parentId);

  const withCount = (entry: Node): Entry =>
    entry.kind === "file"
      ? entry
      : { ...entry, detail: \`\${childrenOf(entry.id).length} items\` };

  const crumbsOf = (id: number, place: Place): Listing["crumbs"] => {
    const crumbs: Listing["crumbs"] = [];
    let current = nodes.get(id);
    while (current && current.parentId !== ROOMS) {
      const parent = nodes.get(current.parentId);
      if (!parent) break;
      crumbs.push({
        id: parent.id,
        title: parent.title,
        isRoot: parent.id === rootOf(place),
        isRootRoom: parent.kind === "room",
      });
      current = parent;
    }
    if (place === "rooms" && id !== ROOMS) {
      crumbs.push({
        id: ROOMS,
        title: PLACE_TITLES.rooms,
        isRoot: true,
        isRootRoom: false,
      });
    }
    return crumbs;
  };

  const list: FilesSource["list"] = async (query) => {
    const id = query.folderId ?? rootOf(query.place);
    const folder = nodes.get(id);
    const needle = query.search.trim().toLowerCase();
    const entries = sortEntries(
      childrenOf(id)
        .filter((entry) => entry.parentId !== ROOMS || entry.kind === "room")
        .filter((entry) => matchesType(entry, query.type))
        .filter(
          (entry) => !needle || entry.title.toLowerCase().includes(needle),
        )
        .map(withCount),
      query,
    );

    return {
      current: {
        id,
        title: folder?.title ?? PLACE_TITLES[query.place],
        isRoom: folder?.kind === "room",
      },
      canCreate: query.place !== "trash" && id !== ROOMS,
      crumbs: crumbsOf(id, query.place),
      entries,
      total: entries.length,
    };
  };

  const add = (parentId: number, title: string, kind: Node["kind"]) => {
    nextId += 1;
    nodes.set(nextId, node(nextId, parentId, title, kind, 0, "You"));
  };

  return {
    list,

    createFolder: async (parentId, title) => add(parentId, title, "folder"),

    createDocument: async (parentId, title) => add(parentId, title, "file"),

    rename: async (entry, title) => {
      const current = nodes.get(entry.id);
      if (current) nodes.set(entry.id, { ...current, title });
    },

    remove: async (entries, forever) => {
      for (const entry of entries) {
        const current = nodes.get(entry.id);
        if (!current) continue;
        if (forever) {
          nodes.delete(entry.id);
        } else {
          nodes.set(entry.id, { ...current, parentId: TRASH, updated: ago(0) });
        }
      }
    },

    addFiles: (parentId, files) => {
      for (const file of files) {
        nextId += 1;
        nodes.set(
          nextId,
          node(
            nextId,
            parentId,
            file.name,
            "file",
            0,
            "You",
            \`\${Math.max(1, Math.round(file.size / 1024))} KB\`,
          ),
        );
      }
    },
  };
};
`})))()}var v;function y(){return(y=e((()=>{v=`import { useCallback, useEffect, useState } from "react";

import { explainPortalError } from "../legal/explain";
import type { FilesSource, Listing, Query } from "./source";

/**
 * One listing at a time. A new query starts a new read and the answer to an
 * old one is dropped, so a fast click through three folders never shows the
 * second folder's files under the third folder's name. The previous listing
 * stays on screen while the next one loads; \`reload\` asks for the same
 * query again after a write.
 */
export type ListingState = {
  listing: Listing | null;
  loading: boolean;
  /** Why the last read failed; empty when it did not. */
  error: string;
};

export const useListing = (source: FilesSource, query: Query) => {
  const [state, setState] = useState<ListingState>({
    listing: null,
    loading: true,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  const { place, folderId, search, type, sortBy, ascending } = query;

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: "" }));

    source.list({ place, folderId, search, type, sortBy, ascending }).then(
      (listing) => {
        if (!cancelled) setState({ listing, loading: false, error: "" });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            listing: current.listing,
            loading: false,
            error: explainPortalError(error, "read this folder"),
          }));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [source, place, folderId, search, type, sortBy, ascending, attempt]);

  return { ...state, reload };
};
`})))()}var b;function x(){return(x=e((()=>{b=`import { useEffect, useState } from "react";

import { DeviceType } from "../../../enums";
import { isMobile, isTablet } from "../../../utils/device";

/**
 * The portal's three device types, read off the viewport.
 *
 * The kit's layout components take the type as a prop rather than measuring
 * anything themselves, because on the portal it is one store value every
 * screen agrees on; here the window is that store. \`Article\` derives its
 * collapsed and mobile forms from the prop, so a constant would leave the
 * sidebar unable to fold and the main button unable to follow it.
 */
const deviceTypeOf = () =>
  isMobile()
    ? DeviceType.mobile
    : isTablet()
      ? DeviceType.tablet
      : DeviceType.desktop;

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    typeof window === "undefined" ? DeviceType.desktop : deviceTypeOf(),
  );

  useEffect(() => {
    const update = () => setDeviceType(deviceTypeOf());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceType;
};
`})))()}function S(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(n,{of:l}),`
`,(0,w.jsx)(t.h1,{id:`a-small-files-app`,children:`A small Files app`}),`
`,(0,w.jsx)(t.p,{children:`A Files application on one screen: the rooms, the personal folder and the
trash in the sidebar; folders opened in place, with a breadcrumb back;
search, a type filter and a sort order; rows or tiles; a selection toolbar;
new folders and documents, renames and deletes; uploads; files opened in
ONLYOFFICE.`}),`
`,(0,w.jsxs)(t.p,{children:[`Below it runs on a tree in memory. Add a portal in the `,(0,w.jsx)(t.strong,{children:`API provider`}),`
toolbar -- `,(0,w.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs`,children:`Connect to a portal`}),`
says how -- and the same screen reads that portal, as the owner of the key.
Nothing in the component changes; the sidebar heading drops its "(demo)".`]}),`
`,(0,w.jsx)(r,{of:d}),`
`,(0,w.jsxs)(t.p,{children:[`Open `,(0,w.jsx)(t.strong,{children:`Finance department`}),`. Search for `,(0,w.jsx)(t.code,{children:`budget`}),`. Switch to tiles. Tick two
files and watch the breadcrumb header become a toolbar. `,(0,w.jsx)(t.strong,{children:`Create → New
folder`}),`; then open the folder's menu and rename it. Move something to Trash
and find it there.`]}),`
`,(0,w.jsxs)(t.p,{children:[`The filter panel, the dialogs and the context menus are portals into the
page's own `,(0,w.jsx)(t.code,{children:`<body>`}),` -- which is the whole application on a real screen, and
this whole article here. Open the sample on its own, from `,(0,w.jsx)(t.strong,{children:`Default`}),` in the
sidebar, to see them the way an application does.`]}),`
`,(0,w.jsx)(t.h2,{id:`who-owns-what`,children:`Who owns what`}),`
`,(0,w.jsxs)(t.p,{children:[`This is the one idea worth taking from the file: `,(0,w.jsx)(t.strong,{children:`layout, data and state
never negotiate.`})]}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:(0,w.jsx)(t.code,{children:`Article`})}),` is the sidebar. It owns collapsing, the mobile drawer, the
main button slot and the profile block. You give it entries.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:(0,w.jsx)(t.code,{children:`Section`})}),` is everything to the right, as five named slots --
`,(0,w.jsx)(t.code,{children:`SectionHeader`}),`, `,(0,w.jsx)(t.code,{children:`SectionFilter`}),`, `,(0,w.jsx)(t.code,{children:`SectionBody`}),`, `,(0,w.jsx)(t.code,{children:`SectionFooter`}),`, plus the
info panel. It owns the sticky header, the scroll container and the
breakpoints.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:(0,w.jsx)(t.code,{children:`FilesSource`})}),` is the data: one `,(0,w.jsx)(t.code,{children:`list(query)`}),` that answers a `,(0,w.jsx)(t.code,{children:`Listing`}),`,
and four writes. `,(0,w.jsx)(t.code,{children:`portalSource`}),` is the SDK behind `,(0,w.jsx)(t.code,{children:`useApi()`}),`; `,(0,w.jsx)(t.code,{children:`demoSource`}),`
is a tree in memory with the same shape. The screen cannot tell them apart,
which is what lets one page work both with and without a portal.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`The component`}),` owns what is left: where the reader is (`,(0,w.jsx)(t.code,{children:`Query`}),`), what
they searched for, what they selected, which view is on, which dialog is
open. No component here has an opinion about any of it, which is why the
same `,(0,w.jsx)(t.code,{children:`Section`}),` carries rows on one click and tiles on the next.`]}),`
`]}),`
`,(0,w.jsxs)(t.p,{children:[`That is also what makes the header trick a two-line change: while something
is selected, render `,(0,w.jsx)(t.code,{children:`TableGroupMenu`}),` in `,(0,w.jsx)(t.code,{children:`SectionHeader`}),` instead of
`,(0,w.jsx)(t.code,{children:`Navigation`}),`. The body does not know the difference.`]}),`
`,(0,w.jsx)(t.h2,{id:`the-device-type-is-a-prop-so-it-has-to-come-from-somewhere`,children:`The device type is a prop, so it has to come from somewhere`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`Article`}),`, `,(0,w.jsx)(t.code,{children:`Section`}),`, `,(0,w.jsx)(t.code,{children:`Navigation`}),` and `,(0,w.jsx)(t.code,{children:`Filter`}),` take `,(0,w.jsx)(t.code,{children:`currentDeviceType`}),`
rather than measuring the window: on the portal it is one store value every
screen agrees on. Here `,(0,w.jsx)(t.code,{children:`useDeviceType`}),` reads it off the viewport with the
kit's own breakpoints, and everything follows from that one value, the way
it does in the client:`]}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Desktop`}),`: the sidebar is 243px wide and carries the `,(0,w.jsx)(t.code,{children:`Create`}),` button.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Tablet`}),`: the sidebar folds to 60px from the arrow at its foot, the
heading gives way to a mark, and there is no wide button to clip -- the
`,(0,w.jsx)(t.code,{children:`Article`}),` reports `,(0,w.jsx)(t.code,{children:`isMobileArticle`}),`, and the actions move to
`,(0,w.jsx)(t.code,{children:`MainButtonMobile`}),`, the floating button at the foot of the screen. It goes
away where nothing can be created.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Phone`}),`: the sidebar becomes a drawer, and the floating button stays.`]}),`
`]}),`
`,(0,w.jsxs)(t.p,{children:[`Narrow the window on this page to watch the switch. Passing a constant
`,(0,w.jsx)(t.code,{children:`DeviceType.desktop`}),` instead, as an earlier version of this sample did, left
the sidebar able to fold and the button unable to follow.`]}),`
`,(0,w.jsx)(t.h2,{id:`what-the-portal-is-asked`,children:`What the portal is asked`}),`
`,(0,w.jsxs)(t.p,{children:[`Every control on the screen is a call the portal already answers. The kit's
`,(0,w.jsx)(t.code,{children:`ApiProvider`}),` makes the typed clients once; `,(0,w.jsx)(t.code,{children:`useApi()`}),` hands them out.`]}),`
`,(0,w.jsxs)(t.table,{children:[(0,w.jsx)(t.thead,{children:(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.th,{children:`On screen`}),(0,w.jsx)(t.th,{children:`Call`})]})}),(0,w.jsxs)(t.tbody,{children:[(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Rooms`}),(0,w.jsx)(t.td,{children:(0,w.jsx)(t.code,{children:`roomsApi.getRoomsFolder({ searchArea: Active })`})})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`A room or a folder`}),(0,w.jsx)(t.td,{children:(0,w.jsx)(t.code,{children:`foldersApi.getFolderByFolderId({ folderId })`})})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`My documents, Trash`}),(0,w.jsxs)(t.td,{children:[(0,w.jsx)(t.code,{children:`foldersApi.getMyFolder()`}),`, `,(0,w.jsx)(t.code,{children:`foldersApi.getTrashFolder()`})]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Search, Type filter, Sort by`}),(0,w.jsxs)(t.td,{children:[(0,w.jsx)(t.code,{children:`filterValue`}),`, `,(0,w.jsx)(t.code,{children:`filterType`}),`, `,(0,w.jsx)(t.code,{children:`sortBy`}),` + `,(0,w.jsx)(t.code,{children:`sortOrder`}),` on the same`]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Breadcrumb`}),(0,w.jsxs)(t.td,{children:[`the listing's `,(0,w.jsx)(t.code,{children:`pathParts`}),`, without the current folder, reversed`]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Create → New folder`}),(0,w.jsx)(t.td,{children:(0,w.jsx)(t.code,{children:`foldersApi.createFolder({ folderId, createFolder: { title } })`})})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Create → New document`}),(0,w.jsx)(t.td,{children:(0,w.jsx)(t.code,{children:`filesApi.createFile({ folderId, createFileJsonElement })`})})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Rename`}),(0,w.jsxs)(t.td,{children:[(0,w.jsx)(t.code,{children:`filesApi.updateFile`}),`, `,(0,w.jsx)(t.code,{children:`foldersApi.renameFolder`})]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Move to Trash, Delete permanently`}),(0,w.jsxs)(t.td,{children:[(0,w.jsx)(t.code,{children:`operationsApi.deleteBatchItems`}),`, then `,(0,w.jsx)(t.code,{children:`getOperationStatuses`})]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Upload files`}),(0,w.jsxs)(t.td,{children:[(0,w.jsx)(t.code,{children:`Uploader`}),` with the folder's numeric id as `,(0,w.jsx)(t.code,{children:`targetId`})]})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:`Open in ONLYOFFICE, Copy link`}),(0,w.jsxs)(t.td,{children:[`the file's `,(0,w.jsx)(t.code,{children:`webUrl`}),`, resolved against the provider's `,(0,w.jsx)(t.code,{children:`baseUrl`})]})]})]})]}),`
`,(0,w.jsx)(t.p,{children:`Three things about those calls that the types do not say:`}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`A folder's contents come one folder per call`}),`, and the search, the
filter and the sort are parameters of that call. Typing in the search box
is therefore a request, so the query is debounced exactly where the request
is made -- `,(0,w.jsx)(t.code,{children:`useDebounce`}),` in the component -- and never inside `,(0,w.jsx)(t.code,{children:`Filter`}),`.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Deletes run in the background.`}),` The batch call answers with an
operation, not with the result, so `,(0,w.jsx)(t.code,{children:`portalSource.remove`}),` polls
`,(0,w.jsx)(t.code,{children:`getOperationStatuses`}),` until it is finished before the folder is read
again; without that the deleted row would still be there.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`The rooms list takes no type filter.`}),` `,(0,w.jsx)(t.code,{children:`getRoomsFolder`}),` filters by room
type, not by file type, so at the Rooms root the page is narrowed on the
client. Everywhere else the portal does it.`]}),`
`]}),`
`,(0,w.jsx)(t.h2,{id:`what-to-expect-on-a-real-portal`,children:`What to expect on a real portal`}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Everything runs as the owner of the key.`}),` Rooms are the rooms that
person is in; My documents is theirs. A guest's key has no My documents,
and the listing says so instead of showing an empty folder -- the portal
answers 403 and the sample repeats it.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Rooms are opened, not selected.`}),` The toolbar's one action is a delete,
and the portal archives a room before it lets anyone delete it, so rooms
carry no checkbox here.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Uploads need a content creator's rights`}),` in the room; a viewer gets 403
on the upload session and the uploader's toast says so.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`The first hundred entries are shown.`}),` The count line says when a folder
holds more; a real application pages with `,(0,w.jsx)(t.code,{children:`startIndex`}),`.`]}),`
`]}),`
`,(0,w.jsx)(t.h2,{id:`where-to-go-next`,children:`Where to go next`}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Samples → Legal practice`}),` for an application built around one problem,
with OAuth for a second identity and a seeder for demo data.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Components → Uploader`}),` for the upload session this screen opens, and
`,(0,w.jsx)(t.strong,{children:`Components → Document Editor`}),` for opening a file in place instead of in
a new tab.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Getting started → API`}),` for the clients `,(0,w.jsx)(t.code,{children:`useApi()`}),` hands out.`]}),`
`]}),`
`,(0,w.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,w.jsxs)(t.p,{children:[`Imports here are relative to this repository. In your application they come
from the package -- `,(0,w.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/components/section`}),`, and so on.`]}),`
`,(0,w.jsx)(t.h3,{id:`filesapptsx`,children:`FilesApp.tsx`}),`
`,(0,w.jsx)(c,{code:f,language:`tsx`}),`
`,(0,w.jsx)(t.h3,{id:`sourcets----the-shape-and-the-portal-behind-it`,children:`source.ts -- the shape, and the portal behind it`}),`
`,(0,w.jsx)(c,{code:m,language:`ts`}),`
`,(0,w.jsx)(t.h3,{id:`demots----the-same-shape-from-memory`,children:`demo.ts -- the same shape from memory`}),`
`,(0,w.jsx)(c,{code:g,language:`ts`}),`
`,(0,w.jsx)(t.h3,{id:`uselistingts----one-listing-at-a-time`,children:`useListing.ts -- one listing at a time`}),`
`,(0,w.jsx)(c,{code:v,language:`ts`}),`
`,(0,w.jsx)(t.h3,{id:`usedevicetypets----the-viewport-as-the-portals-device-type`,children:`useDeviceType.ts -- the viewport as the portal's device type`}),`
`,(0,w.jsx)(c,{code:b,language:`ts`})]})}function C(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,w.jsx)(t,{...e,children:(0,w.jsx)(S,{...e})}):S(e)}var w;function T(){return(T=e((()=>{w=i(),o(),t(),s(),u(),p(),h(),_(),y(),x()})))()}T();export{C as default};