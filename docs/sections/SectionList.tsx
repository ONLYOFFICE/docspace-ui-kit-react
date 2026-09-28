import { useCallback, useEffect, useMemo, useState } from "react";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import FolderComplete32Svg from "../../assets/icons/32/folderComplete.svg";
import FolderInProgress32Svg from "../../assets/icons/32/folderInProgress.svg";
import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import { Button, ButtonSize } from "../../components/button";
import Filter from "../../components/filter";
import type { TItem } from "../../components/filter";
import { Heading, HeadingLevel, HeadingSize } from "../../components/heading";
import { Link, LinkType } from "../../components/link";
import Navigation from "../../components/navigation";
import { RoomIcon } from "../../components/room-icon";
import { Row, RowContainer, RowContent } from "../../components/rows";
import Section from "../../components/section";
import { Text } from "../../components/text";
import { Toast, toastr } from "../../components/toast";
import { DeviceType, FilterGroups } from "../../enums";
import { useDebounce } from "../../hooks";
import { useApi } from "../../providers/api";
import { FileIcon } from "../samples/file-icon";
import { useDeviceType } from "../samples/files-app/useDeviceType";
import { explainPortalError } from "../samples/legal/explain";
import { demoSource } from "./demo";
import { FolderPicker } from "./FolderPicker";
import {
  filterGroupsFor,
  formFolderOf,
  itemCount,
  portalSource,
  SECTION_TITLES,
  type SectionFilter,
  type SectionItem,
  type SectionKind,
  type SectionListing,
  type SectionQuery,
  type SectionSource,
  type SortKey,
} from "./source";
import styles from "./SectionList.module.scss";

const noop = () => {};

/**
 * The kit's own filter group for each group a list offers. The type group is
 * a room type only on a rooms list; inside a folder or a room, and in My
 * documents, it is a file type.
 *
 * The owner group is not `roomFilterOwner`, although that is the portal's:
 * the component special-cases that group as exactly [Me, Other, people
 * selector] (`FilterBlockItem` reads the second entry unconditionally, and
 * `FilterBlock` will not deselect in it), and "Other" needs a people
 * selector this list does not mount. A plain tag group is one chip,
 * selected and cleared like any other.
 */
const groupOf = (
  group: SectionFilter["group"],
  kind: SectionKind,
  folderId: number | null,
): FilterGroups => {
  if (group === "owner") return FilterGroups.filterOther;
  return kind !== "files" && folderId === null
    ? FilterGroups.roomFilterType
    : FilterGroups.filterType;
};

const ROOM_TYPE_LABELS: Partial<Record<RoomType, string>> = {
  [RoomType.EditingRoom]: "Collaboration room",
  [RoomType.PublicRoom]: "Public room",
  [RoomType.CustomRoom]: "Custom room",
  [RoomType.VirtualDataRoom]: "Virtual data room",
  [RoomType.FillingFormsRoom]: "Form filling room",
};

const dateOf = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

type ListingState = {
  listing: SectionListing | null;
  loading: boolean;
  error: string;
};

/**
 * One listing at a time: a new query starts a new read and the answer to an
 * old one is dropped, so a fast run of clicks through three folders never
 * shows the second folder's rows under the third folder's name.
 */
const useSectionListing = (source: SectionSource, query: SectionQuery) => {
  const [state, setState] = useState<ListingState>({
    listing: null,
    loading: true,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: "" }));

    source.list(query).then(
      (listing) => {
        if (!cancelled) setState({ listing, loading: false, error: "" });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            listing: current.listing,
            loading: false,
            error: explainPortalError(error, "read this list"),
          }));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [source, query, attempt]);

  return { ...state, reload };
};

export type SectionListProps = {
  /** Which of the portal's three lists to show. */
  kind: SectionKind;
  /**
   * Puts a "Select folder" button in the header, which opens `FolderPicker`
   * over this section; the list then shows whatever was picked.
   */
  withFolderPicker?: boolean;
};

