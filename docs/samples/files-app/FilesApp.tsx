import { useCallback, useMemo, useState } from "react";

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
 * `Article.Body` takes exactly one element -- Article clones it to inject its
 * own props -- so a list of entries has to live inside a component of its own.
 * Handing `Article.Body` an array is the single most common way to get a blank
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
        linkData={{ path: `/${id}`, state: {} }}
        isActive={active === id}
        onClick={() => onSelect(id)}
      />
    ))}
  </>
);

/**
 * A small Files application on the portal behind the nearest `ApiProvider`:
 * rooms, the personal folder and the trash in the sidebar; folders opened
 * in place with a breadcrumb back; search, a type filter and a sort order
 * the portal applies; rows or tiles; a selection toolbar; new folders and
 * documents, renames and deletes; uploads through `Uploader`; files opened
 * in ONLYOFFICE.
 *
 * With no portal configured the same screen runs on `demoSource`, a tree in
 * memory with the same shape, so every control still does something.
 *
 * The lesson of this file is the division of labour. `Article` and `Section`
 * own the layout -- the sticky header, the scrolling body, the collapsing
 * sidebar, the breakpoints. `FilesSource` owns the data. This component owns
 * the state in between: where the reader is, what they searched for, what
 * they selected. The three never negotiate, which is why the same `Section`
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
  // this one prop, and tells us through `setIsMobileArticle` when the main
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
      toastr.info(`${entry.title} would open in the editor.`);
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
      targets.length === 1 ? targets[0].title : `${targets.length} items`;
    return run(
      () => source.remove(targets, inTrash),
      inTrash ? `${what} deleted` : `${what} moved to Trash`,
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
      run(() => source.rename(entry, full), `Renamed to ${full}`, "rename");
    } else {
      run(
        () => source.createFolder(current.id, title),
        `${title} created`,
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
      `${title} created`,
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
        size={`${size}px`}
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
            id: `filter_type-${filter.key}`,
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
          key={`${entry.kind}-${entry.id}`}
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
            key={`${entry.kind}-${entry.id}`}
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
            key={`file-${entry.id}`}
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
        ? `Nothing matches "${query.search}".`
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
            ? ` • first ${entries.length} of ${listing.total}`
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
        zendeskEmail=""
        chatDisplayName=""
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
                // portal's `pathParts` without the current folder, reversed.
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
              placeholder={`Search in ${current.title}`}
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
                    id: `filter_type-${filter.key}`,
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
                  toastr.success(`${files.length} files uploaded`);
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
