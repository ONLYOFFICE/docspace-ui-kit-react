import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import { useSectionPinnedHeight } from "../../.storybook/utils/useSectionPinnedHeight";
import type { ContextMenuModel } from "../../components/context-menu";
import {
  DataTable,
  type DataTableColumn,
  type DataTableRowState,
  contextMenuColumn,
  createLocalStorageWidths,
} from "../../components/data-table";
import { Link, LinkType } from "../../components/link";
import { Text } from "../../components/text";
import {
  FileTile,
  FolderTile,
  RoomTile,
  TileContainer,
  TileContent,
} from "../../components/tiles";
import { SortByFieldName } from "../../enums";
import type { SectionItem, SectionKind, SortKey } from "./source";
import styles from "./SectionList.module.scss";

/**
 * A room type as the client names it on a tile's tag (`getRoomTypeName`): the
 * short form, "Custom" rather than "Custom room".
 */
export const ROOM_TYPE_NAMES: Partial<Record<RoomType, string>> = {
  [RoomType.EditingRoom]: "Collaboration",
  [RoomType.PublicRoom]: "Public room",
  [RoomType.CustomRoom]: "Custom",
  [RoomType.VirtualDataRoom]: "Virtual data room",
  [RoomType.FillingFormsRoom]: "Form space",
};

/**
 * The time of the last change, as the client writes it in every view:
 * "10/27/2026 5:53 PM".
 */
export const changedAt = (iso: string) =>
  iso
    ? new Date(iso)
        .toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(", ", " ")
    : "";

/** A name with a file's extension greyed, as the client draws it. */
export const NameText = ({ item }: { item: SectionItem }) =>
  item.fileExst ? (
    <>
      {item.title.slice(0, -item.fileExst.length)}
      <span className={styles.extension}>{item.fileExst}</span>
    </>
  ) : (
    <>{item.title}</>
  );

type ViewProps = {
  kind: SectionKind;
  items: SectionItem[];
  /** Whether the list is a section's rooms rather than a folder's contents. */
  roomsList: boolean;
  iconOf: (item: SectionItem, size?: number) => ReactElement;
  open: (item: SectionItem) => void;
  contextOptions: (item: SectionItem) => ContextMenuModel[];
};

type SectionTableProps = ViewProps & {
  sortBy: SortKey;
  ascending: boolean;
  onSort: (sortBy: SortKey) => void;
};

/**
 * The desktop view: the client's table. A section's rooms show Name, Tags
 * and Last activity; a folder's contents Name, Modified and Size. The name
 * and the date columns sort, the others do not.
 */