/**
 * One of the portal's top-level lists -- My documents, Rooms or Forms -- as
 * the portal draws it: the breadcrumb, the filter bar, and the rows. A
 * folder or a room opens in place, and the breadcrumb or its back arrow
 * leads out again. Search, sort and every filter are applied by whichever
 * source answers.
 *
 * Read-only on purpose. The filter bar carries no main button
 * (`showMainButton` is left off), and each row's context menu only opens and
 * copies links, so nothing here writes to a portal the reader connected.
 *
 * Which source answers is decided by the nearest `ApiProvider`: with no
 * portal behind it (`baseUrl` is empty) the list runs on `demoSource`, and
 * with one it asks that portal, as whoever the key belongs to.
 */
export const SectionList = ({ kind, withFolderPicker }: SectionListProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const api = useApi();
  const { baseUrl } = api;

  const source = useMemo(
    () => (baseUrl ? portalSource(api, kind) : demoSource(kind)),
    [api, baseUrl, kind],
  );

  const [query, setQuery] = useState<SectionQuery>({
    folderId: null,
    search: "",
    filters: [],
    sortBy: kind === "files" ? "AZ" : "DateAndTime",
    ascending: kind === "files",
  });
  const { listing, loading, error, reload } = useSectionListing(source, query);

  const currentDeviceType = useDeviceType();
  const isDesktop = currentDeviceType === DeviceType.desktop;
  const [clearSearch, setClearSearch] = useState(false);

  const { folderId } = query;
  const atRoot = folderId === null;
  const groups = filterGroupsFor(kind, folderId);
  const items = listing?.items ?? [];
  const crumbs = listing?.crumbs ?? [];
  const current = listing?.current ?? {
    id: null,
    title: SECTION_TITLES[kind],
    isRoom: false,
  };

  // Typing is a request to the portal, so the search is debounced exactly
  // where that request is made.
  const onSearchDebounced = useDebounce((value: string) => {
    setQuery((state) => ({ ...state, search: value }));
  }, 300);

  /** Opens a folder or a room, or leaves for the section with `null`. */
  const go = useCallback((next: number | null) => {
    setQuery((state) => {
      if (state.search) setClearSearch(true);
      // A filter belongs to the list it was set on: a room type means
      // nothing inside a room, so each level starts unfiltered.
      return { ...state, folderId: next, search: "", filters: [] };
    });
  }, []);

  const openFile = (item: SectionItem) => {
    if (!baseUrl || !item.webUrl) {
      toastr.info(`${item.title} would open in the editor.`);
      return;
    }
    window.open(new URL(item.webUrl, baseUrl).href, "_blank", "noopener");
  };

  const open = (item: SectionItem) =>
    item.kind === "file" ? openFile(item) : go(item.id);

  const copyLink = (item: SectionItem) =>
    navigator.clipboard.writeText(new URL(item.webUrl, baseUrl).href).then(
      () => toastr.success("Link copied"),
      () => toastr.error("The browser refused the clipboard."),
    );

  // The minimum a row needs: open it, and, for a file on a real portal,
  // copy where it opens. Nothing that writes.
  const contextOptions = (item: SectionItem) => [
    {
      key: "open",
      label: item.kind === "file" ? "Open in ONLYOFFICE" : "Open",
      onClick: () => open(item),
    },
    ...(item.kind === "file" && baseUrl && item.webUrl
      ? [
          {
            key: "copy-link",
            label: "Copy link",
            onClick: () => copyLink(item),
          },
        ]
      : []),
  ];

  const labelOf = (filter: SectionFilter) =>
    groups
      .find((group) => group.group === filter.group)
      ?.options.find((option) => option.key === filter.key)?.label ?? "";

  // The chips under the bar. Stable, as the component asks: it is re-read
  // whenever the function changes.
  const selectedFilterData = useCallback(
    (): TItem[] =>
      query.filters.map((filter) => ({
        id: `filter_${filter.group}-${filter.key}`,
        key: filter.key,
        group: groupOf(filter.group, kind, folderId),
        label: labelOf(filter),
      })),
    [query.filters, kind, folderId],
  );

  // One view only, and the selector is hidden -- but the component still
  // asks for the list, during render, so it must keep its identity.
  const getViewSettingsData = useCallback(
    () => [
      { id: "row", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
    ],
    [],
  );

  const getSelectedInputValue = useCallback(() => query.search, [query.search]);

  const fromItems = (picked: TItem[]): SectionFilter[] =>
    groups.flatMap((group) => {
      const hit = picked.find(
        (item) =>
          item.group === groupOf(group.group, kind, folderId) &&
          group.options.some((option) => option.key === item.key),
      );
      return hit ? [{ group: group.group, key: hit.key } as SectionFilter] : [];
    });

  const removeFilter = (key: string | number) =>
    setQuery((state) => ({
      ...state,
      filters: state.filters.filter((filter) => filter.key !== key),
    }));

  const iconOf = (item: SectionItem) => {
    if (item.kind === "room") {
      return (
        <RoomIcon
          title={item.title}
          color={item.color || "4781D1"}
          showDefault
          size="32px"
          radius="6px"
        />
      );
    }
    // A form room's Complete and In process folders carry icons of their
    // own in the portal, and here.
    const formFolder = formFolderOf(item);
    if (formFolder) {
      const Icon =
        formFolder === "done" ? FolderComplete32Svg : FolderInProgress32Svg;
      return <Icon width={32} height={32} />;
    }
    return (
      <FileIcon fileExst={item.kind === "folder" ? "folder" : item.fileExst} />
    );
  };

  const rows = (
    <RowContainer useReactWindow={false} itemHeight={56}>
      {items.map((item) => (
        <Row
          key={`${item.kind}-${item.id}`}
          element={iconOf(item)}
          contextTitle={item.title}
          contextOptions={contextOptions(item)}
        >
          <RowContent>
            <Link
              type={LinkType.action}
              isTextOverflow
              fontSize="13px"
              isBold
              onClick={() => open(item)}
            >
              {item.title}
            </Link>
            <div />
            <Text as="span" fontSize="12px" containerMinWidth="140px">
              {item.kind === "room"
                ? (ROOM_TYPE_LABELS[item.roomType as RoomType] ?? "Room")
                : item.by}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="120px">
              {item.kind === "room" ? item.by : dateOf(item.updated)}
            </Text>
            <Text as="span" fontSize="12px" containerMinWidth="80px">
              {item.kind === "room" ? dateOf(item.updated) : item.detail}
            </Text>
          </RowContent>
        </Row>
      ))}
    </RowContainer>
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
  ) : items.length === 0 ? (
    <Text fontSize="13px" className={styles.state}>
      {query.search
        ? `Nothing matches "${query.search}".`
        : query.filters.length
          ? "Nothing matches this filter."
          : "Nothing here yet."}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" isBold className={styles.count}>
        {listing.total > items.length
          ? `First ${items.length} of ${listing.total}`
          : itemCount(items.length)}
      </Text>
      {rows}
    </>
  );

  const header = atRoot ? (
    <Heading level={HeadingLevel.h1} size={HeadingSize.medium} truncate>
      {current.title}
    </Heading>
  ) : (
    <Navigation
      title={current.title}
      isRootFolder={false}
      canCreate={false}
      showText
      isDesktop={isDesktop}
      isRoom={current.isRoom}
      withMenu={false}
      showTitle
      showRootFolderTitle
      showNavigationButton={false}
      isInfoPanelVisible={false}
      isCurrentFolderInfo={false}
      currentDeviceType={currentDeviceType}
      // The ancestors, nearest first, the section last.
      navigationItems={crumbs.map((crumb) => ({
        id: crumb.id,
        title: crumb.title,
        isRootRoom: crumb.isRootRoom,
      }))}
      onClickFolder={(id) => {
        const crumb = crumbs.find((item) => String(item.id) === String(id));
        if (crumb) go(crumb.isRoot ? null : crumb.id);
      }}
      onBackToParentFolder={() => {
        const parent = crumbs[0];
        go(parent && !parent.isRoot ? parent.id : null);
      }}
      clearTrash={noop}
      getContextOptionsFolder={() => []}
      getContextOptionsPlus={() => []}
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

  return (
    <div className={styles.frame}>
      <Toast />

      {pickerOpen ? (
        <FolderPicker
          kind={kind}
          source={source}
          onClose={() => setPickerOpen(false)}
          onPick={(next) => {
            setPickerOpen(false);
            go(next);
          }}
        />
      ) : null}

      <Section
        currentDeviceType={currentDeviceType}
        withBodyScroll
        isHeaderVisible
        viewAs="row"
        settingsStudio={false}
      >
        <Section.SectionHeader>
          <div className={styles.header}>
            <div className={styles.title}>{header}</div>
            <span
              className={styles.source}
              data-connected={baseUrl ? "true" : "false"}
              title={
                baseUrl
                  ? "Rows come from this portal, as the key's owner"
                  : "No portal in the API Config toolbar: rows come from memory"
              }
            >
              {baseUrl ? new URL(baseUrl).host : "Demo data"}
            </span>
            {withFolderPicker ? (
              <div className={styles.actions}>
                <Button
                  label="Select folder"
                  size={ButtonSize.extraSmall}
                  onClick={() => setPickerOpen(true)}
                  testId="section-select-folder"
                />
              </div>
            ) : null}
          </div>
        </Section.SectionHeader>

        <Section.SectionFilter>
          <Filter
            viewAs="row"
            view={`section-${kind}`}
            placeholder={`Search in ${current.title}`}
            filterTitle="Filter"
            sortByTitle="Sort by"
            filterHeader="Filter"
            selectorLabel="Select"
            userId="1"
            currentDeviceType={currentDeviceType}
            viewSelectorVisible={false}
            isRooms={kind !== "files" && atRoot}
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
            onChangeViewAs={noop}
            onSort={(key, direction) =>
              setQuery((state) => ({
                ...state,
                sortBy: (key === "DateAndTime"
                  ? "DateAndTime"
                  : "AZ") as SortKey,
                ascending: direction === "asc",
              }))
            }
            onFilter={(picked) =>
              setQuery((state) => ({
                ...state,
                filters: fromItems(picked as TItem[]),
              }))
            }
            onSortButtonClick={noop}
            removeSelectedItem={({ key }) => removeFilter(key)}
            clearAll={() => {
              setQuery((state) => ({ ...state, filters: [], search: "" }));
              if (query.search) setClearSearch(true);
            }}
            getSelectedInputValue={getSelectedInputValue}
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
            getViewSettingsData={getViewSettingsData}
            getFilterData={() =>
              Promise.resolve(
                groups.flatMap((group): TItem[] => {
                  const filterGroup = groupOf(group.group, kind, folderId);
                  return [
                    {
                      key: filterGroup,
                      group: filterGroup,
                      label: group.label,
                      isHeader: true,
                      isLast: true,
                    },
                    ...group.options.map((option, index) => ({
                      id: `filter_${group.group}-${option.key}`,
                      key: option.key,
                      group: filterGroup,
                      label: option.label,
                      isSelected: query.filters.some(
                        (filter) => filter.key === option.key,
                      ),
                      isLast: index === group.options.length - 1,
                    })),
                  ];
                }),
              )
            }
            getSelectedFilterData={selectedFilterData}
          />
        </Section.SectionFilter>

        <Section.SectionBody>{body}</Section.SectionBody>

        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  );
};