export const SectionTable = ({
  kind,
  items,
  roomsList,
  iconOf,
  open,
  contextOptions,
  sortBy,
  ascending,
  onSort,
}: SectionTableProps) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const pinnedHeight = useSectionPinnedHeight(node);
  // One layout per list shape: the table remembers the widths under this key.
  const storage = `section-${kind}-${roomsList ? "rooms" : "items"}-columns`;
  const widthStorage = useMemo(
    () => createLocalStorageWidths(storage),
    [storage],
  );

  const columns = useMemo<DataTableColumn<SectionItem>[]>(() => {
    const side =
      (value: (item: SectionItem) => string) => (item: SectionItem) => (
        <Text
          fontSize="12px"
          fontWeight={600}
          color="var(--section-story-row-side)"
          className={styles.sideCell}
          truncate
        >
          {value(item)}
        </Text>
      );

    const tags = (item: SectionItem) => (item.tags ?? []).join(", ");
    const updated = (item: SectionItem) => changedAt(item.updated);
    const size = (item: SectionItem) =>
      item.kind === "file" ? item.detail : "";

    return [
      {
        id: "Name",
        title: "Name",
        width: { type: "fill" },
        sortKey: SortByFieldName.Name,
        cell: (item) => (
          <div className={styles.nameCell}>
            <div className={styles.nameIcon}>{iconOf(item)}</div>
            <Link
              type={LinkType.page}
              title={item.title}
              fontSize="13px"
              fontWeight={600}
              isTextOverflow
              truncate
              onClick={() => open(item)}
            >
              <NameText item={item} />
            </Link>
          </div>
        ),
      },
      roomsList
        ? {
            id: "Tags",
            title: "Tags",
            width: { type: "flex" },
            cell: side(tags),
          }
        : {
            id: "Modified",
            title: "Modified",
            width: { type: "flex" },
            sortKey: SortByFieldName.ModifiedDate,
            cell: side(updated),
          },
      roomsList
        ? {
            id: "Activity",
            title: "Last activity",
            width: { type: "flex" },
            sortKey: SortByFieldName.ModifiedDate,
            cell: side(updated),
          }
        : {
            id: "Size",
            title: "Size",
            width: { type: "flex" },
            cell: side(size),
          },
      contextMenuColumn<SectionItem>(),
    ];
  }, [roomsList, iconOf, open]);

  const getRowProps = useCallback(
    (item: SectionItem): DataTableRowState => ({
      contextMenu: {
        title: "Actions",
        options: contextOptions(item),
        getModel: () => contextOptions(item),
      },
    }),
    [contextOptions],
  );

  return (
    <div
      ref={setNode}
      className={styles.table}
      style={
        {
          // Below what the section pins: its header and the filter.
          "--data-table-header-top": `${pinnedHeight}px`,
        } as React.CSSProperties
      }
    >
      <DataTable
        columns={columns}
        rows={items}
        getRowKey={(item) => `${item.kind}-${item.id}`}
        getRowProps={getRowProps}
        sort={{ key: sortBy, desc: !ascending }}
        onSortChange={(key) => onSort(key as SortKey)}
        widthStorage={widthStorage}
        ariaLabel="Contents"
      />
    </div>
  );
};

/**
 * The tile view. A section's rooms are room tiles with their tags, or the
 * room's type when it has none; a folder's contents are folder tiles, then
 * file tiles, under the client's "Folders" and "Files" headings.
 */
export const SectionTiles = ({
  items,
  roomsList,
  iconOf,
  open,
  contextOptions,
}: ViewProps) => {
  const heading = (text: string) => (
    <Text fontSize="16px" fontWeight={600} className={styles.tileHeading}>
      {text}
    </Text>
  );

  // The client's FilesTileContent: 16px for a room, 13px for a folder or a
  // file on a desktop.
  const name = (item: SectionItem, fontSize = "13px") => (
    <TileContent>
      <Link
        type={LinkType.page}
        title={item.title}
        fontSize={fontSize}
        fontWeight={600}
        isTextOverflow
        onClick={() => open(item)}
      >
        <NameText item={item} />
      </Link>
    </TileContent>
  );

  if (roomsList) {
    return (
      <TileContainer className={styles.tiles}>
        {items.map((item) => (
          <RoomTile
            key={`room-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              isRoom: true,
              roomType: String(item.roomType),
              tags: item.tags,
              contextOptions: contextOptions(item),
            }}
            element={iconOf(item)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            columnCount={2}
            getRoomTypeName={(type) =>
              ROOM_TYPE_NAMES[Number(type) as RoomType] ?? "Room"
            }
            selectTag={() => {}}
            selectOption={() => {}}
            thumbnailClick={() => open(item)}
          >
            {name(item, "16px")}
          </RoomTile>
        ))}
      </TileContainer>
    );
  }

  return (
    <TileContainer
      className={styles.tiles}
      headingFolders={heading("Folders")}
      headingFiles={heading("Files")}
    >
      {items.map((item) =>
        item.kind === "file" ? (
          <FileTile
            key={`file-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              fileExst: item.fileExst,
              fileType: item.fileType,
              contextOptions: [],
            }}
            element={iconOf(item)}
            temporaryIcon={iconOf(item, 96)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            thumbnailClick={() => open(item)}
          >
            {name(item)}
          </FileTile>
        ) : (
          <FolderTile
            key={`${item.kind}-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              isFolder: true,
              contextOptions: [],
            }}
            element={iconOf(item)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            thumbnailClick={() => open(item)}
          >
            {name(item)}
          </FolderTile>
        ),
      )}
    </TileContainer>
  );
};
